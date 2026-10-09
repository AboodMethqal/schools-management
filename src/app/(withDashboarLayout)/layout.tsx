import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardGroupLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
