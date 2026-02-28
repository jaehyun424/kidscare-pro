import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

function wrapper({ children }: { children: React.ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}

describe('ToastContext', () => {
    it('starts with no toasts', () => {
        const { result } = renderHook(() => useToast(), { wrapper });
        expect(result.current.toasts).toHaveLength(0);
    });

    it('adds a success toast', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.success('Done', 'Operation completed');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe('success');
        expect(result.current.toasts[0].title).toBe('Done');
        expect(result.current.toasts[0].message).toBe('Operation completed');
    });

    it('adds an error toast', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.error('Failed', 'Something went wrong');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe('error');
    });

    it('adds a warning toast', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.warning('Caution');
        });

        expect(result.current.toasts[0].type).toBe('warning');
    });

    it('adds an info toast', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.info('FYI', 'This is info');
        });

        expect(result.current.toasts[0].type).toBe('info');
    });

    it('removes a toast by id', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.success('First');
            result.current.success('Second');
        });

        expect(result.current.toasts).toHaveLength(2);

        act(() => {
            result.current.removeToast(result.current.toasts[0].id);
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Second');
    });

    it('can add multiple toasts', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.success('One');
            result.current.error('Two');
            result.current.info('Three');
        });

        expect(result.current.toasts).toHaveLength(3);
    });

    it('throws when used outside provider', () => {
        expect(() => {
            renderHook(() => useToast());
        }).toThrow('useToast must be used within a ToastProvider');
    });
});
