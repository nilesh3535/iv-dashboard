import AdminLayoutClientWrapper from "@/components/AdminLayoutClientWrapper";
import { getCurrentAdmin } from "@/firebase/actions/general.action";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
 const admin = await getCurrentAdmin(); // Server-safe call
  // Render your client layout wrapper that handles UI and loading
  return <AdminLayoutClientWrapper admin={admin}>{children}</AdminLayoutClientWrapper>;
}