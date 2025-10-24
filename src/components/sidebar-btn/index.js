const SidebarButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 ${active ? "bg-gray-100 font-semibold" : ""}`}
  >
    <Icon size={24} className="h-6 w-6" />
    <span className="text-md">{label}</span>
  </button>
);

export default SidebarButton;
