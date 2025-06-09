'use server';

import prisma from '@/lib/db/prisma';
import { 
  signUpSchema, 
  verifyEmailSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema 
} from '@/lib/validations/auth';
import { sendVerificationEmail } from '@/lib/email/index';
import { sendPasswordResetEmail } from '@/lib/email';
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

// Rest of the file remains unchanged...
