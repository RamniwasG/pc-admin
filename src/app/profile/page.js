"use client";
import { clearLoginCredentials, getUserData } from "@/utils";
import { Mail, Shield, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const user = getUserData();
    setUser(user);
  }, [])

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-100 border border-gray-100 shadow-md rounded-2xl p-16 hover:shadow-lg transition">
        <button className="px-4 py-2 text-md text-blue-600 rounded-lg hover:text-rose-500 transition">
            <Link href="/dashboard">Back to dashboard</Link>
        </button>
        <div className="flex flex-col justify-center items-center bg-white p-6">
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
                {/* <Image
                    src={user?.image || "/default-avatar.png"}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="w-40 h-40 rounded-full border-4 border-gray-100 object-cover shadow-sm"
                /> */}
                <UserCircle size={100} className="rounded-full border-2 border-rose-100" />
            </div>

            {/* Name */}
            <h2 className="text-lg font-semibold text-gray-800">
                {user?.name || "User Name"}
            </h2>

            {/* Email */}
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>{user?.email || "user@example.com"}</span>
            </div>

            {/* Role */}
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600 text-sm">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user?.role || "user"}</span>
            </div>

            {/* Optional buttons */}
            <div className="mt-5 flex justify-center gap-3">
                
                <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-pink-500 hover:text-white cursor-pointer transition" onClick={() => clearLoginCredentials()}>
                    <Link href="/login">Logout</Link>
                </button>
            </div>
        </div>
    </div>
  );
}