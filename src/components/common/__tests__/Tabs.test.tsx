import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabPanel } from '../Tabs';

describe('Tabs', () => {
    const tabs = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3', badge: 5 },
    ];

    it('renders all tabs', () => {
        render(<Tabs tabs={tabs} onChange={() => {}} />);

        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Tab 2')).toBeInTheDocument();
        expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('shows badge count', () => {
        render(<Tabs tabs={tabs} onChange={() => {}} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('calls onChange when tab is clicked', () => {
        const handleChange = vi.fn();
        render(<Tabs tabs={tabs} onChange={handleChange} />);

        fireEvent.click(screen.getByText('Tab 2'));
        expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('sets active tab', () => {
        render(<Tabs tabs={tabs} activeTab="tab2" onChange={() => {}} />);

        const tab2 = screen.getByText('Tab 2').closest('button');
        expect(tab2).toHaveClass('tab-active');
    });

    it('has correct ARIA attributes', () => {
        render(<Tabs tabs={tabs} activeTab="tab1" onChange={() => {}} />);

        const tabList = screen.getByRole('tablist');
        expect(tabList).toBeInTheDocument();

        const activeTabs = screen.getAllByRole('tab');
        expect(activeTabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(activeTabs[1]).toHaveAttribute('aria-selected', 'false');
    });
});

describe('TabPanel', () => {
    it('renders children when active', () => {
        render(
            <TabPanel id="tab1" activeTab="tab1">
                <p>Content 1</p>
            </TabPanel>
        );
        expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('does not render when inactive', () => {
        render(
            <TabPanel id="tab1" activeTab="tab2">
                <p>Content 1</p>
            </TabPanel>
        );
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
});
