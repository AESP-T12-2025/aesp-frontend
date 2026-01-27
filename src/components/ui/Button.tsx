/**
 * Accessible Button Component
 * ==========================
 * A fully accessible, customizable button component with:
 * - Multiple variants (primary, secondary, outline, ghost, danger, success)
 * - Multiple sizes (xs, sm, md, lg, xl)
 * - Icon support (left/right icons)
 * - Loading state with spinner
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * 
 * @example
 * // Basic usage
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 * 
 * // With loading state
 * <Button isLoading>Submitting...</Button>
 * 
 * // With icons
 * <Button leftIcon={<SaveIcon />}>Save</Button>
 */

'use client';

import React, { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import { clsx } from 'clsx';

// =============================================================================
// TYPES
// =============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style variant */
    variant?: ButtonVariant;
    /** Button size */
    size?: ButtonSize;
    /** Shows loading spinner and disables button */
    isLoading?: boolean;
    /** Custom loading text */
    loadingText?: string;
    /** Icon to display on the left */
    leftIcon?: React.ReactNode;
    /** Icon to display on the right */
    rightIcon?: React.ReactNode;
    /** Makes button full width */
    fullWidth?: boolean;
}

// =============================================================================
// STYLE CONSTANTS
// =============================================================================

const BASE_STYLES = clsx(
    // Layout
    'inline-flex items-center justify-center',
    // Typography
    'font-semibold',
    // Shape
    'rounded-xl',
    // Transition
    'transition-all duration-200 ease-in-out',
    // Focus styles for accessibility (WCAG 2.1 compliant)
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    // Disabled styles
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    // Active state
    'active:scale-[0.98]'
);

const VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary: clsx(
        'bg-blue-600 text-white',
        'hover:bg-blue-700',
        'focus-visible:ring-blue-500'
    ),
    secondary: clsx(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200',
        'focus-visible:ring-gray-400',
        'dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
    ),
    outline: clsx(
        'border-2 border-gray-200 text-gray-700 bg-transparent',
        'hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50',
        'focus-visible:ring-blue-500',
        'dark:border-gray-600 dark:text-gray-200 dark:hover:border-blue-400'
    ),
    ghost: clsx(
        'text-gray-600 bg-transparent',
        'hover:bg-gray-100',
        'focus-visible:ring-gray-400',
        'dark:text-gray-300 dark:hover:bg-gray-800'
    ),
    danger: clsx(
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus-visible:ring-red-500'
    ),
    success: clsx(
        'bg-green-600 text-white',
        'hover:bg-green-700',
        'focus-visible:ring-green-500'
    ),
};

const SIZE_STYLES: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
};

const ICON_SIZES: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
};

// =============================================================================
// LOADING SPINNER COMPONENT
// =============================================================================

interface LoadingSpinnerProps {
    size: ButtonSize;
    className?: string;
}

const LoadingSpinner = memo(function LoadingSpinner({
    size,
    className
}: LoadingSpinnerProps) {
    return (
        <svg
            className={clsx('animate-spin', ICON_SIZES[size], className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="status"
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
    );
});

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            loadingText,
            disabled,
            leftIcon,
            rightIcon,
            fullWidth = false,
            children,
            type = 'button',
            ...props
        },
        ref
    ) {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                type={type}
                className={clsx(
                    BASE_STYLES,
                    VARIANT_STYLES[variant],
                    SIZE_STYLES[size],
                    fullWidth && 'w-full',
                    className
                )}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-busy={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner size={size} />
                        <span>{loadingText || 'Loading...'}</span>
                    </>
                ) : (
                    <>
                        {leftIcon && (
                            <span
                                className="inline-flex shrink-0"
                                aria-hidden="true"
                            >
                                {leftIcon}
                            </span>
                        )}
                        {children}
                        {rightIcon && (
                            <span
                                className="inline-flex shrink-0"
                                aria-hidden="true"
                            >
                                {rightIcon}
                            </span>
                        )}
                    </>
                )}
            </button>
        );
    }
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;
export { Button, LoadingSpinner };
