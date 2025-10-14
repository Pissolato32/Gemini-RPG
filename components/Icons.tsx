import React from 'react';

// Um invólucro de ícone genérico para um estilo consistente
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const HealthIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </IconWrapper>
);

export const StrengthIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21.4 10.4c.5-.5.5-1.3 0-1.8l-1.8-1.8c-.5-.5-1.3-.5-1.8 0l-7.4 7.4c-.5.5-1.3.5-1.8 0l-1.8-1.8c-.5-.5-1.3-.5-1.8 0l-1.8 1.8c-.5.5-.5 1.3 0 1.8l7.4 7.4c.5.5 1.3.5 1.8 0l7.4-7.4Z" />
    <path d="m7.4 8.4 1.8-1.8" />
    <path d="m13.4 2.4 1.8-1.8" />
    <path d="m2.4 13.4 1.8-1.8" />
    <path d="m8.4 19.4 1.8-1.8" />
  </IconWrapper>
);

export const DexterityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M22 12c-2.5 0-4.2-1-4-4 .2-2.2 2.3-3.8 4-4 .2 2.3-1.3 4.2-4 4-2.5 0-4.2-1-4-4 .2-2.2 2.3-3.8 4-4" />
    <path d="M2 12c2.5 0 4.2 1 4 4-.2 2.2-2.3 3.8-4 4-.2-2.3 1.3-4.2 4-4 2.5 0 4.2 1 4 4-.2 2.2-2.3 3.8-4 4" />
    <path d="m13 12-2-10" />
    <path d="m13 12 2 10" />
  </IconWrapper>
);

export const IntelligenceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 2a10 10 0 0 0-10 10c0 4.4 3.6 8 8 8a4.5 4.5 0 0 1 0-8 4.5 4.5 0 0 1 0-8Z" />
    <path d="M12 2a10 10 0 0 1 10 10c0 4.4-3.6 8-8 8a4.5 4.5 0 0 0 0-8 4.5 4.5 0 0 0 0-8Z" />
  </IconWrapper>
);

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconWrapper>
);

export const TimeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </IconWrapper>
);