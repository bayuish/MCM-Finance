export interface KelurahanGIS {
  nama: string;
  kodePos: string;
}

export interface KecamatanGIS {
  nama: string;
  kelurahan: KelurahanGIS[];
}

export interface KotaGIS {
  nama: string;
  kecamatan: KecamatanGIS[];
}

export interface ProvinsiGIS {
  nama: string;
  kota: KotaGIS[];
}

export const INDONESIA_REGIONS_DATA: ProvinsiGIS[] = [
  {
    nama: "Sulawesi Selatan",
    kota: [
      {
        nama: "Kota Makassar",
        kecamatan: [
          {
            nama: "Kec. Rappocini",
            kelurahan: [
              { nama: "Kel. Buakana", kodePos: "90222" },
              { nama: "Kel. Gunung Sari", kodePos: "90221" },
              { nama: "Kel. Karunrung", kodePos: "90222" },
              { nama: "Kel. Mappala", kodePos: "90222" },
              { nama: "Kel. Minasa Upa", kodePos: "90221" },
              { nama: "Kel. Rappocini", kodePos: "90222" },
            ],
          },
          {
            nama: "Kec. Panakkukang",
            kelurahan: [
              { nama: "Kel. Masale", kodePos: "90231" },
              { nama: "Kel. Tamamaung", kodePos: "90231" },
              { nama: "Kel. Paropo", kodePos: "90233" },
              { nama: "Kel. Karampuang", kodePos: "90231" },
              { nama: "Kel. Pampang", kodePos: "90231" },
              { nama: "Kel. Sinrijawa", kodePos: "90232" },
            ],
          },
          {
            nama: "Kec. Tamalanrea (BTP)",
            kelurahan: [
              { nama: "Kel. Tamalanrea Indah", kodePos: "90245" },
              { nama: "Kel. Tamalanrea", kodePos: "90245" },
              { nama: "Kel. Buntusu", kodePos: "90245" },
              { nama: "Kel. Kapasa", kodePos: "90241" },
              { nama: "Kel. Kapasa Raya", kodePos: "90241" },
            ],
          },
          {
            nama: "Kec. Biringkanaya",
            kelurahan: [
              { nama: "Kel. Daya", kodePos: "90241" },
              { nama: "Kel. Sudiang", kodePos: "90242" },
              { nama: "Kel. Sudiang Raya", kodePos: "90242" },
              { nama: "Kel. Pai", kodePos: "90242" },
            ],
          },
          {
            nama: "Kec. Mariso",
            kelurahan: [
              { nama: "Kel. Mariso", kodePos: "90122" },
              { nama: "Kel. Lette", kodePos: "90123" },
              { nama: "Kel. Mattoangin", kodePos: "90121" },
            ],
          },
          {
            nama: "Kec. Ujung Pandang",
            kelurahan: [
              { nama: "Kel. Baru", kodePos: "90111" },
              { nama: "Kel. Maloku", kodePos: "90112" },
              { nama: "Kel. Pisang Selatan", kodePos: "90113" },
            ],
          },
        ],
      },
      {
        nama: "Kab. Gowa",
        kecamatan: [
          {
            nama: "Kec. Somba Opu",
            kelurahan: [
              { nama: "Kel. Sungguminasa", kodePos: "92111" },
              { nama: "Kel. Tombolo", kodePos: "92114" },
              { nama: "Kel. Samata", kodePos: "92118" },
            ],
          },
        ],
      },
      {
        nama: "Kab. Maros",
        kecamatan: [
          {
            nama: "Kec. Mandai",
            kelurahan: [
              { nama: "Kel. Hasanuddin", kodePos: "90552" },
              { nama: "Kel. Bontoa", kodePos: "90552" },
            ],
          },
        ],
      },
    ],
  },
  {
    nama: "DKI Jakarta",
    kota: [
      {
        nama: "Kota Jakarta Selatan",
        kecamatan: [
          {
            nama: "Kec. Kebayoran Baru",
            kelurahan: [
              { nama: "Kel. Senayan", kodePos: "12190" },
              { nama: "Kel. Gandaria Utara", kodePos: "12140" },
            ],
          },
        ],
      },
    ],
  },
  {
    nama: "Jawa Barat",
    kota: [
      {
        nama: "Kota Bandung",
        kecamatan: [
          {
            nama: "Kec. Coblong",
            kelurahan: [
              { nama: "Kel. Dago", kodePos: "40135" },
              { nama: "Kel. Lebak Gede", kodePos: "40132" },
            ],
          },
        ],
      },
    ],
  },
  {
    nama: "Jawa Timur",
    kota: [
      {
        nama: "Kota Surabaya",
        kecamatan: [
          {
            nama: "Kec. Tegalsari",
            kelurahan: [
              { nama: "Kel. Kedungdoro", kodePos: "60261" },
              { nama: "Kel. Wonorejo", kodePos: "60263" },
            ],
          },
        ],
      },
    ],
  },
];

