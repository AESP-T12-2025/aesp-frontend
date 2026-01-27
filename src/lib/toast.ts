/**
 * Centralized Toast Utilities for AESP Frontend
 * ==============================================
 * Provides consistent, accessible toast notifications across the application.
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Loading state with promise resolution
 * - API error handling with automatic message extraction
 * - Message truncation to prevent UI overflow
 * - Configurable durations and positions
 * - TypeScript support
 * 
 * @example
 * // Success toast
 * showSuccess('Saved successfully!')
 * 
 * // Error handling
 * try { await api.save() } catch (e) { handleApiError(e) }
 * 
 * // Promise toast
 * promiseToast(api.save(), {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Failed to save'
 * })
 */

import toast, { ToastOptions, ToastPosition } from 'react-hot-toast';

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/** Maximum characters for toast messages */
const MAX_MESSAGE_LENGTH = 150;

/** Default duration for toasts (ms) */
const DEFAULT_DURATION = 4000;

/** Extended duration for error toasts (ms) */
const ERROR_DURATION = 5000;

/** Short duration for success toasts (ms) */
const SUCCESS_DURATION = 3000;

/** Default toast position */
const DEFAULT_POSITION: ToastPosition = 'top-right';

// =============================================================================
// STYLE CONSTANTS
// =============================================================================

