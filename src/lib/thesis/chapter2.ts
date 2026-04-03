// =====================================================================
// NỘI DUNG CHƯƠNG 2 — CƠ SỞ LÝ THUYẾT
// Trích xuất từ luận án NCS. Nguyễn Hải Hà, ĐH GTVT, 2026
// =====================================================================

export const CHAPTER2 = {
  title: 'Cơ sở lý thuyết tính toán và mô hình hóa hệ trụ VLHR kết hợp lưới ĐKT',
  titleEn: 'Theoretical Basis for Analysis and Modeling of GRCS Systems',

  sections: [
    {
      id: 'parameters',
      title: 'Các thông số trụ VLHR và phương pháp xác định',
      titleEn: 'Key Parameters and Determination Methods',
      subsections: [
        {
          id: 'E50',
          title: 'Mô đun biến dạng E₅₀',
          content: `Mô đun biến dạng cát tuyến E₅₀ được xác định tại 50% ứng suất phá hoại, là thông số quan trọng phản ánh độ cứng của trụ VLHR. Giá trị E₅₀ phụ thuộc vào: loại vật liệu trụ, độ chặt, áp lực bó hông (phụ thuộc đất nền xung quanh) và điều kiện thí nghiệm.`,
          formula: 'E₅₀ = σ₅₀ / ε₅₀ = (qult/2) / ε₅₀',
          values: [
            { material: 'Đá dăm đầm chặt', E50: '15–55 MPa', source: 'Bảng 2.1' },
            { material: 'Sỏi sạn', E50: '10–40 MPa', source: 'Bảng 2.1' },
            { material: 'Cát thô', E50: '5–25 MPa', source: 'Bảng 2.1' },
          ],
          keyInsight: 'E₅₀ của trụ VLHR trong luận án: 4–25 MPa, phù hợp phạm vi tài liệu quốc tế.',
        },
        {
          id: 'SCR',
          title: 'Hệ số tập trung ứng suất n (SCR)',
          content: `Hệ số tập trung ứng suất n = σc/σs phản ánh mức độ chia tải giữa trụ và đất nền. n phụ thuộc vào tỷ số mô đun Ec/Es, khoảng cách s/D, độ cứng lưới J và cấp tải trọng. Phạm vi n = 2–5 cho trụ VLHR (so với n = 10–20 cho cọc cứng).`,
          formula: 'n = σc / σs',
          values: [
            { source: 'Barksdale & Bachus (1983)', range: 'n = 2,5–5,0' },
            { source: 'Han (2015)', range: 'n ≈ (Ec/Es)^0,5' },
            { source: 'FHWA (1983)', range: 'n = 2,5–5,0' },
            { source: 'Luận án (MHVL)', range: 'n = 2,00–3,64' },
          ],
          keyInsight: 'n giảm dần theo tải trọng do đất nền dần cố kết và tham gia chịu lực.',
        },
        {
          id: 'J',
          title: 'Độ cứng lưới địa kỹ thuật J',
          content: `Độ cứng kéo J (kN/m) ảnh hưởng đến hiệu quả truyền tải qua hiệu ứng màng. Khi J tăng, lực kéo T trong lưới giảm (do lưới ít biến dạng hơn), nhưng hệ số n tăng do lưới truyền nhiều tải hơn lên đầu trụ. Tuy nhiên, khi J quá lớn (> 5000 kN/m), lưới gần như không biến dạng nên hiệu ứng màng suy giảm.`,
          formula: 'J = T / ε (kN/m)',
          keyInsight: 'Độ cứng tối ưu J ≈ 3000 kN/m cho trụ VLHR (phân tích số Plaxis 3D).',
        },
      ],
    },
    {
      id: 'bearing_capacity',
      title: 'Lý thuyết sức chịu tải giới hạn trụ VLHR',
      titleEn: 'Bearing Capacity Theory',
      subsections: [
        {
          id: 'single_bc',
          title: 'Trụ đơn VLHR',
          content: `Cơ chế phá hoại chính của trụ đơn VLHR trong đất sét mềm là phình nở (bulging) tại độ sâu 2,5D–4D từ đỉnh trụ. Hughes & Withers (1974) đề xuất lý thuyết nở hông giới hạn, trong đó SCT phụ thuộc vào áp lực bó hông do đất nền cung cấp.`,
          formulas: [
            { name: 'Hughes & Withers (1974)', formula: 'qult = σr,lim × Kp = (σr0 + 4cu) × Kp', note: 'Kp = tan²(45° + φc/2)' },
            { name: 'Vesic (1972)', formula: 'qult = c × Nc + σ₃ × Nq', note: 'Nc phụ thuộc φ và Ir' },
          ],
          keyInsight: 'SCT giảm 61% khi IL tăng từ 0,78 → 1,5 do áp lực bó hông giảm.',
        },
        {
          id: 'group_bc',
          title: 'Nhóm trụ VLHR',
          content: `Nhóm trụ VLHR có hành vi khác trụ đơn do: (1) tương tác nhóm giữa các trụ; (2) hiệu ứng vòm trong khối đắp; (3) hiệu ứng màng của lưới ĐKT. Ba cơ chế phá hoại nhóm trụ: phình nở cục bộ, xuyên thủng, và phá hoại tổng thể khối.`,
          formulas: [
            { name: 'Sức chịu tải tổng hợp', formula: 'qgroup = σc × as + σs × (1 - as)', note: 'as = Ac/A' },
            { name: 'Hiệu ứng vòm', formula: 'E = σc×as / (σc×as + σs×(1-as))', note: 'E: hệ số hiệu quả vòm' },
          ],
          keyInsight: 'Đóng góp của lưới ĐKT tăng khi đất yếu hơn: Δqult = 24,8% tại IL=1,5.',
        },
      ],
    },
    {
      id: 'settlement',
      title: 'Dự báo lún trụ VLHR trong xử lý nền đất yếu',
      titleEn: 'Settlement Prediction Methods',
      subsections: [
        {
          id: 'priebe',
          title: 'Phương pháp Priebe (1995)',
          content: 'Dựa trên hệ số cải thiện nền n₀, phụ thuộc tỷ lệ diện tích thay thế as và tỷ số mô đun Ec/Es. Phương pháp đơn giản nhưng không xét hiệu ứng vòm và lưới ĐKT.',
          formula: 'β = 1 / [1 + as(n₀ - 1)]',
          note: 'β: hệ số giảm lún; n₀: hệ số cải thiện cơ bản',
        },
        {
          id: 'balaam',
          title: 'Phương pháp Balaam & Booker (1981, 1985)',
          content: 'Giải tích đàn hồi xét sự tương tác trụ-đất theo bài toán cell trụ tròn. Phù hợp khi biến dạng nhỏ và vật liệu đàn hồi tuyến tính.',
          formula: 'S = S₀ × μc',
          note: 'S₀: lún nền tự nhiên; μc: hệ số hiệu chỉnh',
        },
        {
          id: 'geogrid_effect',
          title: 'Ảnh hưởng lưới ĐKT đến độ lún',
          content: 'Lưới ĐKT giảm lún qua 2 cơ chế: (1) tăng cường truyền tải lên đầu trụ → giảm ứng suất trên đất nền; (2) cung cấp ức chế biến dạng ngang → tăng mô đun nền tổng thể.',
          keyInsight: 'Giảm lún 52,6% khi s/D giảm từ 3,5 → 2,5 (17,32 → 8,21 mm tại 120 kPa).',
        },
      ],
    },
    {
      id: 'arching',
      title: 'Hiệu ứng vòm trong nền đắp',
      titleEn: 'Soil Arching Effect in Embankment',
      content: `Khi khối đắp trên hệ trụ chịu tải, chênh lệch độ cứng trụ-đất nền tạo ra chuyển vị vi sai. Đất nền mềm lún nhiều hơn đầu trụ, gây phát triển ứng suất cắt trong khối đắp, hình thành "vòm" ứng suất chuyển tải từ vùng đất yếu lên đầu trụ.`,
      methods: [
        { name: 'Terzaghi (1943)', desc: 'Cửa trượt phẳng, đơn giản nhưng thiên cao', formula: 'σs = γH/(2Kμ) × [1 - exp(-2Kμz/B)]' },
        { name: 'Hewlett & Randolph (1988)', desc: 'Vòm bán cầu, phổ biến trong BS 8006', formula: 'Hcr = 0,7(s-a)' },
        { name: 'BS 8006-1 (2010)', desc: 'Phương pháp dựa trên H&R + hệ số an toàn', formula: 'H ≥ 1,4(s-a) để vòm hoàn chỉnh' },
        { name: 'EBGEO (2011)', desc: 'Vòm đa lớp theo Zaeske (2001), chính xác nhất', formula: 'Nhiều lớp vòm phát triển từ mặt đỉnh trụ' },
      ],
      comparison: 'Các phương pháp cho kết quả chênh lệch 20–40% (Van Eekelen, 2013). Phương pháp EBGEO được đánh giá phù hợp nhất với trụ VLHR.',
    },
    {
      id: 'membrane',
      title: 'Hiệu ứng màng của lưới ĐKT',
      titleEn: 'Membrane Effect of Geosynthetics',
      content: `Lưới ĐKT trải trên đỉnh trụ hoạt động như lớp truyền tải. Khi đất nền giữa các trụ lún, lưới bị kéo căng phát sinh lực kéo T. Lực kéo có thành phần thẳng đứng Tv hướng lên, đỡ bớt tải trọng cho đất nền và chuyển thêm tải lên đầu trụ.`,
      keyFormulas: [
        { name: 'Lực kéo lưới', formula: 'T = J × ε', note: 'J: độ cứng kéo, ε: biến dạng lưới' },
        { name: 'Thành phần đứng', formula: 'Tv = T × sin(α)', note: 'α: góc nghiêng lưới' },
      ],
      practicalValues: [
        'T = 3,01–3,67 kN/m tại p = 120 kPa (thực nghiệm)',
        'ε < 6% (giới hạn thiết kế EBGEO)',
        'J tối ưu ≈ 3000 kN/m cho trụ VLHR',
        'Hiệu quả tăng qult: 12,6%–24,8% tùy IL',
      ],
    },
    {
      id: 'interaction',
      title: 'Cơ chế tương tác đất–trụ–lưới',
      titleEn: 'Soil-Column-Geogrid Interaction',
      content: `Ba thành phần làm việc đồng thời: (1) Hiệu ứng vòm tập trung tải lên đỉnh trụ; (2) Hiệu ứng màng bổ sung lực truyền; (3) Đất nền cung cấp áp lực bó hông. Tỷ lệ đóng góp phụ thuộc H, J, s/D và tính chất đất nền.`,
      stages: [
        { name: 'Giai đoạn thi công', n_range: 'n ≈ 2–3', source: 'Briançon & Simon, 2012' },
        { name: 'Giai đoạn cố kết', n_range: 'n tăng lên 4–6', source: 'Ghorbani và nnk, 2021' },
        { name: 'Giai đoạn ổn định', n_range: 'n = 4–8', source: 'Jenck và nnk, 2009' },
      ],
    },
    {
      id: 'model_theory',
      title: 'Lý thuyết mô hình vật lý và tỷ lệ mô hình',
      titleEn: 'Physical Model Theory and Scaling',
      content: `Mô hình vật lý dựa trên lý thuyết tương tự, trong đó các thông số nguyên mẫu được thu nhỏ theo tỷ lệ N sao cho các quan hệ cơ học được bảo toàn. Mô hình 1g (trọng lực bình thường) đơn giản hơn mô hình ly tâm nhưng có giới hạn về ứng suất tự trọng.`,
      comparison: [
        { criterion: 'Trường ứng suất', model_1g: 'Nhỏ hơn thực tế N lần', centrifuge: 'Đúng quy mô' },
        { criterion: 'Chi phí', model_1g: 'Thấp', centrifuge: 'Rất cao' },
        { criterion: 'Kích thước mẫu', model_1g: 'Lớn hơn', centrifuge: 'Rất nhỏ' },
        { criterion: 'Đo đạc', model_1g: 'Kích thước lớn → dễ đo', centrifuge: 'Khó đo' },
        { criterion: 'Phù hợp', model_1g: 'Nghiên cứu cơ chế, xu hướng', centrifuge: 'Dự báo định lượng' },
      ],
      scaleFactors: [
        { param: 'Chiều dài', factor: '1/N', value: '1/20' },
        { param: 'Diện tích', factor: '1/N²', value: '1/400' },
        { param: 'Thể tích', factor: '1/N³', value: '1/8000' },
        { param: 'Ứng suất', factor: '1 (1g)', value: '1' },
        { param: 'Biến dạng', factor: '1', value: '1' },
        { param: 'Lực', factor: '1/N²', value: '1/400' },
        { param: 'Mô đun', factor: '1', value: '1' },
        { param: 'Độ cứng lưới J', factor: '1/N', value: '1/20' },
      ],
    },
  ],
};
