import { getLocalStorage } from "@/services/localStorageService";

interface RolesGuardProps {
  role?: string | string[];
}

const RolesGuard = ({ role }: RolesGuardProps) => {
  if (!role || role === "all") return true;

  const userData = getLocalStorage("userData");
  const userRole = userData?.role;

  if (!userRole) return false;

  const checkRoleAccess = (targetRole: string) => {
    if (targetRole === "all") return true;
    return userRole === targetRole;
  };

  if (Array.isArray(role)) {
    return role.some(checkRoleAccess);
  }

  return checkRoleAccess(role);
};

export default RolesGuard;
