// ============================================
// Petit Stay - Brand Logo Component
// Replaces emoji 👶/✨ with a proper SVG mark
// ============================================

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 52,
};

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      className={`brand-logo ${className}`}
      aria-hidden="true"
    >
      {/* Circular gold background */}
      <circle cx="24" cy="24" r="22" fill="url(#brandGradient)" />
      {/* Star accent */}
      <path
        d="M24 12l2.5 5.5L32 18.5l-4 4.2 1 6.3L24 26l-5 3l1-6.3-4-4.2 5.5-1z"
        fill="white"
        opacity="0.95"
      />
      {/* Crescent child silhouette */}
      <ellipse cx="24" cy="32" rx="7" ry="4.5" fill="white" opacity="0.7" />
      <defs>
        <linearGradient id="brandGradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#D3B167" />
          <stop offset="100%" stopColor="#9E8047" />
        </linearGradient>
      </defs>
    </svg>
  );
}
