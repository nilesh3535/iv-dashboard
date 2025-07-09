import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
  "WinYourInterview - Admin Panel",
description: "This is WinYourInterview - Admin Panel",};

export default function SignIn() {
  return <SignInForm />;
}
