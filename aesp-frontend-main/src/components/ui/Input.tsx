/**
 * Accessible Input Component
 * ==========================
 * A fully accessible, customizable input component with:
 * - Multiple sizes (sm, md, lg)
 * - Icon support (left/right icons)
 * - Error and helper text
 * - Label with required indicator
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Dark mode support
 * 
 * @example
 * // Basic usage
 * <Input label="Email" placeholder="Enter your email" />
 * 
 * // With error
 * <Input label="Password" error="Password is required" />
 * 
 * // With icons
 * <Input leftIcon={<SearchIcon />} placeholder="Search..." />
 */

'use client';

import React, { InputHTMLAttributes, forwardRef, useId, useState, useCallback } from 'react';
import { clsx } from 'clsx';

// =============================================================================
// TYPES
// =============================================================================

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input label text */
    label?: string;
    /** Error message to display */
    error?: string;
    /** Helper text below the input */
    helperText?: string;
    /** Icon to display on the left */
    leftIcon?: React.ReactNode;
    /** Icon to display on the right */
    rightIcon?: React.ReactNode;
    /** Input size variant */
    size?: InputSize;
    /** Show character count */
    showCount?: boolean;
    /** Custom container className */
    containerClassName?: string;
}

// =============================================================================
// STYLE CONSTANTS
// =============================================================================

const SIZE_STYLES: Record<InputSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3.5 text-lg',
};

const ICON_CONTAINER_STYLES: Record<InputSize, { left: string; right: string }> = {
    sm: { left: 'left-2.5', right: 'right-2.5' },
    md: { left: 'left-3', right: 'right-3' },
    lg: { left: 'left-4', right: 'right-4' },
};

const ICON_PADDING: Record<InputSize, { left: string; right: string }> = {
    sm: { left: 'pl-8', right: 'pr-8' },
    md: { left: 'pl-10', right: 'pr-10' },
    lg: { left: 'pl-12', right: 'pr-12' },
};

const LABEL_STYLES: Record<InputSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
};

// =============================================================================
// INPUT COMPONENT
// =============================================================================

const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input(
        {
            className,
            containerClassName,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            size = 'md',
            showCount = false,
            id,
            disabled,
            required,
            maxLength,
            value,
            defaultValue,
            onChange,
            ...props
        },
        ref
    ) {
        // Generate stable, unique IDs (SSR-safe)
        const generatedId = useId();
        const inputId = id || generatedId;
        const errorId = error ? `${inputId}-error` : undefined;
        const helperId = helperText ? `${inputId}-helper` : undefined;

        // Track character count for showCount feature
        const [charCount, setCharCount] = useState(() => {
            const initialValue = value ?? defaultValue ?? '';
            return typeof initialValue === 'string' ? initialValue.length : 0;
        });

        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            if (showCount) {
                setCharCount(e.target.value.length);
            }
            onChange?.(e);
        }, [showCount, onChange]);

        // Build aria-describedby attribute
        const ariaDescribedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={clsx('w-full', containerClassName)}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={clsx(
                            'block font-semibold mb-1.5',
                            LABEL_STYLES[size],
                            error
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-700 dark:text-gray-200',
                            disabled && 'opacity-50'
                        )}
                    >
                        {label}
                        {required && (
                            <span
                                className="text-red-500 ml-1"
                                aria-hidden="true"
                            >
                                *
                            </span>
                        )}
                        {required && (
                            <span className="sr-only">(required)</span>
                        )}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div
                            className={clsx(
                                'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
                                ICON_CONTAINER_STYLES[size].left
                            )}
                            aria-hidden="true"
                        >
                            {leftIcon}
                        </div>
                    )}

                    {/* Input Element */}
                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        required={required}
                        maxLength={maxLength}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={handleChange}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={ariaDescribedBy}
                        aria-required={required}
                        className={clsx(
                            // Base styles
                            'w-full rounded-xl border bg-white text-gray-900',
                            'placeholder:text-gray-400',
                            // Transition
                            'transition-colors duration-200',
                            // Focus styles (WCAG 2.1 compliant)
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                            // Error styles
                            error
                                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-400'
                                : 'border-gray-200 focus-visible:ring-blue-500 focus:border-blue-500 dark:border-gray-600',
                            // Disabled styles
                            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
                            'dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
                            // Dark mode
                            'dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
                            // Size styles
                            SIZE_STYLES[size],
                            // Icon padding
                            leftIcon && ICON_PADDING[size].left,
                            rightIcon && ICON_PADDING[size].right,
                            className
                        )}
                        {...props}
                    />

                    {/* Right Icon */}
                    {rightIcon && (
                        <div
                            className={clsx(
                                'absolute top-1/2 -translate-y-1/2 text-gray-400',
                                ICON_CONTAINER_STYLES[size].right
                            )}
                            aria-hidden="true"
                        >
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Footer: Error, Helper Text, Character Count */}
                <div className="flex justify-between items-start mt-1.5 min-h-[1.25rem]">
                    <div className="flex-1">
                        {/* Error Message */}
                        {error && (
                            <p
                                id={errorId}
                                className="text-sm text-red-600 dark:text-red-400 font-medium"
                                role="alert"
                                aria-live="polite"
                            >
                                {error}
                            </p>
                        )}

                        {/* Helper Text */}
                        {helperText && !error && (
                            <p
                                id={helperId}
                                className="text-sm text-gray-500 dark:text-gray-400"
                            >
                                {helperText}
                            </p>
                        )}
                    </div>

                    {/* Character Count */}
                    {showCount && maxLength && (
                        <span
                            className={clsx(
                                'text-xs ml-2',
                                charCount > maxLength
                                    ? 'text-red-500'
                                    : 'text-gray-400'
                            )}
                            aria-live="polite"
                        >
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            </div>
        );
    }
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Input;
export { Input };
