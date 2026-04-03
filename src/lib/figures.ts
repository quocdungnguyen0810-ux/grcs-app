export interface ThesisFigure {
  id: string;
  title: string;
  chapter: number;
  caption: string;
  relatedSection: string;
  imageAssetPath: string | null;
  sourceRef: string;
  type: 'experimental' | 'schematic' | 'chart' | 'photo';
}

export const THESIS_FIGURES: ThesisFigure[] = [
  { id: 'H1.1', title: 'Cơ chế truyền tải trọng nền đắp gia cường lưới ĐKT', chapter: 1, caption: 'Sơ đồ truyền tải qua hiệu ứng vòm + màng', relatedSection: 'overview', imageAssetPath: null, sourceRef: 'Hình 1.1', type: 'schematic' },
  { id: 'H1.5', title: 'Các dạng phá hoại của trụ VLHR', chapter: 1, caption: 'Phình nở, xuyên thủng, phá hoại tổng thể', relatedSection: 'mechanism', imageAssetPath: null, sourceRef: 'Hình 1.5', type: 'schematic' },
  { id: 'H2.1', title: 'Cơ chế phá hoại phình hông trụ đơn VLHR', chapter: 2, caption: 'Hughes & Withers, 1974', relatedSection: 'theory', imageAssetPath: null, sourceRef: 'Hình 2.1', type: 'schematic' },
  { id: 'H2.6', title: 'Cơ chế hình thành hiệu ứng vòm', chapter: 2, caption: 'Nền đắp trên hệ trụ VLHR', relatedSection: 'theory', imageAssetPath: null, sourceRef: 'Hình 2.6', type: 'schematic' },
  { id: 'H3.1', title: 'Mô hình thực hệ trụ VLHR + lưới ĐKT', chapter: 3, caption: 'Sơ đồ bố trí mô hình nguyên mẫu', relatedSection: 'model', imageAssetPath: null, sourceRef: 'Hình 3.1', type: 'schematic' },
  { id: 'H3.3', title: 'Thùng thí nghiệm trụ đơn', chapter: 3, caption: '200×200×700 mm', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.3', type: 'photo' },
  { id: 'H3.4', title: 'Thùng thí nghiệm nhóm trụ', chapter: 3, caption: '1000×500×1000 mm', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.4', type: 'photo' },
  { id: 'H3.6', title: 'Hệ thống khung gia tải', chapter: 3, caption: 'Khung U + kích thủy lực', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.6', type: 'photo' },
  { id: 'H3.7', title: 'Thiết bị đo chuyển vị, biến dạng', chapter: 3, caption: 'LVDT, Strain gauge, Load cell', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.7', type: 'photo' },
  { id: 'H3.8', title: 'Trình tự chế tạo trụ đơn VLHR', chapter: 3, caption: 'Đóng ống → lấy đất → đổ cốt liệu → rút ống', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.8', type: 'photo' },
  { id: 'H3.9', title: 'Sơ đồ bố trí thiết bị đo', chapter: 3, caption: 'Bố trí LVDT, LC, SG', relatedSection: 'model-construction', imageAssetPath: null, sourceRef: 'Hình 3.9', type: 'schematic' },
  { id: 'H3.16', title: 'Thí nghiệm gia tải trụ đơn trên MHVL', chapter: 3, caption: 'Ảnh chụp thí nghiệm thực tế', relatedSection: 'experiment', imageAssetPath: null, sourceRef: 'Hình 3.16', type: 'photo' },
  { id: 'H3.17', title: 'Quan hệ σ-ε trụ đơn không lưới', chapter: 3, caption: 'Đường cong ứng suất-biến dạng 3 trạng thái IL', relatedSection: 'charts', imageAssetPath: null, sourceRef: 'Hình 3.17', type: 'chart' },
  { id: 'H3.19', title: 'Trụ đơn bị phá hoại sau thí nghiệm', chapter: 3, caption: 'Phình nở tại 2,5D–4D', relatedSection: 'mechanism', imageAssetPath: null, sourceRef: 'Hình 3.19', type: 'photo' },
  { id: 'H4.1', title: 'Tương quan qult và cu', chapter: 4, caption: 'Phân tích hồi quy tuyến tính', relatedSection: 'insights', imageAssetPath: null, sourceRef: 'Hình 4.1', type: 'chart' },
  { id: 'H4.10', title: 'Mô phỏng Plaxis 3D', chapter: 4, caption: 'MHVL tỷ lệ 1:20', relatedSection: 'insights', imageAssetPath: null, sourceRef: 'Hình 4.10', type: 'schematic' },
  { id: 'H4.12', title: 'Ảnh hưởng Ec đến n', chapter: 4, caption: 'n tăng theo Ec', relatedSection: 'charts', imageAssetPath: null, sourceRef: 'Hình 4.12', type: 'chart' },
  { id: 'H4.14', title: 'Ảnh hưởng J đến n', chapter: 4, caption: 'n tối ưu tại J≈3000', relatedSection: 'charts', imageAssetPath: null, sourceRef: 'Hình 4.14', type: 'chart' },
];