export interface Peminjam {
  id: string; // Auto-generated: PEM-001, PEM-002, etc.
  nama: string;
  whatsapp: string;
  nik: string;
  alamat: string;
  pekerjaan: string;
  kontakDarurat: string;
  fotoKtp: string;
  catatan: string;
  status: "Aktif" | "Lunas" | "Blacklist";
  tanggalDaftar: string;
}

export type JenisPembayaran = "Bunga 15 Hari" | "Sekali bayar" | "Harian" | "Mingguan" | "Bulanan";
export type StatusPembiayaan = "Pending ACC" | "ACC (Siap Cair)" | "Aktif" | "Lunas" | "Segera jatuh tempo" | "Terlambat" | "Ditolak";

export type JenisJaminanType = "Handphone / Gadget" | "BPKB Kendaraan" | "Sertifikat / Lainnya";

export interface DetailHandphone {
  merk: string; // e.g. Apple, Samsung, Xiaomi, Oppo, Vivo
  tipe: string; // e.g. iPhone 15 Pro Max 256GB
  kondisi: string; // e.g. Mulus 98%, Normal tanpa Kendala
  kelengkapan: string[]; // e.g. ["Dus Original", "Charger Fast Charging", "Nota Pembelian"]
  fotoHp: string[];
}

export interface DetailBPKB {
  jenisKendaraan: "Mobil" | "Motor";
  merkModel: string; // e.g. Toyota Avanza 1.5 G MT 2023
  nomorPolisi: string; // e.g. DD 1234 AB
  nomorBpkb: string; // e.g. BPKB-987654321
  nomorRangkaMesin?: string;
  fotoBpkb: string;
  fotoKendaraan?: string;
}

export interface DataJaminan {
  idJaminan: string; // e.g. JMN-20260818-001
  jenisJaminan: JenisJaminanType;
  handphoneDetails?: DetailHandphone;
  bpkbDetails?: DetailBPKB;
  deskripsiLainnya?: string;
  lokasiPenyimpanan: string; // e.g. Brankas Kasir Utama A-1, Gudang Agunan B-2
  statusJaminan: "Tersimpan di Brankas" | "Siap Ambil (Lunas)" | "Sudah Diambil Peminjam";
  tanggalDiterima: string;
  tanggalPengambilan?: string;
  petugasPenerima: string;
  penerimaPengambilan?: string; // Nama nasabah saat serah terima pengambilan kembali
  catatanAgunan?: string;
}

export interface AdminOfficer {
  idAdmin: string; // e.g. ADM-MCM-001
  namaAdmin: string; // e.g. H. Andi Pratama, S.E.
  cabang: string; // e.g. Cabang Pusat Pettarani Makassar
  jabatan: string; // e.g. Head Admin Operasional
}

export const MOCK_ADMIN_OFFICERS: AdminOfficer[] = [
  {
    idAdmin: "ADM-MCM-001",
    namaAdmin: "H. Andi Pratama, S.E.",
    cabang: "Cabang Pusat Pettarani Makassar",
    jabatan: "Head Admin & Owner",
  },
  {
    idAdmin: "ADM-MCM-002",
    namaAdmin: "Siti Rahmawati, A.Md.",
    cabang: "Cabang Panakkukang Makassar",
    jabatan: "Admin Pembiayaan & Penagihan",
  },
  {
    idAdmin: "ADM-MCM-003",
    namaAdmin: "Budi Raharjo, S.Kom.",
    cabang: "Cabang Tamalanrea (BTP) Makassar",
    jabatan: "Credit & Collateral Officer",
  },
];

