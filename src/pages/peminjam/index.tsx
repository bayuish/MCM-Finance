import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  INITIAL_PEMINJAM_DATA, 
  MOCK_RIWAYAT_PINJAMAN,
  INDONESIA_REGIONS_DATA,
  generateNextPeminjamId, 
  type Peminjam,
  type RiwayatPinjaman
} from "@/data/mockData";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserCheck, 
  UserX, 
  Phone, 
  FileText, 
  MapPin, 
  Eye, 
  X, 
  History,
  CheckCircle2
} from "lucide-react";

import { 
  getProvinsiList,
  getKabupatenList,
  getKecamatanList,
  getDesaList,
  lookupPostalCode,
  type TerritoryItem
} from "@/utils/indonesiaTerritory";

const DataPeminjamPage: React.FC = () => {
  const navigate = useNavigate();
  const [peminjamList, setPeminjamList] = useState<Peminjam[]>(INITIAL_PEMINJAM_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [selectedPeminjam, setSelectedPeminjam] = useState<Peminjam | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new borrower
  const [formData, setFormData] = useState({
    nama: "",
    whatsapp: "",
    nik: "",
    alamat: "",
    pekerjaan: "",
    kontakDarurat: "",
    catatan: "",
    status: "Aktif" as Peminjam["status"],
  });

  // Separate states for structured Kontak Darurat
  const [kdNama, setKdNama] = useState("");
  const [kdHubungan, setKdHubungan] = useState("Istri");
  const [kdNoHp, setKdNoHp] = useState("");

  // Dynamic 4-level cascading territory states driven by official 'daftar-wilayah-indonesia' library
  const [provinsiList] = useState<TerritoryItem[]>(() => getProvinsiList());
  const [selectedProvKode, setSelectedProvKode] = useState<string>("73"); // Default Sulawesi Selatan (73)
  const [selectedProvNama, setSelectedProvNama] = useState<string>("Sulawesi Selatan");

  const [kabupatenList, setKabupatenList] = useState<TerritoryItem[]>(() => getKabupatenList("73"));
  const [selectedKabKode, setSelectedKabKode] = useState<string>("7371"); // Default Kota Makassar (7371)
  const [selectedKabNama, setSelectedKabNama] = useState<string>("Kota Makassar");

  const [kecamatanList, setKecamatanList] = useState<TerritoryItem[]>(() => getKecamatanList("7371"));
  const [selectedKecKode, setSelectedKecKode] = useState<string>("7371010"); // Default Mariso
  const [selectedKecNama, setSelectedKecNama] = useState<string>("Mariso");

  const [desaList, setDesaList] = useState<TerritoryItem[]>(() => getDesaList("7371010"));
  const [selectedDesaKode, setSelectedDesaKode] = useState<string>("7371010003");
  const [selectedDesaNama, setSelectedDesaNama] = useState<string>("Mattoangin");

  const [kodePos, setKodePos] = useState<string>("90121");
  const [streetAddress, setStreetAddress] = useState<string>("");

  // Cascading Handlers
  const handleProvinsiChange = (provKode: string) => {
    const provObj = provinsiList.find((p) => p.kode === provKode);
    const provNama = provObj?.nama || "";
    setSelectedProvKode(provKode);
    setSelectedProvNama(provNama);

    const newKabs = getKabupatenList(provKode);
    setKabupatenList(newKabs);
    const firstKab = newKabs[0] || { kode: "", nama: "" };
    setSelectedKabKode(firstKab.kode);
    setSelectedKabNama(firstKab.nama);

    const newKecs = firstKab.kode ? getKecamatanList(firstKab.kode) : [];
    setKecamatanList(newKecs);
    const firstKec = newKecs[0] || { kode: "", nama: "" };
    setSelectedKecKode(firstKec.kode);
    setSelectedKecNama(firstKec.nama);

    const newDesas = firstKec.kode ? getDesaList(firstKec.kode) : [];
    setDesaList(newDesas);
    const firstDesa = newDesas[0] || { kode: "", nama: "" };
    setSelectedDesaKode(firstDesa.kode);
    setSelectedDesaNama(firstDesa.nama);

    setKodePos(lookupPostalCode(firstDesa.nama, firstDesa.kode));
  };

  const handleKabupatenChange = (kabKode: string) => {
    const kabObj = kabupatenList.find((k) => k.kode === kabKode);
    const kabNama = kabObj?.nama || "";
    setSelectedKabKode(kabKode);
    setSelectedKabNama(kabNama);

    const newKecs = getKecamatanList(kabKode);
    setKecamatanList(newKecs);
    const firstKec = newKecs[0] || { kode: "", nama: "" };
    setSelectedKecKode(firstKec.kode);
    setSelectedKecNama(firstKec.nama);

    const newDesas = firstKec.kode ? getDesaList(firstKec.kode) : [];
    setDesaList(newDesas);
    const firstDesa = newDesas[0] || { kode: "", nama: "" };
    setSelectedDesaKode(firstDesa.kode);
    setSelectedDesaNama(firstDesa.nama);

    setKodePos(lookupPostalCode(firstDesa.nama, firstDesa.kode));
  };

  const handleKecamatanChange = (kecKode: string) => {
    const kecObj = kecamatanList.find((kc) => kc.kode === kecKode);
    const kecNama = kecObj?.nama || "";
    setSelectedKecKode(kecKode);
    setSelectedKecNama(kecNama);

    const newDesas = getDesaList(kecKode);
    setDesaList(newDesas);
    const firstDesa = newDesas[0] || { kode: "", nama: "" };
    setSelectedDesaKode(firstDesa.kode);
    setSelectedDesaNama(firstDesa.nama);

    setKodePos(lookupPostalCode(firstDesa.nama, firstDesa.kode));
  };

  const handleDesaChange = (desaKode: string) => {
    const desaObj = desaList.find((d) => d.kode === desaKode);
    const desaNama = desaObj?.nama || "";
    setSelectedDesaKode(desaKode);
    setSelectedDesaNama(desaNama);

    setKodePos(lookupPostalCode(desaNama, desaKode));
  };

  const filteredPeminjam = peminjamList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.includes(searchTerm) ||
      item.whatsapp.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (peminjam: Peminjam) => {
    setSelectedPeminjam(peminjam);
    setIsDetailModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = generateNextPeminjamId(peminjamList);
    const formattedKd = `${kdNama || "Kontak"} (${kdHubungan}) - ${kdNoHp || "+62"}`;
    const fullAlamat = `${streetAddress ? streetAddress + ", " : ""}Kel. ${selectedDesaNama}, Kec. ${selectedKecNama}, ${selectedKabNama}, ${selectedProvNama} (${kodePos})`;

    const newEntry: Peminjam = {
      id: newId,
      ...formData,
      alamat: fullAlamat,
      kontakDarurat: formattedKd,
      fotoKtp: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      tanggalDaftar: "17 Agt 2026",
    };

    // Store in global INITIAL_PEMINJAM_DATA & local state
    INITIAL_PEMINJAM_DATA.unshift(newEntry);
    setPeminjamList([newEntry, ...peminjamList]);
    setIsAddModalOpen(false);

    // Reset form
    setFormData({
      nama: "",
      whatsapp: "",
      nik: "",
      alamat: "",
      pekerjaan: "",
      kontakDarurat: "",
      catatan: "",
      status: "Aktif",
    });
    setKdNama("");
    setKdHubungan("Istri");
    setKdNoHp("");

    // Auto-navigate to /pembiayaan and open Form Transaksi Pembiayaan Baru modal!
    navigate(`/pembiayaan?openAddModal=true&peminjamId=${newId}`, {
      state: { openAddModal: true, peminjamId: newId },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#1976d2]" />
            Data Peminjam Mandiri Cell Makassar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan identitas, dokumen KTP, kontak darurat, serta riwayat pinjaman & pembayaran nasabah.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg shadow transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> Tambah Peminjam Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="base-card min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Peminjam</span>
            <Users className="h-4 w-4 text-[#1976d2]" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{peminjamList.length} Nasabah</p>
          <p className="mt-1 text-xs text-slate-500">Terdaftar di sistem</p>
        </div>

        <div className="base-card border-l-4 border-l-blue-600 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peminjam Aktif</span>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-700">
            {peminjamList.filter((p) => p.status === "Aktif").length} Nasabah
          </p>
          <span className="status-badge status-badge-aktif mt-1 w-fit">
            Aktif
          </span>
        </div>

        <div className="base-card border-l-4 border-l-emerald-500 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peminjam Lunas</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">
            {peminjamList.filter((p) => p.status === "Lunas").length} Nasabah
          </p>
          <span className="status-badge status-badge-lunas mt-1 w-fit">
            Lunas
          </span>
        </div>

        <div className="base-card border-l-4 border-l-rose-500 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blacklist / Bermasalah</span>
            <UserX className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-700">
            {peminjamList.filter((p) => p.status === "Blacklist").length} Nasabah
          </p>
          <span className="status-badge status-badge-terlambat mt-1 w-fit">
            Blacklist
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="base-card">
        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama, NIK, No. WA, atau Kode PEM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif (Biru)</option>
              <option value="Lunas">Lunas (Hijau)</option>
              <option value="Blacklist">Blacklist (Merah)</option>
            </select>
          </div>
        </div>

        {/* Data Table (.base-table) */}
        <div className="overflow-x-auto">
          <table className="base-table">
            <thead>
              <tr>
                <th>ID Peminjam</th>
                <th>Nama Lengkap</th>
                <th>No. WhatsApp</th>
                <th>NIK</th>
                <th>Pekerjaan</th>
                <th>Status Peminjam</th>
                <th className="text-center">Aksi / Riwayat</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium">
              {filteredPeminjam.length > 0 ? (
                filteredPeminjam.map((peminjam) => (
                  <tr key={peminjam.id}>
                    <td className="font-mono font-bold text-[#1976d2]">{peminjam.id}</td>
                    <td className="font-bold text-slate-900">{peminjam.nama}</td>
                    <td className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      {peminjam.whatsapp}
                    </td>
                    <td className="font-mono text-slate-600">{peminjam.nik}</td>
                    <td className="text-slate-600">{peminjam.pekerjaan}</td>
                    <td>
                      {peminjam.status === "Aktif" && (
                        <span className="status-badge status-badge-aktif">
                          <span className="h-2 w-2 rounded-full bg-blue-600" /> Aktif
                        </span>
                      )}
                      {peminjam.status === "Lunas" && (
                        <span className="status-badge status-badge-lunas">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Lunas
                        </span>
                      )}
                      {peminjam.status === "Blacklist" && (
                        <span className="status-badge status-badge-terlambat">
                          <span className="h-2 w-2 rounded-full bg-rose-600" /> Blacklist
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleOpenDetail(peminjam)}
                        className="px-3 py-1 text-xs font-bold text-[#1976d2] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat Riwayat & Profil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    Tidak ada data peminjam yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Detail Profile & Riwayat Pinjaman & Pembayaran */}
      {isDetailModalOpen && selectedPeminjam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="background__gradient p-5 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-white/20 rounded-full tracking-wider">
                  Profil Nasabah & History
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedPeminjam.nama} ({selectedPeminjam.id})
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Grid Profil Peminjam */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Foto KTP */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                    <FileText className="h-4 w-4 text-[#1976d2]" /> Preview KTP
                  </span>
                  <img
                    src={selectedPeminjam.fotoKtp}
                    alt="Foto KTP"
                    className="h-32 w-full object-cover rounded-lg border border-slate-300 shadow-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">NIK: {selectedPeminjam.nik}</span>
                </div>

                {/* Info Detail */}
                <div className="md:col-span-2 space-y-2 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-semibold block">Nama Lengkap:</span>
                      <span className="font-bold text-slate-900">{selectedPeminjam.nama}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">No. WhatsApp:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {selectedPeminjam.whatsapp}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Pekerjaan:</span>
                      <span className="font-bold text-slate-900">{selectedPeminjam.pekerjaan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Kontak Darurat:</span>
                      <span className="font-bold text-slate-900">{selectedPeminjam.kontakDarurat}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">Alamat Lengkap:</span>
                    <span className="font-semibold text-slate-800 flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                      {selectedPeminjam.alamat}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">Catatan Admin:</span>
                    <p className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-md font-medium text-[11px] italic">
                      "{selectedPeminjam.catatan}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Riwayat Pinjaman & Pembayaran */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 border-b pb-2">
                  <History className="h-4 w-4 text-[#1976d2]" />
                  Riwayat Pinjaman & Pembayaran Nasabah
                </h4>

                {MOCK_RIWAYAT_PINJAMAN[selectedPeminjam.id] ? (
                  MOCK_RIWAYAT_PINJAMAN[selectedPeminjam.id].map((pinjaman, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 mb-4 bg-white shadow-sm space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block">No. Pembiayaan:</span>
                          <span className="font-mono font-bold text-[#1976d2]">{pinjaman.nomorPembiayaan}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block">Tanggal Pencairan:</span>
                          <span className="font-semibold text-slate-800">{pinjaman.tanggalPencairan}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block">Total Tagihan:</span>
                          <span className="font-extrabold text-slate-900">Rp {pinjaman.totalTagihan.toLocaleString("id-ID")}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block">Sisa Tagihan:</span>
                          <span className="font-extrabold text-rose-600">Rp {pinjaman.sisaTagihan.toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      {/* Timeline Pembayaran */}
                      <div>
                        <span className="text-xs font-bold text-slate-700 mb-2 block">
                          History Angsuran Terbayar:
                        </span>
                        <div className="space-y-2">
                          {pinjaman.riwayatBayar.map((bayar, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs border border-slate-100"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="font-bold text-slate-800">
                                  Angsuran Ke-{bayar.angsuranKe}
                                </span>
                                <span className="text-slate-400">({bayar.tanggal})</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-emerald-700">
                                  Rp {bayar.nominal.toLocaleString("id-ID")}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded">
                                  {bayar.metode}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500">Belum ada riwayat transaksi aktif untuk nasabah ini.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Peminjam Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6">
            <div className="background__gradient p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5" /> Form Pendaftaran Peminjam Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1976d2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp *</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 rounded-l-lg select-none">
                      +62
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="812-3456-7890"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const clean = raw.startsWith("62") ? raw.slice(2) : raw.startsWith("0") ? raw.slice(1) : raw;
                        setFormData({ ...formData, whatsapp: clean });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-r-lg focus:outline-none focus:border-[#1976d2] font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK (KTP) *</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="16 Digit NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1976d2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pekerjaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Wiraswasta / PNS / Swasta"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1976d2]"
                  />
                </div>
              </div>

              {/* Wilayah Administrasi Indonesia & Kode Pos Cascading Selector */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <MapPin className="h-4 w-4 text-[#1976d2]" /> Wilayah Administrasi Indonesia & Kode Pos *
                  </label>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-blue-600 text-white rounded uppercase tracking-wider">
                    Akurat & Otomatis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* 1. Provinsi */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Provinsi (38+ Indonesia) *</label>
                    <select
                      value={selectedProvKode}
                      onChange={(e) => handleProvinsiChange(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      {provinsiList.map((prov) => (
                        <option key={prov.kode} value={prov.kode}>
                          {prov.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Kota / Kabupaten */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kota / Kabupaten *</label>
                    <select
                      value={selectedKabKode}
                      onChange={(e) => handleKabupatenChange(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      {kabupatenList.map((k) => (
                        <option key={k.kode} value={k.kode}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Kecamatan */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kecamatan *</label>
                    <select
                      value={selectedKecKode}
                      onChange={(e) => handleKecamatanChange(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      {kecamatanList.map((kc) => (
                        <option key={kc.kode} value={kc.kode}>
                          {kc.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Kelurahan & Kode Pos */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kelurahan / Desa & Kode Pos *</label>
                    <select
                      value={selectedDesaKode}
                      onChange={(e) => handleDesaChange(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      {desaList.map((kl) => (
                        <option key={kl.kode} value={kl.kode}>
                          {kl.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Auto Kode Pos Summary Badge */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-300 font-mono text-[11px] font-bold text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span>Wilayah Terpilih: <strong className="text-[#1976d2]">Kel. {selectedDesaNama}, Kec. {selectedKecNama}, {selectedKabNama}, {selectedProvNama}</strong></span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] shrink-0 font-mono font-bold">
                    ✓ Kode Pos Auto: {kodePos}
                  </span>
                </div>

                {/* Jalan & Detail Alamat (No. Rumah, RT/RW, Patokan) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jalan & Detail Alamat (No. Rumah / RT-RW / Patokan) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Jl. Pettarani No. 45, RT 02 / RW 04, Samping Apotek Sehat..."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-medium bg-white text-xs"
                  />
                </div>
              </div>

              {/* Seksi Kontak Darurat Terstruktur (Nama, Hubungan, No. Telp +62) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Phone className="h-4 w-4 text-[#1976d2]" /> Data Kontak Darurat *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Nama Kontak Darurat */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Kontak *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Siti Aminah"
                      value={kdNama}
                      onChange={(e) => setKdNama(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-semibold text-slate-800 bg-white"
                    />
                  </div>

                  {/* 2. Hubungan / Status */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hubungan *</label>
                    <select
                      value={kdHubungan}
                      onChange={(e) => setKdHubungan(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      <option value="Istri">Istri</option>
                      <option value="Suami">Suami</option>
                      <option value="Orang Tua">Orang Tua (Ayah/Ibu)</option>
                      <option value="Anak">Anak</option>
                      <option value="Saudara Kandung">Saudara Kandung</option>
                      <option value="Kerabat / Famili">Kerabat / Famili</option>
                      <option value="Rekan Kerja / Atasan">Rekan Kerja / Atasan</option>
                    </select>
                  </div>

                  {/* 3. Nomor Telepon / WA (with +62 prefix) */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">No. Telp / WA *</label>
                    <div className="relative flex items-center">
                      <span className="bg-slate-100 border border-r-0 border-slate-300 px-2.5 py-2 rounded-l-lg text-slate-700 font-bold font-mono text-xs select-none">
                        +62
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="813-4567-8901"
                        value={kdNoHp.replace(/^(\+?62|0)\s*/, "")}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^(\+?62|0)\s*/, "");
                          setKdNoHp(raw ? `+62 ${raw}` : "");
                        }}
                        className="w-full p-2 border border-slate-300 rounded-r-lg focus:outline-none focus:border-[#1976d2] font-mono font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Khusus Admin</label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan mengenai kelayakan / latar belakang..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1976d2]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg shadow"
                >
                  Simpan Data Peminjam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPeminjamPage;
