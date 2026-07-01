"use client";

import { usePathname } from "next/navigation";

interface FooterWrapperProps {
  children: React.ReactNode;
}

export default function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Hide footer on login, admin, and dashboard pages
  const hideFooterPaths = ["/login", "/admin", "/dashboard"];
  const shouldHide = hideFooterPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  
  if (shouldHide) {
    return null;
  }
  
  return <>{children}</>;
}
