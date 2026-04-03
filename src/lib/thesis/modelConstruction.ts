// Model Construction Steps — Chapter 3
export interface ConstructionStep {
  step: number;
  title: string;
  description: string;
  visual: string;
  controlPoints: string[];
  commonMistakes: string[];
  substeps?: {
    id: string;
    title: string;
    description: string;
  }[];
}

export const SINGLE_COLUMN_STEPS: ConstructionStep[] = [
  { step: 1, title: 'Chuẩn bị thùng thí nghiệm', description: 'Thùng trụ tròn đường kính trong 380 mm, chiều cao 1000 mm cho trụ đơn. Xử lý thành thùng: phủ màng PE + mỡ silicon để giảm ma sát (μ < 0,1).', visual: 'tank_single', controlPoints: ['Đường kính trong: Ø380 mm', 'Chiều cao: 1000 mm', 'Ma sát thành thùng μ < 0,1'], commonMistakes: ['Không phủ đều mỡ silicon', 'Thùng bị biến dạng'] },
  { step: 2, title: 'Thi công lớp đệm cát đầm chặt phía dưới', description: 'Đổ lớp cát sạch vào đáy thùng, đầm chặt đạt chiều dày 200 mm. Lớp đệm cát đáy có chức năng thoát nước và tạo nền cứng cho trụ tựa lên.', visual: 'base_sand', controlPoints: ['Chiều dày = 200 mm', 'Đầm chặt đều', 'Phẳng mặt'], commonMistakes: ['Chiều dày không đều', 'Không đầm chặt đủ'] },
  { step: 3, title: 'Thi công lớp đất yếu', description: 'Đất sét pha yếu đổ vào thùng theo lớp 50 mm trên lớp đệm cát đáy, đầm đều. Bảo dưỡng nilon 4 ngày để đạt trạng thái IL mục tiêu. Chiều dày lớp đất yếu = 600 mm.', visual: 'soil_layers', controlPoints: ['Chiều dày mỗi lớp đắp = 50 mm', 'Tổng chiều dày = 600 mm', 'IL = 0,78 / 1,0 / 1,5', 'Bảo dưỡng 4 ngày'], commonMistakes: ['Đất lún không đều giữa các lớp', 'Không đầm đều', 'IL không đồng nhất'] },
  { 
    step: 4, 
    title: 'Chế tạo trụ VLHR', 
    description: 'Thi công trụ đá dăm theo phương pháp thay thế nền tại chính giữa thùng tròn. Trụ xuyên qua toàn bộ lớp đất yếu 600 mm, tựa trên lớp đệm cát đáy.', 
    visual: 'column_single', 
    controlPoints: ['D = 40 mm', 'L = 600 mm', 'ID ≥ 0,95', 'γ = 18,3 kN/m³', 'Trụ nằm chính giữa thùng'], 
    commonMistakes: ['Trụ lệch tâm', 'Cốt liệu không đầm đều', 'Rút ống làm xáo trộn đất'],
    substeps: [
      { id: '4.1', title: 'Đóng ống vách', description: 'Đóng ống PVC đường kính ngoài 44mm, trong 40mm từ từ vào nền đất tại tâm thùng.' },
      { id: '4.2', title: 'Lấy đất trong ống', description: 'Dùng dụng cụ khoan/cạo lấy cẩn thận phần lõi đất bên trong ống.' },
      { id: '4.3', title: 'Đổ lớp đá dăm', description: 'Đổ từng lớp đá dăm (0,5-4,75mm) định lượng vào bên trong.' },
      { id: '4.4', title: 'Đầm chặt VLHR', description: 'Sử dụng thanh đầm thép đầm chặt với số chày chuẩn, đảm bảo ID ≥ 0,95.' },
      { id: '4.5', title: 'Rút dần ống vách', description: 'Rút ống lên 1 đoạn cẩn thận, không làm sụp thành đất.' },
      { id: '4.6', title: 'Lặp lại', description: 'Tiếp tục đổ VLHR và đầm cho đến khi đầy cao độ thiết kế.' },
      { id: '4.7', title: 'Kiểm tra', description: 'Rút hoàn toàn ống vách, kiểm tra cao độ và độ phẳng đỉnh trụ.' }
    ]
  },
  { step: 5, title: 'Trải lưới ĐKT', description: 'Lưới ĐKT độ cứng J = 100 kN/m trải trực tiếp trên đỉnh trụ VLHR. Lưới phải được căng đều, không chùng.', visual: 'geogrid', controlPoints: ['J = 100 kN/m', 'Lưới căng đều', 'Vị trí: trên đỉnh trụ'], commonMistakes: ['Lưới bị chùng', 'Không căng đều'] },
  { step: 6, title: 'Thi công lớp đệm cát trên', description: 'Đắp lớp cát đầm chặt phía trên lưới ĐKT. Chiều dày 100 mm cho trụ đơn.', visual: 'sand_cushion', controlPoints: ['Chiều dày đệm cát = 100 mm', 'Độ chặt lớp đệm', 'Phẳng mặt'], commonMistakes: ['Chiều dày không đều'] },
  { step: 7, title: 'Lắp thiết bị đo', description: 'LVDT đo độ lún (±0,01 mm). Strain gauge trên thanh thép đo ứng suất đỉnh trụ.', visual: 'sensors_single', controlPoints: ['Độ chính xác LVDT ±0,01 mm', 'Shunt calibration < 5%'], commonMistakes: ['Cảm biến bị offset', 'Tín hiệu nhiễu'] },
  { step: 8, title: 'Lắp hệ gia tải', description: 'Khung thép chữ U + động cơ + hộp giảm tốc + vít me bi truyền lực thẳng đứng. Tốc độ CRP = 0,061 mm/phút.', visual: 'loading_frame', controlPoints: ['Tâm gia tải trùng tâm trụ', 'Tốc độ = 0,061 mm/phút'], commonMistakes: ['Tải lệch tâm'] },
  { step: 9, title: 'Kiểm tra chất lượng mô hình', description: 'Kiểm tra cu bằng cắt cánh mini. Kiểm tra γ nền. Kiểm tra ID trụ. Xác nhận mô hình sẵn sàng.', visual: 'quality_check', controlPoints: ['cu đạt giá trị mục tiêu', 'γ nền đồng nhất', 'ID ≥ 0,95'], commonMistakes: ['cu phân bố không đều', 'Trụ bị nứt khi kiểm tra'] },
];