export interface TransaksiPembiayaan {
  nomorPembiayaan: string; // Auto-generated: PB-2026-001
  idPeminjam: string; // Link to Peminjam ID (PEM-001)
  namaPeminjam: string;
  whatsappPeminjam: string;
  nikPeminjam: string;
  pekerjaanPeminjam: string;
  tanggalPencairan: string;
  jumlahPokok: number;
  persenMargin: number; // Margin Bunga per 15 Hari (e.g. 10% or 15%)
  biayaMargin: number; // Rp Bunga per 15 Hari
  totalTagihan: number;
  tenor: number;
  jenisPembayaran: JenisPembayaran;
  tanggalJatuhTempo: string; // Tanggal Jatuh Tempo Bunga 15 Harian Berikutnya
  angsuranPerPeriode: number; // Nominal Bunga 15 Hari (e.g. Rp 1.000.000 / 15 hari)
  sisaTagihan: number; // Sisa Pokok Pinjaman
  sisaPokok?: number; // Sisa Pokok Pinjaman yang Belum Dilunasi
  bungaPer15Hari?: number; // Nominal Bunga per 15 Hari
  periodeSiklusHari?: number; // Default 15 Hari
  status: StatusPembiayaan;
  deskripsiJaminan?: string; // e.g. BPKB Motor Honda Vario 2023
  fotoJaminan?: string; // Image URL / preview base64
  dataJaminan?: DataJaminan; // Detailed structured collateral details
  tanggalCairDiproses?: string;
  petugasPencairan?: string;
  adminPenanggungJawab?: string; // e.g. H. Andi Pratama, S.E.
  cabangAdmin?: string; // e.g. Cabang Pusat Pettarani Makassar
  catatanOwner?: string; // Catatan persetujuan / revisi dari Owner
  disetujuiDenganPenyesuaian?: boolean; // Flag if Owner modified loan terms
  pokokAwalPengajuan?: number; // Original requested Pokok before Owner adjustment
  marginAwalPengajuan?: number; // Original requested Margin % before Owner adjustment
}

// Currency Formatter with decimals: e.g. Rp 10.000.000,00
export const formatRupiah = (val: number, includePrefix = true): string => {
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
  return includePrefix ? `Rp ${formatted}` : formatted;
};

export interface ActionItem {
  id: string;
  nasabah: string;
  nominal: number;
  jatuhTempo: string;
  status: StatusPembiayaan;
  kategori: string;
}

export interface PembayaranEntry {
  idPembayaran: string; // e.g. BYR-2026-001
  nomorPembiayaan: string; // link to PB-2026-001
  idPeminjam: string;
  namaPeminjam: string;
  angsuranKe: number; // e.g. Angsuran ke-1, ke-2, ke-3...
  tanggalBayar: string;
  nominalBayar: number;
  jenisAksiPembayaran?: "Bayar Bunga 15 Hari" | "Cicil Pokok" | "Pelunasan Pokok Total";
  metodePembayaran: string; // Transfer BCA, Cash, QRIS, etc.
  buktiBayarFoto: string; // Mandatory Photo Proof URL/Base64
  catatan?: string;
}

export interface RiwayatPinjaman {
  nomorPembiayaan: string;
  tanggalPencairan: string;
  jumlahPokok: number;
  totalTagihan: number;
  sisaTagihan: number;
  status: "Aktif" | "Lunas" | "Terlambat";
  riwayatBayar: {
    idPembayaran?: string;
    tanggal: string;
    nominal: number;
    angsuranKe: number;
    metode: string;
    buktiBayarFoto?: string; // Photo proof
    catatan?: string;
  }[];
}