/** Base toast styling */
const baseStyle = {
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

/** Success toast colors */
const successStyle = {
    style: {
        ...baseStyle,
        background: '#059669', // Emerald-600
        color: '#fff',
    },
    iconTheme: {
        primary: '#fff',
        secondary: '#059669',
    },
};

/** Error toast colors */
const errorStyle = {
    style: {
        ...baseStyle,
        background: '#DC2626', // Red-600
        color: '#fff',
    },
    iconTheme: {
        primary: '#fff',
        secondary: '#DC2626',
    },
};

/** Warning toast colors */
const warningStyle = {
    style: {
        ...baseStyle,
        background: '#D97706', // Amber-600
        color: '#fff',
    },
};

/** Info toast colors */
const infoStyle = {
    style: {
        ...baseStyle,
        background: '#2563EB', // Blue-600
        color: '#fff',
    },
};

/** Loading toast colors */
const loadingStyle = {
    style: {
        ...baseStyle,
        background: '#4B5563', // Gray-600
        color: '#fff',
    },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Truncate message to prevent UI overflow
 */
function truncateMessage(message: string): string {
    if (!message) return '';
    if (message.length <= MAX_MESSAGE_LENGTH) return message;
    return message.slice(0, MAX_MESSAGE_LENGTH - 3) + '...';
}

/**
 * Default toast options factory
 */
function getDefaultOptions(): ToastOptions {
    return {
        duration: DEFAULT_DURATION,
        position: DEFAULT_POSITION,
    };
}

// =============================================================================
// PUBLIC TOAST FUNCTIONS
// =============================================================================

/**
 * Show a success toast notification
 * 
 * @param message - Success message to display
 * @param options - Optional toast configuration
 * @returns Toast ID for further manipulation
 * 
 * @example
 * showSuccess('Profile updated successfully!')
 */
export function showSuccess(
    message: string,
    options?: Partial<ToastOptions>
): string {
    return toast.success(truncateMessage(message), {
        ...getDefaultOptions(),
        ...successStyle,
        duration: SUCCESS_DURATION,
        ...options,
    });
}

/**
 * Show an error toast notification
 * 
 * @param message - Error message to display
 * @param options - Optional toast configuration
 * @returns Toast ID for further manipulation
 * 
 * @example
 * showError('Failed to save changes')
 */
export function showError(
    message: string,
    options?: Partial<ToastOptions>
): string {
    return toast.error(truncateMessage(message), {
        ...getDefaultOptions(),
        ...errorStyle,
        duration: ERROR_DURATION,
        ...options,
    });
}

/**
 * Show a warning toast notification
 * 
 * @param message - Warning message to display
 * @param options - Optional toast configuration
 * @returns Toast ID for further manipulation
 * 
 * @example
 * showWarning('Your session will expire in 5 minutes')
 */
export function showWarning(
    message: string,
    options?: Partial<ToastOptions>
): string {
    return toast(truncateMessage(message), {
        ...getDefaultOptions(),
        ...warningStyle,
        icon: '⚠️',
        ...options,
    });
}

/**
 * Show an info toast notification
 * 
 * @param message - Info message to display
 * @param options - Optional toast configuration
 * @returns Toast ID for further manipulation
 * 
 * @example
 * showInfo('New features are available!')
 */
export function showInfo(
    message: string,
    options?: Partial<ToastOptions>
): string {
    return toast(truncateMessage(message), {
        ...getDefaultOptions(),
        ...infoStyle,
        icon: 'ℹ️',
        ...options,
    });
}

/**
 * Show a loading toast that persists until dismissed
 * 
 * @param message - Loading message to display
 * @returns Toast ID to update or dismiss later
 * 
 * @example
 * const toastId = showLoading('Uploading...')
 * // Later:
 * updateToast(toastId, 'success', 'Upload complete!')
 */
export function showLoading(message: string): string {
    return toast.loading(truncateMessage(message), {
        position: DEFAULT_POSITION,
        ...loadingStyle,
    });
}

// =============================================================================
// TOAST MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Update an existing toast with a new message and type
 * 
 * @param toastId - ID of the toast to update
 * @param type - New type ('success' or 'error')
 * @param message - New message to display
 * 
 * @example
 * const id = showLoading('Saving...')
 * try {
 *   await save()
 *   updateToast(id, 'success', 'Saved!')
 * } catch {
 *   updateToast(id, 'error', 'Failed to save')
 * }
 */
export function updateToast(
    toastId: string,
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
): void {
    toast.dismiss(toastId);

    switch (type) {
        case 'success':
            showSuccess(message);
            break;
        case 'error':
            showError(message);
            break;
        case 'warning':
            showWarning(message);
            break;
        case 'info':
            showInfo(message);
            break;
    }
}

/**
 * Dismiss a specific toast by ID
 * 
 * @param toastId - ID of the toast to dismiss
 */
export function dismissToast(toastId: string): void {
    toast.dismiss(toastId);
}

/**
 * Dismiss all visible toasts
 */
export function dismissAllToasts(): void {
    toast.dismiss();
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/** Axios error shape */
interface AxiosError {
    response?: {
        data?: {
            detail?: string;
            message?: string;
            error?: {
                message?: string;
                code?: string;
            };
        };
        status?: number;
    };
    message?: string;
}

/**
 * Extract error message from various error types
 * 
 * @param error - The error object
 * @param defaultMessage - Fallback message if extraction fails
 * @returns Extracted error message
 */
export function extractErrorMessage(
    error: unknown,
    defaultMessage = 'Đã xảy ra lỗi'
): string {
    if (!error) return defaultMessage;

    // String error
    if (typeof error === 'string') {
        return error;
    }

    // Standard Error object
    if (error instanceof Error) {
        return error.message;
    }

    // Object-based error
    if (typeof error === 'object') {
        const err = error as AxiosError;

        // Axios error response
        if (err.response?.data) {
            const data = err.response.data;
            return (
                data.detail ||
                data.message ||
                data.error?.message ||
                defaultMessage
            );
        }

        // Direct message property
        if (err.message) {
            return err.message;
        }
    }

    return defaultMessage;
}

/**
 * Handle API error and show appropriate toast
 * 
 * @param error - The error object from API call
 * @param defaultMessage - Fallback error message
 * @returns The extracted error message
 * 
 * @example
 * try {
 *   await api.updateUser(data)
 * } catch (error) {
 *   handleApiError(error, 'Failed to update user')
 * }
 */
export function handleApiError(
    error: unknown,
    defaultMessage = 'Đã xảy ra lỗi'
): string {
    const message = extractErrorMessage(error, defaultMessage);
    showError(message);
    return message;
}

// =============================================================================
// PROMISE TOAST
// =============================================================================

/** Messages for promise toast transitions */
interface PromiseMessages {
    loading: string;
    success: string;
    error: string;
}

/**
 * Show toast that auto-updates based on promise resolution
 * 
 * @param promise - The promise to track
 * @param messages - Messages for each state
 * @returns The original promise result
 * 
 * @example
 * const result = await promiseToast(api.saveUser(data), {
 *   loading: 'Saving user...',
 *   success: 'User saved!',
 *   error: 'Failed to save user'
 * })
 */
export function promiseToast<T>(
    promise: Promise<T>,
    messages: PromiseMessages
): Promise<T> {
    return toast.promise(promise, messages, {
        position: DEFAULT_POSITION,
        loading: loadingStyle,
        success: {
            ...successStyle,
            duration: SUCCESS_DURATION,
        },
        error: {
            ...errorStyle,
            duration: ERROR_DURATION,
        },
    });
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export the underlying toast for advanced usage
export { toast };

// Export constants for external configuration
export {
    MAX_MESSAGE_LENGTH,
    DEFAULT_DURATION,
    ERROR_DURATION,
    SUCCESS_DURATION,
    DEFAULT_POSITION,
};
