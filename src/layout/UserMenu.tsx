import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { LogOut, ChevronDown } from "lucide-react";

const UserMenu: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSwitchRole = (newRole: UserRole) => {
    switchRole(newRole);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-95"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a9b75] text-white font-bold text-sm shadow-sm border border-white/20">
          {user.role === "owner" ? "OW" : "AD"}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
          <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold">
            Role: <span className="text-amber-300 font-extrabold">{user.role}</span>
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-white/80" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 mb-1 rounded-t-lg bg-[#4a9b75] text-white">
            <p className="text-xs font-bold text-white">{user.name}</p>
            <p className="text-[11px] text-white/90">{user.email}</p>
          </div>

          <div className="py-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ganti Role (Demo)
            </p>
            <button
              onClick={() => handleSwitchRole("owner")}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                user.role === "owner"
                  ? "bg-[#1976d2] text-white font-semibold"
                  : "text-slate-700 hover:bg-[#1976d2] hover:text-white"
              }`}
            >
              <span>Role: Owner (Pemilik)</span>
              {user.role === "owner" && <span className="h-2 w-2 rounded-full bg-amber-400"></span>}
            </button>
            <button
              onClick={() => handleSwitchRole("admin")}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                user.role === "admin"
                  ? "bg-[#1976d2] text-white font-semibold"
                  : "text-slate-700 hover:bg-[#1976d2] hover:text-white"
              }`}
            >
              <span>Role: Admin (Pengelola)</span>
              {user.role === "admin" && <span className="h-2 w-2 rounded-full bg-blue-300"></span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
