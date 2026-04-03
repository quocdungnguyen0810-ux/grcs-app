// ===================================================================
// Experiment3DTab — Main tab component
// "Trình tự thí nghiệm & mô hình 3D"
// ===================================================================
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Play, Pause, SkipForward, SkipBack, RotateCcw,
  Eye, EyeOff, Box, Wrench, Zap, ChevronRight, Info
} from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import type { VisualizationMode, LayerVisibility } from './types';
import {
  ASSEMBLY_STEPS,
  DEFAULT_LAYER_VISIBILITY,
} from './types';

const MODE_TABS: { id: VisualizationMode; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'assembly', label: 'Lắp ráp', labelEn: 'Assembly', icon: Wrench },
  { id: 'structural', label: 'Cấu tạo', labelEn: 'Structural', icon: Box },
  { id: 'experiment', label: 'Thí nghiệm', labelEn: 'Experiment', icon: Zap },
];

const LAYER_CONFIG: { id: keyof LayerVisibility; label: string; color: string }[] = [
  { id: 'tank', label: 'Thùng thí nghiệm', color: '#334155' },
  { id: 'baseSand', label: 'Đệm cát đáy', color: '#d97706' },
  { id: 'soil', label: 'Đất nền yếu', color: '#78350f' },
  { id: 'columns', label: 'Trụ VLHR', color: '#9ca3af' },
  { id: 'geogrid', label: 'Lưới ĐKT', color: '#10b981' },
  { id: 'topSand', label: 'Đệm cát đỉnh', color: '#fbbf24' },
  { id: 'gauges', label: 'Thiết bị đo', color: '#ef4444' },
  { id: 'loadingSystem', label: 'Hệ gia tải', color: '#475569' },
  { id: 'labels', label: 'Nhãn', color: '#f1f5f9' },
];

