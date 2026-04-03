// =====================================================================
// DỮ LIỆU THỰC NGHIỆM TỪ LUẬN ÁN TIẾN SĨ - NCS. NGUYỄN HẢI HÀ
// Trường Đại học Giao thông Vận tải, 2026
// =====================================================================
// File này chứa TOÀN BỘ dữ liệu thực nghiệm đã được trích xuất
// từ luận án. Không bịa số liệu.
// =====================================================================

import type {
  SoilStateInfo, SingleColumnResult, GroupColumnResult,
  NumericalResult, ExperimentScenario, MaterialProperty,
  ProcedureStep, ComparisonMetric, SoilState
} from './types';

// ===== THÔNG TIN ĐỀ TÀI =====
export const THESIS_INFO = {
  title: 'Nghiên cứu ứng xử của trụ vật liệu hạt rời kết hợp lưới địa kỹ thuật xử lý nền đất yếu cho xây dựng công trình giao thông',
  titleEn: 'Study on behavior of granular material columns combined with geosynthetics for soft ground treatment in transport infrastructure construction',
  author: 'NCS. Nguyễn Hải Hà',
  university: 'Trường Đại học Giao thông Vận tải',
  advisors: ['PGS. TS. Nguyễn Đức Mạnh', 'PGS. TS. Đặng Hồng Lam'],
  year: 2026,
  modelScale: '1:20',
  modelType: 'Mô hình trọng lực 1g',
};

// ===== CÁC CẤP TẢI TRỌNG (kPa) =====
export const PRESSURE_LEVELS = [18, 36, 54, 72, 90, 108, 120];

// ===== TRẠNG THÁI ĐẤT NỀN (Bảng 3.11) =====
export const SOIL_STATES: Record<SoilState, SoilStateInfo> = {
  IL_078: {
    id: 'IL_078',
    IL: 0.78,
    label: 'IL = 0,78',
    labelEn: 'Liquidity Index = 0.78',
    state: 'Dẻo chảy',
    cu: 20,
    Es: 1450,
    color: '#4e7ab9',
  },
  IL_10: {
    id: 'IL_10',
    IL: 1.0,
    label: 'IL = 1,0',
    labelEn: 'Liquidity Index = 1.0',
    state: 'Chảy',
    cu: 10,
    Es: 1050,
    color: '#f5b731',
  },
  IL_15: {
    id: 'IL_15',
    IL: 1.5,
    label: 'IL = 1,5',
    labelEn: 'Liquidity Index = 1.5',
    state: 'Chảy (IL = 1,5)',
    cu: 5,
    Es: 850,
    color: '#6b7b8d',
  },
};

// ===== TÍNH CHẤT ĐẤT NỀN (Bảng 3.5) =====
export const SOIL_PROPERTIES: MaterialProperty[] = [
  { name: 'Độ ẩm tự nhiên', nameEn: 'Natural moisture content', symbol: 'W', unit: '%', value: 46.7, source: 'Bảng 3.5' },
  { name: 'Giới hạn chảy', nameEn: 'Liquid limit', symbol: 'W_L', unit: '%', value: 50.1, source: 'Bảng 3.5' },
  { name: 'Giới hạn dẻo', nameEn: 'Plastic limit', symbol: 'W_P', unit: '%', value: 35.4, source: 'Bảng 3.5' },
  { name: 'Chỉ số dẻo', nameEn: 'Plasticity index', symbol: 'I_P', unit: '%', value: 14.7, source: 'Bảng 3.5' },
  { name: 'Độ sệt', nameEn: 'Liquidity index', symbol: 'I_L', unit: '–', value: 0.78, source: 'Bảng 3.5' },
  { name: 'Trọng lượng thể tích', nameEn: 'Unit weight', symbol: 'γ', unit: 'kN/m³', value: 16.6, source: 'Bảng 3.5' },
  { name: 'Hệ số rỗng ban đầu', nameEn: 'Initial void ratio', symbol: 'e₀', unit: '–', value: 1.313, source: 'Bảng 3.5' },
  { name: 'Thành phần hạt sét', nameEn: 'Clay fraction (<0.002mm)', symbol: '–', unit: '%', value: 26.1, source: 'Bảng 3.5' },
];

