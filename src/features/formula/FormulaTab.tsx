// ===================================================================
// FormulaTab — Công thức đề xuất & Máy tính tương tác
// "Proposed Formulas & Interactive Calculator"
// Mục 4.5 Luận án
// ===================================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import {
  FlaskConical, Calculator, ChevronRight, Info,
  CheckCircle, AlertTriangle, TrendingDown, BarChart2,
} from 'lucide-react';
import {
  calcNFormula, calcQult,
  PROPOSED_FORMULAS, N_FORMULA,
  BEARING_CAPACITY_TABLE, E50_TABLE,
  GROUP_COLUMN_RESULTS,
} from '../../lib/data';

// ── Helpers ──────────────────────────────────────────────────────────
const PRESSURE_RANGE = [18, 36, 54, 72, 90, 108, 120];
const SD_OPTIONS = [2.5, 3.0, 3.5] as const;

function nHanYe(sD: number): number {
  // Han & Ye (2001): constant n based only on area replacement ratio
  // as = π/4 × (D/s)² ≈ π/4 / sD²  (square grid)
  const as = Math.PI / 4 / (sD * sD);
  return (1 - as) / as;  // simplification
}

function getExperimentalN(sDKey: string, pIdx: number): number {
  const res = GROUP_COLUMN_RESULTS.find((r) => r.sD === sDKey);
  return res ? res.stressConcentration[pIdx] ?? 0 : 0;
}

const SD_KEY: Record<number, string> = { 2.5: 'sD_25', 3.0: 'sD_30', 3.5: 'sD_35' };
const SD_COLOR: Record<number, string> = { 2.5: '#4e7ab9', 3.0: '#f5b731', 3.5: '#6b7b8d' };

// ── Sub-components ───────────────────────────────────────────────────

function FormulaBox({ title, titleEn, formula, sub }: {
  title: string; titleEn: string; formula: React.ReactNode; sub?: string;
}) {
  return (
    <div className="glass-card p-4 space-y-2 border border-accent-400/20">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-accent-400 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-surface-200">{title}</div>
          <div className="text-xs text-surface-500">{titleEn}</div>
        </div>
      </div>
      <div className="bg-primary-900/60 rounded-lg px-4 py-3 font-mono text-sm text-accent-300 text-center">
        {formula}
      </div>
      {sub && <p className="text-xs text-surface-500">{sub}</p>}
    </div>
  );
}