// 1. Central Hero Barometer Configuration
export const HERO_BAROMETER_CONFIG = {
  title: "MANDIRI CELL LOAN MONITOR",
  totalLabel: "TOTAL PIUTANG AKTIF",
  totalAmount: 438790400,
  todayLabel: "JATUH TEMPO HARI INI",
  todayCount: 17,
  todaySuffix: "TAGIHAN",
  soonCount: 8,
  soonLabel: "Segera Jatuh Tempo",
  lateCount: 5,
  lateLabel: "Terlambat",
};

// 2. Central Dashboard Metrics Data
export const DASHBOARD_METRICS_DATA = [
  {
    title: "Total Pembiayaan Aktif",
    value: 1250000000,
    formattedValue: "Rp 1.250.000.000",
    status: "Aktif" as StatusPembiayaan,
    subtitle: "158 Portofolio",
    iconName: "Wallet",
    borderColor: "border-l-blue-600",
  },
  {
    title: "Total Sisa Tagihan",
    value: 438790400,
    formattedValue: "Rp 438.790.400",
    status: "Aktif" as StatusPembiayaan,
    subtitle: "Pokok & bunga",
    iconName: "DollarSign",
    borderColor: "border-l-blue-500",
  },
  {
    title: "Pembayaran Bulan Ini",
    value: 185400000,
    formattedValue: "Rp 185.400.000",
    status: "Lunas" as StatusPembiayaan,
    subtitle: "+12.4%",
    iconName: "TrendingUp",
    borderColor: "border-l-emerald-500",
  },
  {
    title: "Jatuh Tempo Hari Ini",
    value: 17,
    formattedValue: "17 Tagihan",
    status: "Segera jatuh tempo" as StatusPembiayaan,
    subtitle: "Rp 32.5Jt",
    iconName: "CalendarClock",
    borderColor: "border-l-amber-500",
  },
  {
    title: "Jumlah Terlambat",
    value: 5,
    formattedValue: "5 Tagihan",
    status: "Terlambat" as StatusPembiayaan,
    subtitle: "Perlu Action",
    iconName: "AlertTriangle",
    borderColor: "border-l-rose-500",
  },
  {
    title: "Jumlah Lunas",
    value: 142,
    formattedValue: "142 Tagihan",
    status: "Lunas" as StatusPembiayaan,
    subtitle: "92% Rate",
    iconName: "CheckCircle2",
    borderColor: "border-l-emerald-600",
  },
];

// 3. Central Monthly Chart Data (2-Line Chart)
export const MONTHLY_CHART_DATA = [
  { month: "Mar 2026", pembayaran: 165000000, tunggakan: 22000000 },
  { month: "Apr 2026", pembayaran: 172000000, tunggakan: 18500000 },
  { month: "Mei 2026", pembayaran: 158000000, tunggakan: 31000000 },
  { month: "Jun 2026", pembayaran: 180000000, tunggakan: 15000000 },
  { month: "Jul 2026", pembayaran: 195000000, tunggakan: 24000000 },
  { month: "Agt 2026", pembayaran: 185400000, tunggakan: 28500000 },
];

// 4. Central Action Items Table Data (Dashboard)
export const ACTION_ITEMS_DATA: ActionItem[] = [
  {
    id: "TAG-2026-001",
    nasabah: "Budi Santoso",
    nominal: 12500000,
    jatuhTempo: "17 Agt 2026",
    status: "Segera jatuh tempo",
    kategori: "Pembiayaan Mobil",
  },
  {
    id: "TAG-2026-002",
    nasabah: "PT Mandiri Utama Perkasa",
    nominal: 45000000,
    jatuhTempo: "12 Agt 2026",
    status: "Terlambat",
    kategori: "Kredit Usaha Mikro",
  },
  {
    id: "TAG-2026-003",
    nasabah: "Siti Rahmawati",
    nominal: 8200000,
    jatuhTempo: "17 Agt 2026",
    status: "Segera jatuh tempo",
    kategori: "Pembiayaan Motor",
  },
  {
    id: "TAG-2026-004",
    nasabah: "Ahmad Wijaya",
    nominal: 18000000,
    jatuhTempo: "25 Agt 2026",
    status: "Aktif",
    kategori: "Kredit Multi Guna",
  },
  {
    id: "TAG-2026-005",
    nasabah: "CV Sukses Mandiri Jaya",
    nominal: 62500000,
    jatuhTempo: "05 Agt 2026",
    status: "Terlambat",
    kategori: "Pembiayaan Alat Berat",
  },
  {
    id: "TAG-2026-006",
    nasabah: "Rina Handayani",
    nominal: 5000000,
    jatuhTempo: "15 Agt 2026",
    status: "Lunas",
    kategori: "Pembiayaan Motor",
  },
  {
    id: "TAG-2026-007",
    nasabah: "Dewi Lestari",
    nominal: 14300000,
    jatuhTempo: "16 Agt 2026",
    status: "Lunas",
    kategori: "Kredit Multi Guna",
  },
];

