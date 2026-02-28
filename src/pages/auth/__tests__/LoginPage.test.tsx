import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import { mockAuthContext } from '../../../test/utils';

// Need to import LoginPage after mocks are set up
import LoginPage from '../LoginPage';

// Mock the login-bg image
vi.mock('../../../assets/login-bg.png', () => ({
    default: 'test-login-bg.png',
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(<LoginPage />);
        expect(screen.getByText('AUTHENTICATE')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Access ID')).toBeInTheDocument();
        expect(screen.getByLabelText('Secure Password')).toBeInTheDocument();
    });

    it('shows demo account buttons', () => {
        render(<LoginPage />);
        expect(screen.getByText('Concierge')).toBeInTheDocument();
        expect(screen.getByText('Guest')).toBeInTheDocument();
        expect(screen.getByText('Specialist')).toBeInTheDocument();
    });

    it('validates empty email', async () => {
        render(<LoginPage />);

        // Need to submit the form
        const form = screen.getByText('AUTHENTICATE').closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('auth.email is required')).toBeInTheDocument();
        });
    });

    it('validates invalid email format', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'notanemail' },
        });
        fireEvent.change(screen.getByLabelText('Secure Password'), {
            target: { value: 'password123' },
        });

        const form = screen.getByText('AUTHENTICATE').closest('form')!;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });

    it('validates short password', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'user@test.com' },
        });
        fireEvent.change(screen.getByLabelText('Secure Password'), {
            target: { value: '123' },
        });
        fireEvent.click(screen.getByText('AUTHENTICATE'));

        await waitFor(() => {
            expect(screen.getByText('Minimum 6 characters')).toBeInTheDocument();
        });
    });

    it('calls signIn with valid credentials', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Email Access ID'), {
            target: { value: 'parent@demo.com' },
        });
        fireEvent.change(screen.getByLabelText('Secure Password'), {
            target: { value: 'demo1234' },
        });
        fireEvent.click(screen.getByText('AUTHENTICATE'));

        await waitFor(() => {
            expect(mockAuthContext.signIn).toHaveBeenCalledWith('parent@demo.com', 'demo1234');
        });
    });

    it('fills credentials when demo button clicked', () => {
        render(<LoginPage />);

        fireEvent.click(screen.getByText('Guest'));

        expect(screen.getByLabelText('Email Access ID')).toHaveValue('parent@demo.com');
        expect(screen.getByLabelText('Secure Password')).toHaveValue('demo1234');
    });

    it('fills hotel credentials when concierge demo clicked', () => {
        render(<LoginPage />);

        fireEvent.click(screen.getByText('Concierge'));

        expect(screen.getByLabelText('Email Access ID')).toHaveValue('hotel@demo.com');
    });
});
