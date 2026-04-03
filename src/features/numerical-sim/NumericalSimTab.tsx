import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Monitor, Cpu, Settings2, BarChart3, CheckCircle2, GitCompare, Layers, BookOpen } from 'lucide-react';
import {
  NUMERICAL_N_BY_EC, NUMERICAL_N_BY_ES, NUMERICAL_N_BY_J, NUMERICAL_N_BY_SD,
  PRESSURE_LEVELS, GROUP_COLUMN_RESULTS
} from '../../lib/data';
import { CHAPTER4 } from '../../lib/thesis/chapter4';

/* ============================================================
   THÔNG SỐ MÔ HÌNH PLAXIS 3D — TỪ LUẬN ÁN (Bảng 4.3, 4.4)
   ============================================================ */
const PLAXIS_GENERAL = [
  { param: 'Phần mềm', value: 'Plaxis 3D Foundation' },
  { param: 'Kiểu bài toán', value: '3D — Nền cọc đá dăm đối xứng' },
  { param: 'Mô hình đất nền', value: 'Mohr-Coulomb (Drained)' },
  { param: 'Mô hình trụ VLHR', value: 'Mohr-Coulomb (Drained)' },
  { param: 'Phần tử', value: '10-nút tứ diện (10-node tetrahedral)' },
  { param: 'Loại phân tích', value: 'Staged construction' },
  { param: 'Tham chiếu bảng', value: 'Bảng 4.3, 4.4 — Chương 4' },
];

const PLAXIS_SOIL_PARAMS = [
  { param: 'γ (kN/m³)', value: '16,6', note: 'Bảng 3.5' },
  { param: 'c\' (kPa)', value: '5 – 20 (tùy I_L)', note: 'c_u thay đổi theo I_L' },
  { param: 'φ\' (°)', value: '15 – 22', note: 'Tùy trạng thái đất' },
  { param: 'E_s (MPa)', value: '0,85 – 1,45', note: 'Bảng 4.6: E_s = 1–5 MPa' },
  { param: 'ν', value: '0,35', note: 'Hệ số Poisson' },
  { param: 'Kiểu thoát nước', value: 'Undrained (B)', note: 'Gia tải ngắn hạn' },
  { param: 'R_inter', value: '0,67', note: 'Interface đất – trụ' },
];

const PLAXIS_COLUMN_PARAMS = [
  { param: 'Mô hình', value: 'Mohr-Coulomb' },
  { param: 'γ (kN/m³)', value: '18,3', note: 'Bảng 3.6' },
  { param: 'E_c (MPa)', value: '15 – 55', note: 'Bảng 4.5: khảo sát 5 giá trị' },
  { param: 'φ\' (°)', value: '42', note: 'Bảng 3.6' },
  { param: 'c\' (kPa)', value: '0', note: 'Vật liệu rời' },
  { param: 'ψ (°)', value: '12', note: 'Góc giãn nở' },
  { param: 'ν', value: '0,30', note: '' },
];

const PLAXIS_GEOGRID_PARAMS = [
  { param: 'Loại phần tử', value: 'Geogrid element' },
  { param: 'EA (kN/m)', value: '100 – 8000', note: 'Bảng 4.7: J = 1000–8000 kN/m' },
  { param: 'J mô hình (kN/m)', value: '100', note: 'Tỷ lệ 1:20 → J_nguyên mẫu = 2000' },
];

// Bảng so sánh MHVL vs Plaxis 3D (từ Bảng 4.4, Chương 4)
const PLAXIS_VALIDATION = [
  { param: 'n tại p=18 kPa, s/D=2,5', mhvl: '3,64', plaxis: '3,49', error: '4,1%' },
  { param: 'n tại p=120 kPa, s/D=2,5', mhvl: '2,03', plaxis: '1,93', error: '4,9%' },
  { param: 'n tại p=18 kPa, s/D=3,0', mhvl: '3,47', plaxis: '3,56', error: '2,6%' },
  { param: 'n tại p=120 kPa, s/D=3,0', mhvl: '2,01', plaxis: '2,10', error: '4,5%' },
  { param: 'n tại p=120 kPa, s/D=3,5', mhvl: '2,00', plaxis: '2,25', error: '12,5%' },
  { param: 'Xu hướng n giảm theo p', mhvl: 'Đúng', plaxis: 'Đúng', error: 'Phù hợp' },
  { param: 'Dạng phá hoại trụ', mhvl: 'Phình nở 1–3D', plaxis: 'Phình nở 1,5–2,8D', error: 'Tương đồng' },
];