// 5. Central Registered Borrowers (Data Peminjam)
export const INITIAL_PEMINJAM_DATA: Peminjam[] = [
  {
    id: "PEM-001",
    nama: "Budi Santoso",
    whatsapp: "+62 812-3456-7890",
    nik: "7371011508920001",
    alamat: "Jl. Pettarani No. 45, Makassar",
    pekerjaan: "Wiraswasta (Toko Kelontong)",
    kontakDarurat: "Siti Aminah (Istri) - 081345678901",
    fotoKtp: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    catatan: "Peminjam proaktif, riwayat pembayaran sangat lancar.",
    status: "Aktif",
    tanggalDaftar: "10 Jan 2026",
  },
  {
    id: "PEM-002",
    nama: "PT Mandiri Utama Perkasa (Bpk. Hendra)",
    whatsapp: "+62 811-9876-5432",
    nik: "7371022003880004",
    alamat: "Kawasan Industri Makassar Blok B No. 12",
    pekerjaan: "Direktur Utama",
    kontakDarurat: "Andi Wijaya (Manager Finansial) - 081298765432",
    fotoKtp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    catatan: "Pembiayaan operasional perusahaan modal kerja.",
    status: "Aktif",
    tanggalDaftar: "15 Feb 2026",
  },
  {
    id: "PEM-003",
    nama: "Siti Rahmawati",
    whatsapp: "+62 852-1122-3344",
    nik: "7371034511940002",
    alamat: "Jl. Perintis Kemerdekaan KM 10, Makassar",
    pekerjaan: "Karyawan Swasta",
    kontakDarurat: "Rahmat (Suami) - 085233445566",
    fotoKtp: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    catatan: "Mengajukan pinjaman sepeda motor.",
    status: "Aktif",
    tanggalDaftar: "01 Mar 2026",
  },
  {
    id: "PEM-004",
    nama: "Ahmad Wijaya",
    whatsapp: "+62 821-5566-7788",
    nik: "7371041806900003",
    alamat: "Jl. Veteran Selatan No. 88, Makassar",
    pekerjaan: "PNS Pemkot Makassar",
    kontakDarurat: "Bambang (Saudara) - 082177889900",
    fotoKtp: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    catatan: "Gaji autodebet, kolektibilitas lancar.",
    status: "Lunas",
    tanggalDaftar: "05 Des 2025",
  },
  {
    id: "PEM-005",
    nama: "CV Sukses Mandiri Jaya (Ibu Ratna)",
    whatsapp: "+62 813-7788-9900",
    nik: "7371050204850005",
    alamat: "Jl. Hertasning Baru No. 102, Makassar",
    pekerjaan: "Kontraktor Bangunan",
    kontakDarurat: "Dedi (Komisaris) - 081399001122",
    fotoKtp: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    catatan: "Memiliki tunggakan di atas 30 hari, dalam pengawasan penagihan intensif.",
    status: "Blacklist",
    tanggalDaftar: "18 Nov 2025",
  },
];

