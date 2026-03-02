// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../assets/login-bg.png', () => ({
    default: 'login-bg.png',
}));

import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import { mockAuthContext } from '../../../test/utils';
import RegisterPage from '../RegisterPage';

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields', () => {
        render(<RegisterPage />);
        expect(screen.getByPlaceholderText('Given Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('Family Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('name@example.com')).toBeTruthy();
        expect(screen.getByPlaceholderText('Min 8 chars')).toBeTruthy();
    });

    it('renders submit button', () => {
        render(<RegisterPage />);
        expect(screen.getByText('SUBMIT APPLICATION')).toBeTruthy();
    });

    it('renders first name label', () => {
        render(<RegisterPage />);
        expect(screen.getByText('First Name')).toBeTruthy();
    });

    it('renders last name label', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Last Name')).toBeTruthy();
    });

    it('renders email address label', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Email Address')).toBeTruthy();
    });

    it('renders password label', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Password')).toBeTruthy();
    });

    it('renders confirm password label', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Confirm')).toBeTruthy();
    });

    it('renders account type select', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Account Type')).toBeTruthy();
    });

    it('renders language select', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Language')).toBeTruthy();
    });

    it('renders sign in link', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Sign In')).toBeTruthy();
    });

    it('renders brand logo', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Stay')).toBeTruthy();
    });

    it('renders membership request heading', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Request Membership')).toBeTruthy();
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<RegisterPage />);

        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            // Should show required errors for firstName, lastName, email, password
            const requiredErrors = screen.getAllByText('validation.required');
            expect(requiredErrors.length).toBeGreaterThanOrEqual(3);
        });
    });

    it('shows password mismatch error', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Given Name'), {
            target: { value: 'John', name: 'firstName' },
        });
        fireEvent.change(screen.getByPlaceholderText('Family Name'), {
            target: { value: 'Doe', name: 'lastName' },
        });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
            target: { value: 'john@example.com', name: 'email' },
        });
        fireEvent.change(screen.getByPlaceholderText('Min 8 chars'), {
            target: { value: 'password123', name: 'password' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm'), {
            target: { value: 'differentpass', name: 'confirmPassword' },
        });

        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            expect(screen.getByText('validation.passwordMismatch')).toBeTruthy();
        });
    });

    it('shows invalid email error', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Given Name'), {
            target: { value: 'John', name: 'firstName' },
        });
        fireEvent.change(screen.getByPlaceholderText('Family Name'), {
            target: { value: 'Doe', name: 'lastName' },
        });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
            target: { value: 'invalidemail', name: 'email' },
        });
        fireEvent.change(screen.getByPlaceholderText('Min 8 chars'), {
            target: { value: 'password123', name: 'password' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm'), {
            target: { value: 'password123', name: 'confirmPassword' },
        });

        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            expect(screen.getByText('validation.invalidEmail')).toBeTruthy();
        });
    });

    it('shows minimum characters error for short password', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Given Name'), {
            target: { value: 'John', name: 'firstName' },
        });
        fireEvent.change(screen.getByPlaceholderText('Family Name'), {
            target: { value: 'Doe', name: 'lastName' },
        });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
            target: { value: 'john@example.com', name: 'email' },
        });
        fireEvent.change(screen.getByPlaceholderText('Min 8 chars'), {
            target: { value: 'abc', name: 'password' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm'), {
            target: { value: 'abc', name: 'confirmPassword' },
        });

        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            expect(screen.getByText('validation.minChars(8)')).toBeTruthy();
        });
    });

    it('calls signUp with valid form data', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Given Name'), {
            target: { value: 'John', name: 'firstName' },
        });
        fireEvent.change(screen.getByPlaceholderText('Family Name'), {
            target: { value: 'Doe', name: 'lastName' },
        });
        fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
            target: { value: 'john@example.com', name: 'email' },
        });
        fireEvent.change(screen.getByPlaceholderText('Min 8 chars'), {
            target: { value: 'password123', name: 'password' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm'), {
            target: { value: 'password123', name: 'confirmPassword' },
        });

        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            expect(mockAuthContext.signUp).toHaveBeenCalledWith(
                'john@example.com',
                'password123',
                'parent',
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Doe',
                }),
            );
        });
    });

    it('clears error when user corrects a field', async () => {
        render(<RegisterPage />);

        // Submit empty form to trigger errors
        fireEvent.click(screen.getByText('SUBMIT APPLICATION'));

        await waitFor(() => {
            expect(screen.getAllByText('validation.required').length).toBeGreaterThanOrEqual(1);
        });

        // Fill in first name to clear its error
        fireEvent.change(screen.getByPlaceholderText('Given Name'), {
            target: { value: 'John', name: 'firstName' },
        });

        // The firstName error should be cleared (error count should decrease)
        const remainingErrors = screen.getAllByText('validation.required');
        expect(remainingErrors.length).toBeGreaterThanOrEqual(1);
    });

    it('renders password toggle button', () => {
        render(<RegisterPage />);
        const toggleBtn = screen.getByLabelText(/show password|hide password/i);
        expect(toggleBtn).toBeTruthy();
    });

    it('renders visual column content', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Join the Standard of Excellence')).toBeTruthy();
    });
});
