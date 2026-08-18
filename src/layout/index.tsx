import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import { Menu, Layers } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Pinned state (toggled via top menu button)
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(true);
  // Hover state (auto expands when mouse enters sidebar)
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarPinned(!isSidebarPinned);

  // Sidebar is open if either pinned open OR currently hovered
  const isSidebarOpen = isSidebarPinned || isSidebarHovered;

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Top Navbar from style.md: Fixed Top top-0, Height 60px, Z-Index z-[999], background__gradient */}
      <header className="fixed top-0 left-0 right-0 z-[999] flex h-[60px] items-center justify-between background__gradient px-4 md:px-6 shadow-md text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
            title="Toggle / Pin Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white font-bold shadow-sm backdrop-blur-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight tracking-wide">MCM Finance</h1>
              <p className="text-[10px] text-white/80 font-medium hidden sm:block">Financial & Management System</p>
            </div>
          </div>
        </div>

        <UserMenu />
      </header>

      {/* Sidebar with Auto Hover Open/Close Event Listeners */}
      <Sidebar
        isOpen={isSidebarOpen}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      />

      {/* Main Content */}
      <main
        className={`pt-[60px] transition-all duration-300 ${
          isSidebarPinned ? "pl-[260px]" : "pl-[80px]"
        }`}
      >
        <div className="min-h-[calc(100vh-60px)] p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