// ===== TÍNH CHẤT VẬT LIỆU TRỤ (Bảng 3.6) =====
export const COLUMN_MATERIAL: MaterialProperty[] = [
  { name: 'Khối lượng riêng', nameEn: 'Specific gravity', symbol: 'ρs', unit: 'g/cm³', value: 2.65, source: 'Bảng 3.6' },
  { name: 'KL thể tích xốp', nameEn: 'Min. dry density', symbol: 'ρd,min', unit: 'g/cm³', value: 1.42, source: 'Bảng 3.6' },
  { name: 'KL thể tích chặt', nameEn: 'Max. dry density', symbol: 'ρd,max', unit: 'g/cm³', value: 1.68, source: 'Bảng 3.6' },
  { name: 'Góc ma sát trong', nameEn: 'Internal friction angle', symbol: 'φ', unit: '°', value: '42 ± 2', source: 'Bảng 3.6' },
  { name: 'Độ mài mòn Los Angeles', nameEn: 'Los Angeles abrasion', symbol: 'LA', unit: '%', value: 22, source: 'Bảng 3.6' },
  { name: 'Đường kính trụ mô hình', nameEn: 'Model column diameter', symbol: 'D', unit: 'mm', value: 40, source: 'Mục 3.1.2' },
  { name: 'Chiều dài trụ mô hình', nameEn: 'Model column length', symbol: 'L', unit: 'mm', value: 600, source: 'Mục 3.1.2' },
  { name: 'Tỷ lệ L/D', nameEn: 'L/D ratio', symbol: 'L/D', unit: '–', value: 15, source: 'Mục 3.1.2' },
  { name: 'Cấp phối hạt', nameEn: 'Grain size', symbol: '–', unit: 'mm', value: '0.5–4.75', source: 'Mục 3.1.3' },  
];

// ===== LƯỚI ĐỊA KỸ THUẬT (Bảng 3.7) =====
export const GEOGRID_PROPERTIES: MaterialProperty[] = [
  { name: 'Cường độ kéo khi đứt (dọc)', nameEn: 'Tensile strength at break (MD)', symbol: '–', unit: 'kN/m', value: 209.4, source: 'Bảng 3.7' },
  { name: 'Độ giãn dài khi đứt (dọc)', nameEn: 'Elongation at break (MD)', symbol: '–', unit: '%', value: 12, source: 'Bảng 3.7' },
  { name: 'CĐ kéo tại ε=2% (dọc)', nameEn: 'Tensile at 2% strain (MD)', symbol: '–', unit: 'kN/m', value: 41.4, source: 'Bảng 3.7' },
  { name: 'CĐ kéo tại ε=5% (dọc)', nameEn: 'Tensile at 5% strain (MD)', symbol: '–', unit: 'kN/m', value: 78.7, source: 'Bảng 3.7' },
  { name: 'CĐ kéo khi đứt (ngang)', nameEn: 'Tensile at break (CD)', symbol: '–', unit: 'kN/m', value: 105.7, source: 'Bảng 3.7' },
  { name: 'Độ giãn dài khi đứt (ngang)', nameEn: 'Elongation at break (CD)', symbol: '–', unit: '%', value: 12, source: 'Bảng 3.7' },
];