// ── Qult Calculator ──────────────────────────────────────────────────
function QultCalculator() {
  const [cu, setCu] = useState(10);
  const [withGeo, setWithGeo] = useState(true);

  const qult = calcQult(cu, withGeo);
  const qultOther = calcQult(cu, !withGeo);
  const improvement = ((calcQult(cu, true) - calcQult(cu, false)) / calcQult(cu, false) * 100).toFixed(1);

  const chartData = Array.from({ length: 20 }, (_, i) => {
    const c = 1 + i;
    return { cu: c, no: calcQult(c, false), geo: calcQult(c, true) };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Control panel */}
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-accent-400" />
            Nhập thông số
          </h3>

          {/* cu slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-surface-400">
              <span>Sức kháng cắt không thoát nước</span>
              <span className="font-mono text-accent-300 font-semibold">cu = {cu} kPa</span>
            </div>
            <input
              type="range" min={1} max={25} step={0.5} value={cu}
              onChange={(e) => setCu(Number(e.target.value))}
              className="w-full accent-yellow-400 h-2 bg-surface-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-surface-600">
              <span>1 kPa (IL≈1,5)</span><span>25 kPa (IL≈0,5)</span>
            </div>
          </div>

          {/* Geogrid toggle */}
          <div className="flex gap-2">
            {[false, true].map((g) => (
              <button
                key={String(g)}
                onClick={() => setWithGeo(g)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                  withGeo === g
                    ? g ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-surface-700 border-surface-600 text-surface-200'
                    : 'border-surface-700 text-surface-500 hover:text-surface-300'
                }`}
              >
                {g ? 'Có lưới ĐKT' : 'Không lưới'}
              </button>
            ))}
          </div>

          {/* Result */}
          <div className="rounded-xl bg-accent-400/10 border border-accent-400/30 p-4 text-center">
            <div className="text-xs text-surface-400 mb-1">Sức chịu tải giới hạn</div>
            <div className="text-3xl font-bold text-accent-400 font-mono">{qult.toFixed(1)}</div>
            <div className="text-xs text-surface-500">kPa</div>
          </div>

          {/* Comparison */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">{withGeo ? 'Không lưới' : 'Có lưới'}</span>
              <span className="font-mono text-surface-300">{qultOther.toFixed(1)} kPa</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Cải thiện do lưới ĐKT</span>
              <span className="font-mono text-emerald-400">+{improvement}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Nc (không lưới / có lưới)</span>
              <span className="font-mono text-surface-300">
                {PROPOSED_FORMULAS.qult_no_geogrid.Nc} / {PROPOSED_FORMULAS.qult_with_geogrid.Nc}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-xs font-semibold text-surface-400">qult theo cu</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
              <XAxis dataKey="cu" tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'cu (kPa)', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [`${Number(v).toFixed(1)} kPa`]}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine x={cu} stroke="#f59e0b" strokeDasharray="4 2" strokeOpacity={0.7} />
              <Line dataKey="no" name="Không lưới" stroke="#6b7280" strokeWidth={2} dot={false} />
              <Line dataKey="geo" name="Có lưới ĐKT" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          {/* Experimental table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-surface-400">
              <thead>
                <tr className="border-b border-surface-700">
                  <th className="text-left py-1 font-medium">IL</th>
                  <th className="text-right py-1">cu (kPa)</th>
                  <th className="text-right py-1">qult,0</th>
                  <th className="text-right py-1">qult,geo</th>
                  <th className="text-right py-1">Δ(%)</th>
                </tr>
              </thead>
              <tbody>
                {BEARING_CAPACITY_TABLE.map((r) => (
                  <tr key={r.IL} className="border-b border-surface-800/50">
                    <td className="py-1">{r.IL.replace('IL_0', 'IL=0,').replace('IL_', 'IL=').replace('78', '78').replace('10', '1,0').replace('15', '1,5')}</td>
                    <td className="text-right font-mono">{r.cu}</td>
                    <td className="text-right font-mono text-surface-300">{r.qult_no}</td>
                    <td className="text-right font-mono text-emerald-400">{r.qult_geo}</td>
                    <td className="text-right font-mono text-yellow-400">+{r.delta_pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── n-Formula Calculator ──────────────────────────────────────────────
function NFormulaCalculator() {
  const [sD, setSD] = useState<number>(3.0);
  const [p, setP] = useState<number>(60);

  const result = useMemo(() => calcNFormula(sD, p), [sD, p]);
  const hanYeN = nHanYe(sD);

  // Chart data: n vs p for all 3 s/D values (formula + experimental)
  const chartData = useMemo(() => PRESSURE_RANGE.map((pi, idx) => {
    const row: Record<string, number> = { p: pi };
    SD_OPTIONS.forEach((s) => {
      const r = calcNFormula(s, pi);
      row[`formula_${s}`] = parseFloat(r.n.toFixed(3));
      row[`exp_${s}`] = getExperimentalN(SD_KEY[s], idx);
    });
    return row;
  }), []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Control panel */}
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-accent-400" />
            Nhập thông số
          </h3>

          {/* s/D selector */}
          <div className="space-y-2">
            <div className="text-xs text-surface-400">Tỷ lệ khoảng cách s/D</div>
            <div className="flex gap-2">
              {SD_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSD(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    sD === s
                      ? 'border-accent-400/50 text-accent-400 bg-accent-400/10'
                      : 'border-surface-700 text-surface-500 hover:text-surface-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* p slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-surface-400">
              <span>Tải trọng phân bố</span>
              <span className="font-mono text-accent-300 font-semibold">p = {p} kPa</span>
            </div>
            <input
              type="range" min={18} max={120} step={1} value={p}
              onChange={(e) => setP(Number(e.target.value))}
              className="w-full accent-yellow-400 h-2 bg-surface-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-surface-600">
              <span>18 kPa (H≈1m)</span><span>120 kPa (H≈7m)</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'σs (đất nền)', value: result.sigmaS.toFixed(2), unit: 'kPa', color: 'text-orange-400' },
              { label: 'σc (đỉnh trụ)', value: result.sigmaC.toFixed(2), unit: 'kPa', color: 'text-blue-400' },
              { label: 'n = σc/σs', value: result.n.toFixed(3), unit: '–', color: 'text-accent-400' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-3 text-center">
                <div className="text-[10px] text-surface-500 mb-1 leading-tight">{item.label}</div>
                <div className={`text-lg font-bold font-mono ${item.color}`}>{item.value}</div>
                <div className="text-[10px] text-surface-600">{item.unit}</div>
              </div>
            ))}
          </div>

          {/* Han & Ye comparison */}
          <div className="rounded-lg bg-surface-800/50 p-3 space-y-1">
            <div className="text-xs font-semibold text-surface-400">So sánh phương pháp</div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Han & Ye (2001) — n hằng số</span>
              <span className="font-mono text-red-400">{hanYeN.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Công thức đề xuất — n(p, s/D)</span>
              <span className="font-mono text-emerald-400">{result.n.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Sai lệch Han & Ye</span>
              <span className="font-mono text-orange-400">~{N_FORMULA.comparison_HanYe_error}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-400">Sai lệch CT đề xuất</span>
              <span className="font-mono text-emerald-400">&lt;{N_FORMULA.proposed_error}%</span>
            </div>
          </div>
        </div>

        {/* n vs p chart */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-xs font-semibold text-surface-400">
            n theo tải trọng p — Công thức vs Thực nghiệm
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
              <XAxis dataKey="p" tick={{ fontSize: 10, fill: '#94a3b8' }}
                label={{ value: 'p (kPa)', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94a3b8' }} />
              <YAxis domain={[1.5, 4.2]} tick={{ fontSize: 10, fill: '#94a3b8' }}
                label={{ value: 'n', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 10 }}
              />
              <ReferenceLine x={p} stroke="#f59e0b" strokeDasharray="4 2" strokeOpacity={0.7} />
              {SD_OPTIONS.map((s) => (
                [
                  <Line key={`f${s}`} dataKey={`formula_${s}`} name={`CT s/D=${s}`}
                    stroke={SD_COLOR[s]} strokeWidth={2} dot={false} />,
                  <Line key={`e${s}`} dataKey={`exp_${s}`} name={`TN s/D=${s}`}
                    stroke={SD_COLOR[s]} strokeWidth={1.5} strokeDasharray="5 3"
                    dot={{ r: 3, fill: SD_COLOR[s] }} />,
                ]
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 text-[10px] text-surface-500">
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-blue-500 inline-block" /> s/D=2,5</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-yellow-400 inline-block" /> s/D=3,0</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-gray-400 inline-block" /> s/D=3,5</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-surface-400 inline-block" /> Thực nghiệm</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t border-surface-400 inline-block" /> Công thức</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scope of Validity ────────────────────────────────────────────────
function ScopePanel() {
  const items = [
    { param: 'Chỉ số sệt IL', range: '0,75 ≤ IL ≤ 1,0', note: 'Lưới ĐKT kém hiệu quả khi IL > 1,0', ok: true },
    { param: 'Sức kháng cắt cu', range: '5–20 kPa (mô hình)', note: 'Tương đương đất yếu thực tế', ok: true },
    { param: 'Tỷ lệ khoảng cách s/D', range: '2,5–3,5', note: 'Khuyến nghị: 2,5–3,0 (cải thiện tốt nhất)', ok: true },
    { param: 'Tải trọng p', range: '18–120 kPa', note: 'Tương đương H = 1–7 m đắp đất', ok: true },
    { param: 'Đường kính trụ D', range: '0,6–1,0 m (nguyên mẫu)', note: 'Quy đổi từ D=40mm × 20', ok: true },
    { param: 'Độ cứng lưới J', range: '2 000 kN/m (nguyên mẫu)', note: 'Mô hình: J = 100 kN/m (1:20)', ok: true },
    { param: 'Nhóm trụ', range: '2×2', note: 'Cần nghiên cứu thêm 3×3, 4×4', ok: false },
    { param: 'Điều kiện thoát nước', range: 'Không thoát nước (CRP)', note: 'Cần kiểm tra thoát nước một phần', ok: false },
  ];

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-primary-400" />
        Phạm vi áp dụng công thức
        <span className="label-en">Scope of Validity</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.param} className={`flex items-start gap-2 p-2 rounded-lg ${
            item.ok ? 'bg-emerald-900/10' : 'bg-orange-900/10'
          }`}>
            {item.ok
              ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              : <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            }
            <div className="min-w-0">
              <div className="text-xs font-medium text-surface-200">{item.param}</div>
              <div className="text-xs text-accent-300 font-mono">{item.range}</div>
              <div className="text-[10px] text-surface-500 mt-0.5">{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── E50 Comparison ───────────────────────────────────────────────────
function E50Panel() {
  const IL_LABELS: Record<string, string> = {
    IL_078: 'IL = 0,78', IL_10: 'IL = 1,0', IL_15: 'IL = 1,5',
  };
  const chartData = E50_TABLE.map((r) => ({
    il: IL_LABELS[r.IL],
    no: r.E50_no,
    geo: r.E50_geo,
    imp: r.improvement_pct,
  }));

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-primary-400" />
        Mô đun biến dạng E₅₀
        <span className="label-en">Deformation Modulus E₅₀</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} />
            <XAxis dataKey="il" tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} label={{ value: 'MPa', angle: -90, fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 10 }} />
            <Line dataKey="no" name="Không lưới" stroke="#6b7280" strokeWidth={2} dot={{ r: 4 }} />
            <Line dataKey="geo" name="Có lưới ĐKT" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {E50_TABLE.map((r) => (
            <div key={r.IL} className="flex items-center gap-3 p-2 bg-surface-800/40 rounded-lg">
              <div className="w-16 text-xs text-surface-400">{IL_LABELS[r.IL]}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-surface-500">Không lưới</span>
                  <span className="text-surface-300 font-mono">{r.E50_no} MPa</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600">Có lưới ĐKT</span>
                  <span className="text-emerald-400 font-mono">{r.E50_geo} MPa</span>
                </div>
              </div>
              <div className="text-xs font-mono text-yellow-400 w-12 text-right">+{r.improvement_pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Tab ─────────────────────────────────────────────────────────
type SubTab = 'qult' | 'n_formula' | 'e50' | 'scope';

const SUBTABS: { id: SubTab; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'qult', label: 'Sức chịu tải qult', labelEn: 'Bearing Capacity', icon: TrendingDown },
  { id: 'n_formula', label: 'Hệ số tập trung n', labelEn: 'Stress Concentration n', icon: FlaskConical },
  { id: 'e50', label: 'Mô đun E₅₀', labelEn: 'Deformation Modulus', icon: BarChart2 },
  { id: 'scope', label: 'Phạm vi áp dụng', labelEn: 'Scope', icon: Info },
];

export default function FormulaTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('n_formula');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <FlaskConical className="w-5 h-5 text-accent-400" />
        <h2 className="section-title !mb-0">Công thức đề xuất & Máy tính</h2>
        <span className="label-en">Proposed Formulas & Interactive Calculator</span>
        <span className="ml-auto text-xs text-surface-500 hidden sm:block">Mục 4.5 Luận án</span>
      </div>

      {/* Formula overview boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormulaBox
          title="Sức chịu tải giới hạn"
          titleEn="Ultimate Bearing Capacity"
          formula={
            <>
              <span className="text-surface-300">q</span>
              <sub className="text-xs">ult</sub>
              <span className="text-surface-300"> = N</span>
              <sub className="text-xs">c</sub>
              <span className="text-surface-300"> × c</span>
              <sub className="text-xs">u</sub>
              {' '}
              <span className="text-surface-500 text-xs ml-2">
                N<sub>c</sub> = {PROPOSED_FORMULAS.qult_no_geogrid.Nc} (không lưới) / {PROPOSED_FORMULAS.qult_with_geogrid.Nc} (có lưới)
              </span>
            </>
          }
          sub={`Cải thiện lưới ĐKT: +${PROPOSED_FORMULAS.qult_with_geogrid.improvement}% · R² = ${PROPOSED_FORMULAS.qult_with_geogrid.R2}`}
        />
        <FormulaBox
          title="Hệ số tập trung ứng suất"
          titleEn="Stress Concentration Ratio"
          formula={
            <span className="text-sm leading-relaxed">
              <span className="text-surface-300">n = σ</span>
              <sub className="text-xs">c</sub>
              <span className="text-surface-300"> / σ</span>
              <sub className="text-xs">s</sub>
              <span className="text-surface-500 text-xs ml-3">= f(s/D, p) — phi tuyến</span>
            </span>
          }
          sub={`σs = (0,253·s/D + 0,157)·p · σc = (8,996·s/D + 55,83)·ln(p) – (25,03·s/D + 112,48)`}
        />
      </div>

      {/* Sub-tab selector */}
      <div className="flex flex-wrap gap-2">
        {SUBTABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`tab-button flex items-center gap-2 ${activeSubTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span className="text-xs text-surface-500 hidden sm:inline">({tab.labelEn})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSubTab === 'qult' && <QultCalculator />}
        {activeSubTab === 'n_formula' && <NFormulaCalculator />}
        {activeSubTab === 'e50' && <E50Panel />}
        {activeSubTab === 'scope' && <ScopePanel />}
      </motion.div>

      {/* Citation */}
      <div className="glass-card p-3 flex items-start gap-2">
        <ChevronRight className="w-4 h-4 text-surface-600 mt-0.5 shrink-0" />
        <p className="text-[11px] text-surface-500">
          <strong className="text-surface-400">Nguồn:</strong> Công thức được phát triển từ kết quả thí nghiệm mô hình vật lý tỷ lệ 1:20 (MHVL 1g)
          và mô phỏng số Plaxis 3D. Áp dụng trong phạm vi: IL = 0,75–1,0; s/D = 2,5–3,5; p = 18–120 kPa;
          J = 2 000 kN/m (nguyên mẫu). Yêu cầu kiểm tra thực địa trước khi áp dụng đại trà.
          — NCS. Nguyễn Hải Hà, Luận án TS, UTC 2026.
        </p>
      </div>
    </div>
  );
}
