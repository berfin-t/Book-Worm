import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";
import type { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children?: ReactNode;
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAppSelector(state => state.account);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = user.roles?.some(role =>
    allowedRoles.includes(role)
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
