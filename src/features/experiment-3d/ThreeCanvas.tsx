// ===================================================================
// ThreeCanvas — React wrapper for the Three.js 3D scene
// ===================================================================
import { useEffect, useRef, useCallback } from 'react';
import type { SceneRefs } from './sceneBuilder';
import { createScene, setLayerVisibility, setAssemblyStep, setCameraView } from './sceneBuilder';
import type { LayerVisibility, VisualizationMode, ModelConfig } from './types';

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

  useEffect(() => {
    if (!containerRef.current) return;
    // Dispose previous scene
    if (sceneRef.current) {
      sceneRef.current.dispose();
    }
    const refs = createScene(containerRef.current, config);
    sceneRef.current = refs;
    onSceneReady?.(refs);

    return () => {
      refs.dispose();
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // Update layer visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    if (mode === 'assembly') {
      setAssemblyStep(sceneRef.current.groups, assemblyStep);
    } else {
      setLayerVisibility(sceneRef.current.groups, layers);
    }
  }, [mode, assemblyStep, layers]);

  // Camera view buttons handler
  const handleCameraView = useCallback((view: 'default' | 'top' | 'front' | 'side' | 'detail') => {
    if (!sceneRef.current) return;
    setCameraView(sceneRef.current.camera, sceneRef.current.controls, view);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" style={{ minHeight: 480 }} />
      {/* Camera view shortcuts */}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {[
          { view: 'default' as const, label: '3D', icon: '🔄' },
          { view: 'top' as const, label: 'Top', icon: '⬆' },
          { view: 'front' as const, label: 'Front', icon: '👁' },
          { view: 'detail' as const, label: 'Detail', icon: '🔍' },
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
