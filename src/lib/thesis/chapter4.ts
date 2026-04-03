// Chapter 4 content - see chapter4.ts
export const CHAPTER4 = {
  title: 'Ứng xử của trụ VLHR kết hợp lưới ĐKT trong xử lý nền đất yếu dưới khối đắp',
  titleEn: 'Behavior of GRSC Combined with Geosynthetics Under Embankment Loading',
  singleColumnBehavior: {
    title: 'Ứng xử trụ đơn VLHR kết hợp lưới ĐKT',
    axialCapacity: {
      title: 'Khả năng chịu tải dọc trục',
      content: 'SCT trụ đơn phụ thuộc mạnh vào IL và lưới ĐKT. Tương quan tuyến tính chặt giữa qult và cu.',
      results: [
        { IL: 0.78, noGeogrid: 378, withGeogrid: 426, improvement: 12.7 },
        { IL: 1.0, noGeogrid: 187, withGeogrid: 227, improvement: 21.4 },
        { IL: 1.5, noGeogrid: 148, withGeogrid: 188, improvement: 27.0 },
      ],
      formulas: {
        noGeogrid: { formula: 'qult = 18,312 × cu', Nc: 18.312, R2: 0.997 },
        withGeogrid: { formula: 'qult = 21,208 × cu', Nc: 21.208, R2: 0.995 },
      },
      interpretation: [
        'qult giảm 61% khi IL tăng từ 0,78 → 1,5',
        'Lưới ĐKT tăng qult 12,7%–27,0%',
        'Hiệu quả lưới tăng khi đất yếu hơn',
        'Nc phù hợp FHWA (18–22)',
      ],
    },
    E50Analysis: {
      title: 'Mô đun biến dạng E₅₀',
      content: 'E₅₀ nhạy cảm hơn qult: giảm 81% vs 61% khi IL tăng.',
      results: [
        { IL: 0.78, noGeogrid: 21.0, withGeogrid: 25.1, unit: 'MPa' },
        { IL: 1.0, noGeogrid: 9.35, withGeogrid: 11.3, unit: 'MPa' },
        { IL: 1.5, noGeogrid: 4.0, withGeogrid: 5.1, unit: 'MPa' },
      ],
      comparison: [
        { study: 'Luận án (MHVL)', range: '4–25 MPa', condition: 'IL=0,78–1,5' },
        { study: 'Long Sơn', range: '25–70 MPa', condition: 'Hiện trường' },
        { study: 'FHWA', range: '15–55 MPa', condition: 'Đá dăm đầm chặt' },
      ],
    },
  },
  groupColumnBehavior: {
    title: 'Ứng xử nhóm trụ VLHR kết hợp lưới ĐKT',
    settlement: {
      title: 'Độ lún và quan hệ tải trọng–lún',
      keyResults: [
        { sD: '2,5', as: '12,57%', s120: '8,21mm', rate: '0,070mm/kPa' },
        { sD: '3,0', as: '8,73%', s120: '12,56mm', rate: '0,109mm/kPa' },
        { sD: '3,5', as: '6,41%', s120: '17,32mm', rate: '0,155mm/kPa' },
      ],
    },
    stressConcentration: {
      title: 'Hệ số TTƯS n',
      content: 'n dao động 2,00–3,64, giảm dần theo tải.',
      interpretation: [
        'n cao nhất tại p=18kPa: n=3,33–3,64',
        'n ổn định tại p=120kPa: n=2,00–2,03',
        'n phù hợp FHWA (2,5–5,0)',
      ],
    },
  },
  parameterAnalysis: {
    title: 'Phân tích yếu tố ảnh hưởng (Plaxis 3D)',
    parameters: [
      { name: 'Ec', influence: 'n tăng khi Ec tăng (15→55 MPa: n=1,83→2,90)', source: 'Bảng 4.5' },
      { name: 'Es', influence: 'n giảm khi Es tăng (1→5 MPa: n=2,76→1,73)', source: 'Bảng 4.6' },
      { name: 'J', influence: 'Tối ưu J≈3000 kN/m', source: 'Bảng 4.7' },
      { name: 's/D', influence: 'n tăng nhẹ khi s/D tăng', source: 'Bảng 4.8' },
    ],
  },
  conclusions: [
    'qult = Nc × cu: Nc=18,3 (không lưới), 21,2 (có lưới)',
    'E₅₀ nhạy hơn qult với IL: giảm 81% vs 61%',
    'Lưới ĐKT hiệu quả hơn khi đất yếu: Δqult=12,7→27,0%',
    'n = 2,00–3,64, giảm dần theo tải, phù hợp FHWA',
    's/D = 2,5–3,0 tối ưu: lún giảm 52,6%',
    'J tối ưu ≈ 3000 kN/m',
    'MHVL phù hợp Plaxis 3D, sai lệch <10%',
  ],
};
