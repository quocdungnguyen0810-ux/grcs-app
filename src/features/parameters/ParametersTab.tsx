import { SOIL_PROPERTIES, COLUMN_MATERIAL, GEOGRID_PROPERTIES, SOIL_STATES, MODEL_SCALE_TABLE, SAND_CUSHION, SPACING_RATIOS, GEOGRID_SCALE_TABLE } from '../../lib/data';
import type { MaterialProperty } from '../../lib/types';
import { Database, Layers, Grid3x3, Ruler } from 'lucide-react';

function PropertyTable({ title, titleEn, icon: Icon, properties }: {
  title: string; titleEn: string; icon: React.ElementType; properties: MaterialProperty[];
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary-600/20"><Icon className="w-4 h-4 text-primary-400" /></div>
        <div>
          <h3 className="label-vi text-sm">{title}</h3>
          <span className="label-en">{titleEn}</span>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Chỉ tiêu</th>
            <th>Ký hiệu</th>
            <th>Đơn vị</th>
            <th>Giá trị</th>
            <th>Nguồn</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p, i) => (
            <tr key={i}>
              <td>
                <div className="label-vi text-xs">{p.name}</div>
                <div className="label-en">{p.nameEn}</div>
              </td>
              <td className="font-mono text-primary-400">{p.symbol}</td>
              <td className="text-surface-400">{p.unit}</td>
              <td className="font-semibold text-surface-100">{p.value}</td>
              <td className="text-xs text-surface-500">{p.source || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ParametersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="section-title !mb-0">Vật liệu & Thông số đầu vào</h2>
        <span className="label-en">Materials & Input Parameters</span>
      </div>

      {/* Trạng thái đất nền */}
      <div className="glass-card p-5">
        <h3 className="label-vi text-sm mb-4">Trạng thái đất nền theo <span className="sym">I<sub>L</sub></span> <span className="label-en ml-2">Soil states (Table 3.11)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(SOIL_STATES).map((s) => (
            <div key={s.id} className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/30" style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-semibold text-surface-100">{s.label}</span>
                <span className="badge badge-blue text-xs">{s.state}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-surface-500 sym">c<sub>u</sub> = </span><span className="text-surface-100 font-mono">{s.cu} kPa</span></div>
                <div><span className="text-surface-500 sym">E<sub>s</sub> = </span><span className="text-surface-100 font-mono">{s.Es} kPa</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PropertyTable title="Đất nền yếu" titleEn="Soft soil (Table 3.5)" icon={Database} properties={SOIL_PROPERTIES} />
        <PropertyTable title="Vật liệu trụ VLHR" titleEn="Column material (Table 3.6)" icon={Layers} properties={COLUMN_MATERIAL} />
      </div>

      <PropertyTable title="Lưới địa kỹ thuật" titleEn="Geogrid (Table 3.7)" icon={Grid3x3} properties={GEOGRID_PROPERTIES} />

      {/* Cấu hình hình học */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-600/20"><Ruler className="w-4 h-4 text-amber-400" /></div>
          <h3 className="label-vi text-sm">Cấu hình hình học <span className="label-en ml-2">Geometric configuration</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {Object.values(SPACING_RATIOS).map((sr) => (
            <div key={sr.label} className="p-3 bg-surface-800/50 rounded-lg border border-surface-700/30 text-sm">
              <div className="font-semibold text-surface-100 mb-1">{sr.label}</div>
              <div className="text-xs text-surface-400">s = {sr.s_mm} mm · <span className="sym">a<sub>s</sub></span> = {sr.as}% · {sr.density}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chiều dày đệm cát */}
      <div className="glass-card p-5">
        <h3 className="label-vi text-sm mb-3">Chiều dày đệm cát <span className="label-en ml-2">Sand cushion thickness (Table 3.8)</span></h3>
        <table className="data-table">
          <thead><tr><th>Mô hình</th><th>BS 8006 (mm)</th><th>Sử dụng (mm)</th></tr></thead>
          <tbody>
            {SAND_CUSHION.map((sc) => (
              <tr key={sc.sD}><td>{SPACING_RATIOS[sc.sD as keyof typeof SPACING_RATIOS].label}</td><td>{sc.bs8006_min}</td><td className="font-semibold">{sc.used}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quy đổi tỷ lệ */}
      <div className="glass-card p-5">
        <h3 className="label-vi text-sm mb-3">Quy đổi từ nguyên mẫu sang mô hình 1:20 <span className="label-en ml-2">Scale conversion (Table 3.4)</span></h3>
        <table className="data-table">
          <thead><tr><th>Thông số</th><th>Ký hiệu</th><th>Nguyên mẫu</th><th>Mô hình</th><th>Đơn vị</th></tr></thead>
          <tbody>
            {MODEL_SCALE_TABLE.map((row, i) => (
              <tr key={i}>
                <td>{row.param}</td>
                <td className="font-mono text-primary-400">{row.symbol}</td>
                <td className="font-mono">{row.prototype.toLocaleString()}</td>
                <td className="font-semibold text-surface-100">{row.model}</td>
                <td className="text-surface-400">{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lưới ĐKT: Nguyên mẫu vs Mô hình */}
      <div className="glass-card p-5">
        <h3 className="label-vi text-sm mb-3">
          Thông số lưới ĐKT — Nguyên mẫu vs Mô hình
          <span className="label-en ml-2">Geogrid scaling (Bảng quy đổi lưới ĐKT)</span>
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Thông số</th>
              <th>Nguyên mẫu</th>
              <th>Mô hình 1:20</th>
              <th>Quy luật tỷ lệ</th>
              <th>Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            {GEOGRID_SCALE_TABLE.map((row, i) => (
              <tr key={i}>
                <td>
                  <div className="text-xs">{row.param}</div>
                  <div className="text-[10px] text-surface-500">{row.nameEn}</div>
                </td>
                <td className="font-mono">{row.prototype}</td>
                <td className="font-semibold text-emerald-400 font-mono">{row.model}</td>
                <td className="text-xs text-primary-400 font-mono">{row.law}</td>
                <td className="text-surface-400 text-xs">{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-surface-500 mt-2">
          Quy đổi theo Garnier et al. (2007) và Ghazavi & Afshar (2013): n = 20 (tỷ lệ mô hình).
          Biến dạng (ε) được bảo toàn; modulus đàn hồi (E) bảo toàn; độ cứng J và cường độ T giảm n lần.
        </p>
      </div>
    </div>
  );
}
