import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom } from 'lucide-react';

const MECHANISMS = [
  {
    id: 'arching',
    title: 'Hiệu ứng vòm trong nền đắp',
    titleEn: 'Soil arching effect in embankment',
    description: 'Khi khối đắp trên hệ trụ chịu tải trọng, sự chênh lệch độ cứng giữa trụ VLHR và đất yếu xung quanh tạo ra chuyển vị vi sai. Đất nền mềm lún nhiều hơn đầu trụ, gây ra sự phát triển ứng suất cắt trong khối đắp, hình thành các "vòm" ứng suất chuyển một phần tải trọng từ vùng đất yếu lên đầu trụ.',
    keyPoints: [
      'Hệ số hiệu quả vòm E = 0,5–0,85 (Briançon & Simon, 2012)',
      'Chiều cao vòm tới hạn h\u1d04\u1d63 ≈ 1,5(s−a) theo EBGEO',
      'Vòm hoàn chỉnh khi H ≥ 1,4(s−a) theo BS 8006',
      'Trụ VLHR có n = 2–5, thấp hơn cọc cứng (n = 10–20)',
    ],
  },
  {
    id: 'membrane',
    title: 'Hiệu ứng màng của lưới ĐKT',
    titleEn: 'Membrane effect of geosynthetics',
    description: 'Lưới ĐKT (J = 100 kN/m) trải trên đỉnh trụ hoạt động như một lớp truyền tải. Khi đất nền giữa các trụ lún xuống, lưới bị kéo căng và phát sinh lực kéo T. Lực kéo này có thành phần thẳng đứng hướng lên, giúp đỡ bớt tải trọng cho đất nền và chuyển thêm tải lên đầu trụ.',
    keyPoints: [
      'Lực kéo T tăng tuyến tính theo tải: T = 3,01–3,67 kN/m tại p = 120 kPa',
      'Biến dạng lưới ε < 6% (giới hạn thiết kế EBGEO)',
      'Độ cứng tối ưu J ≈ 3000 kN/m cho trụ VLHR (từ phân tích số)',
      'Hiệu quả cải thiện q_ult: 12,6%–24,8% tùy trạng thái I_L',
    ],
  },
  {
    id: 'interaction',
    title: 'Cơ chế tương tác đất – trụ – lưới',
    titleEn: 'Soil-column-geogrid interaction mechanism',
    description: 'Ba thành phần làm việc đồng thời: (1) Hiệu ứng vòm tập trung tải lên đỉnh trụ; (2) Hiệu ứng màng của lưới bổ sung lực truyền; (3) Đất nền cung cấp áp lực bó hông cho trụ. Tỷ lệ đóng góp phụ thuộc vào H, J, s/D và tính chất đất nền.',
    keyPoints: [
      'Giai đoạn thi công: n ≈ 2–3 (Briançon & Simon, 2012)',
      'Giai đoạn cố kết: n tăng lên 4–6 (Ghorbani và nnk, 2021)',
      'Giai đoạn ổn định: n = 4–8 cho trụ VLHR (Jenck và nnk, 2009)',
      'Hiệu quả tăng khi đất yếu hơn (IL cao): ΔE₅₀ = 19–27%',
    ],
  },
  {
    id: 'stress_dist',
    title: 'Phân bố ứng suất giữa trụ và đất nền',
    titleEn: 'Stress distribution between column and soil',
    description: 'Hệ số tập trung ứng suất n = σc/σs phản ánh mức độ chia tải. Trong thí nghiệm MHVL, n dao động 2,00–3,64. n giảm dần theo tải trọng do đất nền dần cố kết và tham gia chịu lực nhiều hơn. Khi s/D tăng, mỗi trụ chịu tải lớn hơn nên n tăng nhẹ.',
    keyPoints: [
      'n = 3,64 (s/D = 2,5, p = 18 kPa) → 2,03 (p = 120 kPa)',
      'n phụ thuộc Ec/Es: n tăng khi Ec/Es tăng',
      'Phạm vi phù hợp: n = 2,5–5 (Barksdale & Bachus, 1983)',
      'Công thức đề xuất n theo Han (2015): n ≈ (Ec/Es)^0.5',
    ],
  },
  {
    id: 'IL_effect',
    title: 'Ảnh hưởng của trạng thái đất nền IL',
    titleEn: 'Effect of soil liquidity index IL',
    description: 'Khi IL tăng (đất yếu hơn), áp lực bó hông giảm → trụ dễ phình nở → qult và E₅₀ giảm mạnh. Cụ thể qult giảm 61% khi IL tăng từ 0,78 lên 1,5. Tuy nhiên, tỷ lệ cải thiện nhờ lưới ĐKT lại tăng (12,6% → 24,8%) vì khi đất yếu, lưới đóng góp tương đối lớn hơn.',
    keyPoints: [
      'q_ult: 378 kPa (I_L = 0,78) → 148 kPa (I_L = 1,5): giảm 61%',
      'E_50: 21 MPa → 4 MPa: giảm 81%',
      'Lưới ĐKT hiệu quả hơn khi đất yếu: Δq_ult = 24,8% tại I_L = 1,5',
      'Mô đun nhạy cảm hơn SCT với trạng thái đất nền',
    ],
  },
  {
    id: 'sD_effect',
    title: 'Ảnh hưởng của tỷ lệ s/D',
    titleEn: 'Effect of spacing ratio s/D',
    description: 'Khi s/D giảm (mật độ trụ cao hơn), tỷ lệ diện tích thay thế as tăng → độ lún giảm đáng kể. Giảm s/D từ 3,5 xuống 2,5: as tăng từ 6,41% lên 12,57%, độ lún giảm 52,6%. Tuy nhiên n lại giảm nhẹ do tương tác nhóm trụ.',
    keyPoints: [
      's/D = 2,5: as = 12,57%, S = 8,21 mm, v = 0,070 mm/kPa',
      's/D = 3,5: as = 6,41%, S = 17,32 mm, v = 0,155 mm/kPa',
      'Giảm s/D từ 3,5 → 2,5: giảm lún 52,6%',
      'Phạm vi khuyến nghị: s/D = 2,5–3,0',
    ],
  },
];

