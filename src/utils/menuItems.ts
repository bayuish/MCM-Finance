import type { MenuItem } from "@/types/auth";

export const menuItems: MenuItem[] = [
  {
    id: "home",
    name: "Dashboard Utama",
    icon: "LayoutDashboard",
    link: "/",
    role: "all",
  },
  {
    id: "peminjam",
    name: "Data Peminjam",
    icon: "Users",
    link: "/peminjam",
    role: "all",
  },
  {
    id: "pembiayaan",
    name: "Data Pembiayaan",
    icon: "Receipt",
    link: "/pembiayaan",
    role: "all",
  },
  {
    id: "pencairan",
    name: "Pencairan & Jaminan",
    icon: "Landmark",
    link: "/pencairan",
    role: "all",
  },
  {
    id: "persebaran",
    name: "Peta Persebaran (GIS)",
    icon: "MapPin",
    link: "/persebaran",
    role: "all",
  },
  {
    id: "owner-panel",
    name: "Menu Pemilik (Owner)",
    icon: "Crown",
    role: "owner",
    children: [
      {
        name: "Persetujuan & ACC Pembiayaan",
        link: "/pembiayaan?view=acc",
        role: "owner",
      },
      {
        name: "Ringkasan Bisnis",
        link: "/",
        role: "owner",
      },
      {
        name: "Laporan Finansial",
        link: "/",
        role: "owner",
      },
    ],
  },
  {
    id: "admin-panel",
    name: "Menu Pengelola (Admin)",
    icon: "ShieldAlert",
    role: "admin",
    children: [
      {
        name: "Manajemen Pengguna",
        link: "/",
        role: "admin",
      },
      {
        name: "Pengaturan Sistem",
        link: "/",
        role: "admin",
      },
    ],
  },
];
