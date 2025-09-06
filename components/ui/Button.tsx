import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-all duration-200 ease-in-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95'
  );

  const variants = {
    primary: cn(
      'bg-blue-600 hover:bg-blue-700 text-white',
      'focus:ring-blue-500 shadow-md hover:shadow-lg'
    ),
    secondary: cn(
      'bg-gray-200 hover:bg-gray-300 text-gray-900',
      'focus:ring-gray-500 shadow-sm hover:shadow-md'
    ),
    danger: cn(
      'bg-red-600 hover:bg-red-700 text-white',
      'focus:ring-red-500 shadow-md hover:shadow-lg'
    ),
    outline: cn(
      'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
      'focus:ring-blue-500 shadow-sm hover:shadow-md'
    ),
    ghost: cn(
      'bg-transparent hover:bg-gray-100 text-gray-700',
      'focus:ring-gray-500'
    )
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </button>
  );
}