import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import {
  INITIAL_PEMBIAYAAN_DATA,
  MOCK_ADMIN_OFFICERS,
  formatRupiah,
  type TransaksiPembiayaan,
  type DataJaminan,
  type JenisJaminanType,
  type DetailHandphone,
  type DetailBPKB,
} from "@/data/mockData";
import {
  Landmark,
  ShieldCheck,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Smartphone,
  Car,
  FolderLock,
  Plus,
  Eye,
  X,
  Upload,
  Camera,
  Building,
  UserCheck,
  Calendar,
  DollarSign,
  Receipt,
  FileCheck,
  ArrowRight,
  Package,
  Sparkles,
} from "lucide-react";

const PencairanPage: React.FC = () => {
  const { user } = useAuth();

  const [pembiayaanList, setPembiayaanList] = useState<TransaksiPembiayaan[]>(INITIAL_PEMBIAYAAN_DATA);
  const [activeTab, setActiveTab] = useState<"antrean" | "inventori">("antrean");

  // Filters for Inventory Tab
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisJaminanFilter, setJenisJaminanFilter] = useState<string>("Semua");
  const [statusJaminanFilter, setStatusJaminanFilter] = useState<string>("Semua");

  // Modal States
  const [selectedContract, setSelectedContract] = useState<TransaksiPembiayaan | null>(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  // Print Receipt Modal States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptTab, setReceiptTab] = useState<"pencairan" | "jaminan">("pencairan");
  const [receiptContract, setReceiptContract] = useState<TransaksiPembiayaan | null>(null);

  // Image Enlargement Preview
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Filtered Loans for Antrean Pencairan (status == "ACC (Siap Cair)")
  const antreanPencairanList = pembiayaanList.filter((item) => item.status === "ACC (Siap Cair)");

  // Filtered Inventory (Loans with collateral or status Aktif/Lunas)
  const inventoriList = pembiayaanList.filter((item) => {
    const hasJaminan = item.dataJaminan || item.deskripsiJaminan;
    if (!hasJaminan) return false;

    const matchesSearch =
      item.namaPeminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorPembiayaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.dataJaminan?.idJaminan && item.dataJaminan.idJaminan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.deskripsiJaminan && item.deskripsiJaminan.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesJenis =
      jenisJaminanFilter === "Semua" ||
      (item.dataJaminan?.jenisJaminan === jenisJaminanFilter) ||
      (jenisJaminanFilter === "Handphone / Gadget" && item.deskripsiJaminan?.toLowerCase().includes("iphone")) ||
      (jenisJaminanFilter === "BPKB Kendaraan" && item.deskripsiJaminan?.toLowerCase().includes("bpkb"));

    const matchesStatus =
      statusJaminanFilter === "Semua" ||
      (item.dataJaminan?.statusJaminan === statusJaminanFilter) ||
      (statusJaminanFilter === "Tersimpan di Brankas" && item.status === "Aktif") ||
      (statusJaminanFilter === "Siap Ambil (Lunas)" && item.status === "Lunas");

    return matchesSearch && matchesJenis && matchesStatus;
  });

  // --- FORM STATES FOR PENCAIRAN & JAMINAN ---
  const [tanggalCair, setTanggalCair] = useState<string>(new Date().toISOString().split("T")[0]);
  const [metodeCair, setMetodeCair] = useState<string>("Transfer BCA");
  const [potonganAdmin, setPotonganAdmin] = useState<string>("50.000");

  const [jenisJaminan, setJenisJaminan] = useState<JenisJaminanType>("Handphone / Gadget");

  // Handphone Form States
  const [hpMerk, setHpMerk] = useState<string>("Apple");
  const [hpTipe, setHpTipe] = useState<string>("iPhone 15 Pro 256GB");
  const [hpKondisi, setHpKondisi] = useState<string>("Mulus 98%, Fisik Normal & LCD Ori");
  const [hpKelengkapan, setHpKelengkapan] = useState<string[]>(["Dus Original", "Charger Original"]);
  const [hpFoto, setHpFoto] = useState<string>(
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80"
  );

  // BPKB Form States
  const [bpkbJenisKendaraan, setBpkbJenisKendaraan] = useState<"Mobil" | "Motor">("Mobil");
  const [bpkbMerkModel, setBpkbMerkModel] = useState<string>("Toyota Avanza 1.5 G MT 2023");
  const [bpkbNopol, setBpkbNopol] = useState<string>("DD 1234 AB");
  const [bpkbNoBpkb, setBpkbNoBpkb] = useState<string>("BPKB-778899001");
  const [bpkbNoRangka, setBpkbNoRangka] = useState<string>("MH1JDF114KK098765");
  const [bpkbFoto, setBpkbFoto] = useState<string>(
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80"
  );
  const [bpkbFotoKendaraan, setBpkbFotoKendaraan] = useState<string>(
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80"
  );

  // Inventory / Storage Metadata Form States
  const [lokasiBrankas, setLokasiBrankas] = useState<string>("Brankas Utama Kasir A-1");
  const [catatanAgunan, setCatatanAgunan] = useState<string>("Kondisi telah diperiksa fisik oleh Admin.");

  // Open Process Modal
  const handleOpenProcessModal = (contract: TransaksiPembiayaan) => {
    setSelectedContract(contract);
    setTanggalCair(new Date().toISOString().split("T")[0]);

    // Pre-fill form if existing collateral data exists
    if (contract.deskripsiJaminan?.toLowerCase().includes("bpkb")) {
      setJenisJaminan("BPKB Kendaraan");
      setBpkbMerkModel(contract.deskripsiJaminan);
    } else {
      setJenisJaminan("Handphone / Gadget");
      setHpTipe(contract.deskripsiJaminan || "Smartphone Android / iOS");
    }

    if (contract.fotoJaminan) {
      setHpFoto(contract.fotoJaminan);
      setBpkbFoto(contract.fotoJaminan);
    }

    setIsProcessModalOpen(true);
  };

  // Toggle Kelengkapan Checkbox
  const handleToggleKelengkapan = (item: string) => {
    setHpKelengkapan((prev) =>
      prev.includes(item) ? prev.filter((k) => k !== item) : [...prev, item]
    );
  };

  // Handle Photo Upload Handphone
  const handleUploadHpPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHpFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Photo Upload BPKB
  const handleUploadBpkbPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBpkbFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Process Pencairan & Pendataan Jaminan
  const handleSubmitProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    const idJaminanGen = `JMN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
      pembiayaanList.length + 1
    ).padStart(3, "0")}`;

    const adminOfficer = user?.name || MOCK_ADMIN_OFFICERS[0].namaAdmin;

    let dataJaminanObj: DataJaminan;

    if (jenisJaminan === "Handphone / Gadget") {
      dataJaminanObj = {
        idJaminan: idJaminanGen,
        jenisJaminan: "Handphone / Gadget",
        handphoneDetails: {
          merk: hpMerk,
          tipe: hpTipe,
          kondisi: hpKondisi,
          kelengkapan: hpKelengkapan,
          fotoHp: [hpFoto],
        },
        lokasiPenyimpanan: lokasiBrankas,
        statusJaminan: "Tersimpan di Brankas",
        tanggalDiterima: tanggalCair,
        petugasPenerima: adminOfficer,
        catatanAgunan: catatanAgunan,
      };
    } else if (jenisJaminan === "BPKB Kendaraan") {
      dataJaminanObj = {
        idJaminan: idJaminanGen,
        jenisJaminan: "BPKB Kendaraan",
        bpkbDetails: {
          jenisKendaraan: bpkbJenisKendaraan,
          merkModel: bpkbMerkModel,
          nomorPolisi: bpkbNopol,
          nomorBpkb: bpkbNoBpkb,
          nomorRangkaMesin: bpkbNoRangka,
          fotoBpkb: bpkbFoto,
          fotoKendaraan: bpkbFotoKendaraan,
        },
        lokasiPenyimpanan: lokasiBrankas,
        statusJaminan: "Tersimpan di Brankas",
        tanggalDiterima: tanggalCair,
        petugasPenerima: adminOfficer,
        catatanAgunan: catatanAgunan,
      };
    } else {
      dataJaminanObj = {
        idJaminan: idJaminanGen,
        jenisJaminan: "Sertifikat / Lainnya",
        deskripsiLainnya: hpTipe || "Dokumen / Sertifikat Berharga",
        lokasiPenyimpanan: lokasiBrankas,
        statusJaminan: "Tersimpan di Brankas",
        tanggalDiterima: tanggalCair,
        petugasPenerima: adminOfficer,
        catatanAgunan: catatanAgunan,
      };
    }

    const deskripsiJaminanFinal =
      jenisJaminan === "Handphone / Gadget"
        ? `${hpMerk} ${hpTipe} (${idJaminanGen})`
        : jenisJaminan === "BPKB Kendaraan"
        ? `BPKB ${bpkbJenisKendaraan} ${bpkbMerkModel} (${bpkbNopol})`
        : `Jaminan Lainnya (${idJaminanGen})`;

    const fotoJaminanFinal =
      jenisJaminan === "Handphone / Gadget" ? hpFoto : bpkbFoto;

    const updatedContract: TransaksiPembiayaan = {
      ...selectedContract,
      status: "Aktif",
      tanggalPencairan: tanggalCair,
      tanggalCairDiproses: tanggalCair,
      petugasPencairan: adminOfficer,
      deskripsiJaminan: deskripsiJaminanFinal,
      fotoJaminan: fotoJaminanFinal,
      dataJaminan: dataJaminanObj,
    };

    setPembiayaanList((prev) =>
      prev.map((item) =>
        item.nomorPembiayaan === selectedContract.nomorPembiayaan ? updatedContract : item
      )
    );

    setIsProcessModalOpen(false);

    // Automatically open receipt preview modal for immediate printing!
    setReceiptContract(updatedContract);
    setReceiptTab("pencairan");
    setIsReceiptModalOpen(true);
  };

  // Open Receipt Print Modal manually
  const handleOpenReceiptModal = (contract: TransaksiPembiayaan, tab: "pencairan" | "jaminan") => {
    setReceiptContract(contract);
    setReceiptTab(tab);
    setIsReceiptModalOpen(true);
  };

  // Browser Print Action
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-[#1976d2]" />
            Menu Pencairan & Pendataan Jaminan (Collateral Vault)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Proses pembiayaan yang telah disetujui Owner, pendataan inventori agunan (HP, BPKB), cetak struk pencairan & struk barang jaminan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("antrean")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
              activeTab === "antrean"
                ? "bg-[#1976d2] text-white shadow-md font-extrabold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Clock className="h-4 w-4" /> Antrean Pencairan ({antreanPencairanList.length})
          </button>
          <button
            onClick={() => setActiveTab("inventori")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
              activeTab === "inventori"
                ? "bg-emerald-600 text-white shadow-md font-extrabold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FolderLock className="h-4 w-4" /> Inventori Jaminan ({inventoriList.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "antrean" ? (
        /* TAB 1: ANTREAN PENCAIRAN (ACC OWNER) */
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Daftar Pengajuan Pembiayaan Disetujui (ACC Owner) - Siap Cair
              </h2>
              <p className="text-xs text-blue-800 mt-0.5">
                Pengajuan di bawah ini telah disetujui (ACC) oleh Owner. Admin dapat memproses pencairan dan menginput detail barang jaminan.
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-black bg-blue-600 text-white rounded-lg shadow shrink-0">
              {antreanPencairanList.length} Siap Cair
            </span>
          </div>

          {antreanPencairanList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {antreanPencairanList.map((item) => (
                <div
                  key={item.nomorPembiayaan}
                  className="base-card space-y-4 border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#1976d2]">
                        {item.nomorPembiayaan}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" /> ACC Owner
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Tgl Pengajuan: {item.tanggalPencairan}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Peminjam / Nasabah:</span>
                        <strong className="text-slate-900 text-sm block">{item.namaPeminjam}</strong>
                        <span className="text-[10px] text-emerald-700 font-semibold">{item.whatsappPeminjam}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Admin Pengaju:</span>
                        <strong className="text-slate-800 block">{item.adminPenanggungJawab}</strong>
                        <span className="text-[10px] text-blue-700 font-semibold">{item.cabangAdmin}</span>
                      </div>
                    </div>

                    {/* Owner Note Alert */}
                    {item.catatanOwner && (
                      <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block text-amber-950">Catatan Persetujuan Owner:</strong>
                          <span>{item.catatanOwner}</span>
                        </div>
                      </div>
                    )}

                    {/* Financial Summary */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Nominal Pokok:</span>
                        <strong className="text-slate-900 text-xs">{formatRupiah(item.jumlahPokok)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Margin (%):</span>
                        <strong className="text-emerald-700 text-xs">{item.persenMargin}% ({formatRupiah(item.biayaMargin)})</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Tagihan:</span>
                        <strong className="text-slate-900 text-xs">{formatRupiah(item.totalTagihan)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Tenor/Jenis:</span>
                        <strong className="text-blue-700 text-xs">{item.tenor} ({item.jenisPembayaran})</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-end">
                    <button
                      onClick={() => handleOpenProcessModal(item)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" /> Proses Pencairan & Pendataan Jaminan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="base-card p-10 text-center space-y-3">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Belum Ada Antrean Pencairan Baru</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Saat ini seluruh pengajuan yang disetujui (ACC) telah diproses cair. Pengajuan baru akan muncul di sini secara otomatis setelah disetujui oleh Owner.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: INVENTORI JAMINAN (GUDANG / BRANKAS) */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari peminjam, ID jaminan, HP, BPKB..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2] font-medium text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Tipe Jaminan:</span>
                <select
                  value={jenisJaminanFilter}
                  onChange={(e) => setJenisJaminanFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2] font-medium text-xs"
                >
                  <option value="Semua">Semua Jenis</option>
                  <option value="Handphone / Gadget">Handphone / Gadget</option>
                  <option value="BPKB Kendaraan">BPKB Kendaraan</option>
                  <option value="Sertifikat / Lainnya">Sertifikat / Lainnya</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Status Jaminan:</span>
                <select
                  value={statusJaminanFilter}
                  onChange={(e) => setStatusJaminanFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2] font-medium text-xs"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tersimpan di Brankas">Tersimpan di Brankas</option>
                  <option value="Siap Ambil (Lunas)">Siap Ambil (Lunas)</option>
                  <option value="Sudah Diambil Peminjam">Sudah Diambil Peminjam</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Collaterals */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="base-table">
                <thead>
                  <tr>
                    <th>ID & Tipe Jaminan</th>
                    <th>Detail Barang Agunan</th>
                    <th>Nasabah / Peminjam</th>
                    <th>Lokasi Penyimpanan</th>
                    <th>Status Agunan</th>
                    <th>Cetak Struk Resmi</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoriList.length > 0 ? (
                    inventoriList.map((item) => {
                      const dj = item.dataJaminan;
                      const isLunas = item.status === "Lunas";

                      return (
                        <tr key={item.nomorPembiayaan}>
                          <td>
                            <div className="space-y-1">
                              <span className="font-mono font-black text-xs text-[#1976d2] block">
                                {dj?.idJaminan || `JMN-${item.nomorPembiayaan}`}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 rounded border border-slate-200 inline-flex items-center gap-1">
                                {dj?.jenisJaminan === "Handphone / Gadget" ? (
                                  <Smartphone className="h-3 w-3 text-purple-600" />
                                ) : (
                                  <Car className="h-3 w-3 text-blue-600" />
                                )}
                                {dj?.jenisJaminan || (item.deskripsiJaminan?.toLowerCase().includes("bpkb") ? "BPKB Kendaraan" : "Handphone / Gadget")}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">No PB: {item.nomorPembiayaan}</span>
                            </div>
                          </td>

                          <td>
                            <div className="flex items-center gap-3">
                              {item.fotoJaminan || dj?.handphoneDetails?.fotoHp[0] || dj?.bpkbDetails?.fotoBpkb ? (
                                <img
                                  src={item.fotoJaminan || dj?.handphoneDetails?.fotoHp[0] || dj?.bpkbDetails?.fotoBpkb}
                                  alt="Foto Agunan"
                                  className="h-12 w-16 object-cover rounded border shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() =>
                                    setEnlargedPhoto(
                                      item.fotoJaminan || dj?.handphoneDetails?.fotoHp[0] || dj?.bpkbDetails?.fotoBpkb || null
                                    )
                                  }
                                />
                              ) : (
                                <div className="h-12 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0 border">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                              <div className="space-y-0.5 text-xs">
                                <strong className="text-slate-900 font-bold block">
                                  {dj?.handphoneDetails
                                    ? `${dj.handphoneDetails.merk} ${dj.handphoneDetails.tipe}`
                                    : dj?.bpkbDetails
                                    ? `BPKB ${dj.bpkbDetails.jenisKendaraan} ${dj.bpkbDetails.merkModel}`
                                    : item.deskripsiJaminan}
                                </strong>
                                {dj?.handphoneDetails && (
                                  <span className="text-[10px] text-slate-600 block">
                                    Kondisi: {dj.handphoneDetails.kondisi} ({dj.handphoneDetails.kelengkapan.join(", ")})
                                  </span>
                                )}
                                {dj?.bpkbDetails && (
                                  <span className="text-[10px] font-mono text-slate-600 block">
                                    Plat: {dj.bpkbDetails.nomorPolisi} | No BPKB: {dj.bpkbDetails.nomorBpkb}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="space-y-0.5 text-xs">
                              <strong className="text-slate-900 block font-bold">{item.namaPeminjam}</strong>
                              <span className="text-[10px] text-emerald-700 font-semibold block">{item.whatsappPeminjam}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">NIK: {item.nikPeminjam}</span>
                            </div>
                          </td>

                          <td>
                            <div className="space-y-0.5 text-xs">
                              <span className="font-semibold text-slate-900 flex items-center gap-1">
                                <FolderLock className="h-3.5 w-3.5 text-amber-600" />
                                {dj?.lokasiPenyimpanan || "Brankas Utama Kasir A-1"}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Penerima: {dj?.petugasPenerima || item.adminPenanggungJawab}
                              </span>
                            </div>
                          </td>

                          <td>
                            {isLunas ? (
                              <span className="px-2.5 py-1 text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Siap Ambil (Lunas)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 rounded-full inline-flex items-center gap-1">
                                <FolderLock className="h-3.5 w-3.5 text-blue-600" /> Tersimpan di Brankas
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => handleOpenReceiptModal(item, "pencairan")}
                                className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded shadow transition-all flex items-center justify-center gap-1"
                              >
                                <Printer className="h-3 w-3" /> Struk Pencairan
                              </button>
                              <button
                                onClick={() => handleOpenReceiptModal(item, "jaminan")}
                                className={`px-2.5 py-1 text-[11px] font-bold text-white rounded shadow transition-all flex items-center justify-center gap-1 ${
                                  isLunas
                                    ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                                    : "bg-slate-700 hover:bg-slate-800"
                                }`}
                              >
                                <FileCheck className="h-3 w-3" />
                                {isLunas ? "Struk Pengambilan (Lunas)" : "Struk Tanda Terima Jaminan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                        Tidak ada data inventori jaminan yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: FORM PROCESS PENCAIRAN & PENDATAAN JAMINAN --- */}
      {isProcessModalOpen && selectedContract && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <Landmark className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Form Process Pencairan & Pendataan Jaminan</h3>
                  <p className="text-xs text-slate-400">Nomor Pembiayaan: {selectedContract.nomorPembiayaan}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProcess} className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              {/* Nasabah Header Information */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Peminjam:</span>
                  <strong className="text-slate-900 text-xs">{selectedContract.namaPeminjam}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Pokok Pinjaman:</span>
                  <strong className="text-emerald-700 text-xs">{formatRupiah(selectedContract.jumlahPokok)}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Margin (%):</span>
                  <strong className="text-slate-900 text-xs">{selectedContract.persenMargin}% ({formatRupiah(selectedContract.biayaMargin)})</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Admin PenanggungJawab:</span>
                  <strong className="text-blue-700 text-xs">{user?.name || selectedContract.adminPenanggungJawab}</strong>
                </div>
              </div>

              {/* Section 1: Detail Pencairan */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 1. Data Pencairan Dana
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tanggal Pencairan *</label>
                    <input
                      type="date"
                      value={tanggalCair}
                      onChange={(e) => setTanggalCair(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Metode Pencairan *</label>
                    <select
                      value={metodeCair}
                      onChange={(e) => setMetodeCair(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] font-medium"
                    >
                      <option value="Transfer BCA">Transfer BCA</option>
                      <option value="Transfer Mandiri">Transfer Mandiri</option>
                      <option value="Transfer BRI">Transfer BRI</option>
                      <option value="Cash / Tunai di Kasir">Cash / Tunai di Kasir</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Potongan Biaya Admin (Rp)</label>
                    <input
                      type="text"
                      value={potonganAdmin}
                      onChange={(e) => setPotonganAdmin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] font-medium font-mono"
                      placeholder="50.000"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pendataan Jaminan (Collateral Type Selection) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <ShieldCheck className="h-4 w-4 text-[#1976d2]" /> 2. Pendataan Detail Barang Jaminan (Collateral)
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setJenisJaminan("Handphone / Gadget")}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      jenisJaminan === "Handphone / Gadget"
                        ? "bg-purple-50 border-purple-500 text-purple-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-purple-600" /> Handphone / Gadget
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisJaminan("BPKB Kendaraan")}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      jenisJaminan === "BPKB Kendaraan"
                        ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Car className="h-4 w-4 text-blue-600" /> BPKB Mobil / Motor
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisJaminan("Sertifikat / Lainnya")}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      jenisJaminan === "Sertifikat / Lainnya"
                        ? "bg-amber-50 border-amber-500 text-amber-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Package className="h-4 w-4 text-amber-600" /> Sertifikat / Lainnya
                  </button>
                </div>

                {/* Sub-Form Handphone */}
                {jenisJaminan === "Handphone / Gadget" && (
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Merk Handphone *</label>
                        <select
                          value={hpMerk}
                          onChange={(e) => setHpMerk(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
                        >
                          <option value="Apple">Apple (iPhone)</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Xiaomi">Xiaomi / Poco / Redmi</option>
                          <option value="Oppo">Oppo</option>
                          <option value="Vivo">Vivo</option>
                          <option value="Realme">Realme</option>
                          <option value="Asus">Asus / ROG</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tipe / Seri / RAM Storage *</label>
                        <input
                          type="text"
                          value={hpTipe}
                          onChange={(e) => setHpTipe(e.target.value)}
                          placeholder="e.g. iPhone 15 Pro Max 256GB"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kondisi Fisik & Fungsi HP *</label>
                      <input
                        type="text"
                        value={hpKondisi}
                        onChange={(e) => setHpKondisi(e.target.value)}
                        placeholder="e.g. Fisik Mulus 98%, LCD Normal, Battery Health 92%"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-2">Kelengkapan Barang yang Diserahkan:</label>
                      <div className="flex flex-wrap gap-3">
                        {["Dus Original", "Charger Fast Charging", "Kabel Data", "Headset", "Nota Pembelian", "SIM Ejector"].map(
                          (item) => (
                            <label
                              key={item}
                              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer font-medium hover:bg-purple-50"
                            >
                              <input
                                type="checkbox"
                                checked={hpKelengkapan.includes(item)}
                                onChange={() => handleToggleKelengkapan(item)}
                                className="rounded text-purple-600 focus:ring-purple-500"
                              />
                              <span>{item}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Foto Unit Handphone / Gadget *</label>
                      <div className="flex items-center gap-4">
                        {hpFoto && (
                          <img
                            src={hpFoto}
                            alt="Preview HP"
                            className="h-20 w-28 object-cover rounded-lg border border-purple-300 shadow-sm"
                          />
                        )}
                        <label className="px-4 py-2 bg-white border border-purple-300 text-purple-900 rounded-lg font-bold cursor-pointer hover:bg-purple-100 flex items-center gap-2">
                          <Upload className="h-4 w-4" /> Unggah Foto HP
                          <input type="file" accept="image/*" onChange={handleUploadHpPhoto} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Form BPKB */}
                {jenisJaminan === "BPKB Kendaraan" && (
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Jenis Kendaraan *</label>
                        <select
                          value={bpkbJenisKendaraan}
                          onChange={(e) => setBpkbJenisKendaraan(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          <option value="Mobil">Mobil</option>
                          <option value="Motor">Motor</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700 block mb-1">Merk & Model Kendaraan *</label>
                        <input
                          type="text"
                          value={bpkbMerkModel}
                          onChange={(e) => setBpkbMerkModel(e.target.value)}
                          placeholder="e.g. Toyota Avanza 1.5 G MT 2023"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Polisi (Plat No) *</label>
                        <input
                          type="text"
                          value={bpkbNopol}
                          onChange={(e) => setBpkbNopol(e.target.value)}
                          placeholder="e.g. DD 1234 AB"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium uppercase font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor BPKB *</label>
                        <input
                          type="text"
                          value={bpkbNoBpkb}
                          onChange={(e) => setBpkbNoBpkb(e.target.value)}
                          placeholder="e.g. BPKB-987654321"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Rangka / Mesin</label>
                        <input
                          type="text"
                          value={bpkbNoRangka}
                          onChange={(e) => setBpkbNoRangka(e.target.value)}
                          placeholder="e.g. MH1JDF114KK098765"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Foto Dokumentasi BPKB *</label>
                      <div className="flex items-center gap-4">
                        {bpkbFoto && (
                          <img
                            src={bpkbFoto}
                            alt="Preview BPKB"
                            className="h-20 w-28 object-cover rounded-lg border border-blue-300 shadow-sm"
                          />
                        )}
                        <label className="px-4 py-2 bg-white border border-blue-300 text-blue-900 rounded-lg font-bold cursor-pointer hover:bg-blue-100 flex items-center gap-2">
                          <Upload className="h-4 w-4" /> Unggah Foto BPKB
                          <input type="file" accept="image/*" onChange={handleUploadBpkbPhoto} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Inventori & Lokasi Penyimpanan Brankas */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <FolderLock className="h-4 w-4 text-amber-600" /> 3. Lokasi Penyimpanan & Inventori Brankas
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lokasi Penyimpanan Barang Agunan *</label>
                    <select
                      value={lokasiBrankas}
                      onChange={(e) => setLokasiBrankas(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] font-medium"
                    >
                      <option value="Brankas Utama Kasir A-1">Brankas Utama Kasir A-1</option>
                      <option value="Brankas Vault B-2">Brankas Vault B-2</option>
                      <option value="Gudang Agunan Khusus Rak C">Gudang Agunan Khusus Rak C</option>
                      <option value="Vault Cabang Panakkukang">Vault Cabang Panakkukang</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan Pemeriksaan Agunan</label>
                    <input
                      type="text"
                      value={catatanAgunan}
                      onChange={(e) => setCatatanAgunan(e.target.value)}
                      placeholder="Catatan kondisi fisik saat diterima"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Simpan Pencairan & Terbitkan Struk Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CETAK STRUK PROFESIONAL (DISBURSEMENT & COLLATERAL RECEIPT) --- */}
      {isReceiptModalOpen && receiptContract && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Header Dialog (no-print) */}
            <div className="no-print flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Cetak Struk Resmi MCM Finance</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerPrint}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow flex items-center gap-1.5 transition-all"
                >
                  <Printer className="h-4 w-4" /> Cetak (Print)
                </button>
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tab Selection inside receipt modal (no-print) */}
            <div className="no-print flex border-b bg-slate-100 text-xs font-bold p-2 gap-2">
              <button
                onClick={() => setReceiptTab("pencairan")}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  receiptTab === "pencairan"
                    ? "bg-[#1976d2] text-white shadow"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Receipt className="h-4 w-4" /> 1. Struk Pencairan Dana
              </button>

              <button
                onClick={() => setReceiptTab("jaminan")}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  receiptTab === "jaminan"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                <FileCheck className="h-4 w-4" /> 2. Struk Barang Jaminan & Pengambilan
              </button>
            </div>

            {/* PRINTABLE RECEIPT CONTENT CONTAINER */}
            <div className="p-8 bg-white text-slate-900 font-sans space-y-6 printable-receipt max-h-[75vh] overflow-y-auto">
              {receiptTab === "pencairan" ? (
                /* RECEIPT TYPE 1: STRUK PENCAIRAN DANA */
                <div className="space-y-6">
                  {/* Receipt Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase">
                      MCM FINANCE & MULTI GUNA
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Jl. A. P. Pettarani No. 45, Makassar | Telp / WA: 0812-3456-7890
                    </p>
                    <span className="inline-block mt-2 px-4 py-1 text-xs font-black bg-slate-900 text-white rounded-full uppercase tracking-widest">
                      STRUK BUKTI PENCAIRAN PEMBIAYAAN
                    </span>
                  </div>

                  {/* Transaction & Borrower Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b pb-4">
                    <div className="space-y-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">NO. PEMBIAYAAN:</span>
                        <strong className="text-slate-900 font-black text-sm">{receiptContract.nomorPembiayaan}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">TANGGAL PENCAIRAN:</span>
                        <strong className="text-slate-800">{receiptContract.tanggalPencairan}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ADMIN PETUGAS:</span>
                        <strong className="text-slate-800">{receiptContract.petugasPencairan || receiptContract.adminPenanggungJawab}</strong>
                      </div>
                    </div>

                    <div className="space-y-1 text-right">
                      <div>
                        <span className="text-slate-400 block text-[10px]">NAMA PEMINJAM:</span>
                        <strong className="text-slate-900 font-bold text-sm block">{receiptContract.namaPeminjam}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">NIK PEMINJAM:</span>
                        <strong className="text-slate-800">{receiptContract.nikPeminjam}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">WHATSAPP:</span>
                        <strong className="text-emerald-700">{receiptContract.whatsappPeminjam}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b pb-1">
                      RINCIAN PENCAIRAN DANA:
                    </h4>
                    <table className="w-full text-xs font-mono border-collapse">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Nominal Pokok Pembiayaan:</td>
                          <td className="py-2 text-right font-bold text-slate-900">{formatRupiah(receiptContract.jumlahPokok)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Margin (%) / Bunga per 15 Hari:</td>
                          <td className="py-2 text-right font-bold text-emerald-700">
                            {receiptContract.persenMargin}% ({formatRupiah(receiptContract.biayaMargin)})
                          </td>
                        </tr>
                        <tr className="border-b bg-slate-50 font-bold">
                          <td className="py-2 px-2 text-slate-900">Total Nilai Tagihan:</td>
                          <td className="py-2 px-2 text-right text-slate-900 text-sm">{formatRupiah(receiptContract.totalTagihan)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-slate-600">Jatuh Tempo Pembayaran Berikutnya:</td>
                          <td className="py-2 text-right font-bold text-rose-600">{receiptContract.tanggalJatuhTempo}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures Area */}
                  <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-600 mb-12">Peminjam / Nasabah,</p>
                      <p className="font-bold border-b border-slate-900 inline-block px-4">{receiptContract.namaPeminjam}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-12">Petugas Kasir / Admin,</p>
                      <p className="font-bold border-b border-slate-900 inline-block px-4">
                        {receiptContract.petugasPencairan || receiptContract.adminPenanggungJawab}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* RECEIPT TYPE 2: STRUK BARANG JAMINAN & PENGAMBILAN (FINAL RELEASE RECEIPT) */
                <div className="space-y-6">
                  {/* Receipt Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase">
                      MCM FINANCE - DIVISI AGUNAN & VAULT
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Jl. A. P. Pettarani No. 45, Makassar | Telp / WA: 0812-3456-7890
                    </p>
                    <span
                      className={`inline-block mt-2 px-4 py-1 text-xs font-black rounded-full uppercase tracking-widest ${
                        receiptContract.status === "Lunas"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {receiptContract.status === "Lunas"
                        ? "STRUK FINAL SERAH TERIMA PENGAMBILAN BARANG JAMINAN"
                        : "STRUK TANDA TERIMA PENYERAHAN BARANG JAMINAN"}
                    </span>
                  </div>

                  {/* Final Status Stamp Alert */}
                  {receiptContract.status === "Lunas" ? (
                    <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-xl text-center space-y-1">
                      <span className="text-xs font-black uppercase text-emerald-800 tracking-widest block">
                        ✓ PEMBAYARAN TELAH LUNAS 100%
                      </span>
                      <p className="text-xs text-emerald-900 font-medium">
                        Struk ini menjadi bukti resmi pengembalian & penyerahan kembali barang jaminan dari pihak MCM Finance kepada pemilik sah.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 font-medium">
                      ℹ️ Barang jaminan di bawah ini tersimpan secara aman di vault/brankas MCM Finance dan dapat diambil setelah seluruh tagihan lunas.
                    </div>
                  )}

                  {/* Collateral & Inventory Details */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">KODE ID JAMINAN:</span>
                        <strong className="text-slate-900 font-black text-sm">
                          {receiptContract.dataJaminan?.idJaminan || `JMN-${receiptContract.nomorPembiayaan}`}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">LOKASI PENYIMPANAN:</span>
                        <strong className="text-amber-800 font-bold">
                          {receiptContract.dataJaminan?.lokasiPenyimpanan || "Brankas Utama Kasir A-1"}
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px]">DETAIL RIGID BARANG AGUNAN:</span>
                      <strong className="text-slate-900 font-bold block text-sm">
                        {receiptContract.dataJaminan?.handphoneDetails
                          ? `${receiptContract.dataJaminan.handphoneDetails.merk} ${receiptContract.dataJaminan.handphoneDetails.tipe}`
                          : receiptContract.dataJaminan?.bpkbDetails
                          ? `BPKB ${receiptContract.dataJaminan.bpkbDetails.jenisKendaraan} ${receiptContract.dataJaminan.bpkbDetails.merkModel} (Plat: ${receiptContract.dataJaminan.bpkbDetails.nomorPolisi})`
                          : receiptContract.deskripsiJaminan}
                      </strong>

                      {receiptContract.dataJaminan?.handphoneDetails && (
                        <p className="text-[11px] text-slate-600">
                          Kondisi Fisik: {receiptContract.dataJaminan.handphoneDetails.kondisi} | Kelengkapan:{" "}
                          {receiptContract.dataJaminan.handphoneDetails.kelengkapan.join(", ")}
                        </p>
                      )}

                      {receiptContract.dataJaminan?.bpkbDetails && (
                        <p className="text-[11px] text-slate-600">
                          No. BPKB: {receiptContract.dataJaminan.bpkbDetails.nomorBpkb} | No. Rangka:{" "}
                          {receiptContract.dataJaminan.bpkbDetails.nomorRangkaMesin || "-"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Signatures Area */}
                  <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-600 mb-12">
                        {receiptContract.status === "Lunas" ? "Penerima Pengambilan Barang," : "Pemilik Barang Jaminan,"}
                      </p>
                      <p className="font-bold border-b border-slate-900 inline-block px-4">{receiptContract.namaPeminjam}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-12">Petugas Simpan / Admin,</p>
                      <p className="font-bold border-b border-slate-900 inline-block px-4">
                        {receiptContract.dataJaminan?.petugasPenerima || receiptContract.adminPenanggungJawab}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={enlargedPhoto} alt="Foto Enlarge" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute -top-4 -right-4 p-2 bg-white text-slate-900 rounded-full shadow-lg font-bold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PencairanPage;