// 6. Central Loan Transactions (Data Pembiayaan)
export const INITIAL_PEMBIAYAAN_DATA: TransaksiPembiayaan[] = [
  {
    nomorPembiayaan: "PB-2026-007",
    idPeminjam: "PEM-003",
    namaPeminjam: "Siti Rahmawati",
    whatsappPeminjam: "+62 852-1122-3344",
    nikPeminjam: "7371034511940002",
    pekerjaanPeminjam: "Karyawan Swasta",
    tanggalPencairan: "18 Agt 2026",
    jumlahPokok: 12000000,
    persenMargin: 15,
    biayaMargin: 1800000,
    totalTagihan: 13800000,
    tenor: 1,
    jenisPembayaran: "Bunga 15 Hari",
    tanggalJatuhTempo: "02 Sep 2026",
    angsuranPerPeriode: 1800000,
    sisaTagihan: 12000000,
    sisaPokok: 12000000,
    bungaPer15Hari: 1800000,
    periodeSiklusHari: 15,
    status: "ACC (Siap Cair)",
    deskripsiJaminan: "iPhone 15 Pro 256GB Deep Purple (SN: C02F9081MD6M)",
    fotoJaminan: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
    cabangAdmin: "Cabang Panakkukang Makassar",
    catatanOwner: "Disetujui (ACC) oleh Owner pada 18 Agt 2026. Siap dilakukan pencairan & penyerahan jaminan oleh Admin.",
  },
  {
    nomorPembiayaan: "PB-2026-006",
    idPeminjam: "PEM-005",
    namaPeminjam: "Hj. Ratna Juwita",
    whatsappPeminjam: "+62 813-7788-9900",
    nikPeminjam: "7371050204850005",
    pekerjaanPeminjam: "Wiraswasta Kuliner",
    tanggalPencairan: "17 Agt 2026",
    jumlahPokok: 25000000,
    persenMargin: 20,
    biayaMargin: 5000000,
    totalTagihan: 30000000,
    tenor: 1,
    jenisPembayaran: "Bunga 15 Hari",
    tanggalJatuhTempo: "17 Sep 2026",
    angsuranPerPeriode: 2500000,
    sisaTagihan: 25000000,
    sisaPokok: 25000000,
    bungaPer15Hari: 2500000,
    periodeSiklusHari: 15,
    status: "Pending ACC",
    deskripsiJaminan: "BPKB Mobil Toyota Avanza 2023 (No. DD 9988 XA)",
    fotoJaminan: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
    cabangAdmin: "Cabang Panakkukang Makassar",
  },
  {
    nomorPembiayaan: "PB-2026-001",
    idPeminjam: "PEM-001",
    namaPeminjam: "Budi Santoso",
    whatsappPeminjam: "+62 812-3456-7890",
    nikPeminjam: "7371011508920001",
    pekerjaanPeminjam: "Wiraswasta (Toko Kelontong)",
    tanggalPencairan: "10 Jan 2026",
    jumlahPokok: 10000000,
    persenMargin: 10,
    biayaMargin: 1000000,
    totalTagihan: 10000000,
    tenor: 1,
    jenisPembayaran: "Bunga 15 Hari",
    tanggalJatuhTempo: "17 Agt 2026",
    angsuranPerPeriode: 1000000,
    sisaTagihan: 10000000,
    sisaPokok: 10000000,
    bungaPer15Hari: 1000000,
    periodeSiklusHari: 15,
    status: "Segera jatuh tempo",
    deskripsiJaminan: "BPKB Mobil Honda HR-V 2022 (No. DD 1234 AB)",
    fotoJaminan: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80",
    adminPenanggungJawab: "H. Andi Pratama, S.E.",
    cabangAdmin: "Cabang Pusat Pettarani Makassar",
  },
  {
    nomorPembiayaan: "PB-2026-002",
    idPeminjam: "PEM-002",
    namaPeminjam: "PT Mandiri Utama Perkasa (Bpk. Hendra)",
    whatsappPeminjam: "+62 811-9876-5432",
    nikPeminjam: "7371022003880004",
    pekerjaanPeminjam: "Direktur Utama",
    tanggalPencairan: "15 Feb 2026",
    jumlahPokok: 40000000,
    persenMargin: 25,
    biayaMargin: 10000000,
    totalTagihan: 50000000,
    tenor: 10,
    jenisPembayaran: "Bulanan",
    tanggalJatuhTempo: "12 Agt 2026",
    angsuranPerPeriode: 5000000,
    sisaTagihan: 45000000,
    status: "Terlambat",
    deskripsiJaminan: "Sertifikat SHM No. 4022/Panakkukang",
    fotoJaminan: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80",
    adminPenanggungJawab: "Siti Rahmawati, A.Md.",
    cabangAdmin: "Cabang Panakkukang Makassar",
  },
  {
    nomorPembiayaan: "PB-2026-003",
    idPeminjam: "PEM-003",
    namaPeminjam: "Siti Nurhaliza",
    whatsappPeminjam: "+62 852-1122-3344",
    nikPeminjam: "7371035010950002",
    pekerjaanPeminjam: "Pegawai Negeri Sipil (PNS)",
    tanggalPencairan: "01 Mar 2026",
    jumlahPokok: 20000000,
    persenMargin: 20,
    biayaMargin: 4000000,
    totalTagihan: 24000000,
    tenor: 12,
    jenisPembayaran: "Bulanan",
    tanggalJatuhTempo: "01 Sep 2026",
    angsuranPerPeriode: 2000000,
    sisaTagihan: 20000000,
    status: "Aktif",
    deskripsiJaminan: "BPKB Motor Honda Vario 160 (No. DD 8899 AB)",
    fotoJaminan: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80",
    adminPenanggungJawab: "Budi Raharjo, S.Kom.",
    cabangAdmin: "Cabang Tamalanrea (BTP) Makassar",
  },
  {
    nomorPembiayaan: "PB-2026-004",
    idPeminjam: "PEM-004",
    namaPeminjam: "Ahmad Wijaya",
    whatsappPeminjam: "+62 821-5566-7788",
    nikPeminjam: "7371041806900003",
    pekerjaanPeminjam: "PNS Pemkot Makassar",
    tanggalPencairan: "25 Jul 2026",
    jumlahPokok: 15000000,
    persenMargin: 20,
    biayaMargin: 3000000,
    totalTagihan: 18000000,
    tenor: 6,
    jenisPembayaran: "Bulanan",
    tanggalJatuhTempo: "25 Agt 2026",
    angsuranPerPeriode: 3000000,
    sisaTagihan: 18000000,
    status: "Aktif",
    deskripsiJaminan: "Slip Gaji PNS & SK Pegawai Negeri (NIP 19850412...)",
    fotoJaminan: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=80",
  },
  {
    nomorPembiayaan: "PB-2026-005",
    idPeminjam: "PEM-005",
    namaPeminjam: "CV Sukses Mandiri Jaya (Ibu Ratna)",
    whatsappPeminjam: "+62 813-7788-9900",
    nikPeminjam: "7371050204850005",
    pekerjaanPeminjam: "Kontraktor Bangunan",
    tanggalPencairan: "05 Mei 2026",
    jumlahPokok: 50000000,
    persenMargin: 25,
    biayaMargin: 12500000,
    totalTagihan: 62500000,
    tenor: 30,
    jenisPembayaran: "Harian",
    tanggalJatuhTempo: "05 Agt 2026",
    angsuranPerPeriode: 2083333,
    sisaTagihan: 62500000,
    status: "Terlambat",
    deskripsiJaminan: "BPKB Excavator Komatsu PC200-8",
    fotoJaminan: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=80",
  },
  {
    nomorPembiayaan: "PB-2026-006",
    idPeminjam: "PEM-004",
    namaPeminjam: "Rina Handayani",
    whatsappPeminjam: "+62 812-9988-7766",
    nikPeminjam: "7371062007930009",
    pekerjaanPeminjam: "Pembiayaan Motor",
    tanggalPencairan: "15 Jun 2026",
    jumlahPokok: 4000000,
    persenMargin: 25,
    biayaMargin: 1000000,
    totalTagihan: 5000000,
    tenor: 1,
    jenisPembayaran: "Sekali bayar",
    tanggalJatuhTempo: "15 Agt 2026",
    angsuranPerPeriode: 5000000,
    sisaTagihan: 0,
    status: "Lunas",
    deskripsiJaminan: "BPKB Motor Honda Beat 2023 (No. DD 9012 EF)",
    fotoJaminan: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=80",
  },
];

// 7. Central Borrower Loan & Payment History Data
export const MOCK_RIWAYAT_PINJAMAN: Record<string, RiwayatPinjaman[]> = {
  "PEM-001": [
    {
      nomorPembiayaan: "PB-2026-001",
      tanggalPencairan: "10 Jan 2026",
      jumlahPokok: 10000000,
      totalTagihan: 12500000,
      sisaTagihan: 2500000,
      status: "Aktif",
      riwayatBayar: [
        {
          idPembayaran: "BYR-2026-001",
          tanggal: "10 Feb 2026",
          nominal: 2500000,
          angsuranKe: 1,
          metode: "Transfer BCA",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Transfer BCA via Mobile Banking"
        },
        {
          idPembayaran: "BYR-2026-002",
          tanggal: "10 Mar 2026",
          nominal: 2500000,
          angsuranKe: 2,
          metode: "Transfer BCA",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Transfer BCA Tepat Waktu"
        },
        {
          idPembayaran: "BYR-2026-003",
          tanggal: "10 Apr 2026",
          nominal: 2500000,
          angsuranKe: 3,
          metode: "Cash di Kantor",
          buktiBayarFoto: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&auto=format&fit=crop&q=80",
          catatan: "Bayar Tunai di Kasir Mandiri Cell"
        },
        {
          idPembayaran: "BYR-2026-004",
          tanggal: "10 Mei 2026",
          nominal: 2500000,
          angsuranKe: 4,
          metode: "Transfer Mandiri",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Struk Transfer Livin Mandiri"
        },
      ],
    },
  ],
  "PEM-002": [
    {
      nomorPembiayaan: "PB-2026-002",
      tanggalPencairan: "15 Feb 2026",
      jumlahPokok: 40000000,
      totalTagihan: 50000000,
      sisaTagihan: 45000000,
      status: "Terlambat",
      riwayatBayar: [
        {
          idPembayaran: "BYR-2026-005",
          tanggal: "15 Mar 2026",
          nominal: 5000000,
          angsuranKe: 1,
          metode: "Transfer BRI",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Pembayaran Angsuran Pertama"
        },
      ],
    },
  ],
  "PEM-004": [
    {
      nomorPembiayaan: "PB-2025-089",
      tanggalPencairan: "05 Des 2025",
      jumlahPokok: 15000000,
      totalTagihan: 18000000,
      sisaTagihan: 0,
      status: "Lunas",
      riwayatBayar: [
        {
          idPembayaran: "BYR-2026-006",
          tanggal: "05 Jan 2026",
          nominal: 6000000,
          angsuranKe: 1,
          metode: "Autodebet",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Autodebet Gaji PNS"
        },
        {
          idPembayaran: "BYR-2026-007",
          tanggal: "05 Feb 2026",
          nominal: 6000000,
          angsuranKe: 2,
          metode: "Autodebet",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Autodebet Gaji PNS"
        },
        {
          idPembayaran: "BYR-2026-008",
          tanggal: "05 Mar 2026",
          nominal: 6000000,
          angsuranKe: 3,
          metode: "Autodebet",
          buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
          catatan: "Pelunasan Terakhir"
        },
      ],
    },
  ],
};

// Helper to generate sequential ID Peminjam (PEM-001, PEM-002, ...)
export const generateNextPeminjamId = (currentList: Peminjam[]): string => {
  const nextNum = currentList.length + 1;
  return `PEM-${String(nextNum).padStart(3, "0")}`;
};

// Helper to generate sequential Nomor Pembiayaan (PB-2026-001, PB-2026-002, ...)
export const generateNextPembiayaanNo = (currentList: TransaksiPembiayaan[]): string => {
  const nextNum = currentList.length + 1;
  return `PB-2026-${String(nextNum).padStart(3, "0")}`;
};
