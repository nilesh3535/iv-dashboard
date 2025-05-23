import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
  "AI  Interviewer - Admin Panel",
description: "This is AI  Interviewer - Admin Panel",};

export default function SignUp() {
  return <SignUpForm />;
}
