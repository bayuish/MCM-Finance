import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { 
  INITIAL_PEMINJAM_DATA,
  INITIAL_PEMBIAYAAN_DATA,
  MOCK_ADMIN_OFFICERS,
  generateNextPembiayaanNo,
  formatRupiah,
  type Peminjam,
  type TransaksiPembiayaan,
  type PembayaranEntry,
  type JenisPembayaran,
  type StatusPembiayaan
} from "@/data/mockData";
import { 
  Receipt, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Clock, 
  Eye, 
  X, 
  Printer,
  TrendingUp,
  FileSpreadsheet,
  UserCheck,
  Phone,
  Percent,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  CreditCard,
  Camera,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Building,
  MessageSquare,
  Send,
  Bot,
  Sparkles,
  Code,
  Copy,
  ExternalLink,
  Check,
  Zap,
  Settings,
  Bell
} from "lucide-react";

const DataPembiayaanPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [peminjamList, setPeminjamList] = useState<Peminjam[]>(INITIAL_PEMINJAM_DATA);
  const [pembiayaanList, setPembiayaanList] = useState<TransaksiPembiayaan[]>(INITIAL_PEMBIAYAAN_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [selectedItem, setSelectedItem] = useState<TransaksiPembiayaan | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Selected Peminjam ID in Create Loan Form
  const [selectedPeminjamId, setSelectedPeminjamId] = useState<string>(
    INITIAL_PEMINJAM_DATA[0]?.id || "PEM-001"
  );

  // Main Navigation View Tab: "semua" (Table view) vs "pendingACC" (Dedicated Owner ACC Queue view)
  const [activeMainTab, setActiveMainTab] = useState<"semua" | "pendingACC">("semua");

  const pendingACCLoans = pembiayaanList.filter((item) => item.status === "Pending ACC");
  const pendingACCCount = pendingACCLoans.length;

  // Auto switch to pending ACC tab if directed via URL query ?view=acc
  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam === "acc") {
      setActiveMainTab("pendingACC");
    }
  }, [searchParams]);

  // Auto open Create Loan Form modal if directed from Add Borrower form
  useEffect(() => {
    // Sync list with central store
    setPeminjamList([...INITIAL_PEMINJAM_DATA]);

    const openModal =
      location.state?.openAddModal || searchParams.get("openAddModal") === "true";
    const targetPeminjamId =
      location.state?.peminjamId || searchParams.get("peminjamId");

    if (openModal) {
      if (targetPeminjamId) {
        setSelectedPeminjamId(targetPeminjamId);
      }
      setIsAddModalOpen(true);
    }
  }, [location, searchParams]);

  // Selected Admin Officer for Create Loan Form (defaults to logged-in user profile)
  const [selectedAdminId, setSelectedAdminId] = useState<string>(
    user?.nipAdmin || MOCK_ADMIN_OFFICERS[0].idAdmin
  );

  // Sync selected admin with currently logged-in user profile
  useEffect(() => {
    if (user?.nipAdmin) {
      setSelectedAdminId(user.nipAdmin);
    }
  }, [user]);

  // Find currently selected Admin Officer object
  const activeSelectedAdmin = MOCK_ADMIN_OFFICERS.find((a) => a.idAdmin === selectedAdminId) || {
    idAdmin: user?.nipAdmin || "ADM-MCM-001",
    namaAdmin: user?.name || "H. Andi Pratama, S.E.",
    cabang: user?.cabang || "Cabang Pusat Pettarani Makassar",
    jabatan: user?.jabatan || "Head Admin Operasional",
  };

  // Find currently selected borrower object
  const activeSelectedBorrower = peminjamList.find((p) => p.id === selectedPeminjamId) || peminjamList[0];

  // String state for form inputs to avoid leading zero bugs (01000) and allow clean clearing
  const [pokokInput, setPokokInput] = useState<string>("10.000.000");
  const [marginInput, setMarginInput] = useState<string>("25");
  const [tenorInput, setTenorInput] = useState<string>("5");
  const [tanggalPencairanInput, setTanggalPencairanInput] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [jenisPembayaranInput, setJenisPembayaranInput] = useState<JenisPembayaran>("Bulanan");
  const [tanggalJatuhTempoInput, setTanggalJatuhTempoInput] = useState<string>("2026-08-30");

  // State for Jaminan (Collateral) Name/Description & Collateral Photo
  const [deskripsiJaminanInput, setDeskripsiJaminanInput] = useState<string>(
    "BPKB Motor Honda Vario 160 CC (No. DD 8899 AB)"
  );
  const [fotoJaminanInput, setFotoJaminanInput] = useState<string>(
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80"
  );
  const [previewEnlargedPhoto, setPreviewEnlargedPhoto] = useState<string | null>(null);

  // Payment Recording Modal State (Form Input Pembayaran Angsuran)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayContractNo, setSelectedPayContractNo] = useState<string>(
    INITIAL_PEMBIAYAAN_DATA[0]?.nomorPembiayaan || "PB-2026-001"
  );
  
  // Dynamic selected contract for payment
  const activePayContract = pembiayaanList.find((item) => item.nomorPembiayaan === selectedPayContractNo) || pembiayaanList[0];

  // Store payment records by contract number
  const [paymentHistoryStore, setPaymentHistoryStore] = useState<Record<string, PembayaranEntry[]>>({
    "PB-2026-001": [
      {
        idPembayaran: "BYR-2026-001",
        nomorPembiayaan: "PB-2026-001",
        idPeminjam: "PEM-001",
        namaPeminjam: "Budi Santoso",
        angsuranKe: 1,
        tanggalBayar: "10 Feb 2026",
        nominalBayar: 2500000,
        metodePembayaran: "Transfer BCA",
        buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
        catatan: "Transfer BCA Mobile Banking"
      },
      {
        idPembayaran: "BYR-2026-002",
        nomorPembiayaan: "PB-2026-001",
        idPeminjam: "PEM-001",
        namaPeminjam: "Budi Santoso",
        angsuranKe: 2,
        tanggalBayar: "10 Mar 2026",
        nominalBayar: 2500000,
        metodePembayaran: "Transfer BCA",
        buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
        catatan: "Transfer BCA Tepat Waktu"
      },
      {
        idPembayaran: "BYR-2026-003",
        nomorPembiayaan: "PB-2026-001",
        idPeminjam: "PEM-001",
        namaPeminjam: "Budi Santoso",
        angsuranKe: 3,
        tanggalBayar: "10 Apr 2026",
        nominalBayar: 2500000,
        metodePembayaran: "Cash di Kantor",
        buktiBayarFoto: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&auto=format&fit=crop&q=80",
        catatan: "Bayar Tunai di Kasir Mandiri Cell"
      },
      {
        idPembayaran: "BYR-2026-004",
        nomorPembiayaan: "PB-2026-001",
        idPeminjam: "PEM-001",
        namaPeminjam: "Budi Santoso",
        angsuranKe: 4,
        tanggalBayar: "10 Mei 2026",
        nominalBayar: 2500000,
        metodePembayaran: "Transfer Mandiri",
        buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
        catatan: "Struk Transfer Livin Mandiri"
      },
    ],
    "PB-2026-002": [
      {
        idPembayaran: "BYR-2026-005",
        nomorPembiayaan: "PB-2026-002",
        idPeminjam: "PEM-002",
        namaPeminjam: "PT Mandiri Utama Perkasa",
        angsuranKe: 1,
        tanggalBayar: "15 Mar 2026",
        nominalBayar: 5000000,
        metodePembayaran: "Transfer BRI",
        buktiBayarFoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
        catatan: "Angsuran ke-1 Rekening Operasional"
      }
    ]
  });

  // Calculate next installment number for selected contract
  const currentContractPayments = paymentHistoryStore[selectedPayContractNo] || [];
  const nextAngsuranKe = currentContractPayments.length + 1;

  // Kasir Payment Action Type State:
  // "Bayar Bunga 15 Hari" | "Cicil Pokok" | "Pelunasan Pokok Total"
  const [jenisAksiBayar, setJenisAksiBayar] = useState<"Bayar Bunga 15 Hari" | "Cicil Pokok" | "Pelunasan Pokok Total">("Bayar Bunga 15 Hari");

  // Payment Form Fields
  const [payNominalInput, setPayNominalInput] = useState<string>("1.000.000");
  const [payMetodeInput, setPayMetodeInput] = useState<string>("Transfer BCA");
  const [payTanggalInput, setPayTanggalInput] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [payBuktiFotoInput, setPayBuktiFotoInput] = useState<string>("");
  const [payCatatanInput, setPayCatatanInput] = useState<string>("");
  const [payErrorMsg, setPayErrorMsg] = useState<string>("");

  // Sync default nominal when selected contract or payment action type changes
  useEffect(() => {
    if (activePayContract) {
      const bungaRp = activePayContract.bungaPer15Hari || activePayContract.biayaMargin || 1000000;
      const sisaPokokRp = activePayContract.sisaPokok !== undefined ? activePayContract.sisaPokok : activePayContract.jumlahPokok;
      
      if (jenisAksiBayar === "Bayar Bunga 15 Hari") {
        setPayNominalInput(formatInputRupiah(String(bungaRp)));
      } else if (jenisAksiBayar === "Pelunasan Pokok Total") {
        setPayNominalInput(formatInputRupiah(String(sisaPokokRp + bungaRp)));
      } else {
        setPayNominalInput(formatInputRupiah(String(sisaPokokRp)));
      }
    }
  }, [selectedPayContractNo, jenisAksiBayar, activePayContract]);

  // File Upload Handler for Bukti Bayar Photo
  const handleBuktiBayarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPayBuktiFotoInput(reader.result as string);
        setPayErrorMsg("");
      };
      reader.readAsDataURL(file);
    }
  };

  // File Upload Handler for Foto Jaminan
  const handleFotoJaminanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoJaminanInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- WHATSAPP AUTO-REMINDER SYSTEM STATES ---
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waSelectedContractNo, setWaSelectedContractNo] = useState<string>("");
  const [waTemplateType, setWaTemplateType] = useState<"h-3" | "hari_h" | "terlambat">("hari_h");
  const [waCustomMessage, setWaCustomMessage] = useState<string>("");
  const [waActiveTab, setWaActiveTab] = useState<"queue" | "broadcast" | "architecture">("queue");
  const [isSimulatingCron, setIsSimulatingCron] = useState(false);
  const [waSimulatedLog, setWaSimulatedLog] = useState<string[]>([]);
  const [waApiKey, setWaApiKey] = useState<string>("FONNTE-MCM-FINANCE-API-KEY-8899");
  const [copiedCode, setCopiedCode] = useState(false);

  const activeWaContract =
    pembiayaanList.find((item) => item.nomorPembiayaan === waSelectedContractNo) || pembiayaanList[0];

  const getWaTextForContract = (
    contract: TransaksiPembiayaan,
    type: "h-3" | "hari_h" | "terlambat"
  ) => {
    if (!contract) return "";
    const nominalAngsuran = formatRupiah(contract.angsuranPerPeriode || contract.biayaMargin);
    const totalSisa = formatRupiah(contract.sisaTagihan);

    if (type === "h-3") {
      return `Halo Bpk/Ibu *${contract.namaPeminjam}*,\n\nSalam hangat dari *MCM Finance Makassar*.\n\nKami menginfokan bahwa pembiayaan Anda (*${contract.nomorPembiayaan}*) akan jatuh tempo pada *${contract.tanggalJatuhTempo}*.\n\n📌 *Rincian Tagihan Bunga/Angsuran:*\n• Wajib Bayar: ${nominalAngsuran}\n• Sisa Pokok: ${totalSisa}\n\n💳 *Rekening Pembayaran:* Bank BCA 7371029841 a.n. MCM Finance\n\nMohon konfirmasi apabila sudah transfer. Terima kasih atas kerja samanya! 🙏`;
    } else if (type === "hari_h") {
      return `⚠️ *REMINDER JATUH TEMPO HARI INI*\n\nHalo Bpk/Ibu *${contract.namaPeminjam}*,\n\nTagihan pembiayaan Anda (*${contract.nomorPembiayaan}*) jatuh tempo *HARI INI (${contract.tanggalJatuhTempo})*.\n\n💵 *Nominal Wajib Bayar:* ${nominalAngsuran}\n• Sisa Pokok: ${totalSisa}\n\n💳 *Transfer BCA:* 7371029841 a.n. MCM Finance / H. Andi Pratama\n\nMohon transfer hari ini dan kirimkan bukti transfer. Terima kasih! 🙏`;
    } else {
      return `🚨 *PEMBERITAHUAN TUNGGAKAN JATUH TEMPO*\n\nHalo Bpk/Ibu *${contract.namaPeminjam}*,\n\nTagihan pembiayaan Anda (*${contract.nomorPembiayaan}*) telah *MELEWATI TANGGAL JATUH TEMPO (${contract.tanggalJatuhTempo})*.\n\n⚠️ *Jumlah Tunggakan:* ${nominalAngsuran}\n• Sisa Pokok Pinjaman: ${totalSisa}\n\nMohon segera melakukan pelunasan hari ini untuk menghindari denda penalti keterlambatan. Hubungi Admin Kasir MCM Finance jika ada kendala. Terima kasih.`;
    }
  };

  const handleOpenWaModalForContract = (contract: TransaksiPembiayaan) => {
    if (!contract) return;
    setWaSelectedContractNo(contract.nomorPembiayaan);
    const initialType =
      contract.status === "Terlambat" ? "terlambat" : contract.status === "Segera jatuh tempo" ? "hari_h" : "h-3";
    setWaTemplateType(initialType);
    setWaCustomMessage(getWaTextForContract(contract, initialType));
    setIsWaModalOpen(true);
  };

  useEffect(() => {
    if (activeWaContract) {
      setWaCustomMessage(getWaTextForContract(activeWaContract, waTemplateType));
    }
  }, [waTemplateType, waSelectedContractNo]);

  const handleSendWhatsAppWebDirect = (contract: TransaksiPembiayaan, customMsg?: string) => {
    if (!contract) return;
    const msg = customMsg || getWaTextForContract(contract, waTemplateType);
    const cleanPhone = contract.whatsappPeminjam.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Contracts needing WA reminders (Segera jatuh tempo, Terlambat, or Aktif)
  const dueOrOverdueContracts = pembiayaanList.filter(
    (item) => item.status === "Segera jatuh tempo" || item.status === "Terlambat" || item.status === "Aktif"
  );

  const handleRunSimulatedCronBroadcast = () => {
    setIsSimulatingCron(true);
    setWaSimulatedLog([
      `[08:00:00 WITA] 🚀 SERVER CRON JOB STARTED: Scanning database for due loans...`,
      `[08:00:01 WITA] 🔍 Found ${dueOrOverdueContracts.length} contracts matching due date filter.`
    ]);

    dueOrOverdueContracts.forEach((contract, index) => {
      setTimeout(() => {
        setWaSimulatedLog((prev) => [
          ...prev,
          `[08:00:0${index + 2} WITA] 💬 [WA API Gateway] Sending auto-reminder to ${contract.namaPeminjam} (${contract.whatsappPeminjam}) - Status: HTTP 200 OK (Message ID: WAG-${Date.now()}-${index + 1})`
        ]);

        if (index === dueOrOverdueContracts.length - 1) {
          setTimeout(() => {
            setWaSimulatedLog((prev) => [
              ...prev,
              `[08:00:10 WITA] ✅ CRON JOB FINISHED: All ${dueOrOverdueContracts.length} automated WhatsApp reminders dispatched successfully!`
            ]);
            setIsSimulatingCron(false);
          }, 600);
        }
      }, (index + 1) * 700);
    });
  };

  // Helper: Format raw digits to thousand separators string ("10000000" -> "10.000.000")
  const formatInputRupiah = (valStr: string): string => {
    const cleanDigits = valStr.replace(/\D/g, "");
    if (!cleanDigits) return "";
    const num = parseInt(cleanDigits, 10);
    if (isNaN(num) || num === 0) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Helper: Parse formatted currency string ("10.000.000") to numeric value (10000000)
  const parseFormattedNumber = (valStr: string): number => {
    const cleanDigits = valStr.replace(/\D/g, "");
    return cleanDigits ? parseInt(cleanDigits, 10) : 0;
  };

  // Compute live numeric values
  const jumlahPokokNumeric = parseFormattedNumber(pokokInput);
  const persenMarginNumeric = marginInput ? parseFloat(marginInput) : 0;
  const tenorNumeric = tenorInput ? parseInt(tenorInput, 10) : 1;

  const biayaMarginNominal = Math.round(jumlahPokokNumeric * (persenMarginNumeric / 100));
  const totalTagihanCalculated = jumlahPokokNumeric + biayaMarginNominal;
  const angsuranCalculated = Math.round(totalTagihanCalculated / (tenorNumeric || 1));

  const filteredPembiayaan = pembiayaanList.filter((item) => {
    const matchesSearch =
      item.namaPeminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorPembiayaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.idPeminjam && item.idPeminjam.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesJenis =
      jenisFilter === "Semua" || item.jenisPembayaran === jenisFilter;
    const matchesStatus =
      statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  // Calculate totals formatted
  const totalPokokAll = pembiayaanList.reduce((acc, curr) => acc + curr.jumlahPokok, 0);
  const totalMarginAll = pembiayaanList.reduce((acc, curr) => acc + curr.biayaMargin, 0);
  const totalSisaAll = pembiayaanList.reduce((acc, curr) => acc + curr.sisaTagihan, 0);

  const getStatusBadge = (status: StatusPembiayaan) => {
    switch (status) {
      case "Pending ACC":
        return (
          <span className="status-badge status-badge-pending whitespace-nowrap inline-flex items-center shrink-0">
            <Clock className="h-3 w-3 text-amber-600 animate-pulse" /> Pending ACC Owner
          </span>
        );
      case "ACC (Siap Cair)":
        return (
          <span className="status-badge bg-blue-50 text-blue-800 border border-blue-300 whitespace-nowrap inline-flex items-center shrink-0">
            <CheckCircle2 className="h-3 w-3 text-blue-600" /> ACC (Siap Cair)
          </span>
        );
      case "Lunas":
        return (
          <span className="status-badge status-badge-lunas whitespace-nowrap inline-flex items-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" /> Lunas
          </span>
        );
      case "Aktif":
        return (
          <span className="status-badge status-badge-aktif whitespace-nowrap inline-flex items-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" /> Aktif
          </span>
        );
      case "Segera jatuh tempo":
        return (
          <span className="status-badge status-badge-segera whitespace-nowrap inline-flex items-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" /> Segera Jatuh Tempo
          </span>
        );
      case "Terlambat":
        return (
          <span className="status-badge status-badge-terlambat whitespace-nowrap inline-flex items-center shrink-0">
            <span className="h-2 w-2 rounded-full bg-rose-600 shrink-0" /> Terlambat
          </span>
        );
      case "Ditolak":
        return (
          <span className="status-badge status-badge-ditolak whitespace-nowrap inline-flex items-center shrink-0">
            <XCircle className="h-3 w-3 text-slate-500" /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  // Owner approval handler (ACC Pembiayaan -> Status becomes "ACC (Siap Cair)")
  const handleApproveTransaction = (nomorPembiayaan: string) => {
    const target = pembiayaanList.find((p) => p.nomorPembiayaan === nomorPembiayaan);
    if (target) {
      handleOpenOwnerReview(target);
    }
  };

  // Owner Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewContract, setReviewContract] = useState<TransaksiPembiayaan | null>(null);

  const [revPokokInput, setRevPokokInput] = useState<string>("");
  const [revMarginInput, setRevMarginInput] = useState<string>("");
  const [revTenorInput, setRevTenorInput] = useState<string>("");
  const [revJenisPembayaran, setRevJenisPembayaran] = useState<JenisPembayaran>("Bulanan");
  const [revCatatanOwner, setRevCatatanOwner] = useState<string>("");

  // Open Owner Review Modal with pre-filled figures
  const handleOpenOwnerReview = (item: TransaksiPembiayaan) => {
    setReviewContract(item);
    setRevPokokInput(formatInputRupiah(String(item.jumlahPokok)));
    setRevMarginInput(String(item.persenMargin));
    setRevTenorInput(String(item.tenor));
    setRevJenisPembayaran(item.jenisPembayaran);
    setRevCatatanOwner(item.catatanOwner || "");
    setIsReviewModalOpen(true);
  };

  // Submit Owner Review & ACC
  const handleSaveOwnerReviewACC = () => {
    if (!reviewContract) return;

    const rawPokok = revPokokInput.replace(/\D/g, "");
    const cleanPokok = parseInt(rawPokok, 10) || reviewContract.jumlahPokok;
    const cleanMargin = parseFloat(revMarginInput) || reviewContract.persenMargin;
    const cleanTenor = parseInt(revTenorInput, 10) || reviewContract.tenor;

    const calculatedMarginRp = Math.round(cleanPokok * (cleanMargin / 100));
    const calculatedTotalTagihan = cleanPokok + calculatedMarginRp;
    const calculatedAngsuran = Math.round(calculatedTotalTagihan / (cleanTenor || 1));

    const isModified =
      cleanPokok !== reviewContract.jumlahPokok ||
      cleanMargin !== reviewContract.persenMargin ||
      cleanTenor !== reviewContract.tenor ||
      revJenisPembayaran !== reviewContract.jenisPembayaran;

    const defaultNote = isModified
      ? `Disetujui Owner dengan penyesuaian (Pokok disesuaikan ke ${formatRupiah(cleanPokok)}, Margin ${cleanMargin}%).`
      : "Disetujui (ACC) oleh Owner tanpa perubahan.";

    const updatedContract: TransaksiPembiayaan = {
      ...reviewContract,
      jumlahPokok: cleanPokok,
      persenMargin: cleanMargin,
      biayaMargin: calculatedMarginRp,
      totalTagihan: calculatedTotalTagihan,
      tenor: cleanTenor,
      jenisPembayaran: revJenisPembayaran,
      angsuranPerPeriode: calculatedAngsuran,
      sisaTagihan: calculatedTotalTagihan,
      status: "ACC (Siap Cair)",
      disetujuiDenganPenyesuaian: isModified,
      pokokAwalPengajuan: reviewContract.pokokAwalPengajuan || reviewContract.jumlahPokok,
      marginAwalPengajuan: reviewContract.marginAwalPengajuan || reviewContract.persenMargin,
      catatanOwner: revCatatanOwner || defaultNote,
    };

    setPembiayaanList((prev) =>
      prev.map((item) =>
        item.nomorPembiayaan === reviewContract.nomorPembiayaan
          ? updatedContract
          : item
      )
    );

    if (selectedItem && selectedItem.nomorPembiayaan === reviewContract.nomorPembiayaan) {
      setSelectedItem(updatedContract);
    }

    setIsReviewModalOpen(false);
  };

  // Owner rejection handler (Tolak Pembiayaan -> Status becomes "Ditolak")
  const handleRejectTransaction = (nomorPembiayaan: string) => {
    setPembiayaanList((prev) =>
      prev.map((item) =>
        item.nomorPembiayaan === nomorPembiayaan
          ? { ...item, status: "Ditolak" }
          : item
      )
    );
    if (selectedItem && selectedItem.nomorPembiayaan === nomorPembiayaan) {
      setSelectedItem({ ...selectedItem, status: "Ditolak" });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const marginNominal = Math.round(jumlahPokokNumeric * (persenMarginNumeric / 100));
    const newNo = generateNextPembiayaanNo(pembiayaanList);

    const newTransaction: TransaksiPembiayaan = {
      nomorPembiayaan: newNo,
      idPeminjam: activeSelectedBorrower.id,
      namaPeminjam: activeSelectedBorrower.nama,
      whatsappPeminjam: activeSelectedBorrower.whatsapp,
      nikPeminjam: activeSelectedBorrower.nik,
      pekerjaanPeminjam: activeSelectedBorrower.pekerjaan,
      tanggalPencairan: tanggalPencairanInput,
      jumlahPokok: jumlahPokokNumeric,
      persenMargin: persenMarginNumeric,
      biayaMargin: marginNominal,
      totalTagihan: jumlahPokokNumeric,
      tenor: tenorNumeric || 1,
      jenisPembayaran: jenisPembayaranInput,
      tanggalJatuhTempo: tanggalJatuhTempoInput || "2026-09-01",
      angsuranPerPeriode: marginNominal, // Bunga 15-Hari (Rp)
      sisaTagihan: jumlahPokokNumeric,
      sisaPokok: jumlahPokokNumeric,
      bungaPer15Hari: marginNominal,
      periodeSiklusHari: 15,
      status: "Pending ACC", // Automatically set to Pending ACC for Owner review!
      deskripsiJaminan: deskripsiJaminanInput || "Tanpa Agunan Khusus",
      fotoJaminan: fotoJaminanInput || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80",
      adminPenanggungJawab: activeSelectedAdmin.namaAdmin,
      cabangAdmin: activeSelectedAdmin.cabang,
    };

    setPembiayaanList([newTransaction, ...pembiayaanList]);
    setIsAddModalOpen(false);
  };

  // Submit Payment Handler with Mandatory Photo Proof
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payBuktiFotoInput) {
      setPayErrorMsg("⚠️ WAJIB mengunggah foto struk / bukti pembayaran transaksi!");
      return;
    }

    const nominalPaid = parseFormattedNumber(payNominalInput);
    if (!nominalPaid || nominalPaid <= 0) {
      setPayErrorMsg("Masukkan nominal pembayaran angsuran yang valid.");
      return;
    }

    const totalCount = Object.values(paymentHistoryStore).reduce((acc, curr) => acc + curr.length, 0);
    const newPaymentId = `BYR-2026-${String(totalCount + 1).padStart(3, "0")}`;

    const newEntry: PembayaranEntry = {
      idPembayaran: newPaymentId,
      nomorPembiayaan: activePayContract.nomorPembiayaan,
      idPeminjam: activePayContract.idPeminjam,
      namaPeminjam: activePayContract.namaPeminjam,
      angsuranKe: nextAngsuranKe,
      tanggalBayar: payTanggalInput,
      nominalBayar: nominalPaid,
      jenisAksiPembayaran: jenisAksiBayar,
      metodePembayaran: payMetodeInput,
      buktiBayarFoto: payBuktiFotoInput,
      catatan: payCatatanInput || `${jenisAksiBayar} (Ke-${nextAngsuranKe})`,
    };

    // Update history store
    setPaymentHistoryStore({
      ...paymentHistoryStore,
      [activePayContract.nomorPembiayaan]: [
        ...(paymentHistoryStore[activePayContract.nomorPembiayaan] || []),
        newEntry,
      ],
    });

    // Update Pembiayaan contract
    const updatedPembiayaanList = pembiayaanList.map((item) => {
      if (item.nomorPembiayaan === activePayContract.nomorPembiayaan) {
        let newSisaPokok = item.sisaPokok !== undefined ? item.sisaPokok : item.jumlahPokok;
        let newStatus: StatusPembiayaan = item.status;
        let newJatuhTempo = item.tanggalJatuhTempo;

        if (jenisAksiBayar === "Pelunasan Pokok Total") {
          newSisaPokok = 0;
          newStatus = "Lunas";
        } else if (jenisAksiBayar === "Cicil Pokok") {
          const sisa = Math.max(0, newSisaPokok - nominalPaid);
          newSisaPokok = sisa;
          if (sisa <= 0) newStatus = "Lunas";
        } else {
          // Bayar Bunga 15 Hari -> Extend due date +15 days!
          newStatus = "Aktif";
          const currentDueDate = new Date(item.tanggalJatuhTempo);
          if (!isNaN(currentDueDate.getTime())) {
            currentDueDate.setDate(currentDueDate.getDate() + 15);
            newJatuhTempo = currentDueDate.toISOString().split("T")[0];
          }
        }

        return {
          ...item,
          sisaPokok: newSisaPokok,
          sisaTagihan: newSisaPokok,
          tanggalJatuhTempo: newJatuhTempo,
          status: newStatus,
        };
      }
      return item;
    });

    setPembiayaanList(updatedPembiayaanList);
    setIsPaymentModalOpen(false);

    // Reset payment form
    setPayBuktiFotoInput("");
    setPayCatatanInput("");
    setPayErrorMsg("");
    alert(`✓ Success! ${jenisAksiBayar} sebesar ${formatRupiah(nominalPaid)} untuk ${activePayContract.namaPeminjam} berhasil dicatat.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Dual Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[#1976d2]" />
            Data Pembiayaan & Transaksi Pinjaman
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan seluruh transaksi pinjaman, margin persen (%), tenor, serta pencatatan pembayaran angsuran dengan bukti foto wajib.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const target = dueOrOverdueContracts[0] || pembiayaanList[0];
              handleOpenWaModalForContract(target);
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
            title="Sistem Otomatisasi & Reminder WhatsApp Jatuh Tempo"
          >
            <MessageSquare className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span>WA Auto-Reminder</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" /> Input Pembayaran
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Pembiayaan Baru
          </button>
        </div>
      </div>

      {/* 2 Main View Navigation Tabs (Data Pembiayaan vs Persetujuan & ACC Owner) */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveMainTab("semua")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeMainTab === "semua"
              ? "bg-[#1976d2] text-white shadow-md font-extrabold"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Receipt className="h-4 w-4" /> 📋 Data Pembiayaan Berjalan ({pembiayaanList.length})
        </button>

        <button
          onClick={() => setActiveMainTab("pendingACC")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeMainTab === "pendingACC"
              ? "bg-amber-600 text-white shadow-md font-extrabold"
              : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
          }`}
        >
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" /> ⏳ Antrean Persetujuan & ACC Owner
          {pendingACCCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full animate-bounce shadow">
              {pendingACCCount} ACC
            </span>
          )}
        </button>
      </div>

      {activeMainTab === "pendingACC" ? (
        /* TAB 2: Dedicated Owner ACC Queue View */
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                Halaman Antrean Persetujuan & ACC Owner
              </h2>
              <p className="text-xs text-amber-900 mt-0.5">
                Setiap transaksi pembiayaan baru wajib diperiksa & disetujui (ACC) oleh Owner sebelum dana dicairkan oleh Admin.
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-extrabold bg-amber-600 text-white rounded-lg shadow shrink-0">
              {pendingACCCount} Pengajuan Menunggu Review
            </span>
          </div>

          {pendingACCCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingACCLoans.map((item) => (
                <div key={item.nomorPembiayaan} className="base-card space-y-4 border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono font-black text-sm text-[#1976d2]">
                      {item.nomorPembiayaan}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-600 animate-pulse" /> Pending ACC Owner
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Peminjam / Nasabah:</span>
                        <strong className="text-slate-900 text-sm block">{item.namaPeminjam}</strong>
                        <span className="text-[10px] text-emerald-700 block font-semibold">{item.whatsappPeminjam}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Admin Pengaju:</span>
                        <strong className="text-slate-800 block">{item.adminPenanggungJawab}</strong>
                        <span className="text-[10px] text-blue-700 block font-semibold">{item.cabangAdmin}</span>
                      </div>
                    </div>

                    {/* Agunan Card */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-3">
                      {item.fotoJaminan ? (
                        <img
                          src={item.fotoJaminan}
                          alt="Foto Agunan"
                          className="h-14 w-20 object-cover rounded border shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setPreviewEnlargedPhoto(item.fotoJaminan || null)}
                        />
                      ) : (
                        <div className="h-14 w-20 bg-slate-200 rounded flex items-center justify-center text-slate-500 shrink-0">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Barang Jaminan / Agunan:</span>
                        <strong className="text-emerald-800 block text-xs">{item.deskripsiJaminan || "Tanpa Agunan Khusus"}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">Tgl Pengajuan: {item.tanggalPencairan}</span>
                      </div>
                    </div>

                    {/* Proposed Loan Figures */}
                    <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Pokok Pengajuan:</span>
                        <strong className="text-slate-900">{formatRupiah(item.jumlahPokok)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Margin (%):</span>
                        <strong className="text-emerald-700">{item.persenMargin}% ({formatRupiah(item.biayaMargin)})</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Tagihan:</span>
                        <strong className="text-slate-900">{formatRupiah(item.totalTagihan)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Tenor:</span>
                        <strong className="text-blue-700">{item.tenor} Periode ({item.jenisPembayaran})</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t flex items-center justify-end gap-2">
                    {user?.role === "owner" ? (
                      <>
                        <button
                          onClick={() => handleRejectTransaction(item.nomorPembiayaan)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1 shadow"
                        >
                          <XCircle className="h-4 w-4" /> Tolak
                        </button>
                        <button
                          onClick={() => handleOpenOwnerReview(item)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Review Terms & ACC
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-lg">
                        ⏳ Menunggu Review Owner
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="base-card p-10 text-center space-y-3">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Seluruh Pengajuan Pembiayaan Telah Diproses</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tidak ada transaksi pembiayaan baru yang menunggu persetujuan (ACC) Owner saat ini. Seluruh pengajuan telah disetujui atau aktif.
              </p>
              <button
                onClick={() => setActiveMainTab("semua")}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg shadow transition-colors inline-flex items-center gap-1.5"
              >
                <Receipt className="h-4 w-4" /> Lihat Data Pembiayaan Berjalan
              </button>
            </div>
          )}
        </div>
      ) : (
        /* TAB 1: Main Table View */
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="base-card min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Transaksi</span>
            <FileSpreadsheet className="h-4 w-4 text-[#1976d2]" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{pembiayaanList.length} Kontrak</p>
          <p className="mt-1 text-xs text-slate-500">Portofolio aktif & lunas</p>
        </div>

        <div className="base-card border-l-4 border-l-blue-600 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pencairan Pokok</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 font-mono truncate">
            {formatRupiah(totalPokokAll)}
          </p>
          <span className="text-[11px] font-semibold text-blue-600 mt-1">Akumulasi Pokok Pinjaman</span>
        </div>

        <div className="base-card border-l-4 border-l-emerald-500 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Margin / Keuntungan</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-lg font-black text-emerald-700 font-mono truncate">
            {formatRupiah(totalMarginAll)}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1">Estimasi Margin Usaha</span>
        </div>

        <div className="base-card border-l-4 border-l-amber-500 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sisa Tagihan Active</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 font-mono truncate">
            {formatRupiah(totalSisaAll)}
          </p>
          <span className="text-[11px] font-semibold text-amber-700 mt-1">Belum Terbayar</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="base-card">
        {/* Tabs for Jenis Pembayaran (Sekali Bayar, Harian, Mingguan, Bulanan) */}
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-700 mr-2">Jenis Pembayaran:</span>
          {(["Semua", "Sekali bayar", "Harian", "Mingguan", "Bulanan"] as const).map((jenis) => (
            <button
              key={jenis}
              onClick={() => setJenisFilter(jenis)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                jenisFilter === jenis
                  ? "bg-[#1976d2] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {jenis}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. PB, ID Peminjam, Nama, WA, atau NIK..."
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
              <option value="Pending ACC">Pending ACC (Owner)</option>
              <option value="Aktif">Aktif</option>
              <option value="Segera jatuh tempo">Segera Jatuh Tempo</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Lunas">Lunas</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Pembiayaan Table (.base-table) - Compact 7 Columns for Laptop Fit */}
        <div className="overflow-x-auto">
          <table className="base-table w-full">
            <thead>
              <tr>
                <th>Kontrak & ID</th>
                <th>Nasabah</th>
                <th>Barang Jaminan</th>
                <th>Pokok & Margin</th>
                <th>Total & Angsuran</th>
                <th>Sisa & Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium">
              {filteredPembiayaan.length > 0 ? (
                filteredPembiayaan.map((item) => (
                  <tr key={item.nomorPembiayaan}>
                    {/* 1. Kontrak & ID Peminjam */}
                    <td>
                      <div className="font-mono font-bold text-[#1976d2]">
                        {item.nomorPembiayaan}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-slate-500">
                        ID: {item.idPeminjam || "PEM-001"}
                      </div>
                    </td>

                    {/* 2. Nasabah & WhatsApp */}
                    <td>
                      <div className="font-bold text-slate-900">{item.namaPeminjam}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Phone className="h-2.5 w-2.5" /> {item.whatsappPeminjam}
                      </div>
                    </td>

                    {/* 3. Barang Jaminan */}
                    <td>
                      <div className="flex items-center gap-2">
                        {item.fotoJaminan ? (
                          <img
                            src={item.fotoJaminan}
                            alt="Foto Jaminan"
                            onClick={() => setPreviewEnlargedPhoto(item.fotoJaminan!)}
                            className="h-8 w-10 object-cover rounded border border-slate-300 shadow-sm cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            title="Klik untuk memperbesar foto jaminan"
                          />
                        ) : (
                          <div className="h-8 w-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                        )}
                        <div className="truncate max-w-[130px]" title={item.deskripsiJaminan}>
                          <span className="font-bold text-slate-800 text-[11px] block truncate">
                            {item.deskripsiJaminan || "Tanpa Agunan"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Pencairan Pokok & Margin (%) */}
                    <td>
                      <div className="font-mono font-bold text-slate-900">
                        {formatRupiah(item.jumlahPokok)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 font-semibold mt-0.5">
                        Margin: <span className="text-blue-700 font-extrabold">{item.persenMargin || 25}%</span> <span className="text-emerald-700">({formatRupiah(item.biayaMargin)})</span>
                      </div>
                    </td>

                    {/* 5. Total Tagihan & Angsuran per Periode */}
                    <td>
                      <div className="font-mono font-black text-slate-900">
                        {formatRupiah(item.totalTagihan)}
                      </div>
                      <div className="text-[10px] text-blue-700 font-bold flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{formatRupiah(item.angsuranPerPeriode)}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {item.jenisPembayaran}
                        </span>
                      </div>
                    </td>

                    {/* 6. Sisa Tagihan & Status */}
                    <td className="min-w-[155px]">
                      <div className="font-mono font-bold text-rose-600 mb-1 whitespace-nowrap">
                        {formatRupiah(item.sisaTagihan)}
                      </div>
                      <div className="whitespace-nowrap">{getStatusBadge(item.status)}</div>
                    </td>

                    {/* 7. Action Buttons (ACC Owner / Bayar / Detail) */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {item.status === "Pending ACC" ? (
                          user?.role === "owner" ? (
                            <>
                              <button
                                onClick={() => handleApproveTransaction(item.nomorPembiayaan)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors inline-flex items-center gap-1 shadow-sm"
                                title="Setujui (ACC) Pembiayaan Ini"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> ACC
                              </button>
                              <button
                                onClick={() => handleRejectTransaction(item.nomorPembiayaan)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors inline-flex items-center gap-1 shadow-sm"
                                title="Tolak Pembiayaan Ini"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Tolak
                              </button>
                            </>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded">
                              Menunggu ACC Owner
                            </span>
                          )
                        ) : (
                          item.status !== "Ditolak" && item.status !== "Lunas" && (
                            <button
                              onClick={() => {
                                setSelectedPayContractNo(item.nomorPembiayaan);
                                setPayNominalInput(formatRupiah(item.angsuranPerPeriode, false));
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors inline-flex items-center gap-1 shadow-sm"
                              title="Input pembayaran angsuran untuk transaksi ini"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Bayar
                            </button>
                          )
                        )}
                        {item.status !== "Ditolak" && (
                          <button
                            onClick={() => handleOpenWaModalForContract(item)}
                            className="px-2 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors inline-flex items-center gap-1 shadow-sm"
                            title="Kirim WhatsApp Reminder Jatuh Tempo ke Nasabah Ini"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="hidden xl:inline">WA</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    Tidak ada transaksi pembiayaan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* MODAL 1: Rincian Detail Pembiayaan */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="background__gradient p-5 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-white/20 rounded-full tracking-wider">
                  Rincian Kontrak Pembiayaan
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedItem.nomorPembiayaan} - {selectedItem.namaPeminjam}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* Pending ACC Banner for Owner */}
              {selectedItem.status === "Pending ACC" && (
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-xs">Menunggu ACC / Persetujuan Owner</h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Transaksi ini diajukan oleh <strong className="text-slate-900">{selectedItem.adminPenanggungJawab || "Admin"}</strong> ({selectedItem.cabangAdmin || "Cabang"}) dan membutuhkan ACC Owner sebelum dana dicairkan.
                      </p>
                    </div>
                  </div>
                  {user?.role === "owner" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenOwnerReview(selectedItem)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow"
                      >
                        <CheckCircle2 className="h-4 w-4" /> ACC / Review Terms
                      </button>
                      <button
                        onClick={() => handleRejectTransaction(selectedItem.nomorPembiayaan)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1 shadow"
                      >
                        <XCircle className="h-4 w-4" /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Owner Adjustment / Review Notes Card */}
              {selectedItem.catatanOwner && (
                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                      <UserCheck className="h-4 w-4 text-[#1976d2]" /> Catatan & Verifikasi Owner
                    </span>
                    {selectedItem.disetujuiDenganPenyesuaian && (
                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500 text-white rounded uppercase tracking-wider">
                        Disetujui Dengan Penyesuaian
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium italic bg-white p-2.5 rounded-lg border border-blue-200">
                    "{selectedItem.catatanOwner}"
                  </p>
                  {selectedItem.pokokAwalPengajuan && selectedItem.disetujuiDenganPenyesuaian && (
                    <p className="text-[10px] text-slate-500 font-bold">
                      Pengajuan Awal Admin: <span className="line-through">{formatRupiah(selectedItem.pokokAwalPengajuan)}</span> (@{selectedItem.marginAwalPengajuan}%) ➔ <strong className="text-emerald-700">Disetujui: {formatRupiah(selectedItem.jumlahPokok)} (@{selectedItem.persenMargin}%)</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">ID Peminjam:</span>
                  <span className="font-mono font-bold text-[#1976d2]">{selectedItem.idPeminjam || "PEM-001"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Tanggal Pencairan:</span>
                  <span className="font-bold text-slate-900">{selectedItem.tanggalPencairan}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Jenis Pembayaran:</span>
                  <span className="font-bold text-blue-700">{selectedItem.jenisPembayaran}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Admin Penanggung Jawab:</span>
                  <span className="font-bold text-slate-900">{selectedItem.adminPenanggungJawab || "H. Andi Pratama, S.E."}</span>
                  <span className="text-[10px] text-blue-700 block font-semibold">{selectedItem.cabangAdmin || "Cabang Pusat Pettarani Makassar"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Jumlah Pokok (Rp):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatRupiah(selectedItem.jumlahPokok)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Margin Usaha (% & Rp):</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedItem.persenMargin || 25}% ({formatRupiah(selectedItem.biayaMargin)})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Total Tagihan (Rp):</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {formatRupiah(selectedItem.totalTagihan)}
                  </span>
                </div>
              </div>

              {/* Jaminan Section in Detail Modal */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="h-4 w-4 text-amber-700" /> Barang Jaminan & Agunan Pinjaman
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Jenis & Deskripsi Agunan:</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedItem.deskripsiJaminan || "Tanpa Agunan Khusus"}</span>
                  </div>
                  {selectedItem.fotoJaminan && (
                    <div className="flex items-center gap-2 shrink-0">
                      <img
                        src={selectedItem.fotoJaminan}
                        alt="Foto Jaminan"
                        onClick={() => setPreviewEnlargedPhoto(selectedItem.fotoJaminan!)}
                        className="h-14 w-20 object-cover rounded-lg border-2 border-amber-300 shadow cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <button
                        onClick={() => setPreviewEnlargedPhoto(selectedItem.fotoJaminan!)}
                        className="px-2.5 py-1 text-[10px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded flex items-center gap-1 shadow-sm"
                      >
                        <ImageIcon className="h-3.5 w-3.5" /> Lihat Foto
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Angsuran per Periode ({selectedItem.jenisPembayaran}):</span>
                  <span className="text-base font-black text-[#1976d2] font-mono">
                    {formatRupiah(selectedItem.angsuranPerPeriode)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Tanggal Jatuh Tempo Berikutnya:</span>
                  <span className="font-extrabold text-amber-700">{selectedItem.tanggalJatuhTempo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Sisa Tagihan Belum Terbayar:</span>
                  <span className="font-extrabold text-rose-600 font-mono">
                    {formatRupiah(selectedItem.sisaTagihan)}
                  </span>
                </div>
              </div>

              {/* Status Indicator Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                <span className="font-bold text-slate-600">Status Pembiayaan:</span>
                {getStatusBadge(selectedItem.status)}
              </div>

              {/* Payment History & Proof of Payment Photos Section */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Receipt className="h-4 w-4 text-emerald-600" /> Histori Pembayaran Angsuran & Bukti Foto
                  </span>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedPayContractNo(selectedItem.nomorPembiayaan);
                      setPayNominalInput(formatRupiah(selectedItem.angsuranPerPeriode, false));
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> + Bayar Angsuran
                  </button>
                </div>

                {paymentHistoryStore[selectedItem.nomorPembiayaan] &&
                paymentHistoryStore[selectedItem.nomorPembiayaan].length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                          <th className="p-2">Angsuran</th>
                          <th className="p-2">Tanggal</th>
                          <th className="p-2">Nominal</th>
                          <th className="p-2">Metode</th>
                          <th className="p-2">Bukti Struk Foto</th>
                          <th className="p-2">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {paymentHistoryStore[selectedItem.nomorPembiayaan].map((bayar, index) => (
                          <tr key={bayar.idPembayaran || index} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-emerald-800">
                              Angsuran Ke-{bayar.angsuranKe}
                            </td>
                            <td className="p-2 font-medium text-slate-700">{bayar.tanggalBayar}</td>
                            <td className="p-2 font-mono font-bold text-slate-900">
                              {formatRupiah(bayar.nominalBayar)}
                            </td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                {bayar.metodePembayaran}
                              </span>
                            </td>
                            <td className="p-2">
                              {bayar.buktiBayarFoto ? (
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={bayar.buktiBayarFoto}
                                    alt="Struk Foto"
                                    onClick={() => setPreviewEnlargedPhoto(bayar.buktiBayarFoto!)}
                                    className="h-7 w-10 object-cover rounded border border-slate-300 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Klik foto struk untuk memperbesar"
                                  />
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                                    Ada Struk
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Tanpa Struk</span>
                              )}
                            </td>
                            <td className="p-2 text-slate-500 font-normal">{bayar.catatan || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 text-center text-slate-500 text-xs bg-white rounded border border-slate-200 italic">
                    Belum ada riwayat pembayaran angsuran untuk kontrak pembiayaan ini.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => alert(`Cetak faktur pembiayaan ${selectedItem.nomorPembiayaan}`)}
                className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Cetak Bukti Pembiayaan
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1976d2] hover:bg-[#1565c0] rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Form Buat Pembiayaan Baru (Percentage Margin & Collateral Upload) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="background__gradient p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="h-5 w-5" /> Form Transaksi Pembiayaan Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Select Registered Borrower */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Peminjam Terdaftar (Mandiri Cell Makassar) *
                </label>
                <select
                  value={selectedPeminjamId}
                  onChange={(e) => setSelectedPeminjamId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                >
                  {peminjamList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.nama} (NIK: {p.nik})
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Admin Penanggung Jawab (Otomatis Sesuai Akun Login) */}
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                    <UserCheck className="h-4 w-4 text-[#1976d2]" /> Admin Penanggung Jawab Transaksi
                  </h4>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-full shadow-sm flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Otomatis Sesuai Akun Login
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-blue-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">NIP / ID Admin:</span>
                    <span className="font-mono font-extrabold text-[#1976d2]">{user?.nipAdmin || "ADM-MCM-001"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Nama Admin Penanggung Jawab:</span>
                    <span className="font-bold text-slate-900 block">{user?.name || "H. Andi Pratama, S.E."}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block">{user?.jabatan || "Head Admin Operasional"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Cabang Operasional:</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                      <Building className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {user?.cabang || "Cabang Pusat Pettarani Makassar"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Auto Synced Borrower Information Preview */}
              {activeSelectedBorrower && (
                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-bold text-[#1976d2] flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4" /> ID Peminjam: <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{activeSelectedBorrower.id}</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">
                      Terverifikasi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 font-semibold block">Nama Lengkap:</span>
                      <span className="font-bold text-slate-900">{activeSelectedBorrower.nama}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">No. WhatsApp:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {activeSelectedBorrower.whatsapp}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">NIK (KTP):</span>
                      <span className="font-mono font-bold text-slate-800">{activeSelectedBorrower.nik}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Pekerjaan:</span>
                      <span className="font-bold text-slate-800">{activeSelectedBorrower.pekerjaan}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Informasi Jaminan & Foto */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="h-4 w-4 text-amber-700" /> Barang Jaminan & Agunan Pinjaman
                </h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jaminan (Nama / Jenis Agunan) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BPKB Motor Honda Vario 2023, Sertifikat SHM, dll."
                    value={deskripsiJaminanInput}
                    onChange={(e) => setDeskripsiJaminanInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-semibold text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unggah Foto Jaminan / Dokumen Agunan *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="relative flex-1 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoJaminanUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1976d2] file:text-white hover:file:bg-[#1565c0] cursor-pointer"
                      />
                    </div>
                    {fotoJaminanInput && (
                      <div className="relative shrink-0">
                        <img
                          src={fotoJaminanInput}
                          alt="Pratinjau Foto Jaminan"
                          className="h-14 w-20 object-cover rounded-lg border-2 border-amber-300 shadow-sm cursor-pointer hover:opacity-90"
                          onClick={() => setPreviewEnlargedPhoto(fotoJaminanInput)}
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 rounded font-bold">
                          Klik
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Jumlah Pokok (Rp) & Margin (%) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Pokok (Rp) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
                    <input
                      type="text"
                      required
                      placeholder="10.000.000"
                      value={pokokInput}
                      onChange={(e) => setPokokInput(formatInputRupiah(e.target.value))}
                      className="w-full p-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Margin Bunga per 15 Hari (%) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="10"
                      value={marginInput}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9.]/g, "");
                        setMarginInput(clean);
                      }}
                      className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-mono font-bold text-slate-900"
                    />
                    <span className="absolute right-3 top-2.5 font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Skema Model Pembayaran *</label>
                  <select
                    value={jenisPembayaranInput}
                    onChange={(e) => setJenisPembayaranInput(e.target.value as JenisPembayaran)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                  >
                    <option value="Bunga 15 Hari">Bunga 15 Hari (Pelunasan Pokok Bebas)</option>
                    <option value="Sekali bayar">Sekali bayar</option>
                    <option value="Harian">Harian</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Bulanan">Bulanan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Periode Jatuh Tempo Pertama *</label>
                  <input
                    type="date"
                    required
                    value={tanggalJatuhTempoInput}
                    onChange={(e) => setTanggalJatuhTempoInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-medium"
                  />
                </div>
              </div>

              {/* Calculated Realtime Loan Summary Card */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-2 text-xs">
                <div className="font-bold text-amber-950 flex items-center justify-between border-b border-amber-300 pb-1.5">
                  <span>💡 Skema Bunga 15 Harian & Pelunasan Bebas:</span>
                  <span className="text-[10px] font-black uppercase bg-amber-600 text-white px-2 py-0.5 rounded">Sistem Non-Tenor Bank</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Pinjaman Pokok:</span>
                  <span className="font-mono font-extrabold text-slate-900">{formatRupiah(jumlahPokokNumeric)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Tagihan Bunga Wajib (per 15 Hari @{persenMarginNumeric}%):</span>
                  <span className="font-mono font-extrabold text-amber-700">{formatRupiah(biayaMarginNominal)} / 15 Hari</span>
                </div>
                <div className="text-[11px] text-amber-900 italic pt-1 border-t border-amber-200">
                  * Nasabah wajib membayar Bunga {formatRupiah(biayaMarginNominal)} setiap 15 hari. Pelunasan Pokok ({formatRupiah(jumlahPokokNumeric)}) bebas dicicil atau dilunasi kapan saja.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Pencairan *</label>
                  <input
                    type="date"
                    required
                    value={tanggalPencairanInput}
                    onChange={(e) => setTanggalPencairanInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Jatuh Tempo *</label>
                  <input
                    type="date"
                    required
                    value={tanggalJatuhTempoInput}
                    onChange={(e) => setTanggalJatuhTempoInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-medium"
                  />
                </div>
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
                  Simpan Transaksi Pembiayaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Form Input Pembayaran Angsuran (Mandatory Bukti Photo Upload) */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-white/20 rounded-full tracking-wider">
                  Modul Kasir & Penagihan
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-1">
                  <CreditCard className="h-5 w-5" /> Form Input Pembayaran Angsuran
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Select Active Loan Contract */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Kontrak Pembiayaan / Nasabah *
                </label>
                <select
                  value={selectedPayContractNo}
                  onChange={(e) => {
                    setSelectedPayContractNo(e.target.value);
                    const contract = pembiayaanList.find((p) => p.nomorPembiayaan === e.target.value);
                    if (contract) {
                      setPayNominalInput(formatRupiah(contract.angsuranPerPeriode, false));
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-bold text-slate-800 bg-white"
                >
                  {pembiayaanList.map((item) => (
                    <option key={item.nomorPembiayaan} value={item.nomorPembiayaan}>
                      {item.nomorPembiayaan} - {item.namaPeminjam} (Sisa: {formatRupiah(item.sisaTagihan)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto Synced Contract Information Banner */}
              {activePayContract && (
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-700" /> Nasabah: {activePayContract.namaPeminjam}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-black bg-emerald-600 text-white rounded-full shadow-sm">
                      Angsuran Ke-{nextAngsuranKe}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">ID Peminjam:</span>
                      <span className="font-mono font-bold text-slate-900">{activePayContract.idPeminjam || "PEM-001"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Bunga 15-Hari:</span>
                      <span className="font-mono font-bold text-amber-700">{formatRupiah(activePayContract.bungaPer15Hari || activePayContract.biayaMargin)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Sisa Pokok Pinjaman:</span>
                      <span className="font-mono font-black text-rose-600">{formatRupiah(activePayContract.sisaPokok !== undefined ? activePayContract.sisaPokok : activePayContract.jumlahPokok)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Opsi Jenis Transaksi Pembayaran */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Jenis Transaksi Pembayaran *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setJenisAksiBayar("Bayar Bunga 15 Hari")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      jenisAksiBayar === "Bayar Bunga 15 Hari"
                        ? "bg-amber-500 text-white border-amber-600 font-bold shadow-md"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] font-black">1. Bayar Bunga 15 Hari</span>
                    <span className="text-[10px] opacity-90 block">Perpanjang +15 Hari</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisAksiBayar("Cicil Pokok")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      jenisAksiBayar === "Cicil Pokok"
                        ? "bg-blue-600 text-white border-blue-700 font-bold shadow-md"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] font-black">2. Cicil Pokok</span>
                    <span className="text-[10px] opacity-90 block">Kurangi Sisa Pokok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisAksiBayar("Pelunasan Pokok Total")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      jenisAksiBayar === "Pelunasan Pokok Total"
                        ? "bg-emerald-600 text-white border-emerald-700 font-bold shadow-md"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] font-black">3. Pelunasan Total</span>
                    <span className="text-[10px] opacity-90 block">Lunasi Pokok (Selesai)</span>
                  </button>
                </div>
              </div>

              {/* Nominal Pembayaran & Metode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Nominal Bayar (Rp) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
                    <input
                      type="text"
                      required
                      placeholder="2.500.000"
                      value={payNominalInput}
                      onChange={(e) => setPayNominalInput(formatInputRupiah(e.target.value))}
                      className="w-full p-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metode Pembayaran *</label>
                  <select
                    value={payMetodeInput}
                    onChange={(e) => setPayMetodeInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-bold text-slate-800 bg-white"
                  >
                    <option value="Transfer BCA">Transfer BCA</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Transfer BRI">Transfer BRI</option>
                    <option value="Cash di Kantor (Kasir)">Cash di Kantor (Kasir)</option>
                    <option value="QRIS / E-Wallet">QRIS / E-Wallet</option>
                  </select>
                </div>
              </div>

              {/* Mandatory Upload Foto Bukti Pembayaran */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-emerald-700" /> Unggah Foto Bukti Pembayaran *
                  </label>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-rose-600 text-white rounded uppercase tracking-wider">
                    Wajib Foto Struk
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-300">
                  <div className="relative flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBuktiBayarUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    />
                  </div>
                  {payBuktiFotoInput ? (
                    <div className="relative shrink-0">
                      <img
                        src={payBuktiFotoInput}
                        alt="Bukti Bayar"
                        className="h-16 w-24 object-cover rounded-lg border-2 border-emerald-500 shadow-sm cursor-pointer"
                        onClick={() => setPreviewEnlargedPhoto(payBuktiFotoInput)}
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-emerald-600 text-white text-[8px] px-1 rounded font-bold">
                        Terverifikasi
                      </span>
                    </div>
                  ) : (
                    <div className="h-14 w-24 bg-rose-50 border border-dashed border-rose-300 rounded-lg flex flex-col items-center justify-center text-rose-500 shrink-0 text-[10px] font-bold p-1 text-center">
                      <AlertCircle className="h-4 w-4 mb-0.5" />
                      Belum Ada Foto
                    </div>
                  )}
                </div>

                {payErrorMsg && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 p-2 rounded border border-rose-200">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {payErrorMsg}
                  </p>
                )}
              </div>

              {/* Tanggal & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Pembayaran *</label>
                  <input
                    type="date"
                    required
                    value={payTanggalInput}
                    onChange={(e) => setPayTanggalInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan / Keterangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Transfer via Mobile Banking BCA"
                    value={payCatatanInput}
                    onChange={(e) => setPayCatatanInput(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" /> Simpan Pembayaran Angsuran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENLARGE PHOTO MODAL */}
      {previewEnlargedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-slate-900 p-3 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewEnlargedPhoto(null)}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewEnlargedPhoto}
              alt="Foto Diperbesar"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-slate-300 font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Dokumen Terverifikasi Peminjam Mandiri Cell Makassar
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Owner Review & ACC Pembiayaan (Interactive Adjustment Form) */}
      {isReviewModalOpen && reviewContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6">
            <div className="background__gradient p-5 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 rounded-full tracking-wider shadow">
                  Review & ACC Owner Pembiayaan
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {reviewContract.nomorPembiayaan} - {reviewContract.namaPeminjam}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
              {/* Submission & Collateral Preview Card */}
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-3">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-xs border-b border-blue-200 pb-2">
                  <ShieldCheck className="h-4 w-4 text-[#1976d2]" /> Informasi Pengajuan & Barang Jaminan (Agunan)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p><span className="text-slate-500 font-semibold">Nama Peminjam:</span> <strong className="text-slate-900">{reviewContract.namaPeminjam}</strong></p>
                    <p><span className="text-slate-500 font-semibold">Admin Pengaju:</span> <strong className="text-slate-900">{reviewContract.adminPenanggungJawab}</strong> ({reviewContract.cabangAdmin})</p>
                    <p><span className="text-slate-500 font-semibold">Deskripsi Agunan:</span> <strong className="text-emerald-800">{reviewContract.deskripsiJaminan || "Tanpa Agunan Khusus"}</strong></p>
                  </div>

                  {reviewContract.fotoJaminan && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-blue-200">
                      <img
                        src={reviewContract.fotoJaminan}
                        alt="Foto Jaminan"
                        className="h-16 w-24 object-cover rounded border shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Foto Bukti Agunan</span>
                        <span className="text-[11px] font-bold text-emerald-700 block">✓ Agunan Verifikasi</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Review & Revision Inputs */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                    <UserCheck className="h-4 w-4 text-amber-600" /> Penyesuaian Term Pembiayaan oleh Owner
                  </h4>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-600 text-white rounded uppercase tracking-wider">
                    Bisa Diubah Sebelum ACC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Jumlah Pokok */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jumlah Pokok (Rp) *</label>
                    <div className="relative flex items-center">
                      <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 rounded-l-lg select-none">
                        Rp
                      </span>
                      <input
                        type="text"
                        required
                        value={revPokokInput}
                        onChange={(e) => setRevPokokInput(formatInputRupiah(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-r-lg focus:outline-none focus:border-[#1976d2] font-mono font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* 2. Margin % */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Biaya / Margin (%) *</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.5"
                        value={revMarginInput}
                        onChange={(e) => setRevMarginInput(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-l-lg focus:outline-none focus:border-[#1976d2] font-mono font-bold text-slate-900 bg-white"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 rounded-r-lg select-none">
                        %
                      </span>
                    </div>
                  </div>

                  {/* 3. Jenis Pembayaran */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jenis Pembayaran *</label>
                    <select
                      value={revJenisPembayaran}
                      onChange={(e) => setRevJenisPembayaran(e.target.value as JenisPembayaran)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    >
                      <option value="Sekali bayar">Sekali bayar</option>
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Bulanan">Bulanan</option>
                    </select>
                  </div>

                  {/* 4. Tenor */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tenor (Jumlah Periode) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={revTenorInput}
                      onChange={(e) => setRevTenorInput(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-bold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Catatan Owner / Catatan Revisi */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Persetujuan Owner *</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan alasan / catatan persetujuan jika ada penyesuaian (cth: Pokok disetujui Rp 20jt)..."
                    value={revCatatanOwner}
                    onChange={(e) => setRevCatatanOwner(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1976d2] font-medium bg-white text-xs"
                  />
                </div>
              </div>

              {/* Calculated Figures Preview Box */}
              {(() => {
                const rPokok = parseInt(revPokokInput.replace(/\D/g, ""), 10) || 0;
                const rMargin = parseFloat(revMarginInput) || 0;
                const rTenor = parseInt(revTenorInput, 10) || 1;
                const rMarginRp = Math.round(rPokok * (rMargin / 100));
                const rTotal = rPokok + rMarginRp;
                const rAngsuran = Math.round(rTotal / rTenor);
                const isChanged =
                  rPokok !== reviewContract.jumlahPokok ||
                  rMargin !== reviewContract.persenMargin ||
                  rTenor !== reviewContract.tenor ||
                  revJenisPembayaran !== reviewContract.jenisPembayaran;

                return (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-300 space-y-2 text-xs">
                    {isChanged && (
                      <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2 rounded-lg font-bold flex items-center gap-1.5 text-[11px]">
                        <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                        <span>Terdapat Penyesuaian Term dari Owner (Pengajuan Awal: {formatRupiah(reviewContract.jumlahPokok)} @ {reviewContract.persenMargin}%)</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold block text-[9px] uppercase">Pokok Disetujui:</span>
                        <strong className="text-slate-900">{formatRupiah(rPokok)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[9px] uppercase">Margin ({rMargin}%):</span>
                        <strong className="text-emerald-700">{formatRupiah(rMarginRp)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[9px] uppercase">Total Tagihan:</span>
                        <strong className="text-slate-900">{formatRupiah(rTotal)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[9px] uppercase">Angsuran / {revJenisPembayaran}:</span>
                        <strong className="text-blue-700">{formatRupiah(rAngsuran)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRejectTransaction(reviewContract.nomorPembiayaan);
                  setIsReviewModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <XCircle className="h-4 w-4" /> Tolak Pembiayaan
              </button>
              <button
                type="button"
                onClick={handleSaveOwnerReviewACC}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" /> Simpan & ACC Pembiayaan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL 4: SISTEM OTOMATISASI & REMINDER WHATSAPP JATUH TEMPO --- */}
      {isWaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Header Dialog */}
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <MessageSquare className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    Sistem Otomatisasi & Reminder WhatsApp Jatuh Tempo
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-600 text-white font-extrabold rounded-full">
                      v2.5 Auto-Cron Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pengiriman otomatis pesan penagihan & pengingat jatuh tempo ke WhatsApp nasabah secara 1-Click atau Cron Job Backend.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 border-b bg-slate-100 text-xs font-bold p-2 gap-2">
              <button
                onClick={() => setWaActiveTab("queue")}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  waActiveTab === "queue"
                    ? "bg-emerald-700 text-white shadow-md font-extrabold"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                <MessageSquare className="h-4 w-4 text-emerald-300" />
                1. Kirim WA Nasabah ({dueOrOverdueContracts.length})
              </button>

              <button
                onClick={() => setWaActiveTab("broadcast")}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  waActiveTab === "broadcast"
                    ? "bg-slate-900 text-white shadow-md font-extrabold"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Zap className="h-4 w-4 text-amber-400" />
                2. Simulasi Auto-Cron Broadcast
              </button>

              <button
                onClick={() => setWaActiveTab("architecture")}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  waActiveTab === "architecture"
                    ? "bg-[#1976d2] text-white shadow-md font-extrabold"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Code className="h-4 w-4 text-blue-300" />
                3. Panduan Backend & Server Cron
              </button>
            </div>

            {/* TAB 1: KIRIM WA DIRECT PER NASABAH */}
            {waActiveTab === "queue" && (
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Selector Antrean Nasabah */}
                  <div className="md:col-span-5 space-y-3 border-r pr-4">
                    <label className="font-bold text-slate-800 text-xs block uppercase tracking-wider">
                      Pilih Nasabah Target Reminder ({dueOrOverdueContracts.length})
                    </label>
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {dueOrOverdueContracts.map((contract) => {
                        const isSelected = contract.nomorPembiayaan === waSelectedContractNo;
                        return (
                          <div
                            key={contract.nomorPembiayaan}
                            onClick={() => {
                              setWaSelectedContractNo(contract.nomorPembiayaan);
                              const type =
                                contract.status === "Terlambat"
                                  ? "terlambat"
                                  : contract.status === "Segera jatuh tempo"
                                  ? "hari_h"
                                  : "h-3";
                              setWaTemplateType(type);
                              setWaCustomMessage(getWaTextForContract(contract, type));
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <strong className="text-slate-900 font-bold text-xs">{contract.namaPeminjam}</strong>
                              <span className="font-mono text-[10px] text-blue-700 font-bold">{contract.nomorPembiayaan}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span>WA: <strong className="text-emerald-700 font-mono">{contract.whatsappPeminjam}</strong></span>
                              <span>Tempo: <strong className="text-slate-800 font-mono">{contract.tanggalJatuhTempo}</strong></span>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200">
                              <span className="font-mono text-xs font-black text-rose-600">
                                {formatRupiah(contract.angsuranPerPeriode || contract.biayaMargin)}
                              </span>
                              {getStatusBadge(contract.status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Live Message Generator & Direct WhatsApp Button */}
                  <div className="md:col-span-7 space-y-4">
                    {activeWaContract ? (
                      <>
                        {/* Nasabah Target Info Card */}
                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Target Penerima WhatsApp:</span>
                            <h4 className="font-extrabold text-slate-900 text-sm">{activeWaContract.namaPeminjam}</h4>
                            <p className="text-xs text-slate-600 font-mono mt-0.5">
                              No. HP: <strong className="text-emerald-700">{activeWaContract.whatsappPeminjam}</strong> | Jatuh Tempo: <strong className="text-rose-700">{activeWaContract.tanggalJatuhTempo}</strong>
                            </p>
                          </div>
                          <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-600 text-white rounded-lg uppercase shadow">
                            Ready WA
                          </span>
                        </div>

                        {/* Template Type Selector */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Pilih Jenis Template Pesan WhatsApp:</label>
                          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setWaTemplateType("h-3");
                                setWaCustomMessage(getWaTextForContract(activeWaContract, "h-3"));
                              }}
                              className={`py-2 px-2 rounded-lg border transition-all text-center ${
                                waTemplateType === "h-3"
                                  ? "bg-blue-600 text-white border-blue-600 shadow"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              📌 H-3 Reminder
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setWaTemplateType("hari_h");
                                setWaCustomMessage(getWaTextForContract(activeWaContract, "hari_h"));
                              }}
                              className={`py-2 px-2 rounded-lg border transition-all text-center ${
                                waTemplateType === "hari_h"
                                  ? "bg-amber-600 text-white border-amber-600 shadow"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              ⚠️ Hari H Wajib Bayar
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setWaTemplateType("terlambat");
                                setWaCustomMessage(getWaTextForContract(activeWaContract, "terlambat"));
                              }}
                              className={`py-2 px-2 rounded-lg border transition-all text-center ${
                                waTemplateType === "terlambat"
                                  ? "bg-rose-600 text-white border-rose-600 shadow"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              🚨 Tunggakan Terlambat
                            </button>
                          </div>
                        </div>

                        {/* Live Message Textarea */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700">Preview & Edit Isi Pesan WhatsApp:</label>
                            <span className="text-[10px] text-slate-400">Dukungan format WhatsApp (*bold*, _italic_)</span>
                          </div>
                          <textarea
                            rows={9}
                            value={waCustomMessage}
                            onChange={(e) => setWaCustomMessage(e.target.value)}
                            className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 leading-relaxed"
                          />
                        </div>

                        {/* Direct Send Action Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppWebDirect(activeWaContract, waCustomMessage)}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Send className="h-4 w-4 text-emerald-200" />
                            🚀 Kirim Sekarang via WhatsApp Web / App (`wa.me`)
                          </button>
                          <p className="text-[10px] text-slate-400 text-center mt-1.5">
                            Menghubungkan langsung ke aplikasi WhatsApp dengan pesan terformat otomatis.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Pilih nasabah dari daftar sebelah kiri untuk memunculkan pesan WhatsApp.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SIMULASI AUTO-CRON BROADCAST */}
            {waActiveTab === "broadcast" && (
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-600" />
                    <h4 className="font-bold text-amber-950 text-sm">Simulasi Auto-Cron Daily Broadcast System</h4>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Sistem ini menyimulasikan proses **Cron Job Server** yang berjalan setiap pukul 08:00 WITA. Server akan memindai database secara otomatis dan memicu pengiriman pesan WhatsApp ke seluruh nasabah yang berstatus **Segera jatuh tempo** atau **Terlambat** melalui API WA Gateway (*Fonnte / Wablas / Twilio*).
                  </p>
                </div>

                {/* API Gateway Key Config Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-[#1976d2]" /> Konfigurasi API Key WhatsApp Gateway (Server Backend)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={waApiKey}
                        onChange={(e) => setWaApiKey(e.target.value)}
                        placeholder="e.g. FONNTE_API_TOKEN_8899"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => alert("✓ API Key WhatsApp Gateway tersimpan di konfigurasi backend MCM Finance!")}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow text-xs"
                      >
                        Simpan Token API
                      </button>
                    </div>
                  </div>
                </div>

                {/* Broadcast Execution Console */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Bot className="h-4 w-4 text-emerald-600" /> Console Output & Log Pengiriman Server Cron:
                    </span>
                    <button
                      type="button"
                      disabled={isSimulatingCron}
                      onClick={handleRunSimulatedCronBroadcast}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSimulatingCron ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isSimulatingCron ? "Memproses Broadcast..." : "▶ Jalankan Simulasi Broadcast (Jam 08:00)"}
                    </button>
                  </div>

                  {/* Terminal Log Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1.5 min-h-[200px] max-h-[300px] overflow-y-auto">
                    {waSimulatedLog.length > 0 ? (
                      waSimulatedLog.map((logLine, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {logLine}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-600 italic py-8 text-center">
                        Klik tombol "▶ Jalankan Simulasi Broadcast" untuk memulai proses uji coba pengiriman WA massal otomatis server.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PANDUAN BACKEND CODE & SETUP SERVER */}
            {waActiveTab === "architecture" && (
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
                  <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" /> Panduan Arsitektur & Script Backend Auto-WA Jatuh Tempo
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Untuk menjalankan pengiriman WhatsApp otomatis **tanpa intervensi manusia setiap hari**, backend (Node.js / Express / Laravel / Python) perlu dikonfigurasi dengan skema berikut:
                  </p>
                </div>

                {/* Step-by-step Architecture Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 text-[9px] font-black bg-blue-600 text-white rounded">LANGKAH 1</span>
                    <h5 className="font-bold text-slate-900 text-xs">Cron Job Scheduler</h5>
                    <p className="text-[11px] text-slate-600">
                      Server menjalankan fungsi scheduler (misal `node-cron`) setiap hari pada pukul 08:00 WITA.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 text-[9px] font-black bg-amber-600 text-white rounded">LANGKAH 2</span>
                    <h5 className="font-bold text-slate-900 text-xs">Query Database</h5>
                    <p className="text-[11px] text-slate-600">
                      Query memilih kontrak yang `tanggal_jatuh_tempo` sesuai H-3, Hari H, atau Tunggakan.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-600 text-white rounded">LANGKAH 3</span>
                    <h5 className="font-bold text-slate-900 text-xs">WA Gateway API</h5>
                    <p className="text-[11px] text-slate-600">
                      Mengirim HTTP POST request ke Provider WA Gateway (Fonnte / Wablas / Baileys) untuk kirim WA.
                    </p>
                  </div>
                </div>

                {/* Free Baileys Option Banner */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" /> OPSI 100% GRATIS (Self-Hosted Bot Baileys / whatsapp-web.js)
                    </h5>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-700 text-white rounded uppercase">
                      0 Rupiah / Tanpa Berlangganan
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Jika Anda tidak ingin membayar biaya berlangganan WA Gateway, Anda dapat menggunakan library Open Source **Baileys (`@whiskeysockets/baileys`)** atau **`whatsapp-web.js`**. Cukup jalankan script di komputer kasir/laptop yang terhubung internet, scan QR Code sekali, dan pesan WA jatuh tempo akan dikirimkan otomatis **100% GRATIS** menggunakan nomor WhatsApp bisnis kasir Anda!
                  </p>
                </div>

                {/* Node.js Copyable Script Code snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-mono text-xs">Sample Code: Node.js Cron + Baileys (100% Free WhatsApp Bot)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`// free-wa-bot.js - 100% Free Self-Hosted WhatsApp Auto Reminder
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const cron = require('node-cron');
const db = require('./database');

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      console.log('✅ WA Bot Connected & Ready!');
    }
  });

  // Schedule Cron Job Setiap Pagi Jam 08:00 WITA (08:00 AM)
  cron.schedule('0 8 * * *', async () => {
    console.log('🚀 Running 100% Free Automated WA Reminders...');
    const dueLoans = await db.query("SELECT * FROM pembiayaan WHERE tanggal_jatuh_tempo = CURRENT_DATE");

    for (const loan of dueLoans.rows) {
      const waNum = loan.whatsapp.replace(/\\D/g, '').replace(/^0/, '62') + '@s.whatsapp.net';
      const msg = \`⚠️ *REMINDER JATUH TEMPO HARI INI*\\n\\nHalo Bpk/Ibu *\${loan.nama}*,\\nTagihan pembiayaan *\${loan.nomor_pembiayaan}* jatuh tempo hari ini.\\nNominal: Rp \${loan.angsuran.toLocaleString('id-ID')}\\nTransfer BCA: 7371029841 a.n. MCM Finance\\n\\nTerima kasih!\`;

      await sock.sendMessage(waNum, { text: msg });
      console.log(\`✅ Free WA Sent to \${loan.nama}\`);
    }
  });
}

connectToWhatsApp();`);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[11px] flex items-center gap-1.5"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCode ? "Tersalin!" : "Salin Code Script Free Bot"}
                    </button>
                  </div>

                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[260px]">
{`// free-wa-bot.js - 100% Free Self-Hosted WhatsApp Auto Reminder (Baileys)
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const cron = require('node-cron');
const db = require('./database');

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      console.log('✅ WA Bot Connected & Ready!');
    }
  });

  // Schedule Cron Job Setiap Pagi Jam 08:00 WITA (08:00 AM)
  cron.schedule('0 8 * * *', async () => {
    console.log('🚀 Running 100% Free Automated WA Reminders...');
    const dueLoans = await db.query("SELECT * FROM pembiayaan WHERE tanggal_jatuh_tempo = CURRENT_DATE");

    for (const loan of dueLoans.rows) {
      const waNum = loan.whatsapp.replace(/\\D/g, '').replace(/^0/, '62') + '@s.whatsapp.net';
      const msg = \`⚠️ *REMINDER JATUH TEMPO HARI INI*\\n\\nHalo Bpk/Ibu *\${loan.nama}*,\\nTagihan pembiayaan *\${loan.nomor_pembiayaan}* jatuh tempo hari ini.\\nNominal: Rp \${loan.angsuran.toLocaleString('id-ID')}\\nTransfer BCA: 7371029841 a.n. MCM Finance\\n\\nTerima kasih!\`;

      await sock.sendMessage(waNum, { text: msg });
      console.log(\`✅ Free WA Sent to \${loan.nama}\`);
    }
  });
}

connectToWhatsApp();`}
                  </pre>
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setIsWaModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPembiayaanPage;
