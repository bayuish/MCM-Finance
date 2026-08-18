import React, { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, UserRole } from "@/types/auth";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/services/localStorageService";

interface TAuthContext {
  isLoggedIn: boolean;
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const initialState: TAuthContext = {
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
};

export const AuthContext = createContext<TAuthContext>(initialState);

export const MOCK_USERS: Record<UserRole, User> = {
  owner: {
    id: "usr_owner_1",
    name: "H. Andi Pratama, S.E.",
    email: "owner@mandiricell.com",
    role: "owner",
    cabang: "Cabang Pusat Pettarani Makassar",
    nipAdmin: "ADM-MCM-001",
    jabatan: "Head Admin & Owner Mandiri Cell",
  },
  admin: {
    id: "usr_admin_1",
    name: "Siti Rahmawati, A.Md.",
    email: "admin.panakkukang@mandiricell.com",
    role: "admin",
    cabang: "Cabang Panakkukang Makassar",
    nipAdmin: "ADM-MCM-002",
    jabatan: "Admin Operasional Pembiayaan",
  },
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(MOCK_USERS.owner);

  useEffect(() => {
    const savedUser = getLocalStorage("userData");
    if (savedUser && savedUser.role && MOCK_USERS[savedUser.role as UserRole]) {
      setUser(savedUser);
    } else {
      setUser(MOCK_USERS.owner);
      setLocalStorage("userData", MOCK_USERS.owner);
    }
    setIsLoggedIn(true);
  }, []);

  const login = (role: UserRole) => {
    const selectedUser = MOCK_USERS[role] || MOCK_USERS.owner;
    setUser(selectedUser);
    setIsLoggedIn(true);
    setLocalStorage("userData", selectedUser);
  };

  const logout = () => {
    // Reset to default Owner role since login menu is removed
    const defaultUser = MOCK_USERS.owner;
    setUser(defaultUser);
    setIsLoggedIn(true);
    setLocalStorage("userData", defaultUser);
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
