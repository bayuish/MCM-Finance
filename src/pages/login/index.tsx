import React from "react";
import useAuth from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { ShieldCheck, Crown, Layers, ArrowRight } from "lucide-react";

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">MCM Finance</h2>
          <p className="text-sm text-slate-500 mt-1">Pilih peran akun (role) untuk masuk ke aplikasi</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("owner")}
            className="w-full group flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-left transition-all hover:bg-amber-100/60 hover:border-amber-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Masuk sebagai Owner</h3>
                <p className="text-xs text-amber-700">Akses penuh ke laporan bisnis & finansial</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-amber-600 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handleLogin("admin")}
            className="w-full group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-left transition-all hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm">Masuk sebagai Admin</h3>
                <p className="text-xs text-blue-700">Akses ke manajemen pengguna & operasional</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Struktur Route & Guard berbasis React Router v6 & TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