// ===== KẾT QUẢ TRỤ ĐƠN (Bảng 3.12, 3.13, 4.1, 4.2) =====
export const SINGLE_COLUMN_RESULTS: SingleColumnResult[] = [
  // IL = 0.78, Không lưới
  {
    IL: 'IL_078', geogrid: 'without_geogrid',
    sigmaMax: 381.76, epsilonMax: 0.0387, Ei: 19962,
    qult: 378, E50: 21000, sigma50: 189, epsilon50: 0.009,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 99.8 }, { epsilon: 1.0, sigma: 201.5 },
      { epsilon: 1.5, sigma: 264.4 }, { epsilon: 2.0, sigma: 299.2 },
      { epsilon: 2.5, sigma: 335.7 }, { epsilon: 3.0, sigma: 364.2 },
      { epsilon: 3.5, sigma: 375.6 }, { epsilon: 4.0, sigma: 381.8 },
    ],
  },
  // IL = 0.78, Có lưới
  {
    IL: 'IL_078', geogrid: 'with_geogrid',
    sigmaMax: 429.89, epsilonMax: 0.045, Ei: 29134,
    qult: 426, E50: 25059, sigma50: 213, epsilon50: 0.0085,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 145.7 }, { epsilon: 1.0, sigma: 240.9 },
      { epsilon: 1.5, sigma: 289.2 }, { epsilon: 2.0, sigma: 343.9 },
      { epsilon: 2.5, sigma: 385.1 }, { epsilon: 3.0, sigma: 411.2 },
      { epsilon: 3.5, sigma: 426.5 }, { epsilon: 4.0, sigma: 429.3 },
    ],
  },
  // IL = 1.0, Không lưới
  {
    IL: 'IL_10', geogrid: 'without_geogrid',
    sigmaMax: 185.9, epsilonMax: 0.053, Ei: 9400,
    qult: 187, E50: 9350, sigma50: 93.5, epsilon50: 0.01,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 47.0 }, { epsilon: 1.0, sigma: 78.0 },
      { epsilon: 1.5, sigma: 108.0 }, { epsilon: 2.0, sigma: 137.0 },
      { epsilon: 2.5, sigma: 153.0 }, { epsilon: 3.0, sigma: 163.0 },
      { epsilon: 3.5, sigma: 170.0 }, { epsilon: 4.0, sigma: 180.0 },
    ],
  },
  // IL = 1.0, Có lưới
  {
    IL: 'IL_10', geogrid: 'with_geogrid',
    sigmaMax: 227.8, epsilonMax: 0.055, Ei: 14000,
    qult: 227, E50: 11336, sigma50: 113.5, epsilon50: 0.01,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 70.0 }, { epsilon: 1.0, sigma: 110.0 },
      { epsilon: 1.5, sigma: 132.0 }, { epsilon: 2.0, sigma: 151.0 },
      { epsilon: 2.5, sigma: 170.0 }, { epsilon: 3.0, sigma: 190.0 },
      { epsilon: 3.5, sigma: 204.0 }, { epsilon: 4.0, sigma: 216.0 },
    ],
  },
  // IL = 1.5, Không lưới
  {
    IL: 'IL_15', geogrid: 'without_geogrid',
    sigmaMax: 149.04, epsilonMax: 0.059, Ei: 4240,
    qult: 148, E50: 4000, sigma50: 74, epsilon50: 0.0185,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 21.2 }, { epsilon: 1.0, sigma: 40.8 },
      { epsilon: 1.5, sigma: 61.2 }, { epsilon: 2.0, sigma: 80.0 },
      { epsilon: 2.5, sigma: 95.2 }, { epsilon: 3.0, sigma: 110.4 },
      { epsilon: 3.5, sigma: 122.7 }, { epsilon: 4.0, sigma: 132.0 },
    ],
  },
  // IL = 1.5, Có lưới
  {
    IL: 'IL_15', geogrid: 'with_geogrid',
    sigmaMax: 186.0, epsilonMax: 0.056, Ei: 5300,
    qult: 188, E50: 5081, sigma50: 94, epsilon50: 0.0185,
    stressStrainCurve: [
      { epsilon: 0.5, sigma: 26.5 }, { epsilon: 1.0, sigma: 51.0 },
      { epsilon: 1.5, sigma: 76.5 }, { epsilon: 2.0, sigma: 100.0 },
      { epsilon: 2.5, sigma: 118.8 }, { epsilon: 3.0, sigma: 138.0 },
      { epsilon: 3.5, sigma: 153.3 }, { epsilon: 4.0, sigma: 165.0 },
    ],
  },
];

