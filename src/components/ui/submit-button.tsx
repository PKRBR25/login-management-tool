'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from './button';

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? 'Processing...' : children}
    </Button>
  );
}
