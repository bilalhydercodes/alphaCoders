'use client';

import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-[#1F1730] border-b-4 border-[#7A4BC2] hover:brightness-105 active:border-b-0 active:translate-y-1',
  secondary:
    'bg-surface text-copy border-2 border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5',
  accent:
    'bg-accent text-[#1F1730] border-b-4 border-[#D49E00] hover:brightness-105 active:border-b-0 active:translate-y-1',
  success:
    'bg-success text-white border-b-4 border-[#3BA853] hover:brightness-105 active:border-b-0 active:translate-y-1',
  danger:
    'bg-danger text-white border-b-4 border-[#B82D32] hover:brightness-105 active:border-b-0 active:translate-y-1',
  ghost:
    'bg-transparent text-copy hover:bg-lavender-soft/40 active:bg-lavender-soft/60 border-none shadow-none',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[36px]',
  md: 'px-5 py-2.5 text-sm min-h-[44px]',
  lg: 'px-6 py-3.5 text-base min-h-[48px]',
  icon: 'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isActuallyDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isActuallyDisabled}
        className={`
          relative inline-flex items-center justify-center font-bold rounded-2xl select-none
          transition-all duration-75 cursor-pointer
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:filter-none
          ${fullWidth ? 'w-full' : ''}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            <span>{children}</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
