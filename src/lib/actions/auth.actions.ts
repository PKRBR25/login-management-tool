'use server';

import { prisma } from '@/lib/db/prisma';
import { signUpSchema, verifyEmailSchema } from '@/lib/validations/auth';
import { sendVerificationEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function signUp(prevState: any, formData: FormData) {
  try {
    const rawFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate the form data
    const validatedFields = signUpSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing or invalid fields. Please check your input.',
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
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate verification token (6 digits)
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        hashed_password: hashedPassword,
        verification_token: verificationToken,
        is_verified: false,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.',
      userId: user.id,
    };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { message: 'An error occurred during sign up.' };
  }
}

export async function verifyEmail(prevState: any, formData: FormData) {
  try {
    const rawFormData = {
      email: formData.get('email') as string,
      verification_token: formData.get('verification_token') as string,
    };

    // Validate the form data
    const validatedFields = verifyEmailSchema.safeParse({
      ...rawFormData,
      verification_token: parseInt(rawFormData.verification_token, 10),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing or invalid fields. Please check your input.',
      };
    }

    const { email, verification_token } = validatedFields.data;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'User not found.' };
    }

    // Check if already verified
    if (user.is_verified) {
      return { message: 'Email is already verified.' };
    }

    // Check verification token
    if (user.verification_token !== verification_token) {
      return { message: 'Invalid verification code.' };
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        verified_since: new Date(),
        verification_token: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully. You can now log in.',
    };
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return { message: 'An error occurred during email verification.' };
  }
}
