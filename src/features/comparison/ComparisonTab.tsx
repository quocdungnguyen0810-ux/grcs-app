import { useState } from 'react';
import { GROUP_COLUMN_RESULTS, SINGLE_COLUMN_RESULTS, SOIL_STATES, SETTLEMENT_COMPARISON, PRESSURE_LEVELS, EXPERIMENT_SCENARIOS } from '../../lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GitCompare, Check, ChevronDown } from 'lucide-react';

const tooltipStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12, fontFamily: 'Inter' };

type CompMode = 'settlement' | 'stress' | 'n' | 'single_IL' | 'geogrid' | 'custom';

export default function ComparisonTab() {
  const [mode, setMode] = useState<CompMode>('custom');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['single_078_no', 'single_078_yes']);
  const [showSelector, setShowSelector] = useState(true);

  const toggleScenario = (id: string) => {
    setSelectedScenarios(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const modes: { id: CompMode; label: string }[] = [
    { id: 'custom', label: 'Tùy chọn kịch bản' },
    { id: 'settlement', label: 'Độ lún theo s/D' },
    { id: 'stress', label: 'Ứng suất theo s/D' },
    { id: 'n', label: 'Hệ số n theo s/D' },
    { id: 'single_IL', label: 'Trụ đơn theo I\u2097' },
    { id: 'geogrid', label: 'Có lưới vs Không lưới' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <GitCompare className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">So sánh kịch bản</h2>
        <span className="label-en">Scenario Comparison</span>
      </div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-1 bg-surface-800/50 p-1 rounded-xl">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`tab-button text-xs ${mode === m.id ? 'active' : ''}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* === CUSTOM SCENARIO COMPARISON === */}
      {mode === 'custom' && (
        <>
          {/* Scenario selector */}
          <div className="glass-card p-4">
            <button onClick={() => setShowSelector(!showSelector)} className="flex items-center gap-2 w-full text-left">
              <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${showSelector ? 'rotate-180' : ''}`} />
              <h3 className="text-sm font-semibold text-surface-200">Chọn kịch bản so sánh</h3>
              <span className="text-xs text-accent-400 ml-auto">{selectedScenarios.length} đã chọn</span>
            </button>
            {showSelector && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Single column scenarios */}
                <div>
                  <div className="text-xs text-surface-500 uppercase tracking-wide mb-2 font-semibold">Nhóm 1: Trụ đơn</div>
                  <div className="space-y-1">
                    {EXPERIMENT_SCENARIOS.filter(s => s.type === 'single').map(s => (
                      <label key={s.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${selectedScenarios.includes(s.id) ? 'bg-primary-600/15 text-primary-300' : 'text-surface-400 hover:bg-surface-700/30'}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedScenarios.includes(s.id) ? 'border-primary-400 bg-primary-400' : 'border-surface-600'}`}>
                          {selectedScenarios.includes(s.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedScenarios.includes(s.id)} onChange={() => toggleScenario(s.id)} />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Group column scenarios */}
                <div>
                  <div className="text-xs text-surface-500 uppercase tracking-wide mb-2 font-semibold">Nhóm 2: Nhóm trụ + Lưới ĐKT</div>
                  <div className="space-y-1">
                    {EXPERIMENT_SCENARIOS.filter(s => s.type === 'group').map(s => (
                      <label key={s.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${selectedScenarios.includes(s.id) ? 'bg-accent-400/15 text-accent-300' : 'text-surface-400 hover:bg-surface-700/30'}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedScenarios.includes(s.id) ? 'border-accent-400 bg-accent-400' : 'border-surface-600'}`}>
                          {selectedScenarios.includes(s.id) && <Check className="w-3 h-3 text-primary-900" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedScenarios.includes(s.id)} onChange={() => toggleScenario(s.id)} />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-700/30">
              <span className="text-xs text-surface-500 self-center">Nhanh:</span>
              <button onClick={() => setSelectedScenarios(['single_078_no', 'single_078_yes', 'single_10_no', 'single_10_yes', 'single_15_no', 'single_15_yes'])}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-700/30 text-surface-300 hover:bg-surface-700/50 transition-all">
                Tất cả trụ đơn
              </button>
              <button onClick={() => setSelectedScenarios(['group_sD25', 'group_sD30', 'group_sD35'])}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-700/30 text-surface-300 hover:bg-surface-700/50 transition-all">
                Tất cả nhóm trụ
              </button>
              <button onClick={() => setSelectedScenarios(['single_078_no', 'single_078_yes'])}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-700/30 text-surface-300 hover:bg-surface-700/50 transition-all">
                Có lưới vs Không (I<sub>L</sub>=0,78)
              </button>
              <button onClick={() => setSelectedScenarios(EXPERIMENT_SCENARIOS.map(s => s.id))}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-700/30 text-surface-300 hover:bg-surface-700/50 transition-all">
                Chọn tất cả
              </button>
            </div>
          </div>

          {/* Custom comparison chart */}
          <CustomComparisonChart selectedIds={selectedScenarios} />
        </>
      )}

      {/* === PRESET COMPARISONS === */}
      {mode !== 'custom' && (
        <>
          {/* Summary table for group comparisons */}
          {['settlement', 'stress', 'n'].includes(mode) && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-surface-200 mb-3">Bảng tổng hợp so sánh <span className="label-en ml-2">Summary comparison</span></h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Chỉ tiêu</th>
                    <th>Đơn vị</th>
                    <th className="text-primary-400">s/D = 2,5</th>
                    <th className="text-accent-400">s/D = 3,0</th>
                    <th style={{ color: '#8d9bab' }}>s/D = 3,5</th>
                  </tr>
                </thead>
                <tbody>
                  {SETTLEMENT_COMPARISON.map((m, i) => (
                    <tr key={i}>
                      <td>
                        <div className="label-vi text-xs">{m.name}</div>
                        <div className="label-en">{m.nameEn}</div>
                      </td>
                      <td className="text-surface-400">{m.unit}</td>
                      <td className="font-mono text-primary-300">{m.values.sD_25}</td>
                      <td className="font-mono text-accent-300">{m.values.sD_30}</td>
                      <td className="font-mono" style={{ color: '#8d9bab' }}>{m.values.sD_35}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><div className="label-vi text-xs">n tại p=18 kPa</div></td>
                    <td>–</td>
                    <td className="font-mono text-primary-300">{GROUP_COLUMN_RESULTS[0].stressConcentration[0]}</td>
                    <td className="font-mono text-accent-300">{GROUP_COLUMN_RESULTS[1].stressConcentration[0]}</td>
                    <td className="font-mono" style={{ color: '#8d9bab' }}>{GROUP_COLUMN_RESULTS[2].stressConcentration[0]}</td>
                  </tr>
                  <tr>
                    <td><div className="label-vi text-xs">n tại p=120 kPa</div></td>
                    <td>–</td>
                    <td className="font-mono text-primary-300">{GROUP_COLUMN_RESULTS[0].stressConcentration[6]}</td>
                    <td className="font-mono text-accent-300">{GROUP_COLUMN_RESULTS[1].stressConcentration[6]}</td>
                    <td className="font-mono" style={{ color: '#8d9bab' }}>{GROUP_COLUMN_RESULTS[2].stressConcentration[6]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Comparison chart */}
          <div className="chart-container">
            {mode === 'settlement' && <CompChart field="settlement" ylabel="Độ lún S (mm)" title="So sánh độ lún theo s/D" reversed />}
            {mode === 'stress' && <CompChart field="columnStress" ylabel="σc (kPa)" title="So sánh ứng suất đỉnh trụ σc theo s/D" />}
            {mode === 'n' && <CompChart field="stressConcentration" ylabel="n = σc/σs" title="So sánh hệ số tập trung ứng suất n theo s/D" />}
            {mode === 'single_IL' && <SingleILComparison />}
            {mode === 'geogrid' && <GeogridComparison />}
          </div>

          {/* Insights */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-surface-200 mb-3">📊 Nhận xét <span className="label-en ml-2">Key insights</span></h3>
            <div className="space-y-2 text-sm text-surface-300">
              <p>• Khi s/D giảm từ 3,5 xuống 2,5, độ lún giảm <strong className="text-emerald-400">52,6%</strong> (17,32 → 8,21 mm tại p = 120 kPa).</p>
              <p>• Tốc độ lún theo tải giảm <strong className="text-emerald-400">55%</strong> (0,155 → 0,070 mm/kPa).</p>
              <p>• Hệ số n = <span className="sym">σ<sub>c</sub>/σ<sub>s</sub></span> giảm dần theo tải, dao động <strong className="text-primary-400">2,00 – 3,64</strong>.</p>
              <p>• Lực kéo lưới ĐKT tăng 21,8% khi s/D tăng từ 2,5 → 3,5.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ===== Custom comparison with scenario selection ===== */
function CustomComparisonChart({ selectedIds }: { selectedIds: string[] }) {
  const singleScenarios = EXPERIMENT_SCENARIOS.filter(s => s.type === 'single' && selectedIds.includes(s.id));
  const groupScenarios = EXPERIMENT_SCENARIOS.filter(s => s.type === 'group' && selectedIds.includes(s.id));

  if (selectedIds.length === 0) {
    return <div className="glass-card p-8 text-center text-surface-500 text-sm">Chọn ít nhất 1 kịch bản để so sánh</div>;
  }

  const lineColors = ['#4e7ab9', '#f5b731', '#6b7b8d', '#10b981', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899'];

  return (
    <div className="space-y-4">
      {/* Single column comparison */}
      {singleScenarios.length > 0 && (
        <div className="chart-container">
          <h4 className="text-sm font-semibold text-surface-200 mb-1">So sánh ứng suất – biến dạng trụ đơn</h4>
          <p className="text-xs text-surface-500 mb-4 italic">σ – ε relationship — Selected single column scenarios</p>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="epsilon" stroke="#64748b" type="number" allowDuplicatedCategory={false}
                label={{ value: 'Biến dạng ε (%)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' } }} />
              <YAxis stroke="#64748b"
                label={{ value: 'Ứng suất σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' } }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }} />
              {singleScenarios.map((sc, i) => {
                const result = SINGLE_COLUMN_RESULTS.find(r => r.IL === sc.IL && r.geogrid === sc.geogrid);
                if (!result) return null;
                const data = result.stressStrainCurve;
                return (
                  <Line key={sc.id} data={data} type="monotone" dataKey="sigma" stroke={lineColors[i % lineColors.length]}
                    strokeWidth={2.5} dot={{ r: 3.5 }} name={sc.name}
                    strokeDasharray={sc.geogrid === 'without_geogrid' ? '6 3' : undefined}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            {singleScenarios.map((sc, i) => {
              const r = SINGLE_COLUMN_RESULTS.find(x => x.IL === sc.IL && x.geogrid === sc.geogrid);
              if (!r) return null;
              return (
                <div key={sc.id} className="p-3 bg-surface-800/40 rounded-lg border-l-3" style={{ borderLeftColor: lineColors[i % lineColors.length], borderLeftWidth: 3 }}>
                  <div className="text-[10px] text-surface-500 truncate">{sc.name}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-lg font-bold" style={{ color: lineColors[i % lineColors.length] }}>{r.qult}</span>
                    <span className="text-xs text-surface-500">kPa</span>
                  </div>
                  <div className="text-[10px] text-surface-400 mt-0.5">
                    <span className="sym">q<sub>ult</sub></span> · <span className="sym">E<sub>50</sub></span> = {(r.E50 / 1000).toFixed(1)} MPa
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group column comparison */}
      {groupScenarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="chart-container">
            <h4 className="text-sm font-semibold text-surface-200 mb-1">Tải trọng – Độ lún</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" type="number" stroke="#64748b" allowDuplicatedCategory={false}
                  label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 } }} />
                <YAxis reversed stroke="#64748b"
                  label={{ value: 'S (mm)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {groupScenarios.map((sc, i) => {
                  const r = GROUP_COLUMN_RESULTS.find(x => x.sD === sc.sD);
                  if (!r) return null;
                  const data = PRESSURE_LEVELS.map((p, j) => ({ pressure: p, settlement: r.settlement[j] }));
                  return <Line key={sc.id} data={data} type="monotone" dataKey="settlement" stroke={lineColors[i % lineColors.length]} strokeWidth={2.5} dot={{ r: 3 }} name={sc.name} />;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h4 className="text-sm font-semibold text-surface-200 mb-1">Hệ số <span className="sym">n = σ<sub>c</sub>/σ<sub>s</sub></span></h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" type="number" stroke="#64748b" allowDuplicatedCategory={false}
                  label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 11 } }} />
                <YAxis stroke="#64748b"
                  label={{ value: 'n', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {groupScenarios.map((sc, i) => {
                  const r = GROUP_COLUMN_RESULTS.find(x => x.sD === sc.sD);
                  if (!r) return null;
                  const data = PRESSURE_LEVELS.map((p, j) => ({ pressure: p, n: r.stressConcentration[j] }));
                  return <Line key={sc.id} data={data} type="monotone" dataKey="n" stroke={lineColors[i % lineColors.length]} strokeWidth={2.5} dot={{ r: 3 }} name={sc.name} />;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Preset comparison charts ===== */
const UTC_COLORS = ['#4e7ab9', '#f5b731', '#6b7b8d'];

function CompChart({ field, ylabel, title, reversed }: { field: keyof typeof GROUP_COLUMN_RESULTS[0]; ylabel: string; title: string; reversed?: boolean }) {
  const data = PRESSURE_LEVELS.map((p, i) => ({
    pressure: p,
    ...Object.fromEntries(GROUP_COLUMN_RESULTS.map(r => [r.sD, (r[field] as number[])[i]])),
  }));
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">{title}</h4>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="pressure" stroke="#64748b" label={{ value: 'p (kPa)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' } }} />
          <YAxis reversed={reversed} stroke="#64748b" label={{ value: ylabel, angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }} />
          {GROUP_COLUMN_RESULTS.map((r, i) => <Line key={r.sD} type="monotone" dataKey={r.sD} stroke={UTC_COLORS[i]} strokeWidth={2.5} dot={{ r: 4 }} name={`s/D = ${r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}`} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function SingleILComparison() {
  const noGrid = SINGLE_COLUMN_RESULTS.filter(r => r.geogrid === 'without_geogrid');
  const data: Record<string, number>[] = [];
  for (let i = 0; i < 8; i++) {
    const pt: Record<string, number> = { epsilon: noGrid[0].stressStrainCurve[i].epsilon };
    noGrid.forEach(r => { pt[r.IL] = r.stressStrainCurve[i].sigma; });
    data.push(pt);
  }
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">So sánh trụ đơn theo trạng thái đất nền <span className="sym">I<sub>L</sub></span></h4>
      <p className="text-xs text-surface-500 mb-4 italic">Trụ đơn không lưới — Ảnh hưởng của I<sub>L</sub></p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="epsilon" stroke="#64748b" label={{ value: 'ε (%)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {noGrid.map((r, i) => <Line key={r.IL} type="monotone" dataKey={r.IL} stroke={UTC_COLORS[i]} strokeWidth={2.5} dot={{ r: 4 }} name={SOIL_STATES[r.IL].label + ' – ' + SOIL_STATES[r.IL].state} />)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function GeogridComparison() {
  const il078 = SINGLE_COLUMN_RESULTS.filter(r => r.IL === 'IL_078');
  const data: Record<string, number>[] = [];
  for (let i = 0; i < 8; i++) {
    const pt: Record<string, number> = { epsilon: il078[0].stressStrainCurve[i].epsilon };
    il078.forEach(r => { pt[r.geogrid] = r.stressStrainCurve[i].sigma; });
    data.push(pt);
  }
  return (
    <>
      <h4 className="text-sm font-semibold text-surface-200 mb-1">So sánh có lưới vs không lưới ĐKT (<span className="sym">I<sub>L</sub></span> = 0,78)</h4>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="epsilon" stroke="#64748b" label={{ value: 'ε (%)', position: 'bottom', offset: -5, style: { fill: '#94a3b8', fontSize: 12 } }} />
          <YAxis stroke="#64748b" label={{ value: 'σ (kPa)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="with_geogrid" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Có lưới ĐKT" />
          <Line type="monotone" dataKey="without_geogrid" stroke="#6b7280" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="5 3" name="Không lưới ĐKT" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
