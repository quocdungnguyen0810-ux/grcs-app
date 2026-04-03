import { Target, Scale, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelBasisTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Cơ sở lựa chọn mô hình</h2>
          <p className="text-surface-400">
            Cơ sở lý thuyết, lựa chọn tỷ lệ và đánh giá độ tin cậy của mô hình vật lý
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Cơ sở lý thuyết */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-100">1. Cơ sở lý thuyết mô hình vật lý</h3>
          </div>
          <div className="space-y-3 text-sm text-surface-300">
            <p>
              Mô hình vật lý là phương pháp nghiên cứu phổ biến trong địa kỹ thuật, cho phép mô phỏng ứng xử của công trình dưới các điều kiện có thể kiểm soát. Việc thiết lập mô hình vật lý phải tuân thủ các quy luật tương tự (similarity rules) giữa mô hình (model) và nguyên mẫu (prototype).
            </p>
            <p>
              Đối với bài toán sức chịu tải và lún của nền đất yếu gia cố trụ VLHR kết hợp lưới ĐKT, ứng xử phụ thuộc nhiều vào trạng thái ứng suất nội tại. Tuy nhiên, việc tạo hình ở môi trường trọng trường tiêu chuẩn (1g) với vật liệu thực gặp khó khăn trong việc đáp ứng tiêu chuẩn tương tự về ứng suất.
            </p>
            <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-700/50">
              <strong className="text-accent-400">Điều kiện lý tưởng:</strong> Cần sử dụng máy ly tâm (Centrifuge) để tăng gia tốc trọng trường $ng$, tạo ứng suất tương đương nguyên mẫu.
            </div>
          </div>
        </motion.div>

        {/* Section 2: Lựa chọn loại mô hình */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-100">2. Lựa chọn loại mô hình</h3>
          </div>
          <div className="space-y-3 text-sm text-surface-300">
            <p>
              Dựa trên điều kiện trang thiết bị thí nghiệm hiện có tại Việt Nam (hạn chế về máy ly tâm cỡ lớn), nghiên cứu quyết định lựa chọn <strong className="text-surface-100">mô hình trọng lực 1g (1g gravity model)</strong>.
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Ưu điểm:</strong> Chế tạo dễ dàng, chi phí thấp, cho phép quan sát trực tiếp các hiện tượng phá hoại (phình nở trụ, hiệu ứng màng của lưới), dễ bố trí cảm biến kích thước thực.</li>
              <li><strong>Nhược điểm:</strong> Ứng suất tại một độ sâu trong mô hình nhỏ hơn so với nguyên mẫu (do quy mô hình học giảm), dẫn đến ứng xử biến dạng có thể không tuyến tính hoàn toàn tương đương.</li>
            </ul>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-100">
              Mục tiêu chính là <strong>nghiên cứu định tính cơ chế làm việc, hiệu ứng nhóm, và cơ chế truyền tải trọng</strong>, kết hợp với mô hình số để kiểm chứng và mở rộng. Do đó, mô hình 1g là phù hợp với mục tiêu và giới hạn của luận án.
            </div>
          </div>
        </motion.div>

        {/* Section 3: Lựa chọn tỷ lệ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500/10 rounded-xl">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-100">3. Lựa chọn tỷ lệ mô hình</h3>
          </div>
          <div className="space-y-3 text-sm text-surface-300">
            <p>Tỷ lệ hình học được chọn là <strong>N = 20</strong> (1:20). Các thông số được quy đổi theo nguyên tắc tương tự:</p>
            
            <div className="relative overflow-x-auto rounded-lg border border-surface-700/50">
              <table className="w-full text-left text-xs bg-surface-900/50">
                <thead className="bg-surface-800/80 text-surface-300 uppercase">
                  <tr>
                    <th className="px-4 py-2 font-medium">Thông số</th>
                    <th className="px-4 py-2 font-medium text-center">Tỷ lệ quy đổi</th>
                    <th className="px-4 py-2 font-medium text-right">Nguyên mẫu</th>
                    <th className="px-4 py-2 font-medium text-right text-accent-400">Mô hình 1:20</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-700/50">
                  {[
                    ['Chiều dày đất yếu (H)', '1 / N', '12000 mm', '600 mm'],
                    ['Đường kính trụ (D)', '1 / N', '800 mm', '40 mm'],
                    ['Chiều dài trụ (L)', '1 / N', '12000 mm', '600 mm'],
                    ['Khoảng cách trụ (s)', '1 / N', '2000 mm (2.5D)', '100 mm'],
                    ['Độ cứng lưới ĐKT (J)', '1 / N²', '1667 kN/m', '83.4 kN/m (*)'],
                    ['Tải trọng phân bố (q)', '1 / 1', '12 kPa', '12 kPa'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-2 text-surface-200">{row[0]}</td>
                      <td className="px-4 py-2 text-surface-400 text-center font-mono">{row[1]}</td>
                      <td className="px-4 py-2 text-surface-200 text-right">{row[2]}</td>
                      <td className="px-4 py-2 text-accent-400 font-medium text-right">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-surface-400 italic">
              (*) Do giới hạn vật liệu thực tế, lưới ĐKT dùng trong mô hình có J ≈ 100 kN/m, phù hợp với tỷ lệ mô hình 1:20.
            </p>
          </div>
        </motion.div>

        {/* Section 4: Đánh giá độ tin cậy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-surface-100">4. Đánh giá độ tin cậy của mô hình</h3>
          </div>
          <div className="space-y-3 text-sm text-surface-300">
            <p>Mặc dù thiết lập mô hình 1g tỷ lệ 1:20 có những hạn chế nhất định về tương tự ứng suất, nhưng độ tin cậy của mô hình thí nghiệm được khẳng định qua:</p>
            
            <ul className="space-y-3">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bảo toàn cơ chế phá hoại:</strong> Quan sát thực tế cho thấy trụ VLHR phình nở ở góc độ sâu (1÷3D) tương đồng hoàn toàn với lý thuyết và thực tế công trình.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Kiểm chứng kết quả bằng mô hình số:</strong> Kết quả đo ứng suất đỉnh trụ (<span className="sym">σ<sub>c</sub></span>), ứng suất đất (<span className="sym">σ<sub>s</sub></span>) ở thí nghiệm mô hình vật lý sẽ được dùng để hiệu chỉnh (calibrate) mô hình phần tử hữu hạn (Plaxis/Midas), từ đó mô phỏng ngược lại cho nguyên mẫu 1:1.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Sự tương tác lưới - trụ:</strong> Hiệu ứng vòm (arching effect) và hiệu ứng màng kéo căng (membrane effect) được tái tạo rõ rệt, chứng minh tính đúng đắn của việc kết hợp lưới ĐKT đặt trên đỉnh trụ.</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-accent-900/20 border border-accent-500/20 rounded-lg flex gap-3">
              <Lightbulb className="w-5 h-5 text-accent-400 shrink-0" />
              <p className="text-xs text-accent-100">
                Mô hình vật lý trong luận án đóng vai trò "kiểm chứng cơ chế" và "hiệu chỉnh thông số", cung cấp dữ liệu thực nghiệm chất lượng cao đầu vào cho bài toán thiết kế thực tế quy mô lớn.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
