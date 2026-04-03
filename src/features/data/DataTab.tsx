import { useState } from 'react';
import { SINGLE_COLUMN_RESULTS, GROUP_COLUMN_RESULTS, PRESSURE_LEVELS, SOIL_STATES, SPACING_RATIOS } from '../../lib/data';
import { Database, Download, Upload, FileJson } from 'lucide-react';

export default function DataTab() {
  const [activeTable, setActiveTable] = useState<'single' | 'group_settlement' | 'group_stress' | 'group_n'>('single');

  const handleExportJSON = () => {
    const data = {
      singleColumn: SINGLE_COLUMN_RESULTS,
      groupColumn: GROUP_COLUMN_RESULTS,
      pressureLevels: PRESSURE_LEVELS,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'experiment_data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'Bảng,Kịch bản,Áp lực (kPa),Giá trị\n';
    GROUP_COLUMN_RESULTS.forEach(r => {
      r.pressureLevels.forEach((p, i) => {
        csv += `Độ lún,${r.sD},${p},${r.settlement[i]}\n`;
        csv += `Ứng suất đỉnh trụ,${r.sD},${p},${r.columnStress[i]}\n`;
        csv += `Áp lực đất nền,${r.sD},${p},${r.soilPressure[i]}\n`;
        csv += `Hệ số n,${r.sD},${p},${r.stressConcentration[i]}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'experiment_data.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Database className="w-5 h-5 text-primary-400" />
        <h2 className="section-title !mb-0">Dữ liệu & Quản trị</h2>
        <span className="label-en">Data Management</span>
      </div>

      {/* Export buttons */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <button onClick={handleExportJSON} className="btn-primary flex items-center gap-2">
          <FileJson className="w-4 h-4" />Xuất JSON
        </button>
        <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />Xuất CSV
        </button>
        <label className="btn-outline flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />Nhập dữ liệu JSON
          <input type="file" accept=".json" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => { alert('Đã đọc file: ' + file.name + '\nKích thước: ' + (ev.target?.result as string).length + ' bytes\n\n(Tính năng import sẽ được phát triển thêm)'); };
              reader.readAsText(file);
            }
          }} />
        </label>
      </div>

      {/* Table selector */}
      <div className="flex flex-wrap gap-1 bg-surface-800/50 p-1 rounded-xl">
        {[
          { id: 'single', label: 'Trụ đơn – σ-ε' },
          { id: 'group_settlement', label: 'Nhóm trụ – Độ lún' },
          { id: 'group_stress', label: 'Nhóm trụ – Ứng suất' },
          { id: 'group_n', label: 'Nhóm trụ – Hệ số n' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTable(t.id as typeof activeTable)} className={`tab-button text-xs ${activeTable === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      <div className="glass-card p-5 overflow-x-auto">
        {activeTable === 'single' && (
          <>
            <h3 className="text-sm font-semibold text-surface-200 mb-3">Bảng 3.12 – Đường cong ứng suất – biến dạng trụ đơn VLHR</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>IL</th>
                  <th>Lưới ĐKT</th>
                  <th>ε = 0,5%</th>
                  <th>ε = 1,0%</th>
                  <th>ε = 1,5%</th>
                  <th>ε = 2,0%</th>
                  <th>ε = 2,5%</th>
                  <th>ε = 3,0%</th>
                  <th>ε = 3,5%</th>
                  <th>ε = 4,0%</th>
                  <th>σmax</th>
                  <th>E50</th>
                </tr>
              </thead>
              <tbody>
                {SINGLE_COLUMN_RESULTS.map((r, i) => (
                  <tr key={i}>
                    <td className="font-semibold" style={{ color: SOIL_STATES[r.IL].color }}>{SOIL_STATES[r.IL].IL}</td>
                    <td>{r.geogrid === 'with_geogrid' ? <span className="badge badge-green">Có</span> : <span className="badge badge-amber">Không</span>}</td>
                    {r.stressStrainCurve.map((pt, j) => <td key={j} className="font-mono text-xs">{pt.sigma.toFixed(1)}</td>)}
                    <td className="font-semibold text-surface-100">{r.sigmaMax.toFixed(1)}</td>
                    <td className="font-semibold text-primary-400">{(r.E50 / 1000).toFixed(1)} MPa</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTable === 'group_settlement' && (
          <>
            <h3 className="text-sm font-semibold text-surface-200 mb-3">Bảng 3.14 – Độ lún đất nền theo cấp tải trọng (mm)</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>s/D</th>
                  {PRESSURE_LEVELS.map(p => <th key={p}>{p} kPa</th>)}
                </tr>
              </thead>
              <tbody>
                {GROUP_COLUMN_RESULTS.map(r => (
                  <tr key={r.sD}>
                    <td className="font-semibold">{r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}</td>
                    {r.settlement.map((s, i) => <td key={i} className="font-mono text-xs">{s.toFixed(2)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTable === 'group_stress' && (
          <>
            <h3 className="text-sm font-semibold text-surface-200 mb-3">Bảng 4.4 – Ứng suất đỉnh trụ & áp lực đất nền (kPa)</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>s/D</th>
                  <th>Đại lượng</th>
                  {PRESSURE_LEVELS.map(p => <th key={p}>{p} kPa</th>)}
                </tr>
              </thead>
              <tbody>
                {GROUP_COLUMN_RESULTS.map(r => (
                  <>
                    <tr key={r.sD + '_col'}>
                      <td rowSpan={2} className="font-semibold align-middle">{r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}</td>
                      <td className="text-amber-400">σc</td>
                      {r.columnStress.map((s, i) => <td key={i} className="font-mono text-xs">{s.toFixed(1)}</td>)}
                    </tr>
                    <tr key={r.sD + '_soil'}>
                      <td className="text-emerald-400">σs</td>
                      {r.soilPressure.map((s, i) => <td key={i} className="font-mono text-xs">{s.toFixed(1)}</td>)}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTable === 'group_n' && (
          <>
            <h3 className="text-sm font-semibold text-surface-200 mb-3">Bảng 4.4 – Hệ số tập trung ứng suất n</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>s/D</th>
                  {PRESSURE_LEVELS.map(p => <th key={p}>{p} kPa</th>)}
                </tr>
              </thead>
              <tbody>
                {GROUP_COLUMN_RESULTS.map(r => (
                  <tr key={r.sD}>
                    <td className="font-semibold">{r.sD === 'sD_25' ? '2,5' : r.sD === 'sD_30' ? '3,0' : '3,5'}</td>
                    {r.stressConcentration.map((n, i) => <td key={i} className="font-mono text-xs">{n.toFixed(2)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="glass-card p-4">
        <h3 className="text-xs font-medium text-surface-500">📌 Ghi chú dữ liệu</h3>
        <p className="text-xs text-surface-500 mt-1">Tất cả dữ liệu đều được trích xuất trực tiếp từ luận án tiến sĩ. Để thay đổi dữ liệu, chỉnh sửa file <code className="text-primary-400">src/lib/data.ts</code> hoặc sử dụng chức năng Nhập dữ liệu JSON.</p>
      </div>
    </div>
  );
}
