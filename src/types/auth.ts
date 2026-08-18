import type { ComponentType, LazyExoticComponent, ReactNode } from "react";

export type UserRole = "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cabang: string; // e.g. "Cabang Pusat Pettarani Makassar"
  nipAdmin: string; // e.g. "ADM-MCM-001"
  jabatan: string; // e.g. "Head Admin Operasional"
}

export type TRoute = {
  exact?: boolean;
  guard?: ComponentType<{ children: ReactNode; role?: string | string[] }>;
  layout?: ComponentType<{ children: ReactNode }>;
  path: string;
  element: LazyExoticComponent<ComponentType<any>>;
  role?: string | string[];
  routes?: TRoute[];
};

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  link?: string;
  role: string | string[];
  children?: {
    name: string;
    link: string;
    role: string | string[];
  }[];
}
