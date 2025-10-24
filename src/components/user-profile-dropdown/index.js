import { useState, useRef, useEffect } from "react";
import { User, Settings, Lock, LogOut } from "lucide-react";
import api from "@/api/axios-instance";
import { clearLoginCredentials } from "@/utils";
import Link from "next/link";

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchUserProfile() {
        const { data } = await api.get('/admin-auth/profile');
        setUserProfile(data);
    }
    fetchUserProfile();
  }, [])

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
      <div className="flex justify-end items-center gap-2">
        <p className="text-sm font-bold">{userProfile && userProfile.name}</p>
        {/* Profile Avatar/Icon */}
        <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer transition"
        >
            <User className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 z-50">
          <ul className="flex flex-col py-2 text-sm text-gray-700">
            <li>
              <button className="flex items-center w-full px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                <Link href="/profile" className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-500" /> Profile</Link>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                <Link href="/settings" className="flex items-center"><Settings className="w-4 h-4 mr-2 text-gray-500" /> Settings</Link>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                <Link href="/change-password" className="flex items-center"><Lock className="w-4 h-4 mr-2 text-gray-500" /> Change Password</Link>
              </button>
            </li>
            <li>
              <div className="border-t my-1"></div>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-red-600 cursor-pointer hover:bg-red-50 transition" onClick={() => {
                clearLoginCredentials();
              }}>
                <Link href="/login" className="flex items-center"><LogOut className="w-4 h-4 mr-2" /> Logout</Link>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}