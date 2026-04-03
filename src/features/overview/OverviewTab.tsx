import { motion } from 'framer-motion';
import { THESIS_INFO } from '../../lib/data';
import { CHAPTER1 } from '../../lib/thesis/chapter1';
import { ExpandableSection, InsightBox, ChapterCard } from '../../components/AcademicComponents';
import {
  BookOpen, Target, Microscope, Lightbulb, ArrowRight, Globe, AlertTriangle,
  Layers, FlaskConical, CheckCircle2, XCircle
} from 'lucide-react';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function OverviewTab() {

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
        className="utc-hero p-8 text-center relative">
        <div className="relative z-10">
          <span className="utc-badge mb-4">Luận án Tiến sĩ Kỹ thuật – {THESIS_INFO.year}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-100 mb-3 leading-snug max-w-4xl mx-auto">
            {THESIS_INFO.title}
          </h1>
          <p className="text-surface-400 text-sm italic max-w-3xl mx-auto mb-4">{THESIS_INFO.titleEn}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-surface-300">
            <span className="font-semibold text-accent-400">{THESIS_INFO.author}</span>
            <span>•</span>
            <span>{THESIS_INFO.university}</span>
          </div>
          <div className="mt-2 text-xs text-surface-500">
            Hướng dẫn: {THESIS_INFO.advisors.join(' & ')}
          </div>
        </div>
      </motion.div>

      {/* Bối cảnh nghiên cứu - Chapter 1 */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <ChapterCard chapter={1} title={CHAPTER1.background.title} titleEn="Research Background">
          <p className="text-sm text-surface-300 leading-relaxed mb-4">{CHAPTER1.background.content}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {CHAPTER1.background.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-surface-800/40 rounded-lg text-xs text-surface-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </ChapterCard>
      </motion.div>

      {/* Đất yếu trong CTGT */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
        <ExpandableSection
          title={CHAPTER1.softSoilContext.title}
          icon={<Layers className="w-4 h-4 text-earth-light" />}
          defaultOpen={false}
        >
          <p className="text-sm text-surface-300 leading-relaxed mb-4">{CHAPTER1.softSoilContext.content}</p>

          {/* Characteristics table */}
          <div className="overflow-x-auto mb-4">
            <table className="data-table text-xs">
              <thead>
                <tr>
                  <th>Chỉ tiêu</th>
                  <th>Rất yếu</th>
                  <th>Yếu</th>
                  <th>TCCS</th>
                </tr>
              </thead>
              <tbody>
                {CHAPTER1.softSoilContext.characteristics.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium">{c.name}</td>
                    <td className="text-red-400">{c['rất_yếu']}</td>
                    <td className="text-amber-400">{c.yếu}</td>
                    <td className="text-surface-400">{c.TCCS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Classification */}
          <h4 className="text-xs font-semibold text-surface-300 mb-2 uppercase tracking-wider">Phân loại đất yếu</h4>
          <div className="space-y-2">
            {CHAPTER1.softSoilContext.classification.map((cls, i) => (
              <div key={i} className="p-3 bg-surface-800/40 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="utc-badge text-[10px]">{cls.group}</span>
                </div>
                <div className="text-xs text-surface-400"><span className="text-surface-500">Đặc trưng: </span>{cls.chars}</div>
                <div className="text-xs text-emerald-400/80 mt-0.5"><span className="text-surface-500">Giải pháp: </span>{cls.solution}</div>
              </div>
            ))}
          </div>
        </ExpandableSection>
      </motion.div>

      {/* GRCS Overview */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <ExpandableSection
          title={CHAPTER1.grcsOverview.title}
          icon={<Globe className="w-4 h-4 text-primary-400" />}
          defaultOpen={false}
        >
          <p className="text-sm text-surface-300 leading-relaxed mb-4">{CHAPTER1.grcsOverview.content}</p>

          {/* Advantages */}
          <h4 className="text-xs font-semibold text-accent-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />Ưu điểm nổi bật
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-4">
            {CHAPTER1.grcsOverview.advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-surface-300 p-2 bg-emerald-900/10 rounded-lg">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                <span>{adv}</span>
              </div>
            ))}
          </div>

          {/* International applications */}
          <h4 className="text-xs font-semibold text-primary-400 mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />Ứng dụng quốc tế
          </h4>
          <div className="space-y-1.5">
            {CHAPTER1.grcsOverview.applications.map((app, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-surface-800/30 rounded-lg text-xs">
                <span className="font-semibold text-accent-400 min-w-[80px]">{app.country}</span>
                <span className="text-surface-400">{app.detail}</span>
              </div>
            ))}
          </div>
        </ExpandableSection>
      </motion.div>

      {/* Mục tiêu nghiên cứu + Phạm vi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.25 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-600/20"><Target className="w-5 h-5 text-primary-400" /></div>
            <h2 className="section-title !mb-0">Mục tiêu nghiên cứu</h2>
          </div>
          <div className="space-y-3">
            {CHAPTER1.objectives.map((obj) => (
              <div key={obj.id} className="flex gap-3 p-3 bg-surface-800/40 rounded-xl">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                  {obj.id}
                </div>
                <p className="text-sm text-surface-300 leading-relaxed">{obj.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-600/20"><Microscope className="w-5 h-5 text-emerald-400" /></div>
            <h2 className="section-title !mb-0">Phạm vi nghiên cứu</h2>
          </div>
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">Phương pháp</h4>
            {CHAPTER1.scope.methods.map((m, i) => (
              <p key={i} className="text-sm text-surface-300 flex items-start gap-2 mb-1">
                <FlaskConical className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" />{m}
              </p>
            ))}
          </div>
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">Điều kiện biên</h4>
            {CHAPTER1.scope.conditions.map((c, i) => (
              <p key={i} className="text-xs text-surface-300 flex items-start gap-2 mb-1">
                <span className="text-emerald-500 shrink-0">▸</span>{c}
              </p>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />Giới hạn
            </h4>
            {CHAPTER1.scope.limitations.map((l, i) => (
              <p key={i} className="text-xs text-surface-400 flex items-start gap-2 mb-1">
                <XCircle className="w-3 h-3 text-amber-500/60 shrink-0 mt-0.5" />{l}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Research Gaps */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.35 }}>
        <ExpandableSection
          title={CHAPTER1.researchGaps.title}
          icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightBox title={CHAPTER1.researchGaps.singleColumn.title} variant="warning">
              <ul className="space-y-2 mt-2">
                {CHAPTER1.researchGaps.singleColumn.gaps.map((g, i) => (
                  <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">⚠</span>{g}
                  </li>
                ))}
              </ul>
            </InsightBox>
            <InsightBox title={CHAPTER1.researchGaps.groupColumn.title} variant="warning">
              <ul className="space-y-2 mt-2">
                {CHAPTER1.researchGaps.groupColumn.gaps.map((g, i) => (
                  <li key={i} className="text-xs text-surface-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">⚠</span>{g}
                  </li>
                ))}
              </ul>
            </InsightBox>
          </div>
        </ExpandableSection>
      </motion.div>

      {/* Đóng góp mới */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-600/20"><Lightbulb className="w-5 h-5 text-amber-400" /></div>
          <h2 className="section-title !mb-0">Đóng góp mới của luận án</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHAPTER1.contributions.map((item) => (
            <div key={item.num} className="p-5 bg-surface-800/50 rounded-xl border border-surface-700/30 hover:border-accent-400/30 transition-colors">
              <div className="text-3xl font-bold text-primary-600/30 mb-2">{item.num}</div>
              <h3 className="font-semibold text-surface-100 mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Luồng nghiên cứu — Approach */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.45 }} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-600/20"><BookOpen className="w-5 h-5 text-purple-400" /></div>
          <h2 className="section-title !mb-0">{CHAPTER1.approach.title}</h2>
        </div>

        {/* 4-step approach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {CHAPTER1.approach.steps.map((step) => (
            <div key={step.step} className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/30 text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-accent-400/15 flex items-center justify-center text-sm font-bold text-accent-400 mb-2">
                {step.step}
              </div>
              <div className="text-sm font-semibold text-surface-100 mb-1">{step.name}</div>
              <div className="text-xs text-surface-400">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* 6 methods flow */}
        <h4 className="text-xs font-semibold text-surface-400 mb-3 uppercase tracking-wider">Phương pháp nghiên cứu</h4>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {CHAPTER1.approach.methods.map((method, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="px-3 py-2 bg-surface-800 border border-surface-700/50 rounded-lg text-center text-surface-200 min-w-[100px]">
                <div className="font-semibold text-accent-400/80 mb-0.5">{method.name}</div>
                <div className="text-surface-400 text-[10px]">{method.desc}</div>
              </div>
              {i < CHAPTER1.approach.methods.length - 1 && <ArrowRight className="w-4 h-4 text-surface-600 shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
