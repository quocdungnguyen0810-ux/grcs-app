import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTER2 } from '../../lib/thesis/chapter2';
import { ExpandableSection, FormulaPanel, InsightBox, FigurePlaceholder } from '../../components/AcademicComponents';
import { BookOpen, Calculator, Layers, ArrowDownUp, Grid3x3, Atom, Box } from 'lucide-react';

const SUB_TABS = [
  { id: 'parameters', label: 'Thông số', icon: Calculator },
  { id: 'bearing_capacity', label: 'Sức chịu tải', icon: ArrowDownUp },
  { id: 'settlement', label: 'Dự báo lún', icon: Layers },
  { id: 'arching', label: 'Hiệu ứng vòm', icon: Grid3x3 },
  { id: 'membrane', label: 'Hiệu ứng màng', icon: Atom },
  { id: 'interaction', label: 'Tương tác', icon: Atom },
  { id: 'model_theory', label: 'Mô hình VL', icon: Box },
];

export default function TheoryTab() {
  const [activeSection, setActiveSection] = useState('parameters');
  const section = CHAPTER2.sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-accent-400" />
        <h2 className="section-title !mb-0">Cơ sở lý thuyết</h2>
        <span className="label-en">Theoretical Basis — Chapter 2</span>
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

      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}>

          {/* Parameters Section */}
          {activeSection === 'parameters' && section && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{section.title}</h3>
                <p className="label-en mb-4">{section.titleEn}</p>
                <div className="space-y-4">
                  {section.subsections?.map(sub => (
                    <ExpandableSection key={sub.id} title={sub.title} defaultOpen={sub.id === 'E50'}>
                      <div className="space-y-3">
                        <p className="text-sm text-surface-300">{sub.content}</p>
                        {'formula' in sub && sub.formula && <FormulaPanel formula={sub.formula as string} />}
                        {'values' in sub && Array.isArray(sub.values) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(sub.values as Array<Record<string, string>>).map((v, i) => (
                              <div key={i} className="p-3 bg-surface-800/50 rounded-lg text-xs">
                                {Object.entries(v).map(([k, val]) => (
                                  <div key={k}><span className="text-surface-500">{k}: </span><span className="text-surface-200">{val}</span></div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        {'keyInsight' in sub && sub.keyInsight && (
                          <InsightBox title="Nhận xét chính" variant="highlight">
                            <p>{sub.keyInsight as string}</p>
                          </InsightBox>
                        )}
                      </div>
                    </ExpandableSection>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bearing Capacity */}
          {activeSection === 'bearing_capacity' && section && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{section.title}</h3>
                <p className="label-en mb-4">{section.titleEn}</p>
                {section.subsections?.map(sub => (
                  <ExpandableSection key={sub.id} title={sub.title} defaultOpen>
                    <div className="space-y-3">
                      <p className="text-sm text-surface-300">{sub.content}</p>
                      {'formulas' in sub && Array.isArray(sub.formulas) && (sub.formulas as Array<{name:string; formula:string; note?:string}>).map((f, i) => (
                        <div key={i} className="p-3 bg-surface-800/50 rounded-lg">
                          <div className="text-xs text-accent-400 mb-1">{f.name}</div>
                          <div className="font-mono text-sm text-surface-100">{f.formula}</div>
                          {f.note && <div className="text-xs text-surface-500 mt-1">{f.note}</div>}
                        </div>
                      ))}
                      {'keyInsight' in sub && sub.keyInsight && (
                        <InsightBox title="Nhận xét" variant="highlight"><p>{sub.keyInsight as string}</p></InsightBox>
                      )}
                      <FigurePlaceholder id={sub.id === 'single_bc' ? 'Hình 2.1' : 'Hình 2.2'} title={sub.title} chapter={2} />
                    </div>
                  </ExpandableSection>
                ))}
              </div>
            </div>
          )}

          {/* Settlement */}
          {activeSection === 'settlement' && section && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{section.title}</h3>
                <p className="label-en mb-4">{section.titleEn}</p>
                {section.subsections?.map(sub => (
                  <ExpandableSection key={sub.id} title={sub.title} defaultOpen={sub.id === 'priebe'}>
                    <div className="space-y-3">
                      <p className="text-sm text-surface-300">{sub.content}</p>
                      {'formula' in sub && <FormulaPanel formula={sub.formula as string} description={'note' in sub ? sub.note as string : undefined} />}
                      {'keyInsight' in sub && sub.keyInsight && (
                        <InsightBox title="Kết quả thực nghiệm" variant="highlight"><p>{sub.keyInsight as string}</p></InsightBox>
                      )}
                    </div>
                  </ExpandableSection>
                ))}
              </div>
            </div>
          )}

          {/* Arching Effect */}
          {activeSection === 'arching' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER2.sections[3].title}</h3>
                <p className="label-en mb-4">{CHAPTER2.sections[3].titleEn}</p>
                <p className="text-sm text-surface-300 mb-4">{CHAPTER2.sections[3].content}</p>
                <FigurePlaceholder id="Hình 2.6" title="Cơ chế hình thành hiệu ứng vòm" chapter={2} />
                <div className="mt-4 space-y-2">
                  {CHAPTER2.sections[3].methods?.map((m, i) => (
                    <div key={i} className="p-3 bg-surface-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="utc-badge text-[10px]">{m.name}</span>
                        <span className="text-xs text-surface-400">{m.desc}</span>
                      </div>
                      <div className="font-mono text-xs text-accent-300">{m.formula}</div>
                    </div>
                  ))}
                </div>
                {'comparison' in CHAPTER2.sections[3] && (
                  <InsightBox title="Nhận xét so sánh" variant="highlight">
                    <p>{CHAPTER2.sections[3].comparison as string}</p>
                  </InsightBox>
                )}
              </div>
            </div>
          )}

          {/* Membrane Effect */}
          {activeSection === 'membrane' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER2.sections[4].title}</h3>
                <p className="label-en mb-4">{CHAPTER2.sections[4].titleEn}</p>
                <p className="text-sm text-surface-300 mb-4">{CHAPTER2.sections[4].content}</p>
                {CHAPTER2.sections[4].keyFormulas?.map((f, i) => (
                  <div key={i} className="mb-3"><FormulaPanel formula={f.formula} description={f.note} source={f.name} /></div>
                ))}
                <div className="p-4 bg-surface-800/50 rounded-xl">
                  <h4 className="text-xs font-medium text-accent-400 mb-2">Giá trị thực nghiệm</h4>
                  <ul className="space-y-1">
                    {CHAPTER2.sections[4].practicalValues?.map((v, i) => (
                      <li key={i} className="text-xs text-surface-300 flex gap-2"><span className="text-accent-500">▸</span>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Interaction */}
          {activeSection === 'interaction' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER2.sections[5].title}</h3>
                <p className="label-en mb-4">{CHAPTER2.sections[5].titleEn}</p>
                <p className="text-sm text-surface-300 mb-4">{CHAPTER2.sections[5].content}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CHAPTER2.sections[5].stages?.map((s, i) => (
                    <div key={i} className="p-4 bg-surface-800/50 rounded-xl text-center">
                      <div className="text-sm font-semibold text-surface-100 mb-1">{s.name}</div>
                      <div className="text-lg font-bold text-accent-400">{s.n_range}</div>
                      <div className="text-xs text-surface-500 mt-1">{s.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Model Theory */}
          {activeSection === 'model_theory' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-surface-100 mb-1">{CHAPTER2.sections[6].title}</h3>
                <p className="label-en mb-4">{CHAPTER2.sections[6].titleEn}</p>
                <p className="text-sm text-surface-300 mb-4">{CHAPTER2.sections[6].content}</p>
                {CHAPTER2.sections[6].comparison && (
                  <>
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">So sánh mô hình 1g và ly tâm</h4>
                    <table className="data-table mb-4">
                      <thead><tr><th>Tiêu chí</th><th>Mô hình 1g</th><th>Ly tâm</th></tr></thead>
                      <tbody>
                        {(CHAPTER2.sections[6].comparison as Array<Record<string, string>>).map((r, i) => (
                          <tr key={i}><td>{r.criterion}</td><td>{r.model_1g}</td><td>{r.centrifuge}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
                {CHAPTER2.sections[6].scaleFactors && (
                  <>
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">Hệ số tỷ lệ mô hình 1:20</h4>
                    <table className="data-table">
                      <thead><tr><th>Thông số</th><th>Hệ số tỷ lệ</th><th>Giá trị</th></tr></thead>
                      <tbody>
                        {(CHAPTER2.sections[6].scaleFactors as Array<Record<string, string>>).map((r, i) => (
                          <tr key={i}><td>{r.param}</td><td className="font-mono text-accent-400">{r.factor}</td><td>{r.value}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
