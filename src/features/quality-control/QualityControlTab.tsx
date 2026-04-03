import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ClipboardCheck, Shield, BarChart3, Ruler } from 'lucide-react';

const QC_ITEMS = [
  {
    category: 'Vật liệu đầu vào',
    categoryEn: 'Input Materials QC',
    icon: ClipboardCheck,
    items: [
      { param: 'Đất sét pha yếu', method: 'Thí nghiệm cắt cánh (Vane test)', target: 'c\u1D64 = 5–20 kPa tùy I_L', status: 'pass', note: 'Kiểm tra mỗi lô trộn, 3 mẫu/lô' },
      { param: 'Cát thạch anh (trụ)', method: 'Phân tích cỡ hạt + γ_d', target: 'd₅₀ = 0,3–0,5mm; γ_d ≥ 15,5 kN/m³', status: 'pass', note: 'Đầm chặt đạt D_r ≥ 70%' },
      { param: 'Cát đệm (đầm chặt)', method: 'Đầm Proctor cải tiến', target: 'K ≥ 0,95 γ_d max', status: 'pass', note: '200mm đáy + 100mm trên' },
      { param: 'Lưới ĐKT', method: 'Kéo giãn theo ASTM D6637', target: 'J = 100 kN/m ± 5%', status: 'pass', note: 'Kiểm tra 3 mẫu trước thi công' },
    ],
  },
  {
    category: 'Kích thước hình học',
    categoryEn: 'Geometric Dimensions',
    icon: Ruler,
    items: [
      { param: 'Đường kính trụ D', method: 'Thước kẹp kỹ thuật số', target: '40 ± 1 mm', status: 'pass', note: 'Kiểm tra đầu, giữa, chân trụ' },
      { param: 'Chiều dài trụ L', method: 'Thước dây', target: '600 ± 5 mm', status: 'pass', note: 'Đo sau khi thi công' },
      { param: 'Khoảng cách trụ s', method: 'Jig định vị', target: '100 / 120 / 140 mm ± 2mm', status: 'pass', note: 'Sai số < 2% cho phép' },
      { param: 'Đường kính thùng', method: 'Thước kẹp', target: '380 ± 2 mm (trụ đơn)', status: 'pass', note: 'Thùng tròn, ĐK trong' },
      { param: 'Chiều cao thùng', method: 'Thước dây', target: '1000 ± 5 mm', status: 'pass', note: 'Thùng trụ đơn' },
    ],
  },
  {
    category: 'Thiết bị đo',
    categoryEn: 'Instrumentation',
    icon: BarChart3,
    items: [
      { param: 'Load cell', method: 'Hiệu chuẩn tại PTN', target: 'Sai số ≤ 1% FS', status: 'pass', note: 'Dải đo 0–50 kN' },
      { param: 'LVDT (đo lún)', method: 'So sánh với đồng hồ đo', target: 'Sai số ≤ 0,01 mm', status: 'pass', note: '2 LVDT/thí nghiệm' },
      { param: 'Cảm biến áp lực đất', method: 'Hiệu chuẩn áp lực nước', target: 'Sai số ≤ 2% FS', status: 'pass', note: 'Đặt trên đỉnh trụ + giữa 2 trụ' },
      { param: 'Hệ thống thu thập dữ liệu', method: 'Kiểm tra tín hiệu', target: '≥ 1 Hz sampling', status: 'pass', note: 'Spider8 + HBM' },
    ],
  },
  {
    category: 'Quy trình thi công',
    categoryEn: 'Construction Process',
    icon: Shield,
    items: [
      { param: 'Độ thẳng đứng trụ', method: 'Ni-vô laser', target: 'Độ lệch < 1°', status: 'pass', note: 'Kiểm tra bằng jig' },
      { param: 'Vị trí lưới ĐKT', method: 'Đánh dấu + ảnh chụp', target: 'Nằm trên đỉnh trụ', status: 'pass', note: 'Kéo căng đều trước đổ cát' },
      { param: 'Độ bão hòa đất sét', method: 'Cân đo dung trọng', target: 'S_r ≥ 95%', status: 'pass', note: 'Trộn tại dung trọng mục tiêu' },
      { param: 'Lặp lại thí nghiệm', method: 'So sánh 2 lần thử', target: 'Δ < 10%', status: 'pass', note: 'Kịch bản chóng, 2 lần lặp' },
    ],
  },
];

