import { useState } from 'react';
// @ts-ignore -- Vite handles jpg imports
import utcLogo from '../geot.utc.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { APP_VERSION } from './lib/version';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import OverviewTab from './features/overview/OverviewTab';
import ModelTab from './features/model/ModelTab';
import ModelConstructionTab from './features/model-construction/ModelConstructionTab';
import ProcedureTab from './features/procedure/ProcedureTab';
import ExperimentTab from './features/experiment/ExperimentTab';
import ComparisonTab from './features/comparison/ComparisonTab';
import InsightsTab from './features/insights/InsightsTab';
import ModelBasisTab from './features/model-basis/ModelBasisTab';
import ChartsTab from './features/charts/ChartsTab';
import MechanismTab from './features/mechanism/MechanismTab';
import QualityControlTab from './features/quality-control/QualityControlTab';
import NumericalSimTab from './features/numerical-sim/NumericalSimTab';
import FormulaTab from './features/formula/FormulaTab';
import {
  BookOpen, Box, Hammer, ListChecks, Beaker,
  GitCompare, Lightbulb, Menu, X, Monitor, GraduationCap, Presentation,
  LocateFixed, Atom, TrendingUp, Shield, Cpu, FlaskConical,
  Smartphone, Tablet, Laptop,
} from 'lucide-react';
import type { ViewLayout } from './store/useAppStore';

interface TabGroup {
  label: string;
  tabs: { label: string; labelEn: string; icon: React.ElementType }[];
}

const TAB_GROUPS: TabGroup[] = [
  {
    label: 'Cơ sở & Lựa chọn',
    tabs: [
      { label: 'Tổng quan', labelEn: 'Overview', icon: BookOpen },
      { label: 'Cơ sở lựa chọn mô hình', labelEn: 'Model Basis', icon: LocateFixed },
    ],
  },
  {
    label: 'Mô hình & Quá trình',
    tabs: [
      { label: 'Mô hình thí nghiệm', labelEn: 'Experimental Model', icon: Box },
      { label: 'Chế tạo mô hình', labelEn: 'Construction', icon: Hammer },
      { label: 'Quy trình thí nghiệm', labelEn: 'Procedure', icon: ListChecks },
      { label: 'Kiểm soát chất lượng', labelEn: 'Quality Control', icon: Shield },
    ],
  },
  {
    label: 'Kết quả & Phân tích',
    tabs: [
      { label: 'Mô phỏng TN & Kết quả', labelEn: 'Simulation & Results', icon: Beaker },
      { label: 'So sánh', labelEn: 'Compare', icon: GitCompare },
      { label: 'Phân tích cơ chế', labelEn: 'Mechanism Analysis', icon: Atom },
      { label: 'Phân tích ứng xử', labelEn: 'Behavior Analysis', icon: TrendingUp },
      { label: 'Mô phỏng số (FEM)', labelEn: 'Numerical Simulation', icon: Cpu },
      { label: 'Công thức đề xuất', labelEn: 'Proposed Formulas', icon: FlaskConical },
      { label: 'Kết luận', labelEn: 'Conclusions', icon: Lightbulb },
    ],
  },
];

// Component mapping — must match tab order above
const TAB_COMPONENTS = [
  OverviewTab, ModelBasisTab,
  ModelTab, ModelConstructionTab, ProcedureTab, QualityControlTab,
  ExperimentTab, ComparisonTab, MechanismTab, InsightsTab, NumericalSimTab, FormulaTab, ChartsTab
];

const MODE_CONFIG = {
  lab: { icon: Monitor, label: 'Lab', color: 'text-blue-400' },
  defense: { icon: GraduationCap, label: 'Defense', color: 'text-accent-400' },
  presentation: { icon: Presentation, label: 'Trình bày', color: 'text-accent-300' },
};

// Bottom nav — 5 key tabs for mobile
const BOTTOM_NAV = [
  { label: 'Tổng quan', icon: BookOpen, tabIdx: 0 },
  { label: 'Mô hình', icon: Box, tabIdx: 2 },
  { label: 'Thí nghiệm', icon: Beaker, tabIdx: 6 },
  { label: 'Công thức', icon: FlaskConical, tabIdx: 11 },
  { label: 'Kết luận', icon: Lightbulb, tabIdx: 12 },
];

// Storyline steps
const STORYLINE = ['Tổng quan', 'Cơ sở', 'Mô hình', 'Chế tạo', 'Quy trình', 'QC', 'Mô phỏng', 'So sánh', 'Cơ chế', 'Ứng xử', 'FEM', 'CT đề xuất', 'Kết luận'];
const STORYLINE_MAP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const VIEW_LAYOUT_CONFIG: Record<ViewLayout, { icon: React.ElementType; label: string }> = {
  mobile: { icon: Smartphone, label: 'Mobile' },
  tablet: { icon: Tablet, label: 'Tablet' },
  desktop: { icon: Laptop, label: 'Desktop' },
};

