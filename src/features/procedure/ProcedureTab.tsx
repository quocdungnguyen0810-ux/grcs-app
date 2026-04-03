import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROCEDURE_STEPS } from '../../lib/data';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ProcedureTab() {
  const [activeStep, setActiveStep] = useState(0);
  const step = PROCEDURE_STEPS[activeStep];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="section-title !mb-0">Quy trình thí nghiệm</h2>
        <span className="label-en">Experimental Procedure</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Timeline sidebar */}
        <div className="glass-card p-4 space-y-1 max-h-[70vh] overflow-y-auto">
          {PROCEDURE_STEPS.map((s, i) => (
            <button key={i} onClick={() => setActiveStep(i)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left text-xs transition-all ${i === activeStep ? 'bg-primary-600/20 text-primary-400' : i < activeStep ? 'text-emerald-400/70' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/30'}`}>
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${i === activeStep ? 'border-primary-400 bg-primary-600/20 text-primary-400' : i < activeStep ? 'border-emerald-500/50 bg-emerald-600/10 text-emerald-400' : 'border-surface-600 text-surface-500'}`}>
                {i < activeStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span className="leading-tight">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="glass-card p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center text-xl font-bold text-primary-400">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-100">{step.title}</h3>
                  <span className="text-sm text-surface-500">Bước {step.step} / {PROCEDURE_STEPS.length}</span>
                </div>
              </div>

              {/* Minh họa SVG cho bước */}
              <StepIllustration step={step.step} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-surface-300 mb-2">📋 Mô tả thao tác</h4>
                  <p className="text-sm text-surface-400 leading-relaxed">{step.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-300 mb-2">🎯 Mục đích</h4>
                  <p className="text-sm text-surface-400 leading-relaxed">{step.purpose}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-surface-800/50 rounded-lg">
                  <h4 className="text-xs font-medium text-emerald-400 mb-2">✅ Đại lượng kiểm soát</h4>
                  <ul className="space-y-1">
                    {step.controlledParams.map((p, i) => (
                      <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-surface-800/50 rounded-lg">
                  <h4 className="text-xs font-medium text-amber-400 mb-2">⚠️ Lỗi có thể gặp</h4>
                  <ul className="space-y-1">
                    {step.possibleErrors.map((e, i) => (
                      <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>{e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-700/50">
                <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />Bước trước
                </button>
                <div className="flex gap-1">
                  {PROCEDURE_STEPS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === activeStep ? 'bg-primary-400' : i < activeStep ? 'bg-emerald-500/50' : 'bg-surface-600'}`} />
                  ))}
                </div>
                <button onClick={() => setActiveStep(Math.min(PROCEDURE_STEPS.length - 1, activeStep + 1))} disabled={activeStep === PROCEDURE_STEPS.length - 1}
                  className="btn-primary flex items-center gap-2 disabled:opacity-30">
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

function StepIllustration({ step }: { step: number }) {
  const h = 120;
  return (
    <div className="bg-surface-900/50 rounded-xl p-4 flex items-center justify-center" style={{ minHeight: h }}>
      <svg viewBox="0 0 400 100" className="w-full max-w-md h-auto">
        {step === 1 && (
          <g>
            <rect x="50" y="10" width="300" height="80" fill="#78350f" fillOpacity="0.3" stroke="#92400e" strokeWidth="1" rx="3" />
            <text x="200" y="55" textAnchor="middle" className="fill-surface-400" fontSize="11">Chuẩn bị vật liệu → Kiểm tra thông số</text>
          </g>
        )}
        {step === 2 && (
          <g>
            <rect x="50" y="10" width="300" height="80" fill="none" stroke="#475569" strokeWidth="1" rx="3" />
            <rect x="55" y="60" width="290" height="25" fill="#d97706" fillOpacity="0.3" rx="2" />
            <text x="200" y="45" textAnchor="middle" className="fill-surface-400" fontSize="11">Thi công đệm cát đáy 200 mm</text>
            <text x="200" y="76" textAnchor="middle" className="fill-amber-400" fontSize="9">Đầm chặt → Thoát nước</text>
          </g>
        )}
        {step === 3 && (
          <g>
            <rect x="50" y="10" width="300" height="80" fill="none" stroke="#475569" strokeWidth="1" rx="3" />
            <rect x="55" y="65" width="290" height="20" fill="#d97706" fillOpacity="0.2" />
            {[0,1,2].map(i => <rect key={i} x="55" y={15 + i*17} width="290" height="15" fill="#78350f" fillOpacity={0.12 + i*0.06} />)}
            <text x="200" y="55" textAnchor="middle" className="fill-surface-400" fontSize="10">Đất yếu 600 mm → Bảo dưỡng 4 ngày</text>
          </g>
        )}
        {(step === 4 || step === 5) && (
          <g>
            <rect x="50" y="10" width="300" height="80" fill="#78350f" fillOpacity="0.2" rx="3" />
            {[150, 200, 250, 300].slice(0, step === 4 ? 1 : 4).map((x, i) => (
              <rect key={i} x={x - 5} y="15" width="10" height="70" fill="#6b7280" fillOpacity="0.6" stroke="#9ca3af" rx="1" />
            ))}
            <text x="200" y="98" textAnchor="middle" className="fill-surface-500" fontSize="10">
              {step === 4 ? 'Tạo trụ: đóng ống → lấy đất → đổ VLHR → rút ống' : 'Bố trí nhóm trụ 2×2'}
            </text>
          </g>
        )}
        {step === 6 && (
          <g>
            <rect x="50" y="30" width="300" height="60" fill="#78350f" fillOpacity="0.2" rx="3" />
            <line x1="50" y1="28" x2="350" y2="28" stroke="#10b981" strokeWidth="3" strokeDasharray="8 4" />
            <text x="200" y="70" textAnchor="middle" className="fill-emerald-400" fontSize="10">Trải lưới ĐKT J = 100 kN/m trên đỉnh trụ</text>
          </g>
        )}
        {step === 7 && (
          <g>
            <rect x="50" y="30" width="300" height="60" fill="#78350f" fillOpacity="0.2" rx="3" />
            <line x1="50" y1="28" x2="350" y2="28" stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" />
            <rect x="50" y="10" width="300" height="18" fill="#fbbf24" fillOpacity="0.2" rx="2" />
            <text x="200" y="70" textAnchor="middle" className="fill-amber-400" fontSize="10">Đệm cát trên lưới ĐKT</text>
          </g>
        )}
        {(step >= 8 && step <= 9) && (
          <g>
            <rect x="50" y="30" width="300" height="60" fill="#78350f" fillOpacity="0.15" rx="3" />
            <rect x="150" y="5" width="100" height="10" fill="#64748b" />
            <rect x="195" y="15" width="10" height="18" fill="#64748b" />
            <text x="200" y="65" textAnchor="middle" className="fill-surface-500" fontSize="10">
              {step === 8 ? 'Lắp LVDT, Strain gauge, Load cell' : 'Lắp khung gia tải + kích thủy lực'}
            </text>
          </g>
        )}
        {(step >= 10 && step <= 11) && (
          <g>
            <rect x="50" y="35" width="300" height="55" fill="#78350f" fillOpacity="0.15" rx="3" />
            <polygon points="175,10 225,10 215,30 185,30" fill="#ef4444" fillOpacity="0.3" />
            <text x="200" y="25" textAnchor="middle" className="fill-red-400" fontSize="10">↓ Gia tải CRP</text>
            <text x="200" y="70" textAnchor="middle" className="fill-surface-500" fontSize="10">
              {step === 10 ? '18 → 36 → 54 → 72 → 90 → 108 → 120 kPa' : 'Data Logger ghi nhận tự động'}
            </text>
          </g>
        )}
        {step >= 12 && (
          <g>
            <rect x="50" y="35" width="300" height="55" fill="#78350f" fillOpacity="0.15" rx="3" />
            <text x="200" y="60" textAnchor="middle" className="fill-surface-400" fontSize="10">
              {step === 12 ? 'Kết thúc → Quan sát phá hoại phình nở tại 2,5D–4D' : 'Xử lý dữ liệu → Vẽ đồ thị → Phân tích'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

