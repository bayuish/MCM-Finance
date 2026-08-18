import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  formatRupiah, 
  type StatusPembiayaan 
} from "@/data/mockData";
import { 
  MapPin, 
  Building, 
  Users, 
  Layers, 
  Filter, 
  Search, 
  Phone, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation,
  ShieldCheck,
  Building2,
  TrendingUp,
  Receipt
} from "lucide-react";

// Branch Offices GIS Data (Makassar Coordinates)
interface BranchGIS {
  id: string;
  nama: string;
  alamat: string;
  telepon: string;
  headOfficer: string;
  totalActiveLoans: number;
  totalPortfolio: number;
  lat: number;
  lng: number;
  coverageRadius: number; // in meters
}

const MOCK_BRANCHES_GIS: BranchGIS[] = [
  {
    id: "CAB-001",
    nama: "Cabang Utama Pettarani (Head Office)",
    alamat: "Jl. A.P. Pettarani No. 45, Rappocini, Makassar",
    telepon: "+62 411-456789",
    headOfficer: "H. Andi Pratama, S.E.",
    totalActiveLoans: 78,
    totalPortfolio: 580000000,
    lat: -5.1528,
    lng: 119.4385,
    coverageRadius: 3500,
  },
  {
    id: "CAB-002",
    nama: "Cabang Panakkukang",
    alamat: "Jl. Boulevard Ruko Jascinth No. 12, Panakkukang, Makassar",
    telepon: "+62 411-889900",
    headOfficer: "Siti Rahmawati, A.Md.",
    totalActiveLoans: 52,
    totalPortfolio: 420000000,
    lat: -5.1565,
    lng: 119.4478,
    coverageRadius: 2800,
  },
  {
    id: "CAB-003",
    nama: "Cabang Tamalanrea (BTP)",
    alamat: "Jl. Perintis Kemerdekaan KM 10, Tamalanrea, Makassar",
    telepon: "+62 411-334455",
    headOfficer: "Budi Raharjo, S.Kom.",
    totalActiveLoans: 28,
    totalPortfolio: 250000000,
    lat: -5.1325,
    lng: 119.4890,
    coverageRadius: 3000,
  },
];

// Borrower GIS Markers Data (Makassar Districts)
interface BorrowerGIS {
  id: string;
  nomorPembiayaan: string;
  idPeminjam: string;
  nama: string;
  whatsapp: string;
  nik: string;
  kecamatan: string;
  alamatLengkap: string;
  pokok: number;
  totalTagihan: number;
  sisaTagihan: number;
  status: StatusPembiayaan;
  deskripsiJaminan: string;
  fotoJaminan?: string;
  lat: number;
  lng: number;
  cabangPenanggungJawab: string;
  adminPenanggungJawab: string;
}

