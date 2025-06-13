'use server';

import prisma from '@/lib/db/prisma';
import { 
  signUpSchema, 
  verifyEmailSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema 
} from '@/lib/validations/auth';
import { sendVerificationEmail } from '@/lib/email/index';
import { sendPasswordResetEmail } from '@/lib/email/index';

import * as bcrypt from 'bcryptjs';
import { addHours } from 'date-fns';

interface SignUpState {
  message: string;
  errors: Record<string, string[]>;
  success: boolean;
  userId?: number;
  details?: string;
}

export async function signUp(prevState: SignUpState | null, formData: FormData): Promise<SignUpState> {
  console.log('🔍 Starting signup process...');
  try {
    const rawFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };
    
    console.log('📝 Form data received:', { 
      email: rawFormData.email,
      hasPassword: !!rawFormData.password,
      hasConfirmPassword: !!rawFormData.confirmPassword 
    });

    // Validate the form data
    const validatedFields = signUpSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      // Convert Zod validation errors to a more usable format
      const errorMap: Record<string, string[]> = {};
      
      validatedFields.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!errorMap[field]) {
          errorMap[field] = [];
        }
        errorMap[field].push(error.message);
      });

      return {
        errors: errorMap,
        message: 'Please correct the errors below.',
        success: false
      };
    }

    const { email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'A user with this email already exists.',
        errors: {},
        success: false
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hashSync(password, 12);
    
    // Generate verification token (6 digits)
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    // Create the user with a default full name based on email
    const defaultFullName = email.split('@')[0]; // Use the part before @ as default name
    
    console.log('🔄 Creating new user with data:', {
      email,
      hashedPassword: hashedPassword ? '***' : 'MISSING',
      defaultFullName,
      verificationToken
    });
    
    let user;
    try {
      console.log('📝 Attempting to create user in database...');
      const userData = {
        email,
        hashed_password: hashedPassword,
        full_name: defaultFullName,
        verification_token: verificationToken,
        is_verified: false,
      };
      
      console.log('📦 User data being saved:', JSON.stringify(userData, null, 2));
      
      user = await prisma.user.create({
        data: userData,
      });
      
      console.log('✅ User created successfully:', { 
        userId: user.id,
        email: user.email,
        createdAt: user.created_at
      });
      
      // Verify the user was actually created
      const createdUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      console.log('🔍 Verification - User in database:', createdUser ? 'Found' : 'Not found');
    } catch (dbError) {
      console.error('❌ Database error during user creation:', dbError);
      throw dbError;
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return {
        success: false,
        message: emailResult.error || 'Failed to send verification email. Please try again later.',
        errors: {},
        details: emailResult.details
      };
    }

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.',
      userId: user.id,
      errors: {}
    };
  } catch (error: any) {
    console.error('❌ Error in signUp:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack?.split('\n').slice(0, 3).join('\n') // Show first 3 lines of stack trace
    });
    
    // Check for specific database errors
    if (error?.code === 'P2002') {
      return {
        message: 'A user with this email already exists.',
        errors: { email: ['This email is already registered.'] },
        success: false
      };
    }
    
    return { 
      message: error?.message || 'An error occurred during sign up. Please try again.',
      success: false,
      errors: {},
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    };
  }
}

interface RequestPasswordResetState {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
  details?: string;
  code?: string;
  stack?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: string;
  code?: string;
  stack?: string;
}

export async function requestPasswordReset(
  prevState: RequestPasswordResetState | null, 
  formData: FormData
): Promise<RequestPasswordResetState> {
  console.log('🔹 Starting password reset request...');
  
  try {
    // Get the email from form data
    const email = formData.get('email');
    console.log('🔹 Email from form data:', email);
    
    // Validate the email
    if (typeof email !== 'string') {
      console.error('❌ Invalid email type:', typeof email);
      return { 
        success: false, 
        message: 'Invalid email format',
        errors: { email: ['Please provide a valid email address'] } 
      };
    }
    
    // Validate against the schema
    const validation = requestPasswordResetSchema.safeParse({ email });
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.format());
      return { 
        success: false, 
        message: 'Validation failed',
        errors: {
          email: validation.error.formErrors.fieldErrors.email || []
        }
      };
    }
    
    console.log('🔹 Looking up user with email:', email);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true,
        full_name: true 
      },
    });
    
    console.log('🔹 User lookup result:', user ? `Found user ${user.id}` : 'Not found');
    
    // Return success even if user doesn't exist to prevent user enumeration
    if (!user) {
      console.log('ℹ️ No user found with email (this is expected behavior for security)');
      return { 
        success: true, 
        message: 'If an account with that email exists, you will receive a password reset link.' 
      };
    }
    
    console.log('🔹 Generating reset token for user:', user.id);
    
    try {
      // Generate a 6-digit reset token
      const resetToken = Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const tokenExpires = addHours(now, 1); // Token expires in 1 hour
      const tokenLockedUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minute lockout
      const tokenValidUntil = addHours(now, 24); // Token valid for 24 hours
      
      console.log('🔹 Creating password reset record with token:', resetToken);
      
      // Store the token in the database
      await prisma.passwordReset.create({
        data: {
          user_id: user.id,
          pr_token: resetToken,
          pr_token_expires_at: tokenExpires,
          pr_token_locked_until: tokenLockedUntil,
          pr_token_valid_until: tokenValidUntil,
        },
      });
      
      console.log('🔹 Sending password reset email...');
      const emailResult = await sendPasswordResetEmail(
        user.email,
        resetToken.toString(),
        user.full_name || 'User'
      ) as { success: boolean; messageId?: string; error?: string };

      if (!emailResult.success) {
        console.error('❌ Failed to send password reset email:', emailResult.error);
        return {
          success: false,
          message: emailResult.error || 'Failed to send password reset email. Please try again later.'
        };
      }

      console.log('✅ Password reset email sent successfully');
      
      return {
        success: true,
        message: 'If an account with that email exists, you will receive a password reset link.'
      };

      
    } catch (error) {
      console.error('❌ Error in requestPasswordReset:', error);
      
      let errorMessage = 'Failed to process your password reset request. Please try again later.';
      
      if ((error as any)?.code === 'EAUTH') {
        errorMessage = 'Authentication with the email service failed. Please contact support.';
      } else if ((error as any)?.code === 'EENVELOPE') {
        errorMessage = 'Invalid email address. Please check the email and try again.';
      } else if ((error as any)?.code === 'ECONNECTION' || (error as any)?.code === 'ETIMEDOUT') {
        errorMessage = 'Could not connect to the email server. Please check your internet connection and try again.';
      } else if ((error as any)?.code === 'ESOCKET' || (error as any)?.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
        errorMessage = 'Connection to the email server failed. This might be a temporary issue. Please try again later.';
      }
      
      return {
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      };
    }
    
  } catch (error) {
    // Create a more detailed error object
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Include any additional properties that might be on the error
      ...(error as any)
    } : {
      type: typeof error,
      value: error
    };
    
    console.error('❌ Unexpected error in requestPasswordReset:', errorObj);
    
    // Return a string that includes the error message for the client
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'An unexpected error occurred. Please try again.';
    
    // Throw a new error that will be caught by the client
    throw new Error(errorMessage);
  }
}
