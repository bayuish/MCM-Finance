import React from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, Home } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-sm">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404 - Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        Halaman yang Anda cari tidak ada atau role akun Anda tidak memiliki hak akses untuk halaman ini.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
      >
        <Home className="h-4 w-4" />
        Kembali ke Dashboard Utama
      </Link>
    </div>
  );
};

export default NotFoundPage;