export const GROUP_COLUMN_STEPS: ConstructionStep[] = [
  { step: 1, title: 'Chuẩn bị thùng thí nghiệm', description: 'Thùng thép kích thước 1000×500×1000 mm cho nhóm trụ 2×2. Phủ PE + mỡ silicon.', visual: 'tank_group', controlPoints: ['Kích thước: 1000×500×1000 mm', 'μ < 0,1'], commonMistakes: ['Thùng biến dạng dưới trọng lượng đất'] },
  { step: 2, title: 'Thi công lớp đệm cát đầm chặt phía dưới', description: 'Đổ lớp cát sạch vào đáy thùng, đầm chặt đạt chiều dày 200 mm. Chức năng thoát nước và tạo nền cứng.', visual: 'base_sand', controlPoints: ['Chiều dày = 200 mm', 'Đầm chặt đều', 'Phẳng mặt'], commonMistakes: ['Chiều dày không đều', 'Không đầm chặt đủ'] },
  { step: 3, title: 'Thi công lớp đất yếu', description: 'Đất sét pha yếu đổ theo lớp 50 mm, đầm đều toàn bộ thùng lớn. Chiều dày 600 mm. Bảo dưỡng 4 ngày.', visual: 'soil_layers_group', controlPoints: ['Lớp 50 mm đều', 'Tổng 600 mm', 'IL đồng nhất toàn thùng'], commonMistakes: ['IL không đều vùng giữa vs vùng thành'] },
  { step: 4, title: 'Bố trí nhóm trụ VLHR 2×2', description: 'Dùng khung định vị xác định vị trí 4 trụ theo s/D (2,5D / 3,0D / 3,5D). Chế tạo lần lượt từng trụ.', visual: 'columns_group', controlPoints: ['s/D = 2,5 / 3,0 / 3,5', 'as = 12,57% / 8,73% / 6,41%'], commonMistakes: ['Sai lệch vị trí trụ', 'Trụ bị nghiêng'] },
  { step: 5, title: 'Trải lưới ĐKT', description: 'Lưới ĐKT độ cứng J = 100 kN/m trải trực tiếp trên đỉnh 4 trụ. Gắn strain gauge trên lưới.', visual: 'geogrid_group', controlPoints: ['J = 100 kN/m', 'Strain gauge vị trí chính xác', 'Lưới căng đều'], commonMistakes: ['Lưới chùng giữa các trụ'] },
  { step: 6, title: 'Thi công lớp đệm cát trên', description: 'Đệm cát trên lưới ĐKT: 100mm (s=2,5D), 120mm (s=3D), 150mm (s=3,5D). Đảm bảo H > 1,4(s−a) theo BS 8006.', visual: 'sand_group', controlPoints: ['Chiều dày theo bảng 3.8', 'H > 1,4(s−a)'], commonMistakes: ['Lún cục bộ tại vị trí trụ'] },
  { step: 7, title: 'Lắp thiết bị đo', description: 'LVDT (×2), Load cell đất nền, Strain gauge đỉnh trụ + lưới. Data Logger ghi tự động.', visual: 'sensors_group', controlPoints: ['LVDT ±0,01mm', 'Đồng bộ thời gian'], commonMistakes: ['Mất dữ liệu lỗi kết nối'] },
  { step: 8, title: 'Lắp hệ gia tải', description: 'Khung U + kích thủy lực + vòng đo lực. Tải phân bố đều trên toàn bộ diện tích nhóm trụ.', visual: 'loading_group', controlPoints: ['Tải đều toàn diện tích', 'Tốc độ CRP'], commonMistakes: ['Tải lệch → lún không đều'] },
  { step: 9, title: 'Kiểm tra chất lượng mô hình', description: 'Kiểm tra: cu (cắt cánh), vị trí trụ (đo lại), ID trụ, căng lưới, offset cảm biến.', visual: 'quality_group', controlPoints: ['cu đúng IL', 'Vị trí trụ chính xác', 'Cảm biến đã hiệu chuẩn'], commonMistakes: ['Phát hiện trụ nghiêng sau khi kiểm tra'] },
];
