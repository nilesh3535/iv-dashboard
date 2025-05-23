import AdminLayoutClientWrapper from "@/components/AdminLayoutClientWrapper";



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AdminLayoutClientWrapper>{children}</AdminLayoutClientWrapper>;
}