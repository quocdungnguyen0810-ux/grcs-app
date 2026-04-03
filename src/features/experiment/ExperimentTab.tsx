import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EXPERIMENT_SCENARIOS, SINGLE_COLUMN_RESULTS, GROUP_COLUMN_RESULTS, PRESSURE_LEVELS, SOIL_STATES } from '../../lib/data';
import { Play, Pause, RotateCcw, Beaker, Maximize2, Minimize2 } from 'lucide-react';

export default function ExperimentTab() {
  const [selectedScenario, setSelectedScenario] = useState(EXPERIMENT_SCENARIOS[0].id);
  const [currentStep, setCurrentStep] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showAnimation, setShowAnimation] = useState(true);

  const scenario = EXPERIMENT_SCENARIOS.find(s => s.id === selectedScenario)!;
  const isSingle = scenario.type === 'single';

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= 6) { setIsPlaying(false); return; }
    const timer = setTimeout(() => setCurrentStep(s => s + 1), 1200 / speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  const reset = useCallback(() => { setCurrentStep(0); setIsPlaying(false); }, []);

  const singleData = isSingle
    ? SINGLE_COLUMN_RESULTS.filter(r => r.IL === scenario.IL && r.geogrid === scenario.geogrid)
    : [];

  const groupData = !isSingle
    ? GROUP_COLUMN_RESULTS.find(r => r.sD === scenario.sD)
    : undefined;

  const singleChartData = isSingle
    ? singleData[0]?.stressStrainCurve.map(pt => ({ epsilon: pt.epsilon, sigma: pt.sigma })) || []
    : [];

  const groupChartData = !isSingle && groupData
    ? PRESSURE_LEVELS.slice(0, currentStep + 1).map((p, i) => ({
        pressure: p,
        settlement: groupData.settlement[i],
        columnStress: groupData.columnStress[i],
        soilPressure: groupData.soilPressure[i],
        n: groupData.stressConcentration[i],
      }))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Beaker className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">Mô phỏng thí nghiệm và kết quả</h2>
        <span className="label-en">Experiment Simulation &amp; Results</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Scenario selector */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-surface-300">Chọn kịch bản</h3>
          <div className="space-y-1">
            <div className="text-xs text-surface-500 uppercase tracking-wide mb-1">Nhóm 1: Trụ đơn</div>
            {EXPERIMENT_SCENARIOS.filter(s => s.type === 'single').map(s => (
              <button key={s.id} onClick={() => { setSelectedScenario(s.id); reset(); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedScenario === s.id ? 'bg-primary-600/20 text-primary-400 font-medium' : 'text-surface-400 hover:bg-surface-700/30'}`}>
                {s.name}
              </button>
            ))}
            <div className="text-xs text-surface-500 uppercase tracking-wide mb-1 mt-3">Nhóm 2: Nhóm trụ + lưới ĐKT</div>
            {EXPERIMENT_SCENARIOS.filter(s => s.type === 'group').map(s => (
              <button key={s.id} onClick={() => { setSelectedScenario(s.id); reset(); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedScenario === s.id ? 'bg-primary-600/20 text-primary-400 font-medium' : 'text-surface-400 hover:bg-surface-700/30'}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main experiment view */}
        <div className="lg:col-span-3 space-y-4">
          {/* Scenario info */}
          <div className="glass-card p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-surface-100 text-sm">{scenario.name}</h3>
              <p className="text-xs text-surface-400 mt-1">{scenario.description}</p>
            </div>
            {isSingle && scenario.IL && (
              <div className="flex gap-2">
                <span className="badge badge-blue"><span className="sym">c<sub>u</sub></span> = {SOIL_STATES[scenario.IL].cu} kPa</span>
                <span className="badge badge-amber">{SOIL_STATES[scenario.IL].state}</span>
              </div>
            )}
          </div>

          {/* Animation panel (group only) */}
          {!isSingle && showAnimation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Mô phỏng gia tải</h4>
                <span className="text-[10px] text-accent-500 italic">Minh họa khái niệm</span>
              </div>
              <ExperimentAnimationSVG
                settlement={groupData?.settlement[currentStep] || 0}
                maxSettlement={groupData?.settlement[6] || 20}
                columnStress={groupData?.columnStress[currentStep] || 0}
                maxColumnStress={groupData?.columnStress[6] || 100}
                n={groupData?.stressConcentration[currentStep] || 1}
                pressure={PRESSURE_LEVELS[currentStep]}
              />
            </motion.div>
          )}

          {/* Playback controls */}
          {!isSingle && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setIsPlaying(!isPlaying)} className="btn-primary flex items-center gap-2">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Tạm dừng' : 'Phát lại'}
                </button>
                <button onClick={reset} className="btn-secondary flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />Đặt lại
                </button>
                <div className="flex items-center gap-1 bg-surface-800/50 rounded-lg p-0.5">
                  {[0.5, 1, 2].map(s => (
                    <button key={s} onClick={() => setSpeed(s)}
                      className={`px-2 py-1 rounded text-xs transition-all ${speed === s ? 'bg-primary-700 text-primary-300' : 'text-surface-500 hover:text-surface-300'}`}>
                      {s}×
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAnimation(!showAnimation)}
                  className="btn-outline text-xs flex items-center gap-1 ml-auto">
                  {showAnimation ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  {showAnimation ? 'Ẩn mô phỏng' : 'Hiện mô phỏng'}
                </button>
                <div className="flex-1 min-w-[120px]">
                  <input type="range" min={0} max={6} value={currentStep} onChange={e => setCurrentStep(Number(e.target.value))}
                    className="w-full accent-primary-500" />
                </div>
                <span className="text-sm font-mono text-primary-400 min-w-[80px]">
                  p = {PRESSURE_LEVELS[currentStep]} kPa
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {PRESSURE_LEVELS.map((p, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-primary-500' : 'bg-surface-700'}`} />
                    <span className={`text-[9px] ${i === currentStep ? 'text-primary-400 font-semibold' : 'text-surface-600'}`}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isSingle ? (
              <div className="md:col-span-2 chart-container">
                <h4 className="text-sm font-semibold text-surface-200 mb-1">Quan hệ ứng suất – biến dạng trụ đơn VLHR</h4>
                <p className="text-xs text-surface-500 mb-4 italic">Stress-strain relationship of single GRSC</p>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={singleChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epsilon" label={{ value: 'Biến dạng ε (%)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 }}} stroke="#64748b" tickFormatter={v => v.toFixed(1)} />
                    <YAxis label={{ value: 'Ứng suất σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 }}} stroke="#64748b" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelFormatter={v => `ε = ${v}%`} />
                    <Line type="monotone" dataKey="sigma" stroke={scenario.IL ? SOIL_STATES[scenario.IL].color : '#3b82f6'} strokeWidth={2.5} dot={{ r: 4 }} name="σ (kPa)" />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-surface-600 mt-2 italic">Dữ liệu thực nghiệm từ luận án – Bảng 3.12</p>
              </div>
            ) : (
              <>
                <motion.div className="chart-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h4 className="text-sm font-semibold text-surface-200 mb-1">Quan hệ tải trọng – độ lún</h4>
                  <p className="text-xs text-surface-500 mb-3 italic">Load-settlement relationship</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={groupChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 }}} />
                      <YAxis reversed stroke="#64748b" label={{ value: 'Độ lún S (mm)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 }}} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="settlement" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Độ lún (mm)" animationDuration={600} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div className="chart-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h4 className="text-sm font-semibold text-surface-200 mb-1">Phân bố ứng suất</h4>
                  <p className="text-xs text-surface-500 mb-3 italic">Stress distribution</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={groupChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 }}} />
                      <YAxis stroke="#64748b" label={{ value: 'σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 }}} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="columnStress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="σc – Đỉnh trụ" animationDuration={600} />
                      <Line type="monotone" dataKey="soilPressure" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="σs – Đất nền" animationDuration={600} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </>
            )}
          </div>

          {/* Stats cards */}
          {!isSingle && groupData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatedStatCard label="Độ lún hiện tại" value={groupData.settlement[currentStep].toFixed(2)} unit="mm" color="text-blue-400" />
              <AnimatedStatCard label="Ứng suất đỉnh trụ" value={groupData.columnStress[currentStep].toFixed(1)} unit="kPa" color="text-amber-400" />
              <AnimatedStatCard label="Áp lực đất nền" value={groupData.soilPressure[currentStep].toFixed(1)} unit="kPa" color="text-emerald-400" />
              <AnimatedStatCard label={<>Hệ số TTƯS <span className="sym">n</span></>} value={groupData.stressConcentration[currentStep].toFixed(2)} unit="" color="text-purple-400" />
            </div>
          )}

          {isSingle && singleData[0] && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatedStatCard label={<><span className="sym">σ</span><sub>max</sub></>} value={singleData[0].sigmaMax.toFixed(1)} unit="kPa" color="text-blue-400" />
              <AnimatedStatCard label={<><span className="sym">q</span><sub>ult</sub></>} value={singleData[0].qult.toString()} unit="kPa" color="text-amber-400" />
              <AnimatedStatCard label={<><span className="sym">E</span><sub>50</sub></>} value={(singleData[0].E50 / 1000).toFixed(1)} unit="MPa" color="text-emerald-400" />
              <AnimatedStatCard label={<><span className="sym">E</span><sub>i</sub></>} value={(singleData[0].Ei / 1000).toFixed(1)} unit="MPa" color="text-purple-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatedStatCard({ label, value, unit, color }: { label: React.ReactNode; value: string; unit: string; color: string }) {
  return (
    <motion.div className="stat-card" key={value} initial={{ scale: 0.95, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
      <span className="text-xs text-surface-500">{label}</span>
      <span className={`text-xl font-bold ${color}`}>{value} <span className="text-sm font-normal">{unit}</span></span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIMENT ANIMATION SVG
// Mô phỏng thùng thí nghiệm nhóm trụ — ĐÚNG VẬT LÝ:
//
//  [  Tấm gia tải (p kPa)  ]
//  ┌─────────────────────────────────────┐
//  │░░░░░░ Đệm cát trên 100mm ░░░░░░░░░│  ← topSand
//  │--- lưới ĐKT (J=100 kN/m) ------│  ← geogrid  (= soilTop)
//  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
//  │▓▓▓▓ [col] ▓▓ [col] ▓▓ [col] ▓▓│  ← 600mm Sét pha yếu
//  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     trụ nằm TRONG đất yếu
//  │/////// Cát đầm chặt 200mm //////│  ← baseSand (bottom)
//  └─────────────────────────────────────┘
//
// Thứ tự vẽ: baseSand → soil → columns (solid, opaque) → geogrid → topSand → outline
// ─────────────────────────────────────────────────────────────────────────────
function ExperimentAnimationSVG({ settlement, maxSettlement, columnStress, maxColumnStress, n, pressure }: {
  settlement: number; maxSettlement: number;
  columnStress: number; maxColumnStress: number; n: number; pressure: number;
}) {
  const settlementScale = maxSettlement > 0 ? settlement / maxSettlement : 0;
  const stressScale = maxColumnStress > 0 ? columnStress / maxColumnStress : 0;
  const stressColor = stressScale > 0.7 ? '#ef4444' : stressScale > 0.4 ? '#f59e0b' : '#10b981';

  // SVG canvas
  const W = 720, canvasH = 235;

  // Tank boundaries
  const tankL = 85, tankR = 625;
  const tankTop = 25, tankBot = 210;
  const tankH = tankBot - tankTop;   // 185px total height
  const tankW = tankR - tankL;       // 540px width

  // Physical layers: 200mm baseSand + 600mm soil + 100mm topSand = 900mm total
  // Proportional to pixel height
  const baseSandH = tankH * (200 / 900);  // ~41px
  const soilH     = tankH * (600 / 900);  // ~123px  ← trụ nằm trong này
  const topSandH  = tankH * (100 / 900);  // ~21px

  // Y positions — SVG Y increases DOWNWARD from top
  const baseSandTop = tankBot - baseSandH;          // top of base-sand = bottom of soil
  const soilTop     = baseSandTop - soilH;           // top of soil = bottom of top-sand
  const geogridY    = soilTop;                       // geogrid AT top of soil / TOP of columns
  const topSandTop  = geogridY - topSandH;           // top of top-sand cushion (= tankTop approx)

  // Columns: embedded FULLY inside soft soil
  //   top of col  = soilTop  (= geogridY)     → touches bottom of geogrid
  //   bottom of col = baseSandTop              → rests on compacted sand
  const colTop = soilTop;        // col top at geogrid level
  const colBot = baseSandTop;    // col bottom at top of base sand
  const colH   = colBot - colTop; // = soilH = full 600mm depth
  const colXs  = [205, 305, 405, 505]; // 4 columns, evenly spaced inside tank
  const colW   = 22;

  // Settlement animation (max 12px visual)
  const dy = settlementScale * 12;

  return (
    <svg viewBox={`0 0 ${W} ${canvasH}`} className="w-full h-auto" style={{ maxHeight: 250 }}>
      <defs>
        {/* Soil — medium-dark brown, opaque enough to see but let columns stand out */}
        <linearGradient id="gr_soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6b2500" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#3d1500" stopOpacity="0.85" />
        </linearGradient>
        {/* Top sand — warm amber */}
        <linearGradient id="gr_tsand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.40" />
        </linearGradient>
        {/* Column — bright slate/gray, horizontal gradient to look 3D */}
        <linearGradient id="gr_col" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#64748b" stopOpacity="1.0" />
          <stop offset="35%"  stopColor="#f1f5f9" stopOpacity="1.0" />
          <stop offset="65%"  stopColor="#cbd5e1" stopOpacity="1.0" />
          <stop offset="100%" stopColor="#475569" stopOpacity="1.0" />
        </linearGradient>
        {/* Stress zone at column top */}
        <linearGradient id="gr_stress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={stressColor} stopOpacity="1.0" />
          <stop offset="100%" stopColor={stressColor} stopOpacity="0.20" />
        </linearGradient>
        {/* Base sand — warm orange-brown with hatching */}
        <pattern id="pt_hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#92400e" strokeWidth="1.2" strokeOpacity="0.45" />
        </pattern>
        {/* Clip path for tank interior */}
        <clipPath id="cp_tank">
          <rect x={tankL + 1} y={tankTop + 1} width={tankW - 2} height={tankH - 2} />
        </clipPath>
      </defs>

      {/* ═══════════════════════════════════════════════════
          LAYER 1: BASE SAND (compacted) — at BOTTOM
          Hatched orange-brown pattern
          ═══════════════════════════════════════════════════ */}
      <rect x={tankL + 1} y={baseSandTop} width={tankW - 2} height={baseSandH}
        fill="#b45309" fillOpacity="0.40" />
      <rect x={tankL + 1} y={baseSandTop} width={tankW - 2} height={baseSandH}
        fill="url(#pt_hatch)" />
      {/* Label right */}
      <text x={tankR + 9} y={baseSandTop + baseSandH * 0.38} fill="#d97706" fontSize="8" fontWeight="700">200 mm</text>
      <text x={tankR + 9} y={baseSandTop + baseSandH * 0.70} fill="#b45309" fontSize="6.5">Cát đầm chặt</text>

      {/* ═══════════════════════════════════════════════════
          LAYER 2: SOFT SOIL — middle 600mm
          Semi-opaque so column colors are visible through
          ═══════════════════════════════════════════════════ */}
      <rect x={tankL + 1} y={soilTop} width={tankW - 2} height={soilH}
        fill="url(#gr_soil)" clipPath="url(#cp_tank)" />
      {/* Label right */}
      <text x={tankR + 9} y={soilTop + soilH * 0.32} fill="#94a3b8" fontSize="8" fontWeight="700">600 mm</text>
      <text x={tankR + 9} y={soilTop + soilH * 0.50} fill="#64748b" fontSize="6.5">Sét pha yếu</text>

      {/* ═══════════════════════════════════════════════════
          COLUMNS — drawn AFTER soil so they appear ON TOP
          - Top of column: soilTop (= geogridY)
          - Bottom of column: baseSandTop (rests on compacted sand)
          - Full height = soilH = 600mm equivalent
          ═══════════════════════════════════════════════════ */}
      {colXs.map((cx, i) => (
        <motion.g key={i}
          animate={{ y: dy * 0.45 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}>

          {/* ── Main column body — bright, fully opaque ── */}
          <rect
            x={cx - colW / 2}
            y={colTop}
            width={colW}
            height={colH}
            fill="url(#gr_col)"
            stroke="#94a3b8"
            strokeWidth="1.5"
            rx="2"
          />

          {/* ── Stress indicator at top of column ── */}
          <rect
            x={cx - colW / 2 + 2}
            y={colTop + 2}
            width={colW - 4}
            height={Math.max(5, colH * 0.18 * stressScale + 5)}
            fill="url(#gr_stress)"
            rx="1.5"
          />

          {/* ── Column foot plate resting ON base sand ── */}
          <rect
            x={cx - colW / 2 - 4}
            y={colBot - 4}
            width={colW + 8}
            height={5}
            fill="#94a3b8"
            fillOpacity="0.7"
            rx="1.5"
          />

          {/* ── Column cap at geogrid level ── */}
          <rect
            x={cx - colW / 2 - 3}
            y={geogridY - 2.5}
            width={colW + 6}
            height={5}
            fill="#e2e8f0"
            fillOpacity="0.85"
            rx="1.5"
          />
        </motion.g>
      ))}

      {/* ═══════════════════════════════════════════════════
          GEOGRID — horizontal line at TOP of columns
          Sags downward between columns under load
          ═══════════════════════════════════════════════════ */}
      <motion.path
        d={`M ${tankL + 5},${geogridY} L ${colXs[0] - colW/2},${geogridY} Q ${(colXs[0]+colXs[1])/2},${geogridY + dy*0.6} ${colXs[1] - colW/2},${geogridY} L ${colXs[1]+colW/2},${geogridY} Q ${(colXs[1]+colXs[2])/2},${geogridY + dy*0.6} ${colXs[2] - colW/2},${geogridY} L ${colXs[2]+colW/2},${geogridY} Q ${(colXs[2]+colXs[3])/2},${geogridY + dy*0.6} ${colXs[3] - colW/2},${geogridY} L ${colXs[3]+colW/2},${geogridY} L ${tankR - 5},${geogridY}`}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray="8 3.5"
        animate={{
          d: `M ${tankL + 5},${geogridY + dy*0.18} L ${colXs[0] - colW/2},${geogridY + dy*0.18} Q ${(colXs[0]+colXs[1])/2},${geogridY + dy*0.85} ${colXs[1] - colW/2},${geogridY + dy*0.18} L ${colXs[1]+colW/2},${geogridY + dy*0.18} Q ${(colXs[1]+colXs[2])/2},${geogridY + dy*0.85} ${colXs[2] - colW/2},${geogridY + dy*0.18} L ${colXs[2]+colW/2},${geogridY + dy*0.18} Q ${(colXs[2]+colXs[3])/2},${geogridY + dy*0.85} ${colXs[3] - colW/2},${geogridY + dy*0.18} L ${colXs[3]+colW/2},${geogridY + dy*0.18} L ${tankR - 5},${geogridY + dy*0.18}`
        }}
        transition={{ duration: 0.65 }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 3: TOP SAND CUSHION — above geogrid
          ═══════════════════════════════════════════════════ */}
      <motion.rect
        x={tankL + 1} y={topSandTop}
        width={tankW - 2} height={topSandH}
        fill="url(#gr_tsand)"
        animate={{ y: topSandTop + dy * 0.12 }}
        transition={{ duration: 0.65 }}
      />
      {/* Label inside top sand */}
      <text
        x={tankL + tankW / 2}
        y={topSandTop + topSandH * 0.6}
        textAnchor="middle"
        fill="#d97706"
        fontSize="7"
        fontWeight="600"
      >Đệm cát 100mm</text>

      {/* ═══════════════════════════════════════════════════
          TANK OUTLINE — drawn last, crisp border
          ═══════════════════════════════════════════════════ */}
      <rect x={tankL} y={tankTop} width={tankW} height={tankH}
        fill="none" stroke="#64748b" strokeWidth="2.5" rx="4" />

      {/* ═══════════════════════════════════════════════════
          LOAD PLATE — floating above, pulsing animation
          ═══════════════════════════════════════════════════ */}
      <motion.g
        animate={{ y: [0, 2.5, 0] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x={(tankL + tankR) / 2 - 65} y="3" width="130" height="18"
          fill="#4e7ab9" fillOpacity="0.92" rx="4" />
        <polygon
          points={`${(tankL + tankR) / 2 - 9},21 ${(tankL + tankR) / 2 + 9},21 ${(tankL + tankR) / 2},28`}
          fill="#6b7b8d"
        />
        <text x={(tankL + tankR) / 2} y="15.5"
          textAnchor="middle" fill="white" fontSize="8.5" fontWeight="bold" letterSpacing="0.5">
          p = {pressure} kPa
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          SETTLEMENT MARKER (left side)
          ═══════════════════════════════════════════════════ */}
      <line x1={tankL - 24} y1={tankTop} x2={tankL - 24} y2={tankBot}
        stroke="#4e7ab9" strokeWidth="0.7" strokeDasharray="3 2.5" />
      <motion.g animate={{ y: dy }} transition={{ duration: 0.65 }}>
        <line x1={tankL - 28} y1={tankTop} x2={tankL - 20} y2={tankTop}
          stroke="#4e7ab9" strokeWidth="2" />
        <text x={tankL - 30} y={tankTop - 3}
          textAnchor="end" fill="#93c5fd" fontSize="8.5" fontWeight="700">
          S={settlement.toFixed(1)}mm
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          N-RATIO BAR (right side panel)
          ═══════════════════════════════════════════════════ */}
      <g transform="translate(674,55)">
        <text x="0" y="-13" textAnchor="middle" fill="#94a3b8" fontSize="7">
          n = σ<tspan fontSize="5.5" dy="2">c</tspan><tspan dy="-2">/σ</tspan><tspan fontSize="5.5" dy="2">s</tspan>
        </text>
        <rect x="-19" y="0" width="38" height="64"
          fill="#0f172a" fillOpacity="0.65" stroke="#475569" strokeWidth="1" rx="4" />
        <motion.rect
          x="-16"
          y={64 - Math.max(5, (n / 4) * 58)}
          width="32"
          height={Math.max(5, (n / 4) * 58)}
          fill="#8b5cf6" fillOpacity="0.65" rx="3"
          animate={{ height: Math.max(5, (n / 4) * 58), y: 64 - Math.max(5, (n / 4) * 58) }}
          transition={{ duration: 0.65 }}
        />
        <text x="0" y="80" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">
          {n.toFixed(2)}
        </text>
        {/* Soil label under bar */}
        <text x="0" y="92" textAnchor="middle" fill="#64748b" fontSize="6">600mm</text>
        <text x="0" y="101" textAnchor="middle" fill="#64748b" fontSize="6">Sét pha yếu</text>
      </g>

      {/* ═══════════════════════════════════════════════════
          LEGEND
          ═══════════════════════════════════════════════════ */}
      <g transform={`translate(90, ${canvasH - 12})`}>
        {/* Base sand */}
        <rect x="0" y="-9" width="12" height="9" fill="#b45309" fillOpacity="0.40" />
        <rect x="0" y="-9" width="12" height="9" fill="url(#pt_hatch)" />
        <text x="16" y="0" fill="#94a3b8" fontSize="7">Cát đầm chặt</text>
        {/* Soft soil */}
        <rect x="96" y="-9" width="12" height="9" fill="#6b2500" fillOpacity="0.70" />
        <text x="112" y="0" fill="#94a3b8" fontSize="7">Đất yếu</text>
        {/* Column */}
        <rect x="162" y="-9" width="12" height="9" fill="url(#gr_col)" stroke="#94a3b8" strokeWidth="0.7" />
        <text x="178" y="0" fill="#94a3b8" fontSize="7">Trụ VLHR</text>
        {/* Geogrid */}
        <line x1="236" y1="-4" x2="256" y2="-4" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 2.5" />
        <text x="260" y="0" fill="#94a3b8" fontSize="7">Lưới ĐKT (J=100 kN/m)</text>
        {/* Top sand */}
        <rect x="382" y="-9" width="12" height="9" fill="#fde68a" fillOpacity="0.55" />
        <text x="398" y="0" fill="#94a3b8" fontSize="7">Đệm cát trên</text>
      </g>
    </svg>
  );
}
