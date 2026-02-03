// ============================================
// KidsCare Pro - Input Component
// ============================================

import React, { forwardRef } from 'react';

// ----------------------------------------
// Types
// ----------------------------------------
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

// ----------------------------------------
// Input Component
// ----------------------------------------
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    size = 'md',
    icon,
    iconPosition = 'left',
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasIcon = !!icon;

    const inputClasses = [
        'form-input',
        size === 'sm' ? 'form-input-sm' : size === 'lg' ? 'form-input-lg' : '',
        error ? 'form-input-error' : '',
        hasIcon ? `form-input-icon-${iconPosition}` : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                </label>
            )}
            <div className="form-input-wrapper">
                {icon && iconPosition === 'left' && (
                    <span className="form-input-icon form-input-icon-left">{icon}</span>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={inputClasses}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <span className="form-input-icon form-input-icon-right">{icon}</span>
                )}
            </div>
            {error && <span className="form-error">{error}</span>}
            {hint && !error && <span className="form-hint">{hint}</span>}
        </div>
    );
});

Input.displayName = 'Input';

// ----------------------------------------
// Textarea Component
// ----------------------------------------
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    hint,
    className = '',
    id,
    rows = 4,
    ...props
}, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const textareaClasses = [
        'form-textarea',
        error ? 'form-input-error' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={textareaId} className="form-label">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                className={textareaClasses}
                rows={rows}
                {...props}
            />
            {error && <span className="form-error">{error}</span>}
            {hint && !error && <span className="form-hint">{hint}</span>}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// ----------------------------------------
// Select Component
// ----------------------------------------
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    hint,
    options,
    placeholder,
    className = '',
    id,
    ...props
}, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const selectClasses = [
        'form-select',
        error ? 'form-input-error' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={selectId} className="form-label">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                id={selectId}
                className={selectClasses}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="form-error">{error}</span>}
            {hint && !error && <span className="form-hint">{hint}</span>}
        </div>
    );
});

Select.displayName = 'Select';

// Additional styles
const inputStyles = `
.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input-icon {
  position: absolute;
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}

.form-input-icon-left {
  left: 0;
}

.form-input-icon-right {
  right: 0;
}

.form-input-icon-left + .form-input,
.form-input.form-input-icon-left {
  padding-left: 40px;
}

.form-input.form-input-icon-right {
  padding-right: 40px;
}

.form-input-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.form-input-lg {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = inputStyles;
    document.head.appendChild(styleSheet);
}
