import { useState } from 'react';
import { motion } from 'framer-motion';
import { SINGLE_COLUMN_RESULTS, GROUP_COLUMN_RESULTS, PROPOSED_FORMULAS, PRESSURE_LEVELS } from '../../lib/data';
import { CHAPTER4 } from '../../lib/thesis/chapter4';
import { ExpandableSection, FormulaPanel, InsightBox } from '../../components/AcademicComponents';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart3, GitCompare, FlaskConical, Calculator } from 'lucide-react';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function InsightsTab() {
  const [activeSection, setActiveSection] = useState<'summary' | 'single' | 'group' | 'params' | 'application'>('summary');

  // Computed insights
  const qultMax = Math.max(...SINGLE_COLUMN_RESULTS.map(r => r.qult));
  const qultMin = Math.min(...SINGLE_COLUMN_RESULTS.map(r => r.qult));
  const e50Max = Math.max(...SINGLE_COLUMN_RESULTS.map(r => r.E50));
  const e50Min = Math.min(...SINGLE_COLUMN_RESULTS.map(r => r.E50));
  const settlementMin = GROUP_COLUMN_RESULTS[0].settlement[6];
  const settlementMax = GROUP_COLUMN_RESULTS[2].settlement[6];
  const nRange = { min: 2.0, max: 3.64 };

  const geogridEffect = SINGLE_COLUMN_RESULTS.reduce((acc, r, _i, arr) => {
    if (r.geogrid === 'with_geogrid') {
      const noGrid = arr.find(x => x.IL === r.IL && x.geogrid === 'without_geogrid');
      if (noGrid) acc.push({ IL: r.IL, delta: ((r.qult - noGrid.qult) / noGrid.qult * 100) });
    }
    return acc;
  }, [] as { IL: string; delta: number }[]);

  const SUB_TABS = [
    { id: 'summary', label: 'Tổng kết', icon: Lightbulb },
    { id: 'single', label: 'Trụ đơn', icon: BarChart3 },
    { id: 'group', label: 'Nhóm trụ', icon: GitCompare },
    { id: 'params', label: 'Phân tích tham số', icon: Calculator },
    { id: 'application', label: 'Áp dụng', icon: FlaskConical },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Lightbulb className="w-5 h-5 text-accent-400" />
        <h2 className="section-title !mb-0">Phân tích ứng xử</h2>
        <span className="label-en">Behavior Analysis — Chapter 4</span>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-1 bg-surface-800/50 p-1 rounded-xl">
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            className={`tab-button text-xs flex items-center gap-1.5 ${activeSection === t.id ? 'active' : ''}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* === SUMMARY === */}
      {activeSection === 'summary' && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="stat-card">
              <span className="text-xs text-surface-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /><span className="sym">q<sub>ult</sub></span> cao nhất</span>
              <span className="text-2xl font-bold text-emerald-400">{qultMax}</span>
              <span className="text-xs text-surface-500">kPa (<span className="sym">I<sub>L</sub></span>=0,78, có lưới)</span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-surface-500 flex items-center gap-1"><TrendingDown className="w-3 h-3" /><span className="sym">q<sub>ult</sub></span> thấp nhất</span>
              <span className="text-2xl font-bold text-red-400">{qultMin}</span>
              <span className="text-xs text-surface-500">kPa (<span className="sym">I<sub>L</sub></span>=1,5, ko lưới)</span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-surface-500"><span className="sym">E<sub>50</sub></span> phạm vi</span>
              <span className="text-xl font-bold text-blue-400">{(e50Min / 1000).toFixed(0)}–{(e50Max / 1000).toFixed(0)}</span>
              <span className="text-xs text-surface-500">MPa</span>
            </div>
            <div className="stat-card">
              <span className="text-xs text-surface-500">n phạm vi</span>
              <span className="text-xl font-bold text-purple-400">{nRange.min}–{nRange.max}</span>
              <span className="text-xs text-surface-500">— phù hợp 2,5–5 (FHWA)</span>
            </div>
          </div>

          {/* Proposed formulas */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Công thức đề xuất <span className="label-en ml-2">Proposed Formulas</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-surface-800/50 rounded-xl border border-surface-700/30">
                <div className="text-xs text-surface-500 mb-2">{PROPOSED_FORMULAS.qult_no_geogrid.description}</div>
                <FormulaPanel formula={PROPOSED_FORMULAS.qult_no_geogrid.formula} />
                <div className="text-xs text-surface-400 mt-2"><span className="sym">N<sub>c</sub></span> = {PROPOSED_FORMULAS.qult_no_geogrid.Nc} (hồi quy, R² = {CHAPTER4.singleColumnBehavior.axialCapacity.formulas.noGeogrid.R2})</div>
                <div className="text-xs text-surface-500 mt-1 italic">Phù hợp <span className="sym">N<sub>c</sub></span>=18–22 (FHWA)</div>
              </div>
              <div className="p-5 bg-emerald-900/20 rounded-xl border border-emerald-700/30">
                <div className="text-xs text-emerald-400 mb-2">{PROPOSED_FORMULAS.qult_with_geogrid.description}</div>
                <FormulaPanel formula={PROPOSED_FORMULAS.qult_with_geogrid.formula} />
                <div className="text-xs text-surface-400 mt-2"><span className="sym">N<sub>c</sub></span> = {PROPOSED_FORMULAS.qult_with_geogrid.Nc} (hồi quy, R² = {CHAPTER4.singleColumnBehavior.axialCapacity.formulas.withGeogrid.R2})</div>
                <div className="text-xs text-emerald-500 mt-1">Tăng {((PROPOSED_FORMULAS.qult_with_geogrid.Nc / PROPOSED_FORMULAS.qult_no_geogrid.Nc - 1) * 100).toFixed(1)}% so với không lưới</div>
              </div>
            </div>
          </div>

          {/* Key findings */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4">📊 Phát hiện chính từ thực nghiệm</h3>
            <div className="space-y-4">
              <InsightCard icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} title="Hiệu quả lưới ĐKT tăng khi đất yếu"
                content={`Khi IL tăng từ 0,78 → 1,5, hiệu quả cải thiện SCT nhờ lưới ĐKT tăng từ ${geogridEffect[0]?.delta.toFixed(1)}% lên ${geogridEffect[2]?.delta.toFixed(1)}%. Lý do: đất yếu không cung cấp đủ áp lực bó hông, lưới đóng vai trò thay thế.`}
                badge="Geogrid" badgeColor="badge-green" />
              <InsightCard icon={<TrendingDown className="w-4 h-4 text-red-400" />} title={<>E<sub>50</sub> nhạy cảm hơn q<sub>ult</sub> với I<sub>L</sub></>}
                content={<>E<sub>50</sub> giảm 81% khi I<sub>L</sub> từ 0,78→1,5 (21 → 4 MPa), trong khi q<sub>ult</sub> chỉ giảm 61% (378 → 148 kPa). Cho thấy độ cứng trụ nhạy cảm hơn sức chịu tải với trạng thái đất nền.</>}
                badge="Stiffness" badgeColor="badge-red" />
              <InsightCard icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="Tỷ lệ s/D = 2,5–3,0 là tối ưu"
                content={`Giảm s/D từ 3,5 → 2,5: độ lún giảm 52,6% (${settlementMax} → ${settlementMin} mm). Tuy nhiên n chỉ chênh lệch < 15% giữa các tỷ lệ s/D, cho thấy hiệu ứng tập trung ứng suất tương đối ổn định.`}
                badge="s/D" badgeColor="badge-amber" />
              <InsightCard icon={<CheckCircle2 className="w-4 h-4 text-blue-400" />} title="Độ cứng lưới tối ưu J = 3000 kN/m"
                content="Trên mô hình số, J = 3000 kN/m cho hệ số n cao nhất. J quá cao (>5000 kN/m) → lưới không biến dạng đủ → hiệu ứng màng không phát huy."
                badge="Optimal" badgeColor="badge-blue" />
            </div>
          </div>

          {/* Conclusions */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-400" />Kết luận chính
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CHAPTER4.conclusions.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-surface-800/40 rounded-lg text-xs text-surface-300">
                  <span className="text-accent-400 font-bold shrink-0">{i + 1}.</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* === SINGLE COLUMN === */}
      {activeSection === 'single' && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER4.singleColumnBehavior.title}</h3>
            <p className="label-en mb-4">Single Column Behavior</p>

            {/* Axial capacity */}
            <ExpandableSection title={CHAPTER4.singleColumnBehavior.axialCapacity.title} defaultOpen>
              <p className="text-sm text-surface-300 mb-3">{CHAPTER4.singleColumnBehavior.axialCapacity.content}</p>

              {/* Results table */}
              <table className="data-table mb-4">
                <thead>
                  <tr>
                    <th>IL</th>
                    <th><span className="sym">q<sub>ult</sub></span> (không lưới)</th>
                    <th><span className="sym">q<sub>ult</sub></span> (có lưới)</th>
                    <th>Cải thiện (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAPTER4.singleColumnBehavior.axialCapacity.results.map((r, i) => (
                    <tr key={i}>
                      <td className="font-semibold">{r.IL}</td>
                      <td className="font-mono text-surface-300">{r.noGeogrid} kPa</td>
                      <td className="font-mono text-emerald-400">{r.withGeogrid} kPa</td>
                      <td className="font-mono text-accent-400">+{r.improvement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Interpretation */}
              <InsightBox title="Nhận xét" variant="highlight">
                <ul className="space-y-1 mt-1">
                  {CHAPTER4.singleColumnBehavior.axialCapacity.interpretation.map((item, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-accent-500 mt-0.5">▸</span>{item}
                    </li>
                  ))}
                </ul>
              </InsightBox>
            </ExpandableSection>
          </div>

          {/* E50 Analysis */}
          <div className="glass-card p-6">
            <ExpandableSection title={CHAPTER4.singleColumnBehavior.E50Analysis.title} defaultOpen>
              <p className="text-sm text-surface-300 mb-3">{CHAPTER4.singleColumnBehavior.E50Analysis.content}</p>

              {/* E50 Results */}
              <table className="data-table mb-4">
                <thead>
                  <tr>
                    <th>IL</th>
                    <th>E₅₀ (không lưới)</th>
                    <th>E₅₀ (có lưới)</th>
                    <th>Đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAPTER4.singleColumnBehavior.E50Analysis.results.map((r, i) => (
                    <tr key={i}>
                      <td className="font-semibold">{r.IL}</td>
                      <td className="font-mono text-surface-300">{r.noGeogrid}</td>
                      <td className="font-mono text-emerald-400">{r.withGeogrid}</td>
                      <td className="text-surface-500">{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Comparison with other studies — Bảng 4.3 */}
              <h4 className="text-xs font-semibold text-accent-400 mb-2 mt-4">So sánh E₅₀ với nghiên cứu khác (Bảng 4.3)</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nghiên cứu</th>
                    <th>Phạm vi E₅₀</th>
                    <th>Điều kiện</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAPTER4.singleColumnBehavior.E50Analysis.comparison.map((c, i) => (
                    <tr key={i}>
                      <td className="font-medium">{c.study}</td>
                      <td className="font-mono text-primary-400">{c.range}</td>
                      <td className="text-surface-400">{c.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ExpandableSection>
          </div>
        </motion.div>
      )}

      {/* === GROUP COLUMN === */}
      {activeSection === 'group' && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER4.groupColumnBehavior.title}</h3>
            <p className="label-en mb-4">Group Column Behavior</p>

            {/* Settlement */}
            <ExpandableSection title={CHAPTER4.groupColumnBehavior.settlement.title} defaultOpen>
              <table className="data-table mb-3">
                <thead>
                  <tr>
                    <th>s/D</th>
                    <th>as (%)</th>
                    <th>S tại 120 kPa</th>
                    <th>Tốc độ lún</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAPTER4.groupColumnBehavior.settlement.keyResults.map((r, i) => (
                    <tr key={i}>
                      <td className="font-semibold">{r.sD}</td>
                      <td className="text-primary-400">{r.as}</td>
                      <td className="font-mono text-blue-400">{r.s120}</td>
                      <td className="text-surface-400">{r.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <InsightBox title="Nhận xét" variant="highlight">
                <p className="text-xs">Giảm s/D từ 3,5 → 2,5: lún giảm {((17.32 - 8.21) / 17.32 * 100).toFixed(1)}%. Diện tích thay thế as tăng gấp 2×.</p>
              </InsightBox>
            </ExpandableSection>
          </div>

          <div className="glass-card p-6">
            <ExpandableSection title={CHAPTER4.groupColumnBehavior.stressConcentration.title} defaultOpen>
              <p className="text-sm text-surface-300 mb-3">{CHAPTER4.groupColumnBehavior.stressConcentration.content}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {CHAPTER4.groupColumnBehavior.stressConcentration.interpretation.map((item, i) => (
                  <div key={i} className="p-3 bg-surface-800/50 rounded-lg text-xs text-surface-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* n values per s/D from real data */}
              <table className="data-table">
                <thead>
                  <tr>
                    <th>s/D</th>
                    {PRESSURE_LEVELS.map(p => <th key={p}>{p} kPa</th>)}
                  </tr>
                </thead>
                <tbody>
                  {GROUP_COLUMN_RESULTS.map(r => (
                    <tr key={r.sD}>
                      <td className="font-semibold">{r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}</td>
                      {r.stressConcentration.map((n, i) => (
                        <td key={i} className={`font-mono text-xs ${n >= 3 ? 'text-emerald-400' : n >= 2.5 ? 'text-blue-400' : 'text-surface-300'}`}>
                          {n.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ExpandableSection>
          </div>
        </motion.div>
      )}

      {/* === PARAMETER ANALYSIS === */}
      {activeSection === 'params' && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER4.parameterAnalysis.title}</h3>
            <p className="label-en mb-4">Parameter Influence Analysis — Plaxis 3D</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHAPTER4.parameterAnalysis.parameters.map((param, i) => (
                <div key={i} className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="utc-badge">{param.name}</span>
                    <span className="text-xs text-surface-500">{param.source}</span>
                  </div>
                  <p className="text-sm text-surface-300">{param.influence}</p>
                </div>
              ))}
            </div>

            <InsightBox title="Tổng hợp ảnh hưởng" variant="highlight">
              <ul className="space-y-1 mt-1">
                <li className="text-xs flex items-start gap-2"><span className="text-accent-500">▸</span>Ec tăng → n tăng: trụ cứng hơn hút tải nhiều hơn</li>
                <li className="text-xs flex items-start gap-2"><span className="text-accent-500">▸</span>Es tăng → n giảm: đất nền cứng hơn chia tải đều hơn</li>
                <li className="text-xs flex items-start gap-2"><span className="text-accent-500">▸</span>J tối ưu ≈ 3000 kN/m: quá cao → lưới không biến dạng → hiệu ứng màng kém</li>
                <li className="text-xs flex items-start gap-2"><span className="text-accent-500">▸</span>s/D tăng → n tăng nhẹ nhưng lún tăng mạnh → cần cân bằng</li>
              </ul>
            </InsightBox>
          </div>
        </motion.div>
      )}

      {/* === APPLICATION === */}
      {activeSection === 'application' && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          {/* Application example */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-200 mb-3 flex items-center gap-2">
              🏗️ Ví dụ áp dụng thực tế
            </h3>
            <div className="text-sm text-surface-300 space-y-3">
              <div className="p-4 bg-surface-800/40 rounded-xl">
                <p><strong className="text-surface-100">Công trình:</strong> Đường Ven Sông Lam — Đô Lương, Nghệ An (Km1+200 – Km2+300)</p>
                <p className="mt-1"><strong className="text-surface-100">Thiết kế:</strong> D=0,8m, L=12m, s/D=3,0 (s=2,4m), lưới ĐKT 100 kN/m</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/30">
                  <div className="text-xs text-surface-500 mb-1"><span className="sym">q<sub>ult</sub></span> (có lưới ĐKT)</div>
                  <div className="text-2xl font-bold text-emerald-400">{(21.208 * 15).toFixed(0)} kPa</div>
                  <div className="text-xs text-surface-500 mt-1">= 21,208 × 15 kPa (<span className="sym">N<sub>c</sub></span> × <span className="sym">c<sub>u</sub></span>)</div>
                </div>
                <div className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/30">
                  <div className="text-xs text-surface-500 mb-1"><span className="sym">q<sub>ult</sub></span> (không lưới)</div>
                  <div className="text-2xl font-bold text-blue-400">{(18.312 * 15).toFixed(0)} kPa</div>
                  <div className="text-xs text-surface-500 mt-1">= 18,312 × 15 kPa (<span className="sym">N<sub>c</sub></span> × <span className="sym">c<sub>u</sub></span>)</div>
                </div>
              </div>
              <InsightBox title="Hiệu quả" variant="highlight">
                <p className="text-xs">Lưới ĐKT tăng SCT {((318.12 / 274.68 - 1) * 100).toFixed(1)}%. Với FS = 2,0 → q cho phép = 159 kPa (có lưới) vs 137 kPa (không lưới).</p>
              </InsightBox>
            </div>
          </div>

          {/* Scope & limitations */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />Giới hạn áp dụng
            </h3>
            <ul className="space-y-2 text-sm text-surface-400">
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">▸</span>Kết quả trên mô hình 1g, cần scale correction khi áp dụng thực tế</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">▸</span>Chỉ nền đất 1 lớp đồng nhất, cần nghiên cứu thêm với nền phân lớp</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">▸</span>Công thức đề xuất áp dụng cho IL &gt; 0,75</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">▸</span>E₅₀ từ mô hình (4–25 MPa) thấp hơn hiện trường Long Sơn (25–70 MPa) do điều kiện đất nền khác nhau</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">▸</span>MHVL phù hợp Plaxis 3D, sai lệch &lt;10% — cho phép mở rộng nghiên cứu bằng mô hình số</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InsightCard({ icon, title, content, badge, badgeColor }: { icon: React.ReactNode; title: React.ReactNode; content: React.ReactNode; badge: string; badgeColor: string }) {
  return (
    <div className="p-4 bg-surface-800/40 rounded-xl border border-surface-700/30">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold text-surface-100 flex-1">{title}</h4>
        <span className={`badge ${badgeColor}`}>{badge}</span>
      </div>
      <p className="text-xs text-surface-400 leading-relaxed">{content}</p>
    </div>
  );
}
