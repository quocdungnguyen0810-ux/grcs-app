// =====================================================================
// NỘI DUNG CHƯƠNG 1 — TỔNG QUAN NGHIÊN CỨU
// Trích xuất từ luận án NCS. Nguyễn Hải Hà, ĐH GTVT, 2026
// =====================================================================

export const CHAPTER1 = {
  title: 'Tổng quan nghiên cứu về trụ VLHR kết hợp lưới ĐKT trong xử lý nền đất yếu',
  titleEn: 'Literature Review on Granular Columns Combined with Geosynthetics for Soft Ground Treatment',

  background: {
    title: 'Bối cảnh nghiên cứu',
    content: `Trong bối cảnh phát triển kinh tế - xã hội hiện nay, hệ thống kết cấu hạ tầng giao thông Việt Nam đang được đầu tư mạnh mẽ, đặc biệt là mạng lưới đường bộ cao tốc và đường sắt tốc độ cao. Sự có mặt các tầng đất yếu rộng khắp ở khu vực đồng bằng Bắc Bộ, vùng ven biển miền Trung và đồng bằng sông Cửu Long tạo ra những thách thức đáng kể. Việc xử lý nền đất yếu, đặc biệt khi bề dày đất yếu lớn (15–20 m), đòi hỏi các giải pháp hiệu quả cả về kỹ thuật, kinh tế lẫn thời gian thi công.`,
    keyPoints: [
      'Đồng bằng Bắc Bộ, ven biển miền Trung, ĐBSCL có đất yếu phân bố rộng',
      'Bề dày đất yếu thường từ 10 m đến trên 30 m',
      'Giải pháp trụ VLHR + lưới ĐKT (GRCS) đang được quan tâm ứng dụng rộng rãi',
      'Hệ thống dựa trên kết hợp hiệu ứng vòm + hiệu ứng màng kéo',
    ],
  },

  softSoilContext: {
    title: 'Đất yếu trong xây dựng công trình giao thông',
    content: `Nền đất yếu với cường độ kháng cắt không thoát nước thấp (cu < 25 kPa), mô đun biến dạng nhỏ (E < 10 MPa) và tính nén lún lớn là thách thức chính trong xây dựng CTGT tại Việt Nam. Khi bề dày lớp yếu vượt 10–15 m, các giải pháp đơn giản như thay đất hoặc gia tải trước thường không hiệu quả hoặc không khả thi về kinh tế.`,
    characteristics: [
      { name: 'cu (cắt cánh)', rất_yếu: '< 12,5 kPa', yếu: '12,5–25 kPa', TCCS: '≤ 35 kPa' },
      { name: 'NSPT', rất_yếu: '< 2', yếu: '2–4', TCCS: '< 5' },
      { name: 'Mô đun E', rất_yếu: '< 2–3 MPa', yếu: '3–10 MPa', TCCS: '—' },
      { name: 'Hệ số rỗng e₀', rất_yếu: '> 1,5', yếu: '> 1,0', TCCS: 'Sét ≥ 1,5' },
      { name: 'Độ sệt IL', rất_yếu: '> 1,0', yếu: '0,75–1,0', TCCS: '> 0,75' },
    ],
    classification: [
      { group: 'Sét mềm vô cơ (CL, CH)', chars: 'IL = 0,75–1,0; Su = 10–25 kPa; NSPT = 2–4', solution: 'Gia tải trước + bấc thấm; trụ VLHR; trụ Đ-XM' },
      { group: 'Bùn sét, bùn vô cơ (ML, MH)', chars: 'IL ≥ 1,0; Su rất nhỏ; W gần WL', solution: 'Khống chế tốc độ đắp + gia cố sâu' },
      { group: 'Đất hữu cơ, than bùn (OL, OH, PT)', chars: 'Cc > 4; lún kéo dài, không đều', solution: 'Đào thay; trụ/cọc sâu; điều chỉnh tuyến' },
    ],
  },

  grcsOverview: {
    title: 'Hệ nền đắp trên trụ VLHR gia cường lưới ĐKT (GRCS)',
    content: `Giải pháp trụ VLHR kết hợp lưới ĐKT trải trên đỉnh trụ thuộc nhóm GRCS (Geosynthetic Reinforced Column-Supported embankment). Trụ VLHR đóng vai trò phần tử chịu lực chính, lưới ĐKT tạo lớp truyền tải phân bố đều tải trọng từ khối đắp xuống hệ trụ và đất nền xung quanh.`,
    advantages: [
      'Xử lý hiệu quả nền đất yếu bề dày lớn',
      'Tốc độ thi công nhanh, ít phụ thuộc thời tiết',
      'Tận dụng vật liệu địa phương → thân thiện môi trường, giảm chi phí vận chuyển',
      'Rút ngắn thời gian cố kết so với gia tải trước',
      'Chi phí thấp hơn cọc cứng (BTCT, khoan nhồi)',
      'Tăng cường hiệu quả truyền tải và giảm lún lệch nhờ lưới ĐKT',
    ],
    applications: [
      { country: 'Đức', detail: 'Đê đường sắt Berlin-Hamburg (Heitz, 2005); Berlin-Magdeburg (Hüser & Alexiew, 1994)' },
      { country: 'Anh', detail: 'Đường cao tốc M60 Manchester (Madun, 2012)' },
      { country: 'Nhật Bản', detail: 'Cọc cát đầm chặt cho đường bộ, đê sông (Yoshida, 2021)' },
      { country: 'Trung Quốc', detail: 'Đường cao tốc Thượng Hải, Thiên Tân, châu thổ sông Châu Giang (Li, 2024)' },
      { country: 'Ấn Độ', detail: 'Punjab, Uttar Pradesh, Bihar (Keller India)' },
    ],
  },

  researchGaps: {
    title: 'Các vấn đề tồn tại cần nghiên cứu',
    singleColumn: {
      title: 'Trụ đơn VLHR',
      gaps: [
        'Hệ số sức chịu tải Nc cho trụ VLHR kết hợp lưới ĐKT chưa xác định rõ',
        'Ảnh hưởng của IL đến ứng xử trụ đơn chưa được nghiên cứu hệ thống',
        'Thiếu dữ liệu thực nghiệm về E₅₀ trong đất yếu IL > 1,0',
        'Cơ chế phá hoại phình nở tại vùng 2,5D–4D cần dữ liệu xác minh',
      ],
    },
    groupColumn: {
      title: 'Nhóm trụ VLHR + Lưới ĐKT',
      gaps: [
        'Hiệu ứng vòm: các phương pháp tính cho kết quả chênh 20–40%',
        'Hệ số TTƯS cho trụ VLHR khác cọc cứng — chưa có công thức riêng',
        'Ảnh hưởng của độ cứng lưới J, số lớp lưới chưa làm rõ',
        'Thiếu dữ liệu phân bố ứng suất đầu trụ/đất nền cho trụ VLHR',
        'Chưa có quy trình thiết kế phù hợp điều kiện Việt Nam',
      ],
    },
  },

  objectives: [
    {
      id: 1,
      text: 'Làm rõ cơ chế làm việc và ứng xử của hệ trụ VLHR kết hợp lưới ĐKT dưới tải trọng khối đắp, có xét hiệu ứng vòm, ứng xử lưới ĐKT, phân bố ứng suất và quan hệ tải trọng–độ lún',
    },
    {
      id: 2,
      text: 'Đánh giá ảnh hưởng của đặc tính vật liệu (trụ, đất nền, lưới ĐKT), cấu trúc hình học (s/D), cấu tạo lớp truyền tải đến hiệu quả hệ thống',
    },
    {
      id: 3,
      text: 'Đề xuất công thức tính hệ số TTƯS, hệ số giảm lún và SCT của hệ trụ VLHR + lưới ĐKT, kiểm chứng bằng thực nghiệm và Plaxis 3D',
    },
    {
      id: 4,
      text: 'Cung cấp cơ sở khoa học và quy trình tính toán phục vụ thiết kế giải pháp trụ VLHR + lưới ĐKT cho CTGT tại Việt Nam',
    },
  ],

  scope: {
    methods: [
      'Mô hình vật lý thu nhỏ tỷ lệ 1:20 (trọng lực 1g) trong phòng thí nghiệm',
      'Phân tích mô hình số 3D bằng Plaxis 3D',
    ],
    conditions: [
      'Trụ đơn VLHR và nhóm trụ 2×2',
      'Nền đất yếu 1 lớp đồng nhất (sét pha, sét) ở 3 trạng thái: IL = 0,78 / 1,0 / 1,5',
      'Tải trọng thẳng đứng, vật liệu trụ: đá dăm nghiền',
      'Lưới ĐKT hai trục 100 kN/m',
      'Tỷ lệ khoảng cách: s/D = 2,5 / 3,0 / 3,5',
    ],
    limitations: [
      'Chưa xét tải trọng ngang, tải trọng động',
      'Chưa xét cấu trúc địa chất nhiều lớp',
      'Chưa xét ma sát âm, ổn định tổng thể nền đường',
      'Chưa xét trụ VLHR bọc lưới ĐKT',
    ],
  },

  approach: {
    title: 'Cách tiếp cận và phương pháp nghiên cứu',
    steps: [
      { step: 1, name: 'Hệ thống hóa lý thuyết', desc: 'Tổng quan trụ VLHR, hiệu ứng vòm, hiệu ứng màng; xác định khoảng trống nghiên cứu' },
      { step: 2, name: 'Nghiên cứu thực nghiệm', desc: 'Mô hình vật lý thu nhỏ 1:20 để thu thập dữ liệu ứng xử thực tế' },
      { step: 3, name: 'Mô phỏng số 3D', desc: 'Hiệu chỉnh, kiểm chứng và mở rộng phạm vi nghiên cứu bằng Plaxis 3D' },
      { step: 4, name: 'Tổng hợp & đề xuất', desc: 'So sánh kết quả → đề xuất công thức tính toán phù hợp' },
    ],
    methods: [
      { name: 'Nghiên cứu tài liệu', desc: 'Thu thập tài liệu quốc tế, phân tích EBGEO, BS 8006, FHWA, JGS' },
      { name: 'Lý thuyết mô hình', desc: 'Thiết kế mô hình vật lý thu nhỏ theo lý thuyết tương tự' },
      { name: 'Thực nghiệm', desc: 'Thiết kế, chế tạo mô hình, tiến hành thí nghiệm, thu thập số liệu' },
      { name: 'Mô phỏng số', desc: 'Phần mềm phần tử hữu hạn PLAXIS 3D' },
      { name: 'Thống kê', desc: 'Phân tích hồi quy, đánh giá độ tin cậy' },
      { name: 'So sánh & phân tích', desc: 'So sánh TN–mô hình số–công thức hiện có → đề xuất mới' },
    ],
  },

  contributions: [
    {
      num: '01',
      title: 'Bộ dữ liệu thực nghiệm hệ thống',
      desc: 'Ứng xử cơ học (tải–lún, phân bố ứng suất, hệ số TTƯS) của hệ trụ VLHR + lưới ĐKT qua MHVL 1:20 với 3 trạng thái đất, 3 tỷ lệ khoảng cách.',
    },
    {
      num: '02',
      title: 'Quy luật ảnh hưởng các yếu tố',
      desc: 'Làm rõ ảnh hưởng s/D, IL và lưới ĐKT đến hệ số TTƯS n, hệ số giảm lún β, sức chịu tải của hệ thống.',
    },
    {
      num: '03',
      title: 'Công thức tính toán đề xuất',
      desc: 'Đề xuất công thức tính n và qult cho hệ trụ VLHR + lưới ĐKT, được kiểm chứng bằng thực nghiệm và Plaxis 3D.',
    },
  ],
};