// ─────────────────────────────────────────────
// Shared Sidebar Nav content (reused in all layouts)
// ─────────────────────────────────────────────
function SidebarNav({
  activeTab,
  setActiveTab,
  onNavigate,
  iconOnly = false,
}: {
  activeTab: number;
  setActiveTab: (i: number) => void;
  onNavigate?: () => void;
  iconOnly?: boolean;
}) {
  return (
    <nav className={`flex-1 overflow-y-auto ${iconOnly ? 'p-1.5' : 'p-3'}`}>
      {TAB_GROUPS.map((group, gi) => {
        const startIdx = TAB_GROUPS.slice(0, gi).reduce((sum, g) => sum + g.tabs.length, 0);
        return (
          <div key={gi}>
            {!iconOnly && <div className="sidebar-group-title">{group.label}</div>}
            <div className={`${iconOnly ? 'flex flex-col gap-0.5 mb-3' : 'space-y-0.5 mb-2'}`}>
              {group.tabs.map((tab, ti) => {
                const globalIdx = startIdx + ti;
                const isActive = activeTab === globalIdx;
                if (iconOnly) {
                  return (
                    <button
                      key={globalIdx}
                      onClick={() => { setActiveTab(globalIdx); onNavigate?.(); }}
                      title={tab.label}
                      className={`icon-sidebar-btn ${isActive ? 'active' : ''}`}
                    >
                      <tab.icon className="w-4 h-4" />
                    </button>
                  );
                }
                return (
                  <button
                    key={globalIdx}
                    onClick={() => { setActiveTab(globalIdx); onNavigate?.(); }}
                    className={`sidebar-item w-full ${isActive ? 'active' : 'text-surface-400'}`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm truncate">{tab.label}</div>
                      <div className="text-xs text-surface-600 truncate">{tab.labelEn}</div>
                    </div>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────
// View Layout Switcher
// ─────────────────────────────────────────────
function ViewSwitcher() {
  const { viewLayout, viewLayoutOverride, setViewLayoutOverride } = useAppStore();
  const effective = viewLayoutOverride ?? viewLayout;

  return (
    <div className="flex items-center gap-0.5 bg-surface-800/60 rounded-lg p-0.5">
      {(Object.keys(VIEW_LAYOUT_CONFIG) as ViewLayout[]).map((v) => {
        const cfg = VIEW_LAYOUT_CONFIG[v];
        const active = effective === v;
        return (
          <button
            key={v}
            title={cfg.label}
            onClick={() => setViewLayoutOverride(active ? null : v)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              active
                ? 'bg-primary-700 text-accent-400'
                : 'text-surface-500 hover:text-surface-300'
            }`}
          >
            <cfg.icon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{cfg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function App() {
  const { activeTab, setActiveTab, mode, setMode, viewLayout, viewLayoutOverride } = useAppStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Activate auto-detect hook
  useResponsiveLayout();

  const effectiveLayout = viewLayoutOverride ?? viewLayout;
  const ActiveComponent = TAB_COMPONENTS[activeTab];
  const storylineStep = STORYLINE_MAP.reduce((best, tabIdx, i) => activeTab >= tabIdx ? i : best, 0);

  // ── MOBILE LAYOUT ──────────────────────────
  if (effectiveLayout === 'mobile') {
    return (
      <div className={`min-h-screen flex flex-col ${mode === 'presentation' ? 'presentation-mode' : ''}`}>
        {/* Mobile Header */}
        <header className="utc-header h-12 flex items-center px-3 gap-2 shrink-0 z-50 sticky top-0">
          <button
            className="p-1.5 text-surface-300 hover:text-surface-100 rounded-lg"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <img
            src={utcLogo as string}
            alt="UTC"
            className="w-7 h-7 rounded-full object-cover ring-2 ring-accent-400/40 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xs font-semibold text-surface-100 truncate">Trụ VLHR + Lưới ĐKT</h1>
            <p className="text-[10px] text-surface-500 truncate">v{APP_VERSION.version}</p>
          </div>

          {/* Mode selector — icon only on mobile */}
          <div className="flex items-center gap-0.5 bg-primary-900/60 rounded-lg p-0.5">
            {(Object.keys(MODE_CONFIG) as Array<keyof typeof MODE_CONFIG>).map((m) => {
              const cfg = MODE_CONFIG[m];
              return (
                <button key={m} onClick={() => setMode(m)}
                  className={`p-1.5 rounded-md transition-all ${mode === m ? 'bg-primary-700 ' + cfg.color : 'text-surface-500'}`}>
                  <cfg.icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
          <ViewSwitcher />
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-12 bottom-16 w-[280px] border-r border-surface-800 bg-surface-950 z-50 overflow-y-auto flex flex-col"
              >
                <SidebarNav
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onNavigate={() => setMobileSidebarOpen(false)}
                />
                <div className="p-3 border-t border-surface-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <img src={utcLogo as string} alt="UTC" className="w-6 h-6 rounded-full object-cover" />
                    <p className="text-[10px] text-surface-500 truncate">{APP_VERSION.university}</p>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16">
          <div className="w-full p-3">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}>
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Tab Bar */}
        <nav className="bottom-nav">
          {BOTTOM_NAV.map(({ label, icon: Icon, tabIdx }) => {
            const isActive = activeTab === tabIdx;
            return (
              <button
                key={tabIdx}
                onClick={() => { setActiveTab(tabIdx); setMobileSidebarOpen(false); }}
                className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // ── TABLET LAYOUT ──────────────────────────
  if (effectiveLayout === 'tablet') {
    return (
      <div className={`min-h-screen flex flex-col ${mode === 'presentation' ? 'presentation-mode' : ''}`}>
        {/* Tablet Header */}
        <header className="utc-header h-13 flex items-center px-4 gap-3 shrink-0 z-50 sticky top-0">
          <img
            src={utcLogo as string}
            alt="UTC"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-accent-400/40 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-surface-100 truncate">Trụ VLHR + Lưới ĐKT</h1>
            <p className="text-xs text-surface-500 truncate hidden sm:block">GRCS – v{APP_VERSION.version}</p>
          </div>

          {/* Mode selector */}
          <div className="flex items-center gap-1 bg-primary-900/60 rounded-lg p-0.5">
            {(Object.keys(MODE_CONFIG) as Array<keyof typeof MODE_CONFIG>).map((m) => {
              const cfg = MODE_CONFIG[m];
              return (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    mode === m ? 'bg-primary-700 ' + cfg.color : 'text-surface-500 hover:text-surface-300'
                  }`}>
                  <cfg.icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
          <ViewSwitcher />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Icon-only Sidebar */}
          <aside className="icon-sidebar shrink-0 hidden sm:flex flex-col border-r border-surface-800 bg-surface-950/50">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} iconOnly />
            <div className="p-2 border-t border-surface-800 shrink-0">
              <img
                src={utcLogo as string}
                alt="UTC"
                className="w-7 h-7 rounded-full object-cover mx-auto ring-1 ring-accent-400/30"
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}>
                  <ActiveComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT (default) ───────────────
  return (
    <div className={`min-h-screen flex flex-col ${mode === 'presentation' ? 'presentation-mode' : ''}`}>
      {/* Desktop Header */}
      <header className="utc-header h-14 flex items-center px-4 gap-3 shrink-0 z-50 sticky top-0">
        {/* UTC branding */}
        <div className="flex items-center gap-2">
          <img
            src={utcLogo as string}
            alt="Bộ môn Địa kỹ thuật — UTC"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-accent-400/40 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-surface-100 truncate">Trụ VLHR + Lưới ĐKT</h1>
            <p className="text-xs text-surface-400 truncate">
              GRCS Simulation — NCS. Nguyễn Hải Hà — v{APP_VERSION.version}
            </p>
          </div>
        </div>

        {/* Storyline nav */}
        <div className="hidden xl:flex items-center gap-0.5 flex-1 max-w-3xl mx-4">
          {STORYLINE.map((s, i) => (
            <button key={i} onClick={() => setActiveTab(STORYLINE_MAP[i])}
              className="flex items-center gap-0.5 group">
              <div className={`w-2 h-2 rounded-full transition-all ${i <= storylineStep ? 'bg-accent-400' : 'bg-surface-600'}`} />
              <span className={`text-[9px] font-medium transition-colors ${
                i === storylineStep ? 'text-accent-400' : i < storylineStep ? 'text-surface-400' : 'text-surface-600'
              } group-hover:text-surface-200`}>{s}</span>
              {i < STORYLINE.length - 1 && (
                <div className={`w-3 h-px mx-0.5 ${i < storylineStep ? 'bg-accent-400/40' : 'bg-surface-700'}`} />
              )}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 bg-primary-900/60 rounded-lg p-0.5">
          {(Object.keys(MODE_CONFIG) as Array<keyof typeof MODE_CONFIG>).map((m) => {
            const cfg = MODE_CONFIG[m];
            return (
              <button key={m} onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === m ? 'bg-primary-700 ' + cfg.color : 'text-surface-500 hover:text-surface-300'
                }`}>
                <cfg.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <ViewSwitcher />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[250px] border-r border-surface-800 bg-surface-950/50 overflow-hidden shrink-0">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-3 border-t border-surface-800 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={utcLogo as string}
                alt="UTC Logo"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-accent-400/30 shrink-0"
              />
              <p className="text-xs text-surface-400 truncate">{APP_VERSION.university}</p>
            </div>
            <p className="text-[10px] text-surface-600">Model 1:20 · MHVL 1g · v{APP_VERSION.version}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