// Chart data for parameter sensitivity
function buildParamChartData(numerical: typeof NUMERICAL_N_BY_EC) {
  return PRESSURE_LEVELS.map((p, pi) => {
    const row: Record<string, number> = { pressure: p };
    numerical.parameterValues.forEach((pv, vi) => {
      row[`${numerical.parameter}=${pv}`] = numerical.nValues[vi][pi];
    });
    return row;
  });
}

const PARAM_COLORS = ['#4e7ab9', '#f5b731', '#6b7b8d', '#10b981', '#8b5cf6'];

export default function NumericalSimTab() {
  const [activeView, setActiveView] = useState<'setup' | 'validation' | 'sensitivity'>('setup');

  const VIEWS = [
    { id: 'setup' as const, label: 'Thông số Plaxis 3D', icon: Settings2 },
    { id: 'validation' as const, label: 'Kiểm chứng MHVL', icon: GitCompare },
    { id: 'sensitivity' as const, label: 'Phân tích nhạy', icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Monitor className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">Mô phỏng trên mô hình số</h2>
        <span className="label-en">Numerical Simulation — Plaxis 3D</span>
      </div>

      {/* Reference tag */}
      <div className="flex items-center gap-2 text-xs text-surface-500">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Dữ liệu từ <strong className="text-surface-300">Chương 4</strong> — Bảng 4.3 → 4.8 — Luận án NCS. Nguyễn Hải Hà</span>
      </div>

      {/* Sub-nav */}
      <div className="flex flex-wrap gap-1 bg-surface-800/50 p-1 rounded-xl">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            className={`tab-button text-xs flex items-center gap-1.5 ${activeView === v.id ? 'active' : ''}`}>
            <v.icon className="w-3.5 h-3.5" />{v.label}
          </button>
        ))}
      </div>

      {/* ====== SETUP VIEW ====== */}
      {activeView === 'setup' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* General */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-surface-100 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary-400" />
              Thông tin chung mô hình số
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {PLAXIS_GENERAL.map((item, i) => (
                <div key={i} className="p-2.5 bg-surface-800/50 rounded-lg border border-surface-700/30">
                  <div className="text-[10px] text-surface-500 uppercase tracking-wider">{item.param}</div>
                  <div className="text-xs text-surface-200 font-medium mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil params */}
          <ParamTable title="Thông số đất nền (Mohr-Coulomb)" data={PLAXIS_SOIL_PARAMS} color="text-amber-400" />

          {/* Column params */}
          <ParamTable title="Thông số trụ VLHR (Mohr-Coulomb)" data={PLAXIS_COLUMN_PARAMS} color="text-primary-400" />

          {/* Geogrid params */}
          <ParamTable title="Lưới ĐKT (Geogrid element)" data={PLAXIS_GEOGRID_PARAMS} color="text-emerald-400" />

          {/* Thesis parameter analysis reference */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-surface-100 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-400" />
              Các yếu tố ảnh hưởng — Phân tích số (Bảng 4.5 → 4.8)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHAPTER4.parameterAnalysis.parameters.map((p, i) => (
                <div key={i} className="p-3 bg-surface-800/50 rounded-xl border border-surface-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-primary-300 text-sm">{p.name}</span>
                    <span className="badge badge-blue text-[9px] ml-auto">{p.source}</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">{p.influence}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ====== VALIDATION VIEW ====== */}
      {activeView === 'validation' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-surface-100 mb-1 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-emerald-400" />
              So sánh MHVL – Plaxis 3D
            </h3>
            <p className="text-xs text-surface-500 mb-4">Đối chiếu hệ số tập trung ứng suất n từ thực nghiệm (MHVL) và mô hình số (Plaxis 3D) — Bảng 4.4</p>

            <div className="relative overflow-x-auto rounded-lg border border-surface-700/50">
              <table className="w-full text-left text-xs bg-surface-900/50">
                <thead className="bg-surface-800/80 text-surface-300 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2 font-medium">Thông số</th>
                    <th className="px-3 py-2 font-medium text-center">MHVL</th>
                    <th className="px-3 py-2 font-medium text-center">Plaxis 3D</th>
                    <th className="px-3 py-2 font-medium text-center">Sai lệch</th>
                    <th className="px-3 py-2 font-medium text-center">KQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-700/50">
                  {PLAXIS_VALIDATION.map((r, i) => (
                    <tr key={i} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-3 py-2 text-surface-200 font-medium">{r.param}</td>
                      <td className="px-3 py-2 text-primary-300 font-mono text-center">{r.mhvl}</td>
                      <td className="px-3 py-2 text-accent-300 font-mono text-center">{r.plaxis}</td>
                      <td className="px-3 py-2 text-surface-400 font-mono text-center">{r.error}</td>
                      <td className="px-3 py-2 text-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-emerald-900/10 border border-emerald-700/20 rounded-lg">
              <p className="text-xs text-emerald-300">
                <strong>Nhận xét (Luận án §4.3):</strong> Sai lệch &lt; 10% cho hầu hết trường hợp. Mô hình Plaxis 3D đã được hiệu chỉnh
                thành công, có thể sử dụng tin cậy để mở rộng phân tích ảnh hưởng của E<sub>c</sub>, E<sub>s</sub>, J và s/D.
              </p>
            </div>
          </div>

          {/* Comparison charts: n from experiment vs Plaxis */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-surface-100 mb-3">So sánh n ~ p: MHVL vs Plaxis 3D (s/D = 3,0)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={PRESSURE_LEVELS.map((p, i) => ({
                pressure: p,
                n_mhvl: GROUP_COLUMN_RESULTS[1].stressConcentration[i],
                n_plaxis: NUMERICAL_N_BY_SD.nValues[1][i],
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 }}} />
                <YAxis stroke="#64748b" domain={[1.5, 4]} label={{ value: 'n', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 }}} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="n_mhvl" stroke="#4e7ab9" strokeWidth={2.5} dot={{ r: 4 }} name="n (MHVL)" />
                <Line type="monotone" dataKey="n_plaxis" stroke="#f5b731" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="6 3" name="n (Plaxis 3D)" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-surface-600 mt-2 italic">Nguồn: Bảng 3.14 (MHVL) + Bảng 4.4 (Plaxis 3D) — Luận án</p>
          </div>

          {/* FEM model SVG */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-surface-100 mb-3">Sơ đồ mô hình 3D — Plaxis 3D Foundation</h3>
            <FEMModelSVG />
          </div>
        </motion.div>
      )}

      {/* ====== SENSITIVITY VIEW ====== */}
      {activeView === 'sensitivity' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <SensitivityChart
            title="Ảnh hưởng E_c đến n (Bảng 4.5)"
            subtitle="E_c = 15, 25, 35, 45, 55 MPa — Đất nền: E_s = 4 MPa, s/D = 3,0"
            data={buildParamChartData(NUMERICAL_N_BY_EC)}
            keys={NUMERICAL_N_BY_EC.parameterValues.map(v => `Ec=${v}`)}
            unit="MPa"
          />
          <SensitivityChart
            title="Ảnh hưởng E_s đến n (Bảng 4.6)"
            subtitle="E_s = 1, 2, 3, 4, 5 MPa — Trụ: E_c = 25 MPa, s/D = 3,0"
            data={buildParamChartData(NUMERICAL_N_BY_ES)}
            keys={NUMERICAL_N_BY_ES.parameterValues.map(v => `Es=${v}`)}
            unit="MPa"
          />
          <SensitivityChart
            title="Ảnh hưởng J (độ cứng lưới) đến n (Bảng 4.7)"
            subtitle="J = 1000, 2000, 3000, 5000, 8000 kN/m"
            data={buildParamChartData(NUMERICAL_N_BY_J)}
            keys={NUMERICAL_N_BY_J.parameterValues.map(v => `J=${v}`)}
            unit="×1000 kN/m"
          />

          {/* Key conclusions from thesis */}
          <div className="glass-card p-5 border-l-4 border-accent-400">
            <h3 className="text-sm font-bold text-surface-100 mb-3">Kết luận từ phân tích số (§4.4 Luận án)</h3>
            <ul className="space-y-2 text-xs text-surface-300">
              {CHAPTER4.conclusions.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: c
                    .replace(/E₅₀/g, 'E<sub>50</sub>')
                    .replace(/qult/g, 'q<sub>ult</sub>')
                    .replace(/Δqult/g, 'Δq<sub>ult</sub>')
                  }} />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ====== Sub-components ====== */

function ParamTable({ title, data, color }: { title: string; data: { param: string; value: string; note?: string }[]; color: string }) {
  return (
    <div className="glass-card p-5">
      <h3 className={`text-sm font-bold text-surface-100 mb-3 flex items-center gap-2`}>
        <Layers className={`w-4 h-4 ${color}`} />
        {title}
      </h3>
      <div className="relative overflow-x-auto rounded-lg border border-surface-700/50">
        <table className="w-full text-left text-xs bg-surface-900/50">
          <thead className="bg-surface-800/80 text-surface-300 uppercase text-[10px]">
            <tr>
              <th className="px-3 py-2 font-medium">Thông số</th>
              <th className="px-3 py-2 font-medium">Giá trị</th>
              <th className="px-3 py-2 font-medium">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/50">
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-surface-800/30 transition-colors">
                <td className="px-3 py-2 text-surface-200 font-medium">{r.param}</td>
                <td className="px-3 py-2 text-surface-100 font-mono">{r.value}</td>
                <td className="px-3 py-2 text-surface-500 text-[10px]">{r.note || '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SensitivityChart({ title, subtitle, data, keys, unit }: {
  title: string; subtitle: string; data: Record<string, number>[]; keys: string[]; unit: string;
}) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-bold text-surface-100 mb-1">{title}</h3>
      <p className="text-xs text-surface-500 mb-3 italic">{subtitle}</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b"
            label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 }}} />
          <YAxis stroke="#64748b" domain={['auto', 'auto']}
            label={{ value: 'n', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 }}} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
          <Legend />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={`${k.split('=')[0]}=${k.split('=')[1]}`}
              stroke={PARAM_COLORS[i % PARAM_COLORS.length]} strokeWidth={2} dot={{ r: 3 }}
              name={`${k} ${unit}`} animationDuration={600} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function FEMModelSVG() {
  return (
    <svg viewBox="0 0 500 280" className="w-full max-w-lg mx-auto">
      {/* Background grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="40" y1={30 + i * 20} x2="460" y2={30 + i * 20} stroke="#1e293b" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={`v${i}`} x1={40 + i * 20} y1="30" x2={40 + i * 20} y2="260" stroke="#1e293b" strokeWidth="0.5" />
      ))}

      {/* Domain */}
      <rect x="40" y="30" width="420" height="230" fill="none" stroke="#475569" strokeWidth="1.5" />

      {/* Sand cushion top */}
      <rect x="40" y="30" width="420" height="25" fill="#fbbf24" fillOpacity="0.12" />
      <text x="250" y="46" textAnchor="middle" className="fill-amber-400" fontSize="8">Đệm cát trên (100mm)</text>

      {/* Geogrid */}
      <line x1="40" y1="55" x2="460" y2="55" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 3" />

      {/* Soil */}
      <rect x="40" y="55" width="420" height="145" fill="#78350f" fillOpacity="0.08" />

      {/* Columns */}
      {[100, 200, 300, 400].map(x => (
        <rect key={x} x={x - 10} y="55" width="20" height="145" fill="#6b7b8d" fillOpacity="0.35" stroke="#8d9bab" strokeWidth="0.8" />
      ))}

      {/* Base sand */}
      <rect x="40" y="200" width="420" height="60" fill="#d97706" fillOpacity="0.12" />
      <text x="250" y="235" textAnchor="middle" className="fill-amber-500" fontSize="8">Đệm cát đầm chặt (200mm)</text>

      {/* Labels */}
      <text x="30" y="135" textAnchor="end" className="fill-surface-500" fontSize="7" transform="rotate(-90, 30, 135)">Đất sét pha yếu 600mm</text>
      <text x="250" y="135" textAnchor="middle" className="fill-surface-400" fontSize="9" fontWeight="600">Mohr-Coulomb</text>
      <text x="250" y="148" textAnchor="middle" className="fill-surface-500" fontSize="7">γ=16,6 | c'=5–20 | φ'=15–22°</text>

      {/* Column label */}
      <text x="100" y="170" textAnchor="middle" className="fill-surface-300" fontSize="7">E_c=15–55 MPa</text>
      <text x="100" y="182" textAnchor="middle" className="fill-surface-400" fontSize="6">φ'=42° | ψ=12°</text>

      {/* Boundary conditions */}
      {[60, 120, 180, 240, 300, 360, 420].map(x => (
        <g key={x}>
          <line x1={x} y1="260" x2={x - 4} y2="268" stroke="#6b7b8d" strokeWidth="0.8" />
          <line x1={x} y1="260" x2={x + 4} y2="268" stroke="#6b7b8d" strokeWidth="0.8" />
        </g>
      ))}

      {/* Right roller */}
      {[60, 100, 140, 180, 220].map(y => (
        <circle key={y} cx="463" cy={y} r="2.5" fill="none" stroke="#6b7b8d" strokeWidth="0.6" />
      ))}

      {/* Load arrows */}
      {[80, 150, 250, 350, 420].map(x => (
        <polygon key={x} points={`${x - 3},28 ${x + 3},28 ${x},33`} fill="#4e7ab9" />
      ))}
      <text x="250" y="24" textAnchor="middle" className="fill-primary-400" fontSize="8" fontWeight="600">
        p = 18 → 120 kPa (CRP)
      </text>

      {/* Software label */}
      <text x="460" y="275" textAnchor="end" className="fill-surface-600" fontSize="7" fontStyle="italic">Plaxis 3D Foundation</text>
    </svg>
  );
}
