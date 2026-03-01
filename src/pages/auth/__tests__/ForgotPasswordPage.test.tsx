import { render, screen, fireEvent, waitFor } from '../../../test/utils';

import ForgotPasswordPage from '../ForgotPasswordPage';

// Mock the login-bg image
vi.mock('../../../assets/login-bg.png', () => ({
    default: 'test-login-bg.png',
}));

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
    sendPasswordResetEmail: vi.fn(),
}));

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders forgot password form', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('SEND RESET LINK')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Access ID')).toBeInTheDocument();
    });

    it('shows back to login link', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('auth.backToLogin')).toBeInTheDocument();
    });

    it('validates empty email', async () => {
        render(<ForgotPasswordPage />);

        const form = screen.getByText('SEND RESET LINK').closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('auth.email is required')).toBeInTheDocument();
        });
    });

    it('validates invalid email format', async () => {
        render(<ForgotPasswordPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'notanemail' },
        });

        const form = screen.getByText('SEND RESET LINK').closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });

    it('shows success message after sending reset link in demo mode', async () => {
        render(<ForgotPasswordPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'user@test.com' },
        });
        fireEvent.click(screen.getByText('SEND RESET LINK'));

        await waitFor(() => {
            expect(screen.getByText('Check Your Email')).toBeInTheDocument();
        });
    });

    it('displays the submitted email in the success message', async () => {
        render(<ForgotPasswordPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'test@hotel.com' },
        });
        fireEvent.click(screen.getByText('SEND RESET LINK'));

        await waitFor(() => {
            expect(screen.getByText('test@hotel.com')).toBeInTheDocument();
        });
    });
});
