import Link from "next/link";

const SidebarButton = ({ active, onClick, icon: Icon, label }) => (
  <Link
    href={`/dashboard/${label.toLowerCase()}`}
    onClick={onClick}
    className={`flex item-center gap-3 p-1 ${active ? 'bg-yellow-100 font-bold' : 'bg-white'}`}>
    <Icon size={24} className="h-6 w-6" />
    <span className="text-md">{label}</span>
  </Link>
);

export default SidebarButton;