// ===== KẾT QUẢ NHÓM TRỤ (Bảng 3.14–3.18, 4.4) =====
export const GROUP_COLUMN_RESULTS: GroupColumnResult[] = [
  // s/D = 2.5
  {
    sD: 'sD_25',
    pressureLevels: PRESSURE_LEVELS,
    settlement: [0.845, 1.92, 2.86, 4.136, 5.45, 6.68, 8.21],
    columnStress: [56.02, 100.02, 132.03, 161.97, 180.11, 193.98, 199.02],
    soilPressure: [15.41, 29.97, 45.02, 62.12, 78.09, 93.14, 98.06],
    stressConcentration: [3.64, 3.34, 2.93, 2.61, 2.31, 2.08, 2.03],
    geogridStrain: [0.45, 0.89, 1.35, 1.78, 2.25, 2.72, 3.01],
  },
  // s/D = 3.0
  {
    sD: 'sD_30',
    pressureLevels: PRESSURE_LEVELS,
    settlement: [1.249, 2.65, 4.23, 6.12, 8.11, 10.41, 12.56],
    columnStress: [56.12, 101.86, 137.95, 170.04, 188.01, 201.96, 207.23],
    soilPressure: [16.17, 31.42, 48.21, 66.88, 83.52, 99.33, 103.31],
    stressConcentration: [3.47, 3.24, 2.86, 2.54, 2.25, 2.03, 2.01],
    geogridStrain: [0.52, 1.02, 1.56, 2.06, 2.57, 3.08, 3.44],
  },
  // s/D = 3.5
  {
    sD: 'sD_35',
    pressureLevels: PRESSURE_LEVELS,
    settlement: [1.49, 3.42, 5.8, 8.82, 11.65, 14.48, 17.32],
    columnStress: [57.02, 103.93, 147.01, 176.24, 197.07, 208.89, 216.05],
    soilPressure: [17.11, 33.23, 52.52, 70.54, 89.42, 102.41, 108.07],
    stressConcentration: [3.33, 3.13, 2.80, 2.50, 2.20, 2.04, 2.00],
    geogridStrain: [0.57, 1.12, 1.67, 2.18, 2.748, 3.31, 3.67],
  },
];

// ===== DỮ LIỆU MÔ HÌNH SỐ (Bảng 4.5–4.8) =====
// n theo Ec
export const NUMERICAL_N_BY_EC: NumericalResult = {
  parameter: 'Ec',
  parameterValues: [15, 25, 35, 45, 55],
  pressureLevels: PRESSURE_LEVELS,
  nValues: [
    [2.72, 2.53, 2.38, 2.18, 1.94, 1.86, 1.83],
    [3.56, 3.24, 2.98, 2.69, 2.37, 2.19, 2.10],
    [4.25, 3.76, 3.42, 3.06, 2.68, 2.49, 2.40],
    [4.40, 3.93, 3.59, 3.22, 2.93, 2.71, 2.66],
    [4.56, 4.32, 3.97, 3.51, 3.21, 2.90, 2.90],
  ],
};

// n theo Es
export const NUMERICAL_N_BY_ES: NumericalResult = {
  parameter: 'Es',
  parameterValues: [1, 2, 3, 4, 5],
  pressureLevels: PRESSURE_LEVELS,
  nValues: [
    [4.87, 4.42, 3.90, 3.48, 3.03, 2.82, 2.76],
    [4.04, 3.59, 3.24, 2.84, 2.51, 2.29, 2.25],
    [3.90, 3.32, 3.06, 2.68, 2.34, 2.20, 2.18],
    [3.56, 3.24, 2.98, 2.69, 2.37, 2.19, 2.10],
    [3.13, 2.77, 2.48, 2.24, 2.02, 1.85, 1.73],
  ],
};

// n theo J (độ cứng lưới ĐKT)
export const NUMERICAL_N_BY_J: NumericalResult = {
  parameter: 'J',
  parameterValues: [1, 2, 3, 5, 8],
  pressureLevels: PRESSURE_LEVELS,
  nValues: [
    [3.51, 2.97, 2.68, 2.41, 2.13, 1.90, 1.80],
    [3.56, 3.24, 2.98, 2.69, 2.37, 2.19, 2.10],
    [3.76, 3.49, 3.19, 2.91, 2.57, 2.35, 2.33],
    [3.60, 3.12, 2.87, 2.58, 2.41, 2.18, 2.21],
    [3.55, 3.05, 2.78, 2.51, 2.30, 2.16, 2.05],
  ],
};

