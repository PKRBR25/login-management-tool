import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendPasswordResetEmail } from '@/lib/email/index';
const bcrypt = require('bcryptjs');

// Generate a random numeric token of specified length
function generateRandomToken(length: number = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate a 6-digit token
    const token = generateRandomToken(6);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Create password reset record
    await prisma.passwordReset.create({
      data: {
        user_id: user.id,
        pr_token: parseInt(token),
        pr_token_expires_at: expiresAt,
        pr_token_valid_until: new Date(Date.now() + 15 * 60 * 1000), // Valid for 15 minutes
      },
    });

    // Send email with reset token
    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({ 
      message: 'Password reset email sent successfully',
      email: user.email // Return email for frontend to use in the next step
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
