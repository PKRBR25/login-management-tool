import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
const bcrypt = require('bcryptjs');

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    // Find the most recent password reset request for this email
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        user: {
          email,
        },
        pr_token: parseInt(token),
        pr_token_expires_at: {
          gt: new Date(),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });

    if (!resetRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if the token is still valid
    if (new Date() > resetRequest.pr_token_valid_until) {
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hashSync(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { id: resetRequest.user_id },
      data: {
        hashed_password: hashedPassword,
      },
    });

    // Invalidate all reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { user_id: resetRequest.user_id },
    });

    return NextResponse.json({ 
      message: 'Password reset successful. You can now log in with your new password.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}
