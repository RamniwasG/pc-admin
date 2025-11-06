"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, LogIn, LogInIcon, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation"; // or useNavigate() if using React Router
import Image from "next/image";
import { getUserToken, setUserData, setUserToken } from "@/utils";
import { useAxios } from "@/api/axios-instance";
import { roles } from "@/constants";

const AdminLogin = () => {
  const router = useRouter();
  const api = useAxios();

  const [formData, setFormData] = useState({
    email: "",
    passcode: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [sentPasscode, setSentPasscode] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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

  // Handle send passcode
  const handleSendPasscode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/send-otp", { phone: formData.email });
      if(data.success) {
        setSentPasscode(true);
        if(data.user) {
          setUserExist(true);
        }
        setSuccessMsg(data.message || 'Passcode sent successfully');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle verify passcode
  const handleVerifyPasscode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, passcode, phone, role } = formData;
      const { data } = await api.post("/auth/verify-otp", { 
        phone: email,
        otp: passcode,
        mobile: `+91${phone}`,
        role
      });
      const { token, user } = data;
      setUserToken(token);
      setUserData(user);

      if (user.role === "admin") {
        router.push("/dashboard");
      } else if (user.role === "seller") {
        router.push("/dashboard");
      } else if (user.role === "staff") {
        router.push("/dashboard");
      } else {
        setError("Unauthorized access");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email/passcode or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen items-center ${sentPasscode ? 'justify-start' : 'justify-center'} sm:justify-start bg-gray-100`}>
      <div>
        <Image
          src='/logo.png'
          width={100}
          height={100}
          className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] rounded-full"
          alt="app logo"
          priority={true}
        />
      </div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col items-center mb-3">
            {sentPasscode ? <ShieldCheck className="w-9 h-9 text-indigo-600 mb-2" /> : <LogInIcon className="w-9 h-9 text-indigo-600 mb-2" />}
            <h2 className="text-2xl font-semibold text-gray-800">{sentPasscode ? 'Verify Security Code' : 'Admin Login'}</h2>
            {/* <p className="text-sm text-gray-500">Access your dashboard</p> */}
          </div>
          {sentPasscode && userExist && <div className="flex flex-col items-center mb-3">
            <p className="text-sm text-red bg-yellow-500">User Exists!</p>
          </div>}
          {sentPasscode && <div className="flex flex-col items-center mb-3">
            <p className="text-sm text-green-500">{successMsg}</p>
          </div>}
          {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}
          <form onSubmit={sentPasscode ? handleVerifyPasscode : handleSendPasscode} className={`space-y-${sentPasscode ? '3' : '5'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-md text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${sentPasscode ? 'bg-gray-200' : ''}`}
                placeholder="admin@example.com"
                disabled={loading || sentPasscode}
                required
              />
            </div>

            {sentPasscode && <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passcode <span className="text-md text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={"text"}
                    name="passcode"
                    value={formData.passcode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="xxxxxx"
                    required
                  />
                </div>
              </div>
              {!userExist && <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-md text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={"text"}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="+91 868 634 0975"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-md text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none`}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </>}
            </>}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center mt-3 gap-2 ${sentPasscode ? 'bg-pink-500' : 'bg-amber-600'} hover:bg-orange-500 hover:border-0 text-white font-medium py-2 rounded-lg transition`}
            >
              {loading ? (
                <span className="animate-pulse">{sentPasscode ? 'Verifying' : 'Sending'}...</span>
              ) : (
                <>
                  {sentPasscode ? 'Verify Passcode' : 'Login'}
                  {sentPasscode ? <ArrowRight size={18} /> : ''}
                </>
              )}
            </button>
            {sentPasscode && (
              <p className="text-sm text-gray-500 text-center">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:underline"
                  onClick={() => {
                    setSentPasscode(false);
                    setUserExist(false);
                    setFormData({ ...formData, passcode: '' });
                    setError('');
                  }}
                >
                  Resend
                </button>
              </p>
            )}
          </form>
      </div>
    </div>
  );
};

export default AdminLogin;
