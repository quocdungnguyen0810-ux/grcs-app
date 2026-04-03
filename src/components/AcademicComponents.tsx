import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExpandableSection({ title, icon, children, defaultOpen = false }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-surface-700/40 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="expandable-header">
        {icon}
        <span className="flex-1 text-sm font-semibold text-surface-100">{title}</span>
        <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * MathType-style formula rendering.
 * Supports:
 *  - Subscripts: _{ } or single char after _
 *  - Superscripts: ^{ } or single char after ^
 *  - Greek: \sigma \epsilon \gamma \phi \psi \mu \alpha \beta \delta \Delta \nu
 *  - Special: \times \leq \geq \approx \pm \infty
 *  - Fractions: \frac{num}{den}
 */
function renderMathContent(formula: string): React.ReactNode[] {
  const GREEK: Record<string, string> = {
    sigma: 'σ', epsilon: 'ε', gamma: 'γ', phi: 'φ', psi: 'ψ',
    mu: 'μ', alpha: 'α', beta: 'β', delta: 'δ', Delta: 'Δ',
    nu: 'ν', tau: 'τ', lambda: 'λ', pi: 'π', theta: 'θ', rho: 'ρ',
  };
  const SPECIAL: Record<string, string> = {
    times: '×', leq: '≤', geq: '≥', approx: '≈', pm: '±',
    infty: '∞', cdot: '·', neq: '≠',
  };

  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < formula.length) {
    // Backslash commands
    if (formula[i] === '\\') {
      i++;
      // \frac{num}{den}
      if (formula.substring(i, i + 4) === 'frac') {
        i += 4;
        if (formula[i] === '{') {
          const numEnd = formula.indexOf('}', i);
          const num = formula.substring(i + 1, numEnd);
          i = numEnd + 1;
          if (formula[i] === '{') {
            const denEnd = formula.indexOf('}', i);
            const den = formula.substring(i + 1, denEnd);
            i = denEnd + 1;
            nodes.push(
              <span key={key++} className="math-frac">
                <span className="math-frac-num">{renderMathContent(num)}</span>
                <span className="math-frac-den">{renderMathContent(den)}</span>
              </span>
            );
            continue;
          }
        }
      }
      // Read command name
      let cmd = '';
      while (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
        cmd += formula[i];
        i++;
      }
      if (GREEK[cmd]) {
        nodes.push(<span key={key++} className="math-greek">{GREEK[cmd]}</span>);
      } else if (SPECIAL[cmd]) {
        nodes.push(<span key={key++}>{SPECIAL[cmd]}</span>);
      } else {
        nodes.push(<span key={key++}>\{cmd}</span>);
      }
      continue;
    }

    // Subscript _
    if (formula[i] === '_') {
      i++;
      if (formula[i] === '{') {
        const end = formula.indexOf('}', i);
        const sub = formula.substring(i + 1, end);
        nodes.push(<sub key={key++} className="math-sub">{renderMathContent(sub)}</sub>);
        i = end + 1;
      } else {
        nodes.push(<sub key={key++} className="math-sub">{formula[i]}</sub>);
        i++;
      }
      continue;
    }

    // Superscript ^
    if (formula[i] === '^') {
      i++;
      if (formula[i] === '{') {
        const end = formula.indexOf('}', i);
        const sup = formula.substring(i + 1, end);
        nodes.push(<sup key={key++} className="math-sup">{renderMathContent(sup)}</sup>);
        i = end + 1;
      } else {
        nodes.push(<sup key={key++} className="math-sup">{formula[i]}</sup>);
        i++;
      }
      continue;
    }

    // Regular character
    nodes.push(<span key={key++}>{formula[i]}</span>);
    i++;
  }

  return nodes;
}

export function MathFormula({ children, display = false }: { children: string; display?: boolean }) {
  return (
    <span className={`math-formula ${display ? 'math-display' : 'math-inline'}`}>
      {renderMathContent(children)}
    </span>
  );
}

export function FormulaPanel({ formula, description, source }: {
  formula: string; description?: string; source?: string;
}) {
  return (
    <div className="formula-panel">
      <div className="text-xl font-bold text-accent-300 mb-2 math-formula math-display">
        {renderMathContent(formula)}
      </div>
      {description && <div className="text-xs text-surface-400 mt-1">{description}</div>}
      {source && <div className="text-xs text-surface-500 italic mt-1">Nguồn: {source}</div>}
    </div>
  );
}

export function InsightBox({ title, children, variant = 'default', icon }: {
  title: string; children: React.ReactNode; variant?: 'default' | 'highlight' | 'warning'; icon?: React.ReactNode;
}) {
  const cls = variant === 'highlight' ? 'insight-box-highlight' : variant === 'warning' ? 'p-4 bg-red-900/10 border border-red-700/20 rounded-xl' : 'insight-box';
  return (
    <div className={cls}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold text-surface-100">{title}</h4>
      </div>
      <div className="text-sm text-surface-300 leading-relaxed">{children}</div>
    </div>
  );
}

export function ChapterCard({ chapter, title, titleEn, children }: {
  chapter: number; title: string; titleEn: string; children: React.ReactNode;
}) {
  return (
    <div className="utc-chapter-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent-400/15 flex items-center justify-center text-sm font-bold text-accent-400">
          Ch.{chapter}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="label-vi text-sm truncate">{title}</h3>
          <span className="label-en">{titleEn}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export function SectionDivider({ label }: { label?: string }) {
  if (!label) return <div className="utc-divider" />;
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-primary-700/40" />
      <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">{label}</span>
      <div className="flex-1 h-px bg-primary-700/40" />
    </div>
  );
}

export function FigurePlaceholder({ id, title, chapter, imagePath }: { id: string; title: string; chapter?: number; imagePath?: string }) {
  if (imagePath) {
    return (
      <div className="rounded-xl overflow-hidden border border-surface-700/30">
        <img src={imagePath} alt={title} className="w-full h-auto" loading="lazy" />
        <div className="p-3 bg-surface-900/70 text-center">
          <div className="text-xs text-surface-500">{id} {chapter ? `— Chương ${chapter}` : ''}</div>
          <div className="text-sm text-surface-300 font-medium">{title}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-surface-900/50 border border-surface-700/30 border-dashed rounded-xl p-6 text-center">
      <div className="text-xs text-surface-500 mb-2">{id} {chapter ? `— Chương ${chapter}` : ''}</div>
      <div className="text-sm text-surface-400 font-medium mb-1">{title}</div>
      <div className="text-xs text-accent-500 italic">Hình minh họa cần thay bằng hình từ luận án</div>
    </div>
  );
}

export function KeyValueRow({ label, value, unit, color }: {
  label: React.ReactNode; value: string | number; unit?: string; color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-surface-800/50 last:border-0">
      <span className="text-xs text-surface-400">{label}</span>
      <span className={`text-sm font-mono font-semibold ${color || 'text-surface-100'}`}>
        {value}{unit && <span className="text-xs font-normal text-surface-500 ml-1">{unit}</span>}
      </span>
    </div>
  );
}