const RELIABILITY_METRICS = [
  { label: 'Hệ số biến thiên (COV)', value: '< 8%', desc: 'Giữa các lần lặp thí nghiệm', color: '#10b981' },
  { label: 'R² (hiệu chỉnh mô hình số)', value: '0,92–0,97', desc: 'Plaxis 2D so với thực nghiệm', color: '#4e7ab9' },
  { label: 'Sai số trung bình SCT', value: '± 6,2%', desc: 'So với công thức đề xuất', color: '#f5b731' },
  { label: 'Số kịch bản thực hiện', value: '12', desc: '6 trụ đơn + 3 nhóm trụ + 3 tỷ lệ', color: '#8b5cf6' },
];

export default function QualityControlTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h2 className="section-title !mb-0">Kiểm soát & Đánh giá chất lượng mô hình</h2>
        <span className="label-en">Quality Control & Assessment</span>
      </div>

      {/* Reliability summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RELIABILITY_METRICS.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="stat-card">
            <span className="text-xs text-surface-500">{m.label}</span>
            <span className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</span>
            <span className="text-[10px] text-surface-600">{m.desc}</span>
          </motion.div>
        ))}
      </div>

      {/* QC Checklist */}
      {QC_ITEMS.map((group, gi) => (
        <motion.div key={gi} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}
          className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <group.icon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100">{group.category}</h3>
              <p className="text-xs text-surface-500">{group.categoryEn}</p>
            </div>
            <div className="ml-auto badge badge-green text-xs">
              {group.items.filter(it => it.status === 'pass').length}/{group.items.length} ĐẠT
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-lg border border-surface-700/50">
            <table className="w-full text-left text-xs bg-surface-900/50">
              <thead className="bg-surface-800/80 text-surface-300 uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2 font-medium">Thông số</th>
                  <th className="px-3 py-2 font-medium">Phương pháp kiểm tra</th>
                  <th className="px-3 py-2 font-medium">Tiêu chuẩn</th>
                  <th className="px-3 py-2 font-medium text-center">KQ</th>
                  <th className="px-3 py-2 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {group.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-800/30 transition-colors">
                    <td className="px-3 py-2 text-surface-200 font-medium">{item.param}</td>
                    <td className="px-3 py-2 text-surface-400">{item.method}</td>
                    <td className="px-3 py-2 text-surface-300 font-mono text-[10px]">{item.target}</td>
                    <td className="px-3 py-2 text-center">
                      {item.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-surface-500 text-[10px]">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}

      {/* Assessment summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-6 border-l-4 border-emerald-500">
        <h3 className="text-sm font-bold text-surface-100 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Kết luận đánh giá chất lượng
        </h3>
        <div className="space-y-2 text-sm text-surface-300">
          <p>Toàn bộ <strong className="text-surface-100">20 thông số kiểm soát</strong> đều đạt yêu cầu. Mô hình vật lý tỷ lệ 1:20 đáp ứng các tiêu chuẩn:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-surface-400">
            <li>Vật liệu đầu vào được kiểm tra 100% trước thi công</li>
            <li>Kích thước hình học sai số &lt; 2% so với thiết kế</li>
            <li>Thiết bị đo được hiệu chuẩn đầy đủ tại PTN</li>
            <li>Quy trình thi công tuân thủ nghiêm ngặt, có ảnh chụp lưu trữ</li>
            <li>Kết quả lặp lại với COV &lt; 8%, đảm bảo độ tin cậy thống kê</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
