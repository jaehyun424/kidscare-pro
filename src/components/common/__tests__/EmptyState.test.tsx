import { render, screen } from '../../../test/utils';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
    it('renders title', () => {
        render(<EmptyState title="No bookings found" />);
        expect(screen.getByText('No bookings found')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(
            <EmptyState
                title="No data"
                description="Try adjusting your filters"
            />
        );
        expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
        const { container } = render(<EmptyState title="No data" />);
        expect(container.querySelector('.empty-state-description')).not.toBeInTheDocument();
    });

    it('renders icon when provided', () => {
        render(
            <EmptyState
                title="Empty"
                icon={<span data-testid="empty-icon">📭</span>}
            />
        );
        expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    });

    it('does not render icon container when icon is not provided', () => {
        const { container } = render(<EmptyState title="Empty" />);
        expect(container.querySelector('.empty-state-icon')).not.toBeInTheDocument();
    });

    it('renders action when provided', () => {
        render(
            <EmptyState
                title="No results"
                action={<button>Create new</button>}
            />
        );
        expect(screen.getByText('Create new')).toBeInTheDocument();
    });

    it('does not render action container when action is not provided', () => {
        const { container } = render(<EmptyState title="No results" />);
        expect(container.querySelector('.empty-state-action')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <EmptyState title="Empty" className="my-custom-class" />
        );
        expect(container.querySelector('.empty-state')).toHaveClass('my-custom-class');
    });

    it('has role="status" for accessibility', () => {
        render(<EmptyState title="Nothing here" />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