export default function Experiment3DTab() {
  const [mode, setMode] = useState<VisualizationMode>('assembly');
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYER_VISIBILITY);
  const [speed, setSpeed] = useState(1);

  // Auto-play assembly
  useEffect(() => {
    if (!isPlaying || mode !== 'assembly') return;
    if (assemblyStep >= ASSEMBLY_STEPS.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setAssemblyStep((s) => s + 1);
    }, 2000 / speed);
    return () => clearTimeout(timer);
  }, [isPlaying, assemblyStep, mode, speed]);

  const handlePlayPause = useCallback(() => {
    if (assemblyStep >= ASSEMBLY_STEPS.length - 1) {
      setAssemblyStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, assemblyStep]);

  const handleReset = useCallback(() => {
    setAssemblyStep(0);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setAssemblyStep((s) => Math.min(s + 1, ASSEMBLY_STEPS.length - 1));
  }, []);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setAssemblyStep((s) => Math.max(s - 1, 0));
  }, []);

  const toggleLayer = useCallback((id: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Layers className="w-5 h-5 text-accent-400" />
        <h2 className="section-title !mb-0">Trình tự thí nghiệm & mô hình 3D</h2>
        <span className="label-en">Experiment Sequence & 3D Model</span>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`tab-button flex items-center gap-2 ${mode === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className="text-xs text-surface-500 hidden sm:inline">({tab.labelEn})</span>
          </button>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left panel — controls */}
        <div className="space-y-3">
          {/* Assembly controls */}
          <AnimatePresence mode="wait">
            {mode === 'assembly' && (
              <motion.div
                key="assembly-controls"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="glass-card p-4 space-y-3"
              >
                <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-accent-400" />
                  Trình tự lắp ráp
                </h3>

                {/* Playback controls */}
                <div className="flex items-center gap-2">
                  <button onClick={handleStepBack} className="btn-secondary p-2" disabled={assemblyStep <= 0}>
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button onClick={handlePlayPause} className="btn-accent px-4 py-2 flex items-center gap-2">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="text-xs font-semibold">{isPlaying ? 'Dừng' : 'Phát'}</span>
                  </button>
                  <button onClick={handleStepForward} className="btn-secondary p-2" disabled={assemblyStep >= ASSEMBLY_STEPS.length - 1}>
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button onClick={handleReset} className="btn-secondary p-2 ml-auto">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-surface-800/50 rounded-lg p-0.5">
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`flex-1 px-2 py-1 rounded text-xs transition-all ${speed === s ? 'bg-primary-700 text-primary-300' : 'text-surface-500 hover:text-surface-300'}`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>

                {/* Step list */}
                <div className="space-y-1">
                  {ASSEMBLY_STEPS.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() => { setAssemblyStep(i); setIsPlaying(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        i === assemblyStep
                          ? 'bg-accent-400/15 text-accent-400 font-medium'
                          : i < assemblyStep
                          ? 'text-surface-400 bg-surface-800/30'
                          : 'text-surface-500 hover:bg-surface-700/30'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          i <= assemblyStep
                            ? 'bg-accent-400 text-primary-900'
                            : 'bg-surface-700 text-surface-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs truncate">{step.label}</div>
                        <div className="text-[10px] text-surface-600 truncate">{step.labelEn}</div>
                      </div>
                      {i === assemblyStep && <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-accent-400" />}
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="flex gap-1">
                  {ASSEMBLY_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i <= assemblyStep ? 'bg-accent-400' : 'bg-surface-700'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Structural / Experiment — Layer toggles */}
            {(mode === 'structural' || mode === 'experiment') && (
              <motion.div
                key="layer-controls"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="glass-card p-4 space-y-3"
              >
                <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent-400" />
                  Lớp hiển thị
                </h3>
                {LAYER_CONFIG.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      layers[l.id]
                        ? 'bg-surface-700/60 text-surface-100'
                        : 'text-surface-500 opacity-60'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layers[l.id] ? l.color : '#334155' }}
                    />
                    <span className="flex-1 text-left text-xs">{l.label}</span>
                    {layers[l.id] ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Component specs */}
          <div className="glass-card p-4 space-y-2">
            <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-400" />
              Thông số mô hình
            </h3>
            <div className="space-y-1 text-xs text-surface-400">
              <div className="flex justify-between"><span>Thùng TN</span><span className="text-surface-200">1000×500×700 mm</span></div>
              <div className="flex justify-between"><span>Trụ VLHR</span><span className="text-surface-200">D=40mm, L=600mm</span></div>
              <div className="flex justify-between"><span>Nhóm trụ</span><span className="text-surface-200">2×2, vuông</span></div>
              <div className="flex justify-between"><span>Lưới ĐKT</span><span className="text-surface-200">100 kN/m</span></div>
              <div className="flex justify-between"><span>Đệm cát</span><span className="text-surface-200">50 mm</span></div>
              <div className="flex justify-between"><span>Tỷ lệ MH</span><span className="text-surface-200">1:20</span></div>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="lg:col-span-3 glass-card overflow-hidden" style={{ minHeight: 520 }}>
          {/* Step info banner (assembly mode) */}
          {mode === 'assembly' && (
            <motion.div
              key={`step-info-${assemblyStep}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2.5 bg-accent-400/10 border-b border-accent-400/20 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-accent-400 text-primary-900 flex items-center justify-center text-sm font-bold shrink-0">
                {assemblyStep + 1}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-accent-400">
                  {ASSEMBLY_STEPS[assemblyStep].label}
                </div>
                <div className="text-xs text-surface-400">
                  {ASSEMBLY_STEPS[assemblyStep].description}
                </div>
              </div>
            </motion.div>
          )}

          {/* Mode banner (structural / experiment) */}
          {mode === 'structural' && (
            <div className="px-4 py-2.5 bg-primary-700/20 border-b border-primary-700/30 flex items-center gap-3">
              <Box className="w-5 h-5 text-primary-400" />
              <div>
                <div className="text-sm font-semibold text-surface-200">Mô hình cấu tạo 3D</div>
                <div className="text-xs text-surface-500">Xoay mô hình bằng kéo chuột · Thu phóng bằng cuộn chuột</div>
              </div>
            </div>
          )}
          {mode === 'experiment' && (
            <div className="px-4 py-2.5 bg-red-900/15 border-b border-red-700/20 flex items-center gap-3">
              <Zap className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm font-semibold text-surface-200">Chế độ thí nghiệm</div>
                <div className="text-xs text-surface-500">Gia tải — Truyền tải trọng qua đệm cát → lưới ĐKT → trụ VLHR → đất nền</div>
              </div>
            </div>
          )}

          {/* Three.js canvas */}
          <ThreeCanvas
            mode={mode}
            assemblyStep={assemblyStep}
            layers={layers}
          />
        </div>
      </div>

      {/* Bottom legend — Correct Experiment Sequence */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-surface-300 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-400" />
          Trình tự thí nghiệm chính xác
          <span className="label-en">Correct Experiment Sequence</span>
        </h3>
        <div className="flex flex-wrap items-center gap-1">
          {ASSEMBLY_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => { setMode('assembly'); setAssemblyStep(i); setIsPlaying(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                  mode === 'assembly' && assemblyStep === i
                    ? 'bg-accent-400/15 text-accent-400 font-semibold'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/30'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  mode === 'assembly' && i <= assemblyStep
                    ? 'bg-accent-400 text-primary-900'
                    : 'bg-surface-700 text-surface-400'
                }`}>
                  {i + 1}
                </span>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < ASSEMBLY_STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-surface-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stress transfer path (experiment mode) */}
      {mode === 'experiment' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-surface-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            Đường truyền tải trọng
            <span className="label-en">Load Transfer Path</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { label: 'Tải trọng P', color: 'bg-blue-500' },
              { label: 'Tấm phân bố', color: 'bg-gray-500' },
              { label: 'Đệm cát', color: 'bg-yellow-500' },
              { label: 'Lưới ĐKT', color: 'bg-emerald-500' },
              { label: 'Đỉnh trụ VLHR (σc)', color: 'bg-amber-500' },
              { label: 'Đất nền (σs)', color: 'bg-orange-800' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-surface-300">{item.label}</span>
                {i < 5 && <ChevronRight className="w-3 h-3 text-surface-600" />}
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-primary-900/30 rounded-lg border border-primary-700/30">
            <p className="text-xs text-surface-400">
              <strong className="text-accent-400">Hệ số tập trung ứng suất (n):</strong>{' '}
              n = σc/σs — Tải trọng truyền qua lưới ĐKT tập trung tại đỉnh trụ VLHR, 
              tạo hiệu ứng tăng cường sức chịu tải và giảm lún hiệu quả. 
              Giá trị n tăng theo tải trọng, chứng minh cơ chế truyền ứng suất qua hiệu ứng vòm đất và membrane effect.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
