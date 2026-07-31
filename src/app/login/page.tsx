import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Account Login | Private Academy",
  description: "Sign in or register to access your engineering notes dashboard.",
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