const MOCK_BORROWERS_GIS: BorrowerGIS[] = [
  {
    id: "GIS-001",
    nomorPembiayaan: "PB-2026-001",
    idPeminjam: "PEM-001",
    nama: "Budi Santoso",
    whatsapp: "+62 812-3456-7890",
    nik: "7371011508920001",
    kecamatan: "Kec. Rappocini",
    alamatLengkap: "Jl. Pettarani No. 45, Rappocini, Makassar",
    pokok: 10000000,
    totalTagihan: 12500000,
    sisaTagihan: 2500000,
    status: "Segera jatuh tempo",
    deskripsiJaminan: "BPKB Mobil Honda HR-V 2022 (No. DD 1234 AB)",
    fotoJaminan: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
    lat: -5.1585,
    lng: 119.4350,
    cabangPenanggungJawab: "Cabang Utama Pettarani",
    adminPenanggungJawab: "H. Andi Pratama, S.E.",
  },
  {
    id: "GIS-002",
    nomorPembiayaan: "PB-2026-002",
    idPeminjam: "PEM-002",
    nama: "PT Mandiri Utama Perkasa (Bpk. Hendra)",
    whatsapp: "+62 811-9876-5432",
    nik: "7371022003880004",
    kecamatan: "Kec. Panakkukang",
    alamatLengkap: "Kawasan Industri Panakkukang, Makassar",
    pokok: 40000000,
    totalTagihan: 50000000,
    sisaTagihan: 45000000,
    status: "Terlambat",
    deskripsiJaminan: "Sertifikat SHM No. 4022/Panakkukang",
    fotoJaminan: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80",
    lat: -5.1540,
    lng: 119.4520,
    cabangPenanggungJawab: "Cabang Panakkukang",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
  },
  {
    id: "GIS-003",
    nomorPembiayaan: "PB-2026-003",
    idPeminjam: "PEM-003",
    nama: "Siti Nurhaliza",
    whatsapp: "+62 852-1122-3344",
    nik: "7371035010950002",
    kecamatan: "Kec. Tamalanrea",
    alamatLengkap: "BTP Blok M No. 88, Tamalanrea, Makassar",
    pokok: 20000000,
    totalTagihan: 24000000,
    sisaTagihan: 20000000,
    status: "Aktif",
    deskripsiJaminan: "BPKB Motor Honda Vario 160 (No. DD 8899 AB)",
    fotoJaminan: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80",
    lat: -5.1290,
    lng: 119.4850,
    cabangPenanggungJawab: "Cabang Tamalanrea (BTP)",
    adminPenanggungJawab: "Budi Raharjo, S.Kom.",
  },
  {
    id: "GIS-004",
    nomorPembiayaan: "PB-2025-089",
    idPeminjam: "PEM-004",
    nama: "Ahmad Hidayat",
    whatsapp: "+62 813-9988-7766",
    nik: "7371041206900003",
    kecamatan: "Kec. Tamalanrea",
    alamatLengkap: "Jl. Perintis Kemerdekaan KM 12, Tamalanrea, Makassar",
    pokok: 15000000,
    totalTagihan: 18000000,
    sisaTagihan: 0,
    status: "Lunas",
    deskripsiJaminan: "BPKB Motor Yamaha NMAX 2024 (No. DD 5678 CD)",
    fotoJaminan: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80",
    lat: -5.1360,
    lng: 119.4780,
    cabangPenanggungJawab: "Cabang Tamalanrea (BTP)",
    adminPenanggungJawab: "Budi Raharjo, S.Kom.",
  },
  {
    id: "GIS-005",
    nomorPembiayaan: "PB-2026-005",
    idPeminjam: "PEM-005",
    nama: "Hj. Ratna Juwita",
    whatsapp: "+62 813-7788-9900",
    nik: "7371050204850005",
    kecamatan: "Kec. Rappocini",
    alamatLengkap: "Jl. Hertasning Baru No. 102, Rappocini, Makassar",
    pokok: 50000000,
    totalTagihan: 62500000,
    sisaTagihan: 62500000,
    status: "Terlambat",
    deskripsiJaminan: "SHM Ruko Hertasning No. 902",
    fotoJaminan: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80",
    lat: -5.1650,
    lng: 119.4490,
    cabangPenanggungJawab: "Cabang Utama Pettarani",
    adminPenanggungJawab: "H. Andi Pratama, S.E.",
  },
  {
    id: "GIS-006",
    nomorPembiayaan: "PB-2026-006",
    idPeminjam: "PEM-006",
    nama: "Dewi Lestari",
    whatsapp: "+62 821-4455-6677",
    nik: "7371061011930006",
    kecamatan: "Kec. Rappocini",
    alamatLengkap: "Jl. Sultan Alauddin No. 77, Rappocini, Makassar",
    pokok: 12000000,
    totalTagihan: 15000000,
    sisaTagihan: 12000000,
    status: "Aktif",
    deskripsiJaminan: "BPKB Honda PCX 160 CC 2023",
    fotoJaminan: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80",
    lat: -5.1720,
    lng: 119.4310,
    cabangPenanggungJawab: "Cabang Utama Pettarani",
    adminPenanggungJawab: "H. Andi Pratama, S.E.",
  },
  {
    id: "GIS-007",
    nomorPembiayaan: "PB-2026-007",
    idPeminjam: "PEM-007",
    nama: "Rizky Ramadhan",
    whatsapp: "+62 812-7766-5544",
    nik: "7371071508910007",
    kecamatan: "Kec. Panakkukang",
    alamatLengkap: "Jl. Pengayoman Ruko No. 4, Panakkukang, Makassar",
    pokok: 30000000,
    totalTagihan: 37500000,
    sisaTagihan: 30000000,
    status: "Aktif",
    deskripsiJaminan: "BPKB Toyota Fortuner 2021",
    fotoJaminan: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
    lat: -5.1590,
    lng: 119.4440,
    cabangPenanggungJawab: "Cabang Panakkukang",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
  },
  {
    id: "GIS-008",
    nomorPembiayaan: "PB-2026-008",
    idPeminjam: "PEM-008",
    nama: "H. Syamsuddin",
    whatsapp: "+62 853-9900-1122",
    nik: "7371082005840008",
    kecamatan: "Kec. Panakkukang",
    alamatLengkap: "Jl. Toddopuli Raya No. 12, Panakkukang, Makassar",
    pokok: 35000000,
    totalTagihan: 43750000,
    sisaTagihan: 43750000,
    status: "Segera jatuh tempo",
    deskripsiJaminan: "Sertifikat SHM No. 1290/Panakkukang",
    fotoJaminan: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80",
    lat: -5.1510,
    lng: 119.4460,
    cabangPenanggungJawab: "Cabang Panakkukang",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
  },
];

