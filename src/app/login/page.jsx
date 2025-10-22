"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation"; // or useNavigate() if using React Router
import Image from "next/image";
import { getUserToken, setUserData, setUserToken } from "@/utils";

const AdminLogin = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Auto login if token already exist
  useEffect(() => {
    const token = getUserToken();
    if(token) {
      router.push("/dashboard")
    }
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5002/api/admin-auth/login", formData);

      // Example response: { token, user: { role } }
      const { token, user } = res.data;
      setUserToken(token);
      setUserData(user);

      if (user.role === "admin") {
        router.push("/dashboard");
      } else if (user.role === "seller") {
        router.push("/dashboard");
      } else {
        setError("Unauthorized access");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gap-6 bg-gray-100 p-4">
        <div className="bg-pink-500" style={{borderRadius: '32%'}}>
            <Image
                src='/logo.png'
                width={300}
                height={300}
                className="w-[400px] h-[400px] rounded-full"
                alt="app logo"
            />
        </div>
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
            <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-12 h-12 text-blue-600 mb-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500">Access your dashboard</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="seller">Saller</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
            </form>
        </div>
    </div>
  );
};

export default AdminLogin;