// n theo s/D
export const NUMERICAL_N_BY_SD: NumericalResult = {
  parameter: 's/D',
  parameterValues: [2.5, 3.0, 3.5],
  pressureLevels: PRESSURE_LEVELS,
  nValues: [
    [3.49, 3.19, 2.88, 2.49, 2.28, 2.07, 1.93],
    [3.56, 3.24, 2.98, 2.69, 2.37, 2.19, 2.10],
    [0, 0, 0, 0, 0, 0, 2.25], // Chỉ có giá trị tại p=120kPa
  ],
};

// ===== SO SÁNH TỔNG HỢP (Bảng 3.15) =====
export const SETTLEMENT_COMPARISON: ComparisonMetric[] = [
  {
    name: 'Tỷ lệ diện tích thay thế',
    nameEn: 'Area replacement ratio',
    unit: '%',
    values: { 'sD_25': 12.57, 'sD_30': 8.73, 'sD_35': 6.41 },
  },
  {
    name: 'Độ lún tại p=120 kPa',
    nameEn: 'Settlement at p=120 kPa',
    unit: 'mm',
    values: { 'sD_25': 8.21, 'sD_30': 12.56, 'sD_35': 17.32 },
  },
  {
    name: 'Tốc độ lún theo tải',
    nameEn: 'Settlement rate',
    unit: 'mm/kPa',
    values: { 'sD_25': 0.070, 'sD_30': 0.109, 'sD_35': 0.155 },
  },
  {
    name: 'Hệ số R²',
    nameEn: 'R² coefficient',
    unit: '–',
    values: { 'sD_25': 0.988, 'sD_30': 0.986, 'sD_35': 0.992 },
  },
];

// ===== KỊCH BẢN THÍ NGHIỆM =====
export const EXPERIMENT_SCENARIOS: ExperimentScenario[] = [
  { id: 'single_078_no', name: 'Trụ đơn – IL=0,78 – Không lưới', nameEn: 'Single column – IL=0.78 – No geogrid', type: 'single', IL: 'IL_078', geogrid: 'without_geogrid', description: 'Trụ đơn VLHR trong đất dẻo chảy, không có lưới ĐKT' },
  { id: 'single_078_yes', name: 'Trụ đơn – IL=0,78 – Có lưới', nameEn: 'Single column – IL=0.78 – With geogrid', type: 'single', IL: 'IL_078', geogrid: 'with_geogrid', description: 'Trụ đơn VLHR trong đất dẻo chảy, có lưới ĐKT 100 kN/m' },
  { id: 'single_10_no', name: 'Trụ đơn – IL=1,0 – Không lưới', nameEn: 'Single column – IL=1.0 – No geogrid', type: 'single', IL: 'IL_10', geogrid: 'without_geogrid', description: 'Trụ đơn VLHR trong đất chảy' },
  { id: 'single_10_yes', name: 'Trụ đơn – IL=1,0 – Có lưới', nameEn: 'Single column – IL=1.0 – With geogrid', type: 'single', IL: 'IL_10', geogrid: 'with_geogrid', description: 'Trụ đơn VLHR trong đất chảy, có lưới ĐKT' },
  { id: 'single_15_no', name: 'Trụ đơn – IL=1,5 – Không lưới', nameEn: 'Single column – IL=1.5 – No geogrid', type: 'single', IL: 'IL_15', geogrid: 'without_geogrid', description: 'Trụ đơn VLHR trong đất chảy (IL = 1,5)' },
  { id: 'single_15_yes', name: 'Trụ đơn – IL=1,5 – Có lưới', nameEn: 'Single column – IL=1.5 – With geogrid', type: 'single', IL: 'IL_15', geogrid: 'with_geogrid', description: 'Trụ đơn VLHR trong đất chảy (IL = 1,5), có lưới ĐKT' },
  { id: 'group_25', name: 'Nhóm trụ – s/D=2,5', nameEn: 'Group – s/D=2.5', type: 'group', sD: 'sD_25', description: 'Nhóm trụ 2×2, khoảng cách s=2,5D, kết hợp lưới ĐKT' },
  { id: 'group_30', name: 'Nhóm trụ – s/D=3,0', nameEn: 'Group – s/D=3.0', type: 'group', sD: 'sD_30', description: 'Nhóm trụ 2×2, khoảng cách s=3,0D, kết hợp lưới ĐKT' },
  { id: 'group_35', name: 'Nhóm trụ – s/D=3,5', nameEn: 'Group – s/D=3.5', type: 'group', sD: 'sD_35', description: 'Nhóm trụ 2×2, khoảng cách s=3,5D, kết hợp lưới ĐKT' },
];

