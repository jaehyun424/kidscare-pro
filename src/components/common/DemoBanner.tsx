// ============================================
// Petit Stay - Demo Mode Banner
// ============================================

import { useState } from 'react';
import { DEMO_MODE } from '../../hooks/useDemo';

export function DemoBanner() {
    const [dismissed, setDismissed] = useState(false);

    if (!DEMO_MODE || dismissed) return null;

    return (
        <div className="demo-banner" role="status">
            Demo Mode — Data is simulated and will not persist
            <button className="demo-banner-dismiss" onClick={() => setDismissed(true)}>
                Dismiss
            </button>
        </div>
    );
}
