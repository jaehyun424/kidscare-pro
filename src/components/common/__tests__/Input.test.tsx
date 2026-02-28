import { render, screen, fireEvent } from '../../../test/utils';
import { Input, Select, Textarea } from '../Input';

describe('Input', () => {
    it('renders with label', () => {
        render(<Input label="Email" />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders without label', () => {
        render(<Input placeholder="Type here" />);
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<Input label="Email" error="Required" />);
        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toHaveClass('form-input-error');
    });

    it('shows hint when no error', () => {
        render(<Input label="Email" hint="Enter your email" />);
        expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('hides hint when error is present', () => {
        render(<Input label="Email" hint="Enter your email" error="Required" />);
        expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('fires onChange', () => {
        const handleChange = vi.fn();
        render(<Input label="Name" onChange={handleChange} />);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('associates label with input via htmlFor', () => {
        render(<Input label="Password" id="pw" type="password" />);
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('id', 'pw');
        expect(input).toHaveAttribute('type', 'password');
    });
});

describe('Select', () => {
    const options = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
    ];

    it('renders options', () => {
        render(<Select label="Choice" options={options} />);
        expect(screen.getByLabelText('Choice')).toBeInTheDocument();
        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('renders placeholder', () => {
        render(<Select label="Choice" options={options} placeholder="Pick one" />);
        expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('shows error', () => {
        render(<Select label="Choice" options={options} error="Required" />);
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('fires onChange', () => {
        const handleChange = vi.fn();
        render(<Select label="Choice" options={options} onChange={handleChange} />);
        fireEvent.change(screen.getByLabelText('Choice'), { target: { value: 'b' } });
        expect(handleChange).toHaveBeenCalled();
    });
});

describe('Textarea', () => {
    it('renders with label', () => {
        render(<Textarea label="Notes" />);
        expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<Textarea label="Notes" error="Too short" />);
        expect(screen.getByText('Too short')).toBeInTheDocument();
    });

    it('defaults to 4 rows', () => {
        render(<Textarea label="Notes" />);
        expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '4');
    });
});