// ===== QUY TRÌNH THÍ NGHIỆM =====
export const PROCEDURE_STEPS: ProcedureStep[] = [
  { step: 1, title: 'Chuẩn bị vật liệu và kiểm tra thông số', description: 'Đất nguyên trạng được đập nhỏ, phơi khô 24h, nghiền nhỏ bằng máy. Chia mẻ 10 kg, trộn với nước đạt độ ẩm 24–35%. Cốt liệu trụ sàng theo cấp phối 0,5–4,75 mm.', purpose: 'Đảm bảo vật liệu đạt yêu cầu về thành phần và trạng thái trước khi tạo mô hình.', controlledParams: ['Độ ẩm W (%)', 'Cấp phối hạt d₅₀', 'Khối lượng riêng ρ'], possibleErrors: ['Đất không đồng nhất về độ ẩm', 'Cấp phối không đúng'] },
  { step: 2, title: 'Thi công lớp đệm cát đầm chặt phía dưới', description: 'Đổ lớp cát sạch vào đáy thùng, đầm chặt đạt chiều dày 200 mm. Lớp đệm cát đáy có chức năng thoát nước và tạo nền cứng cho mô hình.', purpose: 'Tạo lớp nền thoát nước ổn định phía dưới, mô phỏng lớp đệm cát đầm chặt trong thực tế.', controlledParams: ['Chiều dày lớp cát = 200 mm', 'Độ chặt đầm nén', 'Phẳng mặt'], possibleErrors: ['Chiều dày không đều', 'Không đầm chặt đủ'] },
  { step: 3, title: 'Thi công lớp đất yếu', description: 'Đất sét pha yếu đổ vào thùng theo lớp 50 mm, đầm đều trên lớp đệm cát đáy. Thành thùng phủ màng PE + mỡ silicon (μ < 0,1). Bảo dưỡng nilon 4 ngày.', purpose: 'Tạo nền đất yếu đồng nhất dày 600 mm, hạn chế ma sát thành thùng.', controlledParams: ['IL = 0,78 / 1,0 / 1,5', 'cu (kPa)', 'Chiều dày lớp đất = 600 mm', 'Chiều dày từng lớp đắp = 50 mm'], possibleErrors: ['Đất lún không đều giữa các lớp', 'Ma sát thành thùng cao'] },
  { step: 4, title: 'Tạo/lắp trụ VLHR', description: 'Đóng ống PVC Φ44 mm vào nền đất yếu, lấy đất, đổ cốt liệu đá dăm theo lớp, đầm bằng thanh thép. Trụ D = 40 mm, L = 600 mm, γ trụ = 18,3 kN/m³.', purpose: 'Chế tạo trụ VLHR có độ chặt ID ≥ 0,95 trong nền đất yếu, trụ xuyên qua toàn bộ lớp đất yếu tựa trên lớp đệm cát đáy.', controlledParams: ['D = 40 mm', 'L = 600 mm', 'ID ≥ 0,95', 'γ = 18,3 kN/m³'], possibleErrors: ['Trụ lệch tâm', 'Cốt liệu không đầm đều'] },
  { step: 5, title: 'Bố trí nhóm trụ theo phương án', description: 'Nhóm trụ 2×2, khoảng cách s = 2,5D / 3,0D / 3,5D. Xác định vị trí chính xác bằng khung định vị.', purpose: 'Tạo cấu hình nhóm trụ đúng tỷ lệ s/D theo ma trận thí nghiệm.', controlledParams: ['s/D = 2,5 / 3,0 / 3,5', 'as = 12,57% / 8,73% / 6,41%'], possibleErrors: ['Sai lệch vị trí trụ', 'Trụ bị nghiêng'] },
  { step: 6, title: 'Trải lưới địa kỹ thuật', description: 'Lưới ĐKT độ cứng J = 100 kN/m được trải trực tiếp trên đỉnh các trụ VLHR. Lưới phải được căng đều, không chùng.', purpose: 'Tạo lớp truyền tải trên đỉnh trụ, phát huy hiệu ứng màng kéo khi gia tải.', controlledParams: ['Độ cứng J = 100 kN/m', 'Vị trí: trên đỉnh trụ', 'Lưới căng đều'], possibleErrors: ['Lưới bị chùng', 'Không căng đều'] },
  { step: 7, title: 'Thi công lớp đệm cát trên', description: 'Đắp lớp cát đầm chặt phía trên lưới ĐKT. Chiều dày: 100 mm (s=2,5D), 120 mm (s=3D), 150 mm (s=3,5D).', purpose: 'Đảm bảo H > 1,4(s−a) theo BS 8006 để hiệu ứng vòm phát triển hoàn toàn, đồng thời phân bố đều tải trọng.', controlledParams: ['Chiều dày đệm cát theo s/D', 'Độ chặt lớp đệm', 'Phẳng mặt'], possibleErrors: ['Chiều dày không đều', 'Lún cục bộ tại vị trí trụ'] },
  { step: 8, title: 'Lắp hệ thống đo chuyển vị, ứng suất', description: 'LVDT đo độ lún (±0,01 mm). Strain gauge trên thanh thép đo ứng suất đỉnh trụ. Load cell đo áp lực đất nền. Strain gauge trên lưới đo biến dạng.', purpose: 'Thu thập đồng bộ dữ liệu ứng xử của toàn bộ hệ thống.', controlledParams: ['Độ chính xác LVDT ±0,01 mm', 'Shunt calibration sai lệch < 5%'], possibleErrors: ['Cảm biến bị offset', 'Tín hiệu nhiễu'] },
  { step: 9, title: 'Lắp hệ khung gia tải', description: 'Khung thép chữ U có độ cứng cao. Động cơ + hộp giảm tốc + vít me bi truyền lực thẳng đứng. Vòng đo lực xác nhận tải trọng.', purpose: 'Truyền tải đều, đồng tâm, kiểm soát tốc độ gia tải.', controlledParams: ['Tâm gia tải trùng tâm mô hình', 'Tốc độ = 0,061 mm/phút'], possibleErrors: ['Tải lệch tâm', 'Tốc độ không đều'] },
  { step: 10, title: 'Tiến hành gia tải theo từng cấp', description: 'Gia tải CRP (tốc độ biến dạng không đổi 0,061 mm/phút). Các cấp: 18, 36, 54, 72, 90, 108, 120 kPa. Mỗi cấp duy trì 2,5 phút.', purpose: 'Mô phỏng điều kiện tải trọng ngắn hạn, không thoát nước.', controlledParams: ['Tốc độ CRP = 0,061 mm/phút', 'Thời gian mỗi cấp = 2,5 phút'], possibleErrors: ['Mất ổn định đột ngột', 'Biến dạng dư'] },
  { step: 11, title: 'Ghi nhận số liệu theo từng cấp tải', description: 'Data Logger ghi tự động: tải trọng, độ lún, ứng suất đỉnh trụ, áp lực đất nền, biến dạng lưới ĐKT.', purpose: 'Thu thập dữ liệu đồng bộ, liên tục, chính xác.', controlledParams: ['Tần suất ghi dữ liệu', 'Đồng bộ thời gian'], possibleErrors: ['Mất dữ liệu do lỗi kết nối', 'Cảm biến bão hòa'] },
  { step: 12, title: 'Kết thúc thí nghiệm', description: 'Gia tải đến khi tổng độ lún đạt 40 mm (100% D). Dỡ tải, quan sát hình dạng phá hoại trụ. Chụp ảnh cắt ngang.', purpose: 'Xác định cơ chế phá hoại (phình nở tại 2,5D–4D từ đỉnh trụ).', controlledParams: ['Độ lún giới hạn = 40 mm'], possibleErrors: ['Phá hoại đột ngột', 'Khó quan sát mặt cắt'] },
  { step: 13, title: 'Xuất bảng số liệu và đồ thị', description: 'Xử lý dữ liệu thô: lọc nhiễu, chuẩn hóa, tính các chỉ tiêu: qult, E₅₀, n, biến dạng lưới. Vẽ đường cong σ–ε, tải–lún.', purpose: 'Phân tích định lượng kết quả thí nghiệm.', controlledParams: ['Sai số thí nghiệm lặp < 5%', 'R² > 0,98'], possibleErrors: ['Dữ liệu ngoại lai', 'Hồi quy không phù hợp'] },
];

