import AdminLayoutClientWrapper from "@/components/AdminLayoutClientWrapper";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  // Render your client layout wrapper that handles UI and loading
  return <AdminLayoutClientWrapper>{children}</AdminLayoutClientWrapper>;
}
