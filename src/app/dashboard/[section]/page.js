import AdminDashboardComp from "@/components/dashboard";

export function generateStaticParams() {
  return [
    { section: 'overview' },
    { section: 'products' },
    { section: 'orders' },
    { section: 'customers' },
    { section: 'analytics' },
    { section: 'settings' },
  ];
}

export default async function Dashboard({ params }) {
    const { section } = await params;
  return (
    <AdminDashboardComp section={section} />
  );
}