// District Summary Leaderboard Data
interface DistrictSummary {
  kecamatan: string;
  totalPeminjam: number;
  totalPortofolio: number;
  jumlahTerlambat: number;
  cabangUtama: string;
}

const DISTRICT_SUMMARY_LIST: DistrictSummary[] = [
  {
    kecamatan: "Kec. Panakkukang",
    totalPeminjam: 48,
    totalPortofolio: 420000000,
    jumlahTerlambat: 3,
    cabangUtama: "Cabang Panakkukang",
  },
  {
    kecamatan: "Kec. Rappocini",
    totalPeminjam: 42,
    totalPortofolio: 380000000,
    jumlahTerlambat: 2,
    cabangUtama: "Cabang Utama Pettarani",
  },
  {
    kecamatan: "Kec. Tamalanrea (BTP)",
    totalPeminjam: 35,
    totalPortofolio: 290000000,
    jumlahTerlambat: 0,
    cabangUtama: "Cabang Tamalanrea (BTP)",
  },
  {
    kecamatan: "Kec. Mariso & Mamajang",
    totalPeminjam: 18,
    totalPortofolio: 110000000,
    jumlahTerlambat: 1,
    cabangUtama: "Cabang Utama Pettarani",
  },
  {
    kecamatan: "Kec. Biringkanaya",
    totalPeminjam: 15,
    totalPortofolio: 50000000,
    jumlahTerlambat: 0,
    cabangUtama: "Cabang Tamalanrea (BTP)",
  },
];

// Custom HTML Pin Markers for Leaflet
const createBranchIcon = () =>
  L.divIcon({
    className: "custom-gis-pin-branch",
    html: `<div style="background-color: #1976d2; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-radius: 12px; padding: 6px 8px; color: #ffffff; font-weight: 800; font-size: 10px; display: flex; items-center; gap: 4px; white-space: nowrap;">
      🏢 Kantor Cabang
    </div>`,
    iconSize: [120, 32],
    iconAnchor: [60, 16],
  });

const createBorrowerIcon = (status: StatusPembiayaan) => {
  let color = "#3b82f6"; // default blue
  let label = "Aktif";

  if (status === "Lunas") {
    color = "#10b981"; // green
    label = "Lunas";
  } else if (status === "Segera jatuh tempo") {
    color = "#f59e0b"; // yellow/amber
    label = "Jatuh Tempo";
  } else if (status === "Terlambat") {
    color = "#f43f5e"; // red
    label = "Terlambat";
  }

  return L.divIcon({
    className: "custom-gis-pin-borrower",
    html: `<div style="background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border-radius: 9999px; padding: 4px 8px; color: #ffffff; font-weight: 800; font-size: 9px; display: flex; items-center; gap: 3px; white-space: nowrap;">
      📍 ${label}
    </div>`,
    iconSize: [85, 24],
    iconAnchor: [42, 12],
  });
};

