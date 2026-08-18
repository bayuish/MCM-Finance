import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { menuItems } from "@/utils/menuItems";
import { 
  LayoutDashboard, 
  Crown, 
  ShieldAlert, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  Users,
  Receipt,
  MapPin,
  Landmark
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard: (props) => <LayoutDashboard {...props} />,
  Users: (props) => <Users {...props} />,
  Receipt: (props) => <Receipt {...props} />,
  Landmark: (props) => <Landmark {...props} />,
  MapPin: (props) => <MapPin {...props} />,
  Crown: (props) => <Crown {...props} />,
  ShieldAlert: (props) => <ShieldAlert {...props} />,
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(["owner-panel", "admin-panel"]);

  if (!user) return null;

  const currentRole = user.role;

  // Filter menu items by role
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.role === "all") return true;
    if (Array.isArray(item.role)) return item.role.includes(currentRole);
    return item.role === currentRole;
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ boxShadow: "4px 0 16px rgba(4, 26, 55, 0.12)" }}
      className={`fixed left-0 top-[60px] z-[99] h-[calc(100vh-60px)] bg-white transition-all duration-300 ease-in-out ${
        isOpen ? "w-[260px]" : "w-[80px]"
      }`}
    >
      <div className="flex h-full flex-col justify-between py-4">
        <div className="space-y-1 px-3">
          {/* User role badge card inside sidebar */}
          {isOpen && (
            <div className="mb-4 rounded-xl background__gradient p-3.5 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Akses Aktif</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white capitalize">{user.role} Workspace</p>
            </div>
          )}

          {filteredMenuItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
            const isExpanded = expandedItems.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.id} className="space-y-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                      isOpen
                        ? "text-[#0d1e38] hover:bg-[#eff6ff] hover:text-[#1e3a8a]"
                        : "justify-center text-[#0d1e38] hover:bg-[#eff6ff] hover:text-[#1e3a8a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-[#1976d2] shrink-0" />
                      {isOpen && <span className="truncate font-semibold">{item.name}</span>}
                    </div>
                    {isOpen && (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.link || "/"}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#eff6ff] text-[#1976d2] font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r before:bg-[#1976d2]"
                          : "text-[#0d1e38] hover:bg-[#eff6ff] hover:text-[#1e3a8a]"
                      } ${!isOpen && "justify-center"}`
                    }
                  >
                    <IconComponent className="h-5 w-5 shrink-0 text-[#1976d2]" />
                    {isOpen && <span className="truncate">{item.name}</span>}
                  </NavLink>
                )}

                {/* Submenu rendering */}
                {isOpen && hasChildren && isExpanded && (
                  <div className="ml-4 space-y-1 border-l-2 border-slate-100 pl-3">
                    {item.children
                      ?.filter((child) => child.role === "all" || child.role === currentRole)
                      .map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.link}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                              isActive
                                ? "text-[#1976d2] bg-[#eff6ff] before:h-2 before:w-2 before:rounded-full before:bg-[#1976d2]"
                                : "text-slate-600 hover:bg-[#eff6ff] hover:text-[#1e3a8a]"
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isOpen && (
          <div className="px-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium">MCM Finance App v1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
