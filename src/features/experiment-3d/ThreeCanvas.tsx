// ===================================================================
// ThreeCanvas — React wrapper for the Three.js 3D scene
// ===================================================================
import { useEffect, useRef, useCallback, useState } from 'react';
import type { SceneRefs } from './sceneBuilder';
import {
  createScene, setLayerVisibility, setAssemblyStep, setCameraView,
  buildStressOverlay,
} from './sceneBuilder';
import type { StressOverlayRefs } from './sceneBuilder';
import type { LayerVisibility, VisualizationMode, ModelConfig } from './types';
import { GROUP_COLUMN_CONFIG } from './types';

interface ThreeCanvasProps {
  mode: VisualizationMode;
  assemblyStep: number;
  layers: LayerVisibility;
  config?: ModelConfig;
  onSceneReady?: (refs: SceneRefs) => void;
}

export default function ThreeCanvas({ mode, assemblyStep, layers, config, onSceneReady }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRefs | null>(null);
  const stressOverlayRef = useRef<StressOverlayRefs | null>(null);
  const stressAnimRef = useRef<number | null>(null);
  const [stressLevel, setStressLevel] = useState(0.5);
  const [animating, setAnimating] = useState(false);

  const usedConfig = config ?? GROUP_COLUMN_CONFIG;

  useEffect(() => {
    if (!containerRef.current) return;
    if (sceneRef.current) {
      sceneRef.current.dispose();
    }
    if (stressOverlayRef.current) {
      stressOverlayRef.current.dispose();
      stressOverlayRef.current = null;
    }
    const refs = createScene(containerRef.current, usedConfig);
    sceneRef.current = refs;
    onSceneReady?.(refs);

    return () => {
      if (stressAnimRef.current) cancelAnimationFrame(stressAnimRef.current);
      if (stressOverlayRef.current) {
        stressOverlayRef.current.dispose();
        stressOverlayRef.current = null;
      }
      refs.dispose();
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usedConfig]);

  // Build/teardown stress overlay based on mode
  useEffect(() => {
    if (!sceneRef.current) return;
    if (mode === 'experiment') {
      if (!stressOverlayRef.current) {
        stressOverlayRef.current = buildStressOverlay(sceneRef.current.scene, usedConfig);
      }
    } else {
      if (stressOverlayRef.current) {
        stressOverlayRef.current.dispose();
        stressOverlayRef.current = null;
      }
    }
  }, [mode, usedConfig]);

  // Stress animation loop in experiment mode
  useEffect(() => {
    if (mode !== 'experiment') {
      if (stressAnimRef.current) {
        cancelAnimationFrame(stressAnimRef.current);
        stressAnimRef.current = null;
      }
      return;
    }
    function tick() {
      const t = Date.now() * 0.001;
      stressOverlayRef.current?.update(t, stressLevel);
      stressAnimRef.current = requestAnimationFrame(tick);
    }
    stressAnimRef.current = requestAnimationFrame(tick);
    return () => {
      if (stressAnimRef.current) cancelAnimationFrame(stressAnimRef.current);
    };
  }, [mode, stressLevel]);

  // Layer / assembly visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    if (mode === 'assembly') {
      setAssemblyStep(sceneRef.current.groups, assemblyStep);
    } else {
      setLayerVisibility(sceneRef.current.groups, layers);
    }
  }, [mode, assemblyStep, layers]);

  // Auto-animate stress when "animating" is on
  useEffect(() => {
    if (!animating) return;
    let dir = 1;
    let val = stressLevel;
    const id = setInterval(() => {
      val += dir * 0.012;
      if (val >= 1) { val = 1; dir = -1; }
      if (val <= 0.05) { val = 0.05; dir = 1; }
      setStressLevel(val);
    }, 50);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

  const handleCameraView = useCallback((view: 'default' | 'top' | 'front' | 'side' | 'detail') => {
    if (!sceneRef.current) return;
    setCameraView(sceneRef.current.camera, sceneRef.current.controls, view);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" style={{ minHeight: 480 }} />

      {/* Experiment mode stress controls */}
      {mode === 'experiment' && (
        <div className="absolute top-3 left-3 space-y-2">
          <div className="bg-surface-900/85 backdrop-blur-sm rounded-xl border border-surface-700/50 p-3 space-y-2 min-w-[180px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-surface-400 font-medium">Mức tải trọng</span>
              <span className="text-[11px] font-mono text-accent-300 font-semibold">
                {Math.round(stressLevel * 100)}%
              </span>
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={Math.round(stressLevel * 100)}
              onChange={(e) => { setAnimating(false); setStressLevel(Number(e.target.value) / 100); }}
              className="w-full accent-yellow-400 h-1.5 bg-surface-700 rounded-lg cursor-pointer"
            />
            {/* Stress color bar */}
            <div className="h-2 rounded-full" style={{
              background: 'linear-gradient(to right, #3b82f6, #f59e0b, #ef4444)',
              opacity: 0.8,
            }} />
            <div className="flex justify-between text-[9px] text-surface-600">
              <span>σs (đất)</span><span>σc (trụ)</span>
            </div>

            {/* Animate toggle */}
            <button
              onClick={() => setAnimating((a) => !a)}
              className={`w-full py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                animating
                  ? 'bg-accent-400/20 text-accent-400 border border-accent-400/40'
                  : 'bg-surface-700/60 text-surface-300 border border-surface-600/40 hover:bg-surface-600/60'
              }`}
            >
              {animating ? '⏸ Dừng' : '▶ Tự động'}
            </button>

            {/* Live n value */}
            <div className="text-center pt-1 border-t border-surface-700/50">
              <div className="text-[9px] text-surface-500">n = σc/σs tại tải này</div>
              <div className="text-sm font-mono font-bold text-accent-400">
                {(2.0 + stressLevel * 1.6).toFixed(2)}
              </div>
              <div className="text-[9px] text-surface-600">≈ {Math.round(18 + stressLevel * 102)} kPa</div>
            </div>
          </div>
        </div>
      )}

      {/* Camera view shortcuts */}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {[
          { view: 'default' as const, label: '3D', icon: '↻' },
          { view: 'top' as const, label: 'Top', icon: '↑' },
          { view: 'front' as const, label: 'Front', icon: '◉' },
          { view: 'detail' as const, label: 'Chi tiết', icon: '⊕' },
        ].map((v) => (
          <button
            key={v.view}
            onClick={() => handleCameraView(v.view)}
            className="px-2.5 py-1.5 bg-surface-900/80 hover:bg-surface-800 backdrop-blur-sm text-surface-300 hover:text-accent-400 text-[11px] font-medium rounded-lg border border-surface-700/50 transition-all"
          >
            <span className="mr-1">{v.icon}</span>{v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
