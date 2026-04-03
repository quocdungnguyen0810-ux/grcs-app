// ===================================================================
// Experiment 3D Visualization — Types
// ===================================================================

/** Physical model configuration matching thesis specifications */
export interface ModelConfig {
  /** Column positions as [x, z] grid coordinates (mm) */
  columnPositions: [number, number][];
  /** Spacing between grid lines (mm) */
  gridSpacing: number;
  /** Column diameter (mm) */
  columnDiameter: number;
  /** Column height/length (mm) */
  columnHeight: number;
  /** Y level of geogrid surface (mm from base) */
  geogridLevel: number;
  /** Thickness of sand cushion layer (mm) */
  sandLayerThickness: number;
  /** Gauge positions — same as column positions (at column heads) */
  gaugePositions: [number, number][];
  /** Soft soil bed thickness (mm) */
  soilBedThickness: number;
  /** Thickness of bottom base sand layer (mm) */
  baseSandThickness: number;
  /** Tank dimensions (mm) */
  tankWidth: number;
  tankDepth: number;
  tankHeight: number;
  /** Whether the tank is circular (cylinder) */
  isCircular?: boolean;
  /** Tank inner diameter for circular tanks (mm) */
  tankDiameter?: number;
}

/** Group column config based on thesis MHVL 1:20 (2x2 group) */
export const GROUP_COLUMN_CONFIG: ModelConfig = {
  // 2x2 column group, centered in tank
  columnPositions: [
    [-50, -50],
    [50, -50],
    [-50, 50],
    [50, 50],
  ],
  gridSpacing: 100, // 100mm grid spacing = 2.5D (D=40mm)
  columnDiameter: 40, // 40mm diameter
  columnHeight: 600, // 600mm length
  baseSandThickness: 200, // 200mm base sand
  geogridLevel: 800, // At top of columns (200 + 600)
  sandLayerThickness: 100, // 100mm upper sand cushion
  gaugePositions: [
    [-50, -50],
    [50, -50],
    [-50, 50],
    [50, 50],
  ],
  soilBedThickness: 600, // 600mm soil bed
  tankWidth: 1000,
  tankDepth: 500,
  tankHeight: 1000, // Adjusted to fit 200 + 600 + 100 + instruments
};

/** Single column config — Circular cylinder Ø380mm × H1000mm */
export const SINGLE_COLUMN_CONFIG: ModelConfig = {
  // 1 column centered in circular tank
  columnPositions: [
    [0, 0],
  ],
  gridSpacing: 100,
  columnDiameter: 40,
  columnHeight: 600,
  baseSandThickness: 200,   // 200mm compacted sand cushion at bottom
  geogridLevel: 800,        // Geogrid on top of columns (200 + 600)
  sandLayerThickness: 100,  // 100mm sand cushion on top of geogrid
  gaugePositions: [
    [0, 0],
  ],
  soilBedThickness: 600,    // 600mm soft clay layer
  isCircular: true,
  tankDiameter: 380,        // Inner diameter 380mm
  tankWidth: 380,
  tankDepth: 380,
  tankHeight: 1000,         // Total height 1000mm
};

/** Construction animation steps */
export type AssemblyStep =
  | 'tank'
  | 'baseSand'
  | 'soil'
  | 'columns'
  | 'geogrid'
  | 'topSand'
  | 'gauges'
  | 'loadingSystem'
  | 'loading';

export const ASSEMBLY_STEPS: {
  id: AssemblyStep;
  label: string;
  labelEn: string;
  description: string;
}[] = [
  {
    id: 'tank',
    label: 'Chuẩn bị thùng thí nghiệm',
    labelEn: 'Prepare model tank',
    description: 'Thùng trụ tròn Ø380×1000mm (trụ đơn) hoặc thùng hộp 1000×500×1000mm (nhóm trụ)',
  },
  {
    id: 'baseSand',
    label: 'Tạo lớp đệm cát đáy',
    labelEn: 'Create bottom sand cushion',
    description: 'Lớp đệm cát đầm chặt dày 20 cm ở đáy mô hình để thoát nước',
  },
  {
    id: 'soil',
    label: 'Đổ lớp đất yếu',
    labelEn: 'Prepare soft soil foundation',
    description: 'Đổ và chuẩn bị lớp đất sét pha yếu dày 60 cm theo phương pháp đầm từng lớp',
  },
  {
    id: 'columns',
    label: 'Thi công trụ VLHR',
    labelEn: 'Construct VLHR columns',
    description: 'Thi công trụ VLHR D=40mm, L=600mm trong nền đất yếu',
  },
  {
    id: 'geogrid',
    label: 'Trải lưới ĐKT',
    labelEn: 'Place geogrid layer',
    description: 'Trải lưới ĐKT J = 100 kN/m trực tiếp trên đỉnh các trụ VLHR đã thi công',
  },
  {
    id: 'topSand',
    label: 'Đổ lớp đệm cát trên',
    labelEn: 'Place top sand cushion',
    description: 'Trải lớp đệm cát dày 10 cm phía trên lưới ĐKT để phân bố tải trọng',
  },
  {
    id: 'gauges',
    label: 'Lắp đặt thiết bị đo',
    labelEn: 'Install instruments',
    description: 'Lắp đặt cảm biến đo ứng suất, biến dạng lưới và LVDT',
  },
  {
    id: 'loadingSystem',
    label: 'Lắp hệ thống truyền lực',
    labelEn: 'Install load transfer system',
    description: 'Lắp đặt tấm phân bố tải và hệ thống đo cơ học phía trên đệm cát',
  },
  {
    id: 'loading',
    label: 'Tiến hành gia tải',
    labelEn: 'Apply loading test',
    description: 'Thí nghiệm gia tải từng cấp (18-120 kPa) để ghi nhận ứng xử nền - trụ - lưới',
  },
];

/** 3D Visualization mode */
export type VisualizationMode = 'assembly' | 'structural' | 'experiment';

/** Layer visibility toggles */
export interface LayerVisibility {
  tank: boolean;
  baseSand: boolean;
  soil: boolean;
  columns: boolean;
  geogrid: boolean;
  topSand: boolean;
  gauges: boolean;
  loadingSystem: boolean;
  loading: boolean;
  labels: boolean;
}

export const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  tank: true,
  baseSand: true,
  soil: true,
  columns: true,
  geogrid: true,
  topSand: true,
  gauges: true,
  loadingSystem: true,
  loading: true,
  labels: true,
};
