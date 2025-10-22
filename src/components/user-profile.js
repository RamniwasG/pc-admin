import { useState, useRef, useEffect } from "react";
import { User, Settings, Lock, LogOut } from "lucide-react";

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar/Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer transition"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 z-50">
          <ul className="flex flex-col py-2 text-sm text-gray-700">
            <li>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                <User className="w-4 h-4 mr-2 text-gray-500" /> Profile
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                <Settings className="w-4 h-4 mr-2 text-gray-500" /> Settings
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                <Lock className="w-4 h-4 mr-2 text-gray-500" /> Change Password
              </button>
            </li>
            <li>
              <div className="border-t my-1"></div>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}