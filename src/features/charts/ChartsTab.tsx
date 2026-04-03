import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SINGLE_COLUMN_RESULTS, GROUP_COLUMN_RESULTS, PRESSURE_LEVELS, SOIL_STATES, CHART_COLORS, NUMERICAL_N_BY_EC, NUMERICAL_N_BY_ES, NUMERICAL_N_BY_J } from '../../lib/data';
import { BarChart3 } from 'lucide-react';

const tooltipStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 };

const CHART_TABS = [
  'Ứng suất – Biến dạng',
  'Tải trọng – Độ lún',
  'Ứng suất đỉnh trụ',
  'Áp lực đất nền',
  'Biến dạng lưới',
  'Hệ số TTƯS n',
  'Mô đun E₅₀',
  'n theo Ec',
  'n theo Es',
  'n theo J',
];

export default function ChartsTab() {
  const [activeChart, setActiveChart] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">Kết luận & Biểu đồ</h2>
        <span className="label-en">Conclusions & Charts</span>
      </div>

      {/* Chart tabs */}
      <div className="flex flex-wrap gap-1 bg-surface-800/50 p-1 rounded-xl">
        {CHART_TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveChart(i)}
            className={`tab-button text-xs ${activeChart === i ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="chart-container">
        {activeChart === 0 && <StressStrainChart />}
        {activeChart === 1 && <LoadSettlementChart />}
        {activeChart === 2 && <ColumnStressChart />}
        {activeChart === 3 && <SoilPressureChart />}
        {activeChart === 4 && <GeogridStrainChart />}
        {activeChart === 5 && <StressConcentrationChart />}
        {activeChart === 6 && <E50Chart />}
        {activeChart === 7 && <NumericalChart data={NUMERICAL_N_BY_EC} paramLabel="Ec (MPa)" title="Ảnh hưởng của Ec đến hệ số n" titleEn="Effect of Ec on stress concentration ratio" source="Bảng 4.5" />}
        {activeChart === 8 && <NumericalChart data={NUMERICAL_N_BY_ES} paramLabel="Es (MPa)" title="Ảnh hưởng của Es đến hệ số n" titleEn="Effect of Es on stress concentration ratio" source="Bảng 4.6" />}
        {activeChart === 9 && <NumericalChart data={NUMERICAL_N_BY_J} paramLabel="J (MN/m)" title="Ảnh hưởng của J đến hệ số n" titleEn="Effect of J on stress concentration ratio" source="Bảng 4.7" />}
      </div>
    </div>
  );
}

function StressStrainChart() {
  const data: Record<string, number>[] = [];
  for (let i = 0; i < 8; i++) {
    const point: Record<string, number> = { epsilon: SINGLE_COLUMN_RESULTS[0].stressStrainCurve[i].epsilon };
    SINGLE_COLUMN_RESULTS.forEach(r => {
      const key = `${r.IL}_${r.geogrid}`;
      point[key] = r.stressStrainCurve[i].sigma;
    });
    data.push(point);
  }
  const lines = SINGLE_COLUMN_RESULTS.map(r => ({
    key: `${r.IL}_${r.geogrid}`,
    name: `${SOIL_STATES[r.IL].label} – ${r.geogrid === 'with_geogrid' ? 'Có lưới' : 'Không lưới'}`,
    color: r.geogrid === 'with_geogrid' ? SOIL_STATES[r.IL].color : SOIL_STATES[r.IL].color + '80',
    dash: r.geogrid === 'without_geogrid' ? '5 3' : undefined,
  }));

  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Quan hệ ứng suất – biến dạng trụ đơn VLHR</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Stress-strain relationship — All conditions (Table 3.12)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="epsilon" stroke="#64748b" label={{ value: 'Biến dạng ε (%)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'Ứng suất σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {lines.map(l => <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2} strokeDasharray={l.dash} dot={{ r: 3 }} name={l.name} />)}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-surface-600 mt-2 italic">Dữ liệu thực nghiệm từ luận án</p>
    </>
  );
}

function LoadSettlementChart() {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, r.settlement[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Quan hệ tải trọng – độ lún nhóm trụ VLHR</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Load-settlement relationship — Group columns (Table 3.14)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'Áp lực p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis reversed stroke="#64748b" label={{ value: 'Độ lún S (mm)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GROUP_COLUMN_RESULTS.map(r => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={CHART_COLORS[r.sD] as string} strokeWidth={2} dot={{ r: 3 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-surface-600 mt-2 italic">Dữ liệu thực nghiệm từ luận án</p>
    </>
  );
}

function ColumnStressChart() {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, r.columnStress[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Ứng suất đỉnh trụ theo cấp tải trọng</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Column head stress vs. applied pressure (Table 3.16)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'σc (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GROUP_COLUMN_RESULTS.map(r => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={CHART_COLORS[r.sD] as string} strokeWidth={2} dot={{ r: 3 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function SoilPressureChart() {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, r.soilPressure[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Áp lực đất nền theo cấp tải trọng</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Soil pressure vs. applied pressure (Table 3.17)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'σs (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GROUP_COLUMN_RESULTS.map(r => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={CHART_COLORS[r.sD] as string} strokeWidth={2} dot={{ r: 3 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function GeogridStrainChart() {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, r.geogridStrain[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Biến dạng lưới ĐKT theo áp lực thẳng đứng</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Geogrid strain vs. vertical pressure (Table 3.18)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'T (kN/m)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GROUP_COLUMN_RESULTS.map(r => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={CHART_COLORS[r.sD] as string} strokeWidth={2} dot={{ r: 3 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function StressConcentrationChart() {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, r.stressConcentration[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Hệ số tập trung ứng suất n theo tải trọng</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Stress concentration ratio n (Table 4.4)</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" domain={[1.5, 4]} label={{ value: 'n = σc/σs', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GROUP_COLUMN_RESULTS.map(r => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={CHART_COLORS[r.sD] as string} strokeWidth={2} dot={{ r: 3 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function E50Chart() {
  const data = SINGLE_COLUMN_RESULTS.map(r => ({
    name: `${SOIL_STATES[r.IL].label}\n${r.geogrid === 'with_geogrid' ? 'Có lưới' : 'Không lưới'}`,
    E50: r.E50 / 1000,
    fill: r.geogrid === 'with_geogrid' ? SOIL_STATES[r.IL].color : '#64748b',
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">Mô đun biến dạng E₅₀ của trụ VLHR</h4>
      <p className="text-xs text-surface-500 mb-4 italic">Secant modulus E₅₀ (Table 4.2)</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((d, i) => (
          <div key={i} className="p-4 bg-surface-800/50 rounded-xl text-center border border-surface-700/30">
            <div className="text-2xl font-bold" style={{ color: d.fill }}>{d.E50.toFixed(1)}</div>
            <div className="text-xs text-surface-400 mt-1">MPa</div>
            <div className="text-xs text-surface-500 mt-2 whitespace-pre-line">{d.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function NumericalChart({ data, paramLabel, title, titleEn, source }: { data: typeof NUMERICAL_N_BY_EC; paramLabel: string; title: string; titleEn: string; source: string }) {
  const chartData = data.pressureLevels.map((p, j) => {
    const point: Record<string, number> = { pressure: p };
    data.parameterValues.forEach((v, i) => { point[`val_${v}`] = data.nValues[i][j]; });
    return point;
  });
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">{title}</h4>
      <p className="text-xs text-surface-500 mb-4 italic">{titleEn} — {source}</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'n', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {data.parameterValues.map((v, i) => (
            <Line key={v} type="monotone" dataKey={`val_${v}`} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} name={`${paramLabel} = ${v}`} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-surface-600 mt-2 italic">Dữ liệu từ mô hình số — Luận án</p>
    </>
  );
}