const PetaPersebaranGISPage: React.FC = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [kecamatanFilter, setKecamatanFilter] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredBorrowers = MOCK_BORROWERS_GIS.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorPembiayaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamatLengkap.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    const matchesKecamatan =
      kecamatanFilter === "Semua" || item.kecamatan === kecamatanFilter;

    return matchesSearch && matchesStatus && matchesKecamatan;
  });

  const getStatusBadge = (status: StatusPembiayaan) => {
    switch (status) {
      case "Lunas":
        return (
          <span className="status-badge status-badge-lunas whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Lunas
          </span>
        );
      case "Aktif":
        return (
          <span className="status-badge status-badge-aktif whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-blue-600" /> Aktif
          </span>
        );
      case "Segera jatuh tempo":
        return (
          <span className="status-badge status-badge-segera whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Segera Jatuh Tempo
          </span>
        );
      case "Terlambat":
        return (
          <span className="status-badge status-badge-terlambat whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-rose-600" /> Terlambat
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-[#1976d2]" />
            Peta Persebaran Peminjam & Wilayah Operasional (GIS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi geofencing persebaran lokasi nasabah peminjam, jangkauan kantor cabang, serta analisis wilayah konsentrasi pinjaman terbanyak.
          </p>
        </div>

        <button
          onClick={() => navigate("/pembiayaan")}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg shadow transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Receipt className="h-4 w-4" /> Kelola Data Pembiayaan
        </button>
      </div>

      {/* GIS Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="base-card min-w-0 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nasabah Peminjam</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">158 Nasabah</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">Tersebar di 14 Kecamatan Makassar</span>
        </div>

        <div className="base-card min-w-0 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah Terbanyak</span>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-2 text-xl font-black text-amber-700">Kec. Panakkukang</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">48 Nasabah (Rp 420 Juta)</span>
        </div>

        <div className="base-card min-w-0 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Portfolio GIS</span>
            <Receipt className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">Rp 1.250.000.000</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">Total Piutang Berjalan</span>
        </div>

        <div className="base-card min-w-0 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kantor Cabang</span>
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-700">3 Cabang</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">Pettarani, Panakkukang, BTP</span>
        </div>
      </div>

      {/* Main Interactive Map & Controls Card */}
      <div className="base-card space-y-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nasabah, No. PB, atau Alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] bg-white font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Filter className="h-4 w-4 text-[#1976d2]" /> Filter Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 font-bold border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-[#1976d2]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif (Biru)</option>
              <option value="Segera jatuh tempo">Segera Jatuh Tempo (Kuning)</option>
              <option value="Terlambat">Terlambat (Merah)</option>
              <option value="Lunas">Lunas (Hijau)</option>
            </select>

            <select
              value={kecamatanFilter}
              onChange={(e) => setKecamatanFilter(e.target.value)}
              className="px-3 py-1.5 font-bold border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-[#1976d2]"
            >
              <option value="Semua">Semua Kecamatan</option>
              <option value="Kec. Panakkukang">Kec. Panakkukang</option>
              <option value="Kec. Rappocini">Kec. Rappocini</option>
              <option value="Kec. Tamalanrea">Kec. Tamalanrea (BTP)</option>
            </select>
          </div>
        </div>

        {/* Map Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl text-xs font-bold border border-slate-200">
          <span className="text-slate-700 flex items-center gap-1.5">
            <Navigation className="h-4 w-4 text-[#1976d2]" /> Legend Marker GIS:
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-blue-600 border border-white shadow-sm" />
              <span className="text-blue-900">🏢 Kantor Cabang (Radius Cover)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
              <span className="text-emerald-900">🟢 Lunas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-blue-600 border border-white shadow-sm" />
              <span className="text-blue-900">🔵 Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500 border border-white shadow-sm" />
              <span className="text-amber-900">🟡 Segera Jatuh Tempo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-600 border border-white shadow-sm" />
              <span className="text-rose-900">🔴 Terlambat</span>
            </div>
          </div>
        </div>

        {/* Leaflet Interactive GIS Map Container */}
        <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner z-10">
          <MapContainer
            center={[-5.1528, 119.4385]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Branch Office Markers & Radius Rings */}
            {MOCK_BRANCHES_GIS.map((branch) => (
              <React.Fragment key={branch.id}>
                <Circle
                  center={[branch.lat, branch.lng]}
                  radius={branch.coverageRadius}
                  pathOptions={{
                    color: "#1976d2",
                    fillColor: "#1976d2",
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: "4,4",
                  }}
                />
                <Marker
                  position={[branch.lat, branch.lng]}
                  icon={createBranchIcon()}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 space-y-2 max-w-xs text-xs">
                      <div className="bg-[#1976d2] text-white p-2 rounded-lg font-bold flex items-center justify-between">
                        <span>🏢 {branch.nama}</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Kantor Resmi</span>
                      </div>
                      <div className="space-y-1 text-slate-700 font-medium">
                        <p className="text-[11px]">{branch.alamat}</p>
                        <p className="flex items-center gap-1 font-bold text-emerald-700">
                          <Phone className="h-3 w-3" /> {branch.telepon}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          Kepala Cabang: <span className="text-slate-900">{branch.headOfficer}</span>
                        </p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded border space-y-1 font-bold text-[11px]">
                        <div className="flex justify-between">
                          <span>Total Kontrak Aktif:</span>
                          <span className="text-blue-700">{branch.totalActiveLoans} Pinjaman</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span>Portfolio Berjalan:</span>
                          <span className="text-emerald-700">{formatRupiah(branch.totalPortfolio)}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

            {/* Render Borrower Location Pins */}
            {filteredBorrowers.map((borrower) => (
              <Marker
                key={borrower.id}
                position={[borrower.lat, borrower.lng]}
                icon={createBorrowerIcon(borrower.status)}
              >
                <Popup>
                  <div className="p-2 space-y-2 max-w-sm text-xs">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-mono font-bold text-[#1976d2]">
                        {borrower.nomorPembiayaan}
                      </span>
                      {getStatusBadge(borrower.status)}
                    </div>

                    <div className="flex items-start gap-2">
                      {borrower.fotoJaminan ? (
                        <img
                          src={borrower.fotoJaminan}
                          alt="Foto Agunan"
                          className="h-12 w-16 object-cover rounded border shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {borrower.nama}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">{borrower.kecamatan}</p>
                        <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <Phone className="h-2.5 w-2.5" /> {borrower.whatsapp}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border space-y-1 font-semibold text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Pokok:</span>
                        <span className="font-mono text-slate-900">{formatRupiah(borrower.pokok)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sisa Tagihan:</span>
                        <span className="font-mono text-rose-600 font-bold">{formatRupiah(borrower.sisaTagihan)}</span>
                      </div>
                      <div className="text-[10px] text-slate-600 border-t pt-1 truncate">
                        <span className="font-bold text-slate-700">Agunan:</span> {borrower.deskripsiJaminan}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium bg-blue-50 p-1.5 rounded">
                      <span>Penanggung Jawab: </span>
                      <strong className="text-slate-900">{borrower.adminPenanggungJawab}</strong> ({borrower.cabangPenanggungJawab})
                    </div>

                    <button
                      onClick={() => navigate("/pembiayaan")}
                      className="w-full py-1 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> Lihat Detail Pembiayaan
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* District Analytics Leaderboard Card */}
      <div className="base-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-[#1976d2]" />
              Analisis Konsentrasi Pembiayaan per Wilayah / Kecamatan
            </h3>
            <p className="text-xs text-slate-500">
              Peringkat wilayah dengan jumlah peminjam terbanyak, total portofolio, serta tingkat risiko tunggakan.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Top 5 Kecamatan Utama
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="base-table w-full">
            <thead>
              <tr>
                <th>Peringkat & Kecamatan</th>
                <th>Total Peminjam</th>
                <th>Total Nominal Portfolio</th>
                <th>Tingkat Risiko (Terlambat)</th>
                <th>Kantor Cabang Pengampu</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium">
              {DISTRICT_SUMMARY_LIST.map((dist, idx) => (
                <tr key={dist.kecamatan}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-[#1976d2] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{dist.kecamatan}</span>
                    </div>
                  </td>
                  <td className="font-bold text-slate-800">
                    {dist.totalPeminjam} Nasabah
                  </td>
                  <td className="font-mono font-black text-slate-900">
                    {formatRupiah(dist.totalPortofolio)}
                  </td>
                  <td>
                    {dist.jumlahTerlambat > 0 ? (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-rose-600" /> {dist.jumlahTerlambat} Terlambat
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> 0 Tunggakan (Lancar)
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {dist.cabangUtama}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PetaPersebaranGISPage;