export default function MechanismTab() {
  const [activeId, setActiveId] = useState(MECHANISMS[0].id);
  const active = MECHANISMS.find(m => m.id === activeId)!;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Atom className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">Phân tích cơ chế</h2>
        <span className="label-en">Mechanism Analysis</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Mechanism list */}
        <div className="glass-card p-4 space-y-1">
          {MECHANISMS.map(m => (
            <button key={m.id} onClick={() => setActiveId(m.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all ${activeId === m.id ? 'bg-primary-600/20 text-primary-400 font-medium' : 'text-surface-400 hover:bg-surface-700/30'}`}>
              {m.title}
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-surface-100 mb-1">{active.title}</h3>
                <p className="text-xs text-surface-500 italic">{active.titleEn}</p>
              </div>

              {/* Animated Illustration */}
              <AnimatedMechanismSVG id={active.id} />

              <p className="text-sm text-surface-300 leading-relaxed">{active.description}</p>

              <div className="p-4 bg-surface-800/50 rounded-xl">
                <h4 className="text-xs font-medium text-primary-400 mb-3">📌 Điểm chính</h4>
                <ul className="space-y-2">
                  {active.keyPoints.map((p, i) => (
                    <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                      <span className="text-primary-500 shrink-0 mt-0.5">▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AnimatedMechanismSVG({ id }: { id: string }) {
  return (
    <div className="bg-surface-900/50 rounded-xl p-4 flex items-center justify-center" style={{ minHeight: 220 }}>
      <svg viewBox="0 0 500 220" className="w-full max-w-lg h-auto">
        {id === 'arching' && <ArchingAnimation />}
        {id === 'membrane' && <MembraneAnimation />}
        {id === 'interaction' && <InteractionAnimation />}
        {id === 'stress_dist' && <StressDistAnimation />}
        {id === 'IL_effect' && <ILEffectAnimation />}
        {id === 'sD_effect' && <SDEffectAnimation />}
      </svg>
    </div>
  );
}

function ArchingAnimation() {
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Hiệu ứng vòm — Soil Arching</text>
      {/* Base sand */}
      <rect x="50" y="170" width="400" height="20" fill="#d97706" fillOpacity="0.2" />
      {/* Soft soil */}
      <rect x="50" y="90" width="400" height="80" fill="#78350f" fillOpacity="0.15" stroke="#92400e" strokeWidth="0.5" />
      {/* Columns */}
      {[130, 250, 370].map(x => <rect key={x} x={x - 10} y="90" width="20" height="80" fill="#6b7280" fillOpacity="0.6" stroke="#9ca3af" strokeWidth="1" />)}
      {/* Geogrid on top of columns */}
      <line x1="50" y1="90" x2="450" y2="90" stroke="#10b981" strokeWidth="2.5" />
      {/* Embankment / sand cushion */}
      <rect x="50" y="30" width="400" height="58" fill="#fbbf24" fillOpacity="0.15" stroke="#d97706" strokeWidth="0.5" />
      <text x="250" y="55" textAnchor="middle" className="fill-amber-500" fontSize="9">Đệm cát trên</text>
      {/* Animated arch curves */}
      <motion.path d="M 140 88 Q 190 55 240 88" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M 260 88 Q 310 55 360 88" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      {/* Animated load arrows flowing to column heads */}
      {[190, 310].map((x, i) => (
        <motion.polygon key={x} points={`${x - 5},30 ${x + 5},30 ${x},40`} fill="#ef4444" fillOpacity="0.6"
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      {/* Arrows concentrating on column heads */}
      {[130, 250, 370].map((x, i) => (
        <motion.polygon key={`col-${x}`} points={`${x - 6},40 ${x + 6},40 ${x},52`} fill="#22c55e" fillOpacity="0.7"
          animate={{ y: [0, 35, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
      <text x="250" y="208" textAnchor="middle" className="fill-surface-500" fontSize="8">Vòm truyền tải từ đất nền yếu lên đầu trụ</text>
      {/* Labels */}
      <text x="455" y="98" className="fill-emerald-400" fontSize="7">Lưới ĐKT</text>
      <text x="455" y="135" className="fill-surface-500" fontSize="7">Đất yếu</text>
      <text x="455" y="182" className="fill-amber-500" fontSize="7">Đệm cát đáy</text>
    </g>
  );
}

function MembraneAnimation() {
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Hiệu ứng màng — Membrane Effect</text>
      <defs>
        <marker id="arrowG" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#10b981" /></marker>
        <marker id="arrowB" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto"><polygon points="0 4, 3 0, 6 4" fill="#3b82f6" /></marker>
      </defs>
      {/* Columns */}
      {[130, 370].map(x => <rect key={x} x={x - 12} y="70" width="24" height="110" fill="#6b7280" fillOpacity="0.5" stroke="#9ca3af" />)}
      {/* Soil below geogrid (between columns) */}
      <rect x="142" y="95" width="216" height="85" fill="#78350f" fillOpacity="0.12" />
      {/* Animated geogrid deflection */}
      <motion.path d="M 118 85 L 142 85 Q 250 130 358 85 L 382 85"
        fill="none" stroke="#10b981" strokeWidth="3"
        animate={{ d: ["M 118 85 L 142 85 Q 250 105 358 85 L 382 85", "M 118 85 L 142 85 Q 250 135 358 85 L 382 85", "M 118 85 L 142 85 Q 250 105 358 85 L 382 85"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Animated tension arrows */}
      <motion.line x1="165" y1="90" x2="210" y2="100" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowG)"
        animate={{ x2: [200, 220, 200], y2: [95, 108, 95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line x1="335" y1="90" x2="290" y2="100" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowG)"
        animate={{ x2: [300, 280, 300], y2: [95, 108, 95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="250" y="108" textAnchor="middle" className="fill-emerald-400" fontSize="9" fontWeight="500">T (lực kéo)</text>
      {/* Animated vertical component */}
      <motion.line x1="250" y1="128" x2="250" y2="108" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowB)"
        animate={{ y1: [120, 135, 120], y2: [105, 112, 105] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.text x="265" y="112" className="fill-blue-400" fontSize="8"
        animate={{ y: [108, 118, 108] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >Tv ↑</motion.text>
      {/* Soil settling indicator */}
      <motion.rect x="200" y="95" width="100" height="5" fill="#78350f" fillOpacity="0.3" rx="2"
        animate={{ y: [95, 115, 95], height: [5, 15, 5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="250" y="165" textAnchor="middle" className="fill-surface-500" fontSize="8">Đất yếu giữa các trụ</text>
      <text x="250" y="208" textAnchor="middle" className="fill-surface-500" fontSize="8">Lưới võng → phát sinh lực kéo T → thành phần Tv đỡ đất</text>
    </g>
  );
}

function InteractionAnimation() {
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Cơ chế tương tác đất – trụ – lưới</text>
      {/* Base sand */}
      <rect x="60" y="175" width="380" height="20" fill="#d97706" fillOpacity="0.2" />
      {/* Soil */}
      <rect x="60" y="95" width="380" height="80" fill="#78350f" fillOpacity="0.15" />
      {/* Columns */}
      {[150, 250, 350].map(x => <rect key={x} x={x - 10} y="95" width="20" height="80" fill="#6b7280" fillOpacity="0.5" stroke="#9ca3af" />)}
      {/* Geogrid on top */}
      <line x1="60" y1="93" x2="440" y2="93" stroke="#10b981" strokeWidth="2.5" />
      {/* Sand cushion */}
      <rect x="60" y="35" width="380" height="56" fill="#fbbf24" fillOpacity="0.12" />
      {/* Three mechanisms animated */}
      {/* 1. Arching - pulsing arches */}
      <motion.path d="M 160 91 Q 200 60 240 91" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2"
        animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.path d="M 260 91 Q 300 60 340 91" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2"
        animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} />
      {/* 2. Membrane - tension indicators */}
      <motion.circle cx="200" cy="93" r="3" fill="#10b981" fillOpacity="0.8"
        animate={{ r: [2, 5, 2] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="300" cy="93" r="3" fill="#10b981" fillOpacity="0.8"
        animate={{ r: [2, 5, 2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      {/* 3. Lateral confinement - arrows */}
      {[150, 250, 350].map((x, i) => (
        <g key={x}>
          <motion.line x1={x - 25} y1="130" x2={x - 12} y2="130" stroke="#06b6d4" strokeWidth="1.5"
            animate={{ x1: [x - 30, x - 20, x - 30] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
          <motion.line x1={x + 25} y1="130" x2={x + 12} y2="130" stroke="#06b6d4" strokeWidth="1.5"
            animate={{ x1: [x + 30, x + 20, x + 30] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
        </g>
      ))}
      {/* Labels */}
      <g transform="translate(60, 208)">
        <rect x="0" y="-6" width="10" height="6" fill="#f59e0b" fillOpacity="0.5" rx="1" />
        <text x="14" y="0" className="fill-amber-400" fontSize="7">Vòm</text>
        <rect x="55" y="-6" width="10" height="6" fill="#10b981" fillOpacity="0.5" rx="1" />
        <text x="69" y="0" className="fill-emerald-400" fontSize="7">Màng</text>
        <line x1="115" y1="-3" x2="130" y2="-3" stroke="#06b6d4" strokeWidth="1.5" />
        <text x="134" y="0" className="fill-cyan-400" fontSize="7">Bó hông</text>
        <text x="250" y="0" textAnchor="middle" className="fill-surface-500" fontSize="7">Ba cơ chế làm việc đồng thời</text>
      </g>
    </g>
  );
}

function StressDistAnimation() {
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Phân bố ứng suất — n = σc/σs</text>
      {/* Soil block */}
      <rect x="80" y="70" width="340" height="120" fill="#78350f" fillOpacity="0.12" stroke="#92400e" strokeWidth="0.5" />
      {/* Columns */}
      {[170, 250, 330].map(x => <rect key={x} x={x - 10} y="60" width="20" height="130" fill="#6b7280" fillOpacity="0.5" stroke="#9ca3af" />)}
      {/* Geogrid */}
      <line x1="80" y1="68" x2="420" y2="68" stroke="#10b981" strokeWidth="2" />
      {/* Top sand */}
      <rect x="80" y="30" width="340" height="36" fill="#fbbf24" fillOpacity="0.12" />
      {/* Animated stress arrows on columns (bigger) */}
      {[170, 250, 330].map((x, i) => (
        <motion.g key={`scol-${x}`}>
          <motion.rect x={x - 8} y="32" width="16" height="0" fill="#ef4444" fillOpacity="0.6" rx="1"
            animate={{ height: [5, 28, 5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
          <motion.text x={x} y="26" textAnchor="middle" className="fill-red-400" fontSize="7" fontWeight="bold"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          >σc</motion.text>
        </motion.g>
      ))}
      {/* Animated stress on soil (smaller) */}
      {[210, 290].map((x, i) => (
        <motion.g key={`ssoil-${x}`}>
          <motion.rect x={x - 6} y="32" width="12" height="0" fill="#3b82f6" fillOpacity="0.4" rx="1"
            animate={{ height: [3, 12, 3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          <motion.text x={x} y="26" textAnchor="middle" className="fill-blue-400" fontSize="7"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          >σs</motion.text>
        </motion.g>
      ))}
      {/* n ratio indicator */}
      <g transform="translate(440, 60)">
        <text x="0" y="0" className="fill-surface-300" fontSize="9" fontWeight="600">n = σc/σs</text>
        <motion.text x="0" y="20" className="fill-purple-400" fontSize="14" fontWeight="bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >2,00–3,64</motion.text>
        <text x="0" y="35" className="fill-surface-500" fontSize="7">Phạm vi MHVL</text>
      </g>
      <text x="250" y="208" textAnchor="middle" className="fill-surface-500" fontSize="8">σc ≫ σs → trụ tập trung ứng suất, đất nền được giảm tải</text>
    </g>
  );
}

function ILEffectAnimation() {
  const bars = [
    { label: 'IL = 0,78', qult: 378, color: '#3b82f6' },
    { label: 'IL = 1,0', qult: 187, color: '#f59e0b' },
    { label: 'IL = 1,5', qult: 148, color: '#ef4444' },
  ];
  const maxQ = 430;
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Ảnh hưởng IL — Sức chịu tải giảm khi đất yếu hơn</text>
      {/* Bar chart */}
      {bars.map((b, i) => {
        const x = 100 + i * 120;
        const barH = (b.qult / maxQ) * 140;
        return (
          <g key={i}>
            <motion.rect x={x} y={180 - barH} width="60" height={barH} fill={b.color} fillOpacity="0.6" rx="4"
              initial={{ height: 0, y: 180 }}
              animate={{ height: barH, y: 180 - barH }}
              transition={{ duration: 1, delay: i * 0.3 }}
            />
            <motion.text x={x + 30} y={175 - barH} textAnchor="middle" fontSize="10" fontWeight="bold" fill={b.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.3 + 0.8 }}
            >{b.qult}</motion.text>
            <text x={x + 30} y="195" textAnchor="middle" className="fill-surface-400" fontSize="8">{b.label}</text>
            <text x={x + 30} y="206" textAnchor="middle" className="fill-surface-500" fontSize="7">kPa</text>
          </g>
        );
      })}
      {/* Trend arrow */}
      <motion.line x1="130" y1="40" x2="370" y2="40" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.text x="420" y="43" className="fill-red-400" fontSize="8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >−61%</motion.text>
    </g>
  );
}

function SDEffectAnimation() {
  const bars = [
    { label: 's/D = 2,5', S: 8.21, color: '#3b82f6' },
    { label: 's/D = 3,0', S: 12.56, color: '#f59e0b' },
    { label: 's/D = 3,5', S: 17.32, color: '#ef4444' },
  ];
  const maxS = 20;
  return (
    <g>
      <text x="250" y="16" textAnchor="middle" className="fill-surface-300" fontSize="11" fontWeight="600">Ảnh hưởng s/D — Độ lún tại p = 120 kPa</text>
      {/* Inverted bar chart (settlement goes down) */}
      {bars.map((b, i) => {
        const x = 100 + i * 120;
        const barH = (b.S / maxS) * 130;
        return (
          <g key={i}>
            <text x={x + 30} y="42" textAnchor="middle" className="fill-surface-400" fontSize="8">{b.label}</text>
            <motion.rect x={x} y={55} width="60" height={barH} fill={b.color} fillOpacity="0.5" rx="4"
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ duration: 1, delay: i * 0.3 }}
            />
            <motion.text x={x + 30} y={58 + barH + 13} textAnchor="middle" fontSize="10" fontWeight="bold" fill={b.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.3 + 0.8 }}
            >{b.S} mm</motion.text>
          </g>
        );
      })}
      {/* Improvement annotation */}
      <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <line x1="130" y1="200" x2="370" y2="200" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="250" y="215" textAnchor="middle" className="fill-emerald-400" fontSize="9" fontWeight="600">Giảm 52,6% khi s/D: 3,5 → 2,5</text>
      </motion.g>
    </g>
  );
}
