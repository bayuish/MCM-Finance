import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import BarometerHero from "@/components/BarometerHero";
import { 
  HERO_BAROMETER_CONFIG,
  DASHBOARD_METRICS_DATA,
  MONTHLY_CHART_DATA,
  ACTION_ITEMS_DATA,
  type ActionItem
} from "@/data/mockData";
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Eye,
  BellRing
} from "lucide-react";

// Icon mapping for Dashboard Metric Cards
const ICON_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  Wallet: (props) => <Wallet {...props} />,
  DollarSign: (props) => <DollarSign {...props} />,
  TrendingUp: (props) => <TrendingUp {...props} />,
  CalendarClock: (props) => <CalendarClock {...props} />,
  AlertTriangle: (props) => <AlertTriangle {...props} />,
  CheckCircle2: (props) => <CheckCircle2 {...props} />,
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (!user) return null;

  // Filter items for action table
  const filteredActionItems = ACTION_ITEMS_DATA.filter((item) => {
    const matchesSearch =
      item.nasabah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ActionItem["status"]) => {
    switch (status) {
      case "Lunas":
        return (
          <span className="status-badge status-badge-lunas">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Lunas
          </span>
        );
      case "Aktif":
        return (
          <span className="status-badge status-badge-aktif">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Aktif
          </span>
        );
      case "Segera jatuh tempo":
        return (
          <span className="status-badge status-badge-segera">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Segera Jatuh Tempo
          </span>
        );
      case "Terlambat":
        return (
          <span className="status-badge status-badge-terlambat">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            Terlambat
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Barometer Hero (Dynamic Live Counter from mockData.ts) */}
      <BarometerHero
        title={HERO_BAROMETER_CONFIG.title}
        totalLabel={HERO_BAROMETER_CONFIG.totalLabel}
        totalAmount={HERO_BAROMETER_CONFIG.totalAmount}
        todayLabel={HERO_BAROMETER_CONFIG.todayLabel}
        todayCount={HERO_BAROMETER_CONFIG.todayCount}
        todaySuffix={HERO_BAROMETER_CONFIG.todaySuffix}
        soonCount={HERO_BAROMETER_CONFIG.soonCount}
        soonLabel={HERO_BAROMETER_CONFIG.soonLabel}
        lateCount={HERO_BAROMETER_CONFIG.lateCount}
        lateLabel={HERO_BAROMETER_CONFIG.lateLabel}
      />

      {/* 2. Ringkasan Indikator Keuangan (Imported from mockData.ts) */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Ringkasan Indikator Keuangan Utama</span>
          <span className="text-xs font-semibold text-slate-500">
            Peran: <span className="capitalize text-[#1976d2] font-bold">{user.role}</span>
          </span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_METRICS_DATA.map((card, idx) => {
            const IconComp = ICON_COMPONENTS[card.iconName] || Wallet;
            return (
              <div key={idx} className={`base-card ${card.borderColor} min-w-0 p-5 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0 shadow-sm border border-blue-100">
                    <IconComp className="h-5 w-5 text-[#1976d2]" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
                  {card.formattedValue}
                </p>
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {getStatusBadge(card.status)}
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {card.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Grafik Pembayaran dan Tunggakan (2-Line Chart) */}
      <div className="base-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Grafik Pembayaran dan Tunggakan</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1976d2] border border-blue-200">
                Line Chart (2 Garis)
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Tren perbandingan penerimaan pembayaran (Line Hijau) vs tunggakan belum terbayar (Line Merah).
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-5 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-4 bg-emerald-500 inline-block rounded-full" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500" />
              </span>
              <span className="text-slate-700">Pembayaran (Lunas/Hijau)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-4 bg-rose-500 inline-block rounded-full" />
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white ring-1 ring-rose-500" />
              </span>
              <span className="text-slate-700">Tunggakan (Terlambat/Merah)</span>
            </div>
          </div>
        </div>

        {/* 2-Line SVG Chart Implementation */}
        {(() => {
          const chartWidth = 800;
          const chartHeight = 220;
          const paddingX = 60;
          const paddingY = 25;
          const maxVal = 220000000;

          const nodes = MONTHLY_CHART_DATA.map((item, i) => {
            const x = paddingX + (i * (chartWidth - 2 * paddingX)) / (MONTHLY_CHART_DATA.length - 1);
            const yPay = chartHeight - paddingY - (item.pembayaran / maxVal) * (chartHeight - 2 * paddingY);
            const yTung = chartHeight - paddingY - (item.tunggakan / maxVal) * (chartHeight - 2 * paddingY);
            return { ...item, x, yPay, yTung };
          });

          // Build SVG Path strings
          const payPathD = `M ${nodes[0].x} ${nodes[0].yPay} ` + nodes.slice(1).map(n => `L ${n.x} ${n.yPay}`).join(" ");
          const payAreaD = `M ${nodes[0].x} ${chartHeight - paddingY} L ${nodes[0].x} ${nodes[0].yPay} ` + nodes.slice(1).map(n => `L ${n.x} ${n.yPay}`).join(" ") + ` L ${nodes[nodes.length - 1].x} ${chartHeight - paddingY} Z`;

          const tungPathD = `M ${nodes[0].x} ${nodes[0].yTung} ` + nodes.slice(1).map(n => `L ${n.x} ${n.yTung}`).join(" ");
          const tungAreaD = `M ${nodes[0].x} ${chartHeight - paddingY} L ${nodes[0].x} ${nodes[0].yTung} ` + nodes.slice(1).map(n => `L ${n.x} ${n.yTung}`).join(" ") + ` L ${nodes[nodes.length - 1].x} ${chartHeight - paddingY} Z`;

          return (
            <div className="relative w-full overflow-x-auto pt-2 pb-2">
              <div className="min-w-[650px] relative">
                <svg viewBox="0 0 800 250" className="w-full h-64 overflow-visible">
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Y-Axis Gridlines & Labels */}
                  {[0, 50, 100, 150, 200].map((val, i) => {
                    const y = chartHeight - paddingY - (val / 220) * (chartHeight - 2 * paddingY);
                    return (
                      <g key={i}>
                        <line
                          x1="50"
                          y1={y}
                          x2="770"
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray={val === 0 ? "none" : "4 4"}
                          strokeWidth={val === 0 ? "1.5" : "1"}
                        />
                        <text
                          x="42"
                          y={y + 3}
                          textAnchor="end"
                          className="text-[10px] font-semibold fill-slate-400"
                        >
                          {val > 0 ? `${val} Jt` : "0"}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Fills Under Lines */}
                  <path d={payAreaD} fill="url(#emeraldGradient)" />
                  <path d={tungAreaD} fill="url(#roseGradient)" />

                  {/* Line 1: Pembayaran (Emerald Green) */}
                  <path
                    d={payPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Line 2: Tunggakan (Rose Red) */}
                  <path
                    d={tungPathD}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Nodes & X-Axis Labels */}
                  {nodes.map((node, i) => {
                    const isHovered = hoveredBar === i;
                    return (
                      <g key={i} className="cursor-pointer">
                        {/* Vertical Crosshair Line on hover */}
                        {isHovered && (
                          <line
                            x1={node.x}
                            y1="15"
                            x2={node.x}
                            y2={chartHeight - paddingY}
                            stroke="#94a3b8"
                            strokeDasharray="3 3"
                            strokeWidth="1.5"
                          />
                        )}

                        {/* Pembayaran Data Node Circle (Green) */}
                        <circle
                          cx={node.x}
                          cy={node.yPay}
                          r={isHovered ? "7" : "5"}
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        {/* Tunggakan Data Node Circle (Red) */}
                        <circle
                          cx={node.x}
                          cy={node.yTung}
                          r={isHovered ? "7" : "5"}
                          fill="#f43f5e"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        {/* X-Axis Month Label */}
                        <text
                          x={node.x}
                          y="215"
                          textAnchor="middle"
                          className={`text-[11px] font-bold ${
                            isHovered ? "fill-[#1976d2]" : "fill-slate-600"
                          }`}
                        >
                          {node.month}
                        </text>

                        {/* Invisible Hover Zone */}
                        <rect
                          x={node.x - 35}
                          y="0"
                          width="70"
                          height="230"
                          fill="transparent"
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredBar !== null && (
                  <div
                    style={{
                      left: `${nodes[hoveredBar].x - 90}px`,
                      top: `${Math.min(nodes[hoveredBar].yPay, nodes[hoveredBar].yTung) - 80}px`,
                    }}
                    className="absolute z-20 w-52 rounded-xl bg-slate-900/95 text-white p-3 text-xs shadow-xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                  >
                    <p className="font-extrabold text-cyan-300 border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                      <span>{nodes[hoveredBar].month}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Data Bulanan</span>
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Pembayaran:
                        </span>
                        <span className="font-bold text-white">
                          Rp {nodes[hoveredBar].pembayaran.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          Tunggakan:
                        </span>
                        <span className="font-bold text-white">
                          Rp {nodes[hoveredBar].tunggakan.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Chart Summary Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800">Total Pembayaran (6 Bln)</span>
            <p className="text-base font-black text-emerald-700">Rp 1.055.400.000</p>
          </div>
          <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-100">
            <span className="text-[11px] font-semibold text-rose-800">Total Tunggakan (6 Bln)</span>
            <p className="text-base font-black text-rose-700">Rp 139.500.000</p>
          </div>
          <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-800">Rata-rata Tingkat Kelancaran</span>
            <p className="text-base font-black text-[#1976d2]">88.3%</p>
          </div>
        </div>
      </div>

      {/* 4. Daftar Tagihan yang Harus Segera Ditindaklanjuti */}
      <div className="base-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Daftar Tagihan yang Harus Segera Ditindaklanjuti</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                {filteredActionItems.length} Tagihan
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Daftar nasabah dengan status tagihan yang memerlukan pemantauan dan tindakan penagihan.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Nasabah / ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] w-48"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <Filter className="h-3.5 w-3.5 text-slate-500 ml-1" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none pr-1"
              >
                <option value="Semua">Semua Status</option>
                <option value="Terlambat">Merah (Terlambat)</option>
                <option value="Segera jatuh tempo">Kuning (Segera)</option>
                <option value="Aktif">Biru (Aktif)</option>
                <option value="Lunas">Hijau (Lunas)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Table (.base-table from style.md) */}
        <div className="overflow-x-auto">
          <table className="base-table">
            <thead>
              <tr>
                <th className="rounded-tl-md">Kode Tagihan</th>
                <th>Nama Nasabah</th>
                <th>Kategori Pembiayaan</th>
                <th>Nominal Tagihan</th>
                <th>Jatuh Tempo</th>
                <th>Status Tagihan</th>
                <th className="rounded-tr-md text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium text-slate-800">
              {filteredActionItems.length > 0 ? (
                filteredActionItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-100/80 transition-colors">
                    <td className="font-mono font-bold text-[#1976d2]">{item.id}</td>
                    <td className="font-bold text-slate-900">{item.nasabah}</td>
                    <td className="text-slate-600">{item.kategori}</td>
                    <td className="font-extrabold text-slate-900">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="font-semibold text-slate-700">{item.jatuhTempo}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.status === "Terlambat" && (
                          <button
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-sm"
                            onClick={() => alert(`Follow up penagihan untuk ${item.nasabah}`)}
                          >
                            <BellRing className="h-3 w-3" /> Follow Up
                          </button>
                        )}
                        {item.status === "Segera jatuh tempo" && (
                          <button
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-sm"
                            onClick={() => alert(`Kirim pengingat jatuh tempo ke ${item.nasabah}`)}
                          >
                            <BellRing className="h-3 w-3" /> Pengingat
                          </button>
                        )}
                        <button
                          className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1"
                          onClick={() => alert(`Detail transaksi ${item.id}`)}
                        >
                          <Eye className="h-3 w-3" /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    Tidak ada tagihan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Status Legend Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-700">Panduan Warna Status:</span>
            <span className="status-badge status-badge-lunas">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Hijau: Lunas
            </span>
            <span className="status-badge status-badge-aktif">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Biru: Aktif
            </span>
            <span className="status-badge status-badge-segera">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Kuning: Segera Jatuh Tempo
            </span>
            <span className="status-badge status-badge-terlambat">
              <span className="h-2 w-2 rounded-full bg-rose-600" /> Merah: Terlambat
            </span>
          </div>

          <button className="text-xs font-bold text-[#1976d2] hover:underline flex items-center gap-1">
            Lihat Semua Transaksi <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