// ===== THÔNG SỐ CẤU HÌNH HÌNH HỌC =====
export const SPACING_RATIOS = {
  sD_25: { label: 's/D = 2,5', sD: 2.5, s_mm: 100, as: 12.57, density: '25 trụ/100m²' },
  sD_30: { label: 's/D = 3,0', sD: 3.0, s_mm: 120, as: 8.73, density: '17 trụ/100m²' },
  sD_35: { label: 's/D = 3,5', sD: 3.5, s_mm: 140, as: 6.41, density: '13 trụ/100m²' },
};

// ===== CÔNG THỨC ĐỀ XUẤT =====
export const PROPOSED_FORMULAS = {
  qult_no_geogrid: { formula: 'qult = 18,312 × cu', Nc: 18.312, description: 'Khi trụ VLHR không có lưới ĐKT' },
  qult_with_geogrid: { formula: 'qult = 21,208 × cu', Nc: 21.208, description: 'Khi trụ VLHR kết hợp lưới ĐKT' },
};

// ===== CHART COLORS =====
export const CHART_COLORS: Record<string, string | string[]> = {
  sD_25: '#4e7ab9',   // UTC Blue
  sD_30: '#f5b731',   // UTC Gold
  sD_35: '#6b7b8d',   // UTC Gray
  IL_078: '#4e7ab9',  // UTC Blue
  IL_10: '#f5b731',   // UTC Gold
  IL_15: '#6b7b8d',   // UTC Gray
  with_geogrid: '#10b981',
  without_geogrid: '#6b7280',
  Ec: ['#4e7ab9', '#f5b731', '#6b7b8d', '#10b981', '#8b5cf6'],
};

