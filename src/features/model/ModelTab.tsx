import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Layers, AlignVerticalSpaceAround, Settings2 } from 'lucide-react';
import ThreeCanvas from '../experiment-3d/ThreeCanvas';
import { SINGLE_COLUMN_CONFIG, GROUP_COLUMN_CONFIG, DEFAULT_LAYER_VISIBILITY } from '../experiment-3d/types';

export default function ModelTab() {
  const [modelType, setModelType] = useState<'single' | 'group'>('single');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="section-title !mb-0">Mô hình thí nghiệm</h2>
          <p className="text-surface-400 mt-1">Cấu tạo mô hình vật lý tỷ lệ 1:20</p>
        </div>
        
        {/* Model Type Selector */}
        <div className="flex bg-surface-800/50 p-1 rounded-xl border border-surface-700/50">
          <button
            onClick={() => setModelType('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              modelType === 'single'
                ? 'bg-accent-400 text-primary-900 shadow-lg shadow-accent-400/20'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <AlignVerticalSpaceAround className="w-4 h-4" />
            Mô hình trụ đơn
          </button>
          <button
            onClick={() => setModelType('group')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              modelType === 'group'
                ? 'bg-accent-400 text-primary-900 shadow-lg shadow-accent-400/20'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <Box className="w-4 h-4" />
            Mô hình nhóm trụ
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {modelType === 'single' ? (
          <motion.div
            key="single"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ModelView config={SINGLE_COLUMN_CONFIG} title="Mô hình trụ đơn (Single Column)" type="single" />
          </motion.div>
        ) : (
          <motion.div
            key="group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ModelView config={GROUP_COLUMN_CONFIG} title="Mô hình nhóm trụ (Group Column)" type="group" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelView({ config, title, type }: { config: any, title: string, type: 'single' | 'group' }) {
  const [layers, setLayers] = useState(DEFAULT_LAYER_VISIBILITY);

  const toggleLayer = (id: keyof typeof DEFAULT_LAYER_VISIBILITY) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Parameters Panel */}
      <div className="space-y-4">
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-surface-200 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-accent-400" />
            Thông số hình học
          </h3>
          <div className="space-y-3 text-sm text-surface-300">
            <div className="flex justify-between border-b border-surface-700/50 pb-2">
              <span>Thùng thí nghiệm</span>
              <span className="font-mono text-accent-400">{type === 'single' ? 'Ø380 × H1000' : '1000×500×1000'}</span>
            </div>
            {type === 'single' ? (
              <>
              <div className="flex justify-between border-b border-surface-700/50 pb-2">
                <span>Hình dạng thùng</span>
                <span className="font-mono text-accent-400">Trụ tròn</span>
              </div>
              <div className="flex justify-between border-b border-surface-700/50 pb-2">
                <span>Số lượng trụ</span>
                <span className="font-mono text-accent-400">01 trụ (chính giữa)</span>
              </div>
              </>
            ) : (
              <>
                <div className="flex justify-between border-b border-surface-700/50 pb-2">
                  <span>Số lượng trụ</span>
                  <span className="font-mono text-accent-400">Nhóm 2×2</span>
                </div>
                <div className="flex justify-between border-b border-surface-700/50 pb-2">
                  <span>Khoảng cách (s)</span>
                  <span className="font-mono text-accent-400">2.5D – 3.5D</span>
                </div>
              </>
            )}
            <div className="flex justify-between border-b border-surface-700/50 pb-2">
              <span>Đường kính (D)</span>
              <span className="font-mono text-accent-400">40 mm</span>
            </div>
            <div className="flex justify-between border-b border-surface-700/50 pb-2">
              <span>Chiều dài (L)</span>
              <span className="font-mono text-accent-400">600 mm</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-surface-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Cấu tạo các lớp
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#475569] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Hệ thống gia tải & Thiết bị đo</p>
                <p className="text-xs text-surface-400">Tấm phân bố tải (không dùng kích thủy lực), cảm biến LVDT, Strain gauges</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#fbbf24] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Đệm cát đỉnh (10 cm)</p>
                <p className="text-xs text-surface-400">Phân bố tải trọng đều xuống lưới</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#10b981] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Lưới ĐKT (J = 100 kN/m)</p>
                <p className="text-xs text-surface-400">Đặt trực tiếp trên đỉnh trụ VLHR</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#9ca3af] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Trụ VLHR (60 cm)</p>
                <p className="text-xs text-surface-400">Đá dăm 0.5-4.75mm, đầm chặt</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#78350f] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Đất nền yếu (60 cm)</p>
                <p className="text-xs text-surface-400">Đất sét pha theo IL yêu cầu</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 mt-0.5 rounded-sm bg-[#d97706] shrink-0" />
              <div>
                <p className="font-semibold text-surface-200">Đệm cát đáy (20 cm)</p>
                <p className="text-xs text-surface-400">Đầm chặt, thoát nước đáy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="lg:col-span-3 h-full min-h-[600px] flex flex-col">
        <div className="glass-card flex-1 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 p-3 bg-surface-900/80 backdrop-blur rounded-lg border border-surface-700/50 w-48">
            <h4 className="text-xs font-bold text-surface-300 mb-2 uppercase tracking-wider">Ẩn / Hiện các lớp</h4>
            <div className="space-y-1.5 flex flex-col">
              {[
                { id: 'loadingSystem', label: 'Hệ gia tải' },
                { id: 'topSand', label: 'Đệm cát đỉnh' },
                { id: 'geogrid', label: 'Lưới ĐKT' },
                { id: 'gauges', label: 'Thiết bị đo' },
                { id: 'columns', label: 'Trụ VLHR' },
                { id: 'soil', label: 'Đất nền yếu' },
                { id: 'baseSand', label: 'Đệm cát đáy' },
                { id: 'tank', label: 'Thùng thí nghiệm' },
              ].map(l => (
                <label key={l.id} className="flex items-center gap-2 text-xs text-surface-200 cursor-pointer hover:text-accent-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={layers[l.id as keyof typeof DEFAULT_LAYER_VISIBILITY]}
                    onChange={() => toggleLayer(l.id as keyof typeof DEFAULT_LAYER_VISIBILITY)}
                    className="rounded bg-surface-800 border-surface-600 text-accent-500 focus:ring-accent-500/50"
                  />
                  {l.label}
                </label>
              ))}
            </div>
          </div>
          
          <ThreeCanvas
            mode="structural"
            assemblyStep={0}
            layers={layers}
            config={config}
          />
        </div>
        <p className="text-center text-xs text-surface-500 mt-2">
          Sử dụng chuột trái để xoay, lăn chuột để thu phóng thiết lập {title.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}
