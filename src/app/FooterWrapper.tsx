"use client";

import { usePathname } from "next/navigation";

interface FooterWrapperProps {
  children: React.ReactNode;
}

export default function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Hide footer on login, admin, dashboard, and profile pages
  const hideFooterPaths = ["/login", "/admin", "/dashboard", "/profile"];
  const shouldHide = hideFooterPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  ) || pathname.startsWith("/u/");
  
  if (shouldHide) {
    return null;
  }
  
  return <>{children}</>;
}