// ===== CHIỀU DÀY ĐỆM CÁT (Bảng 3.8) =====
export const SAND_CUSHION = [
  { sD: 'sD_25', bs8006_min: 90, used: 100, unit: 'mm' },
  { sD: 'sD_30', bs8006_min: 118, used: 120, unit: 'mm' },
  { sD: 'sD_35', bs8006_min: 146, used: 150, unit: 'mm' },
];

// ===== QUY ĐỔI TỶ LỆ MÔ HÌNH (Bảng 3.4) =====
export const MODEL_SCALE_TABLE = [
  { param: 'Chiều dày nền đất yếu', symbol: 'H_dy', prototype: 12000, model: 600, unit: 'mm' },
  { param: 'Chiều cao lớp đắp', symbol: 'H_dap', prototype: 6000, model: 300, unit: 'mm' },
  { param: 'Đường kính trụ', symbol: 'D', prototype: 800, model: 40, unit: 'mm' },
  { param: 'Chiều dài trụ', symbol: 'L', prototype: 12000, model: 600, unit: 'mm' },
  { param: 'Khoảng cách trụ', symbol: 's', prototype: 2000, model: 100, unit: 'mm' },
  { param: 'Độ cứng lưới ĐKT', symbol: 'J', prototype: 2000, model: 100, unit: 'kN/m' },
  { param: 'Cường độ kéo lưới', symbol: 'T', prototype: 200, model: 10, unit: 'kN/m' },
  { param: 'Tải trọng phân bố', symbol: 'q', prototype: 12, model: 12, unit: 'kPa' },
];
