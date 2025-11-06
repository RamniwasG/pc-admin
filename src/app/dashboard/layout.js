import UserProfileDropdown from "@/components/user-profile-dropdown";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center gap-3 px-1 py-2">
            <h1 className="text-3xl font-semibold text-gray-800">
                Dashboard
            </h1>
            <UserProfileDropdown />
        </div>
        {children}
    </div>
  );
}
