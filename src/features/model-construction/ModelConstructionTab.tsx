import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SINGLE_COLUMN_STEPS, GROUP_COLUMN_STEPS } from '../../lib/thesis/modelConstruction';
import { FigurePlaceholder } from '../../components/AcademicComponents';
import { Hammer, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

export default function ModelConstructionTab() {
  const [track, setTrack] = useState<'single' | 'group'>('single');
  const [step, setStep] = useState(0);

  const steps = track === 'single' ? SINGLE_COLUMN_STEPS : GROUP_COLUMN_STEPS;
  const current = steps[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Hammer className="w-5 h-5 text-accent-400" />
        <h2 className="section-title !mb-0">Chế tạo mô hình vật lý</h2>
        <span className="label-en">Physical Model Construction — Chapter 3</span>
      </div>

      {/* Overview illustration */}
      <div className="glass-card overflow-hidden">
        <img src="/model_construction.png" alt="Quy trình chế tạo mô hình vật lý" className="w-full h-auto max-h-[300px] object-cover" loading="lazy" />
        <div className="p-3 text-center bg-surface-900/50">
          <p className="text-xs text-surface-500 italic">Hình minh họa tổng quan quy trình chế tạo mô hình — AI Generated</p>
        </div>
      </div>

      {/* Track selector */}
      <div className="flex gap-2 bg-surface-800/50 p-1 rounded-xl w-fit">
        <button onClick={() => { setTrack('single'); setStep(0); }}
          className={`tab-button text-sm ${track === 'single' ? 'active' : ''}`}>
          🔹 Trụ đơn
        </button>
        <button onClick={() => { setTrack('group'); setStep(0); }}
          className={`tab-button text-sm ${track === 'group' ? 'active' : ''}`}>
          🔷 Nhóm trụ 2×2
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Step timeline */}
        <div className="glass-card p-4 space-y-1 max-h-[70vh] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
            {track === 'single' ? 'Quy trình trụ đơn' : 'Quy trình nhóm trụ'}
          </h3>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left text-xs transition-all ${
                i === step ? 'bg-accent-400/15 text-accent-400' :
                i < step ? 'text-emerald-400/70' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/30'
              }`}>
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                i === step ? 'border-accent-400 bg-accent-400/15 text-accent-400' :
                i < step ? 'border-emerald-500/50 bg-emerald-600/10 text-emerald-400' :
                'border-surface-600 text-surface-500'
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span className="leading-tight">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={`${track}-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="glass-card p-6 space-y-5">

              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-400/15 flex items-center justify-center text-xl font-bold text-accent-400">
                  {current.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-100">{current.title}</h3>
                  <span className="text-sm text-surface-500">Bước {current.step} / {steps.length} — {track === 'single' ? 'Trụ đơn' : 'Nhóm trụ'}</span>
                </div>
              </div>

              {/* Visual */}
              <ConstructionStepSVG step={current.step} track={track} />

              {/* Description */}
              <div className="p-4 bg-surface-800/40 rounded-xl">
                <h4 className="text-sm font-medium text-surface-200 mb-2">📋 Mô tả thao tác</h4>
                <p className="text-sm text-surface-300 leading-relaxed mb-4">{current.description}</p>
                {current.substeps && (
                  <div className="mt-4 space-y-2 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-surface-700">
                    {current.substeps.map((sub, i) => (
                      <div key={i} className="flex relative pl-8 pb-3 last:pb-0">
                        <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-accent-400 ring-4 ring-surface-800" />
                        <div>
                          <div className="text-xs font-semibold text-accent-300 mb-0.5">{sub.id}. {sub.title}</div>
                          <div className="text-xs text-surface-400">{sub.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {track === 'group' && current.step === 4 && (
                  <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-300 italic">
                      * Các bước thi công (4.1–4.7) thực hiện tương tự như nhóm trụ đơn nhưng lặp lại 4 lần cho 4 vị trí trong thiết bị định vị theo tỷ lệ s/D tương ứng.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Control points */}
                <div className="p-3 bg-surface-800/50 rounded-lg">
                  <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />Điểm kiểm soát
                  </h4>
                  <ul className="space-y-1">
                    {current.controlPoints.map((p, i) => (
                      <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Common mistakes */}
                <div className="p-3 bg-surface-800/50 rounded-lg">
                  <h4 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />Lỗi thường gặp
                  </h4>
                  <ul className="space-y-1">
                    {current.commonMistakes.map((e, i) => (
                      <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">⚠</span>{e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Figure placeholder */}
              <FigurePlaceholder id={`Hình 3.${current.step + 2}`} title={current.title} chapter={3} />

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-700/50">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />Bước trước
                </button>
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                      i === step ? 'bg-accent-400' : i < step ? 'bg-emerald-500/50' : 'bg-surface-600'
                    }`} />
                  ))}
                </div>
                <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
                  className="btn-accent flex items-center gap-2 disabled:opacity-30">
                  Bước sau<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ConstructionStepSVG({ step, track }: { step: number; track: 'single' | 'group' }) {
  const isGroup = track === 'group';
  return (
    <div className="bg-surface-900/50 rounded-xl p-4 flex items-center justify-center" style={{ minHeight: 130 }}>
      <svg viewBox="0 0 500 120" className="w-full max-w-lg h-auto">
        {step === 1 && (
          <g>
            {isGroup ? (
              <rect x="50" y="10" width="400" height="100" fill="none" stroke="#475569" strokeWidth="2" rx="3" />
            ) : (
              <>
                <ellipse cx="250" cy="15" rx="90" ry="12" fill="none" stroke="#475569" strokeWidth="2" />
                <line x1="160" y1="15" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                <line x1="340" y1="15" x2="340" y2="100" stroke="#475569" strokeWidth="2" />
                <ellipse cx="250" cy="100" rx="90" ry="12" fill="none" stroke="#475569" strokeWidth="2" />
              </>
            )}
            <text x="250" y="65" textAnchor="middle" className="fill-surface-400" fontSize="11">
              {isGroup ? 'Thùng 1000×500×1000 mm' : 'Trụ tròn Ø380 × H1000 mm'}
            </text>
            <text x="250" y="85" textAnchor="middle" className="fill-accent-400" fontSize="9">PE + mỡ silicon → μ {'<'} 0,1</text>
          </g>
        )}
        {step === 2 && (
          <g>
            {isGroup ? (
              <rect x="100" y="20" width="300" height="80" fill="none" stroke="#475569" strokeWidth="1" rx="2" />
            ) : (
              <>
                <ellipse cx="250" cy="20" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
                <line x1="170" y1="20" x2="170" y2="100" stroke="#475569" strokeWidth="1" />
                <line x1="330" y1="20" x2="330" y2="100" stroke="#475569" strokeWidth="1" />
                <ellipse cx="250" cy="100" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
              </>
            )}
            <rect x={isGroup ? 105 : 175} y="80" width={isGroup ? 290 : 150} height="20" fill="#d97706" fillOpacity="0.3" rx="2" />
            <text x="250" y="93" textAnchor="middle" className="fill-amber-400" fontSize="9">Đệm cát đáy 200 mm</text>
          </g>
        )}
        {step === 3 && (
          <g>
            {isGroup ? (
              <rect x="100" y="15" width="300" height="90" fill="none" stroke="#475569" strokeWidth="1" rx="2" />
            ) : (
              <>
                <ellipse cx="250" cy="15" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
                <line x1="170" y1="15" x2="170" y2="105" stroke="#475569" strokeWidth="1" />
                <line x1="330" y1="15" x2="330" y2="105" stroke="#475569" strokeWidth="1" />
                <ellipse cx="250" cy="105" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
              </>
            )}
            <rect x={isGroup ? 105 : 175} y="85" width={isGroup ? 290 : 150} height="16" fill="#d97706" fillOpacity="0.25" />
            {[0,1,2,3].map(i => <rect key={i} x={isGroup ? 105 : 175} y={25 + i*15} width={isGroup ? 290 : 150} height="13" fill="#78350f" fillOpacity={0.1 + i*0.06} />)}
            <text x="250" y="60" textAnchor="middle" className="fill-surface-400" fontSize="10">Đất yếu 600 mm → Bảo dưỡng 4 ngày</text>
          </g>
        )}
        {step === 4 && (
          <g>
            {isGroup ? (
              <rect x="80" y="15" width="340" height="90" fill="#78350f" fillOpacity="0.15" rx="3" />
            ) : (
              <>
                <ellipse cx="250" cy="15" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
                <rect x="175" y="25" width="150" height="65" fill="#78350f" fillOpacity="0.15" />
                <ellipse cx="250" cy="105" rx="80" ry="10" fill="none" stroke="#475569" strokeWidth="1" />
                <rect x="175" y="90" width="150" height="16" fill="#d97706" fillOpacity="0.2" />
              </>
            )}
            {isGroup
              ? [180, 240, 300, 360].map((x, i) => <rect key={i} x={x-6} y="18" width="12" height="84" fill="#6b7280" fillOpacity="0.6" stroke="#9ca3af" rx="1" />)
              : <rect x="244" y="25" width="12" height="65" fill="#6b7280" fillOpacity="0.6" stroke="#9ca3af" rx="1" />
            }
            <text x="250" y="112" textAnchor="middle" className="fill-accent-400" fontSize="9">
              {isGroup ? 'Nhóm 2×2: s/D = 2,5 / 3,0 / 3,5' : 'D=40mm, L=600mm, ID≥0,95 — chính giữa'}
            </text>
          </g>
        )}
        {step === 5 && (
          <g>
            {isGroup ? (
              <rect x="80" y="40" width="340" height="70" fill="#78350f" fillOpacity="0.15" rx="3" />
            ) : (
              <rect x="175" y="40" width="150" height="55" fill="#78350f" fillOpacity="0.15" />
            )}
            <line x1={isGroup ? 80 : 175} y1="38" x2={isGroup ? 420 : 325} y2="38" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" />
            <text x="250" y="80" textAnchor="middle" className="fill-emerald-400" fontSize="10">
              Lưới ĐKT J = 100 kN/m — trên đỉnh trụ
            </text>
          </g>
        )}
        {step === 6 && (
          <g>
            {isGroup ? (
              <rect x="80" y="40" width="340" height="70" fill="#78350f" fillOpacity="0.15" rx="3" />
            ) : (
              <rect x="175" y="40" width="150" height="55" fill="#78350f" fillOpacity="0.15" />
            )}
            <line x1={isGroup ? 80 : 175} y1="38" x2={isGroup ? 420 : 325} y2="38" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <rect x={isGroup ? 80 : 175} y="18" width={isGroup ? 340 : 150} height="20" fill="#fbbf24" fillOpacity="0.2" rx="2" />
            <text x="250" y="80" textAnchor="middle" className="fill-surface-400" fontSize="10">
              Đệm cát trên lưới ĐKT
            </text>
          </g>
        )}
        {(step === 7 || step === 8) && (
          <g>
            <rect x="80" y="35" width="340" height="70" fill="#78350f" fillOpacity="0.1" rx="3" />
            {step === 8 && <rect x="180" y="8" width="140" height="12" fill="#64748b" rx="2" />}
            {step === 8 && <rect x="245" y="20" width="10" height="18" fill="#64748b" />}
            {step === 7 && <>
              <rect x="160" y="30" width="8" height="20" fill="#3b82f6" rx="1" /><text x="160" y="27" className="fill-blue-400" fontSize="7">LVDT</text>
              <circle cx="300" cy="60" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" /><text x="312" y="63" className="fill-red-400" fontSize="7">LC</text>
            </>}
            <text x="250" y="85" textAnchor="middle" className="fill-surface-400" fontSize="10">
              {step === 7 ? 'LVDT + Strain gauge + Load cell' : 'Khung gia tải + kích thủy lực'}
            </text>
          </g>
        )}
        {step === 9 && (
          <g>
            <rect x="100" y="20" width="300" height="80" fill="#059669" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" strokeDasharray="4" rx="5" />
            <text x="250" y="50" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="600">✓ Kiểm tra chất lượng</text>
            <text x="250" y="70" textAnchor="middle" className="fill-surface-400" fontSize="9">c&#x1D64; • γ • I&#x1D05; trụ • cảm biến • vị trí</text>
            <text x="250" y="85" textAnchor="middle" className="fill-accent-400" fontSize="9">Mô hình sẵn sàng thí nghiệm</text>
          </g>
        )}
      </svg>
    </div>
  );
}
