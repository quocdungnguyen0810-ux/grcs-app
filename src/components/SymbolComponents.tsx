/**
 * Reusable scientific notation components
 * Ensures all symbols use proper subscript/superscript rendering
 */
import React from 'react';

/** Generic subscript symbol: <Sym>c<sub>u</sub></Sym> → cᵤ */
export function Sym({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`sym ${className}`}>{children}</span>;
}

// ===== Common symbols as pre-built components =====

/** cᵤ — Undrained shear strength */
export function Cu({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>c<sub>u</sub></span>;
}

/** qᵤₗₜ — Ultimate bearing capacity */
export function Qult({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>q<sub>ult</sub></span>;
}

/** E₅₀ — Secant modulus at 50% failure */
export function E50({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>E<sub>50</sub></span>;
}

/** Eᵢ — Initial tangent modulus */
export function Ei({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>E<sub>i</sub></span>;
}

/** σc — Column stress */
export function SigmaC({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>σ<sub>c</sub></span>;
}

/** σs — Soil stress */
export function SigmaS({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>σ<sub>s</sub></span>;
}

/** n = σc/σs — Stress concentration ratio */
export function StressRatioN({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>n = σ<sub>c</sub>/σ<sub>s</sub></span>;
}

/** aₛ — Area replacement ratio */
export function As({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>a<sub>s</sub></span>;
}

/** Iₗ — Liquidity index */
export function IL({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>I<sub>L</sub></span>;
}

/** Nₖ — Bearing capacity factor */
export function Nc({ className = '' }: { className?: string }) {
  return <span className={`sym ${className}`}>N<sub>c</sub></span>;
}

/** Formula display with proper notation */
export function Formula({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}
