// ============================================
// KidsCare Pro - DatePicker Component
// ============================================

import { useRef } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label?: string;
    min?: string;
    max?: string;
    error?: string;
    placeholder?: string;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    label,
    min,
    max,
    error,
    placeholder = 'Select date',
    className = '',
}: DatePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="date-picker-wrapper">
                <input
                    ref={inputRef}
                    type="date"
                    className="date-picker-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={min}
                    max={max}
                    placeholder={placeholder}
                />
                {value && (
                    <span className="date-picker-display">{formatDisplayDate(value)}</span>
                )}
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartChange: (date: string) => void;
    onEndChange: (date: string) => void;
    label?: string;
    className?: string;
}

export function DateRangePicker({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    label,
    className = '',
}: DateRangePickerProps) {
    return (
        <div className={`date-range-picker ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="date-range-inputs">
                <DatePicker
                    value={startDate}
                    onChange={onStartChange}
                    max={endDate || undefined}
                    placeholder="Start date"
                />
                <span className="date-range-separator">to</span>
                <DatePicker
                    value={endDate}
                    onChange={onEndChange}
                    min={startDate || undefined}
                    placeholder="End date"
                />
            </div>
        </div>
    );
}

// Period selector for dashboards
interface PeriodSelectorProps {
    value: string;
    onChange: (period: string) => void;
    options?: { value: string; label: string }[];
}

export function PeriodSelector({
    value,
    onChange,
    options = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ],
}: PeriodSelectorProps) {
    return (
        <div className="period-selector" role="group" aria-label="Time period">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    className={`period-btn ${value === opt.value ? 'period-active' : ''}`}
                    onClick={() => onChange(opt.value)}
                    aria-pressed={value === opt.value}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
