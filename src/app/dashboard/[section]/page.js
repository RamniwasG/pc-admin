import AdminDashboardComp from "@/components/dashboard";

export default async function Dashboard({ params }) {
    const { section } = await params;
  return (
    <AdminDashboardComp section={section} />
  );
}

