import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn('control resize-none', invalid && 'control-invalid', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
