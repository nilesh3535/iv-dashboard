import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
  "AI  Interviewer - Admin Panel",
description: "This is AI  Interviewer - Admin Panel",};

export default function SignIn() {
  return <SignInForm />;
}
