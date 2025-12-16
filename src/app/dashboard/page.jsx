"use client";
import React, { useEffect, useState} from "react";
import {
  Package,
  Tags,
  Layers,
  ShoppingCart,
  MoreVertical,
  User,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { getUserToken } from "@/utils";
import { useAxios } from "@/api/axios-instance";
import SmBtnLoader from "@/shared/loaders/sm-btn-loader";
import { useDispatch } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";

const Dashboard = () => {
  const api = useAxios();
  // local state for lists
  const [data, setData] = useState({
    categories: 0,
    subcategories: 0,
    products: 0,
    orders: 0,
    users: 0
  });
  const [loading, setLoading] = useState(false);

  // fetch lists
  async function fetchDashboardCounts() {
    setLoading(true);
    try {
      const { data } = await api.get("/dashboard/counts");
      setData(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load data");
    }
    setLoading(false);
  }

  const router = useRouter();
  const dispatch = useDispatch();

  // Auto login if token already exist
  useEffect(() => {
    const token = getUserToken();
    if(token) {
      router.push("/dashboard")
    }
    
    fetchDashboardCounts();
    dispatch(fetchCategories());
  }, [])

  // --- Dashboard data (replace with real API data later)
  const totals = [
    { label: "Categories", value: data.categories, icon: Tags, color: "bg-green-500" },
    { label: "Subcategories", value: data.subcategories, icon: Layers, color: "bg-yellow-500" },
    { label: "Orders", value: data.orders || 0, icon: ShoppingCart, color: "bg-red-500" },
    { label: "Products", value: data.products || 0, icon: Package, color: "bg-blue-500" },
    { label: "Users", value: data.users || 0, icon: User, color: "bg-blue-500" },
  ];

  const pieData = [
    { name: "Users", value: data.users || 0, color: "bg-blue-500" },
    { name: "Products", value: data.products || 0, color: "#3b82f6" },
    { name: "Categories", value: data.categories, color: "#22c55e" },
    { name: "Subcategories", value: data.subcategories, color: "#eab308" },
    { name: "Orders", value: data.orders || 0, color: "#ef4444" },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Amit Kumar",
      total: "₹1,200",
      status: "Delivered",
      date: "2025-10-19",
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      total: "₹2,850",
      status: "Pending",
      date: "2025-10-20",
    },
    {
      id: "ORD-003",
      customer: "Ravi Patel",
      total: "₹3,499",
      status: "Cancelled",
      date: "2025-10-21",
    },
    {
      id: "ORD-004",
      customer: "Sneha Gupta",
      total: "₹1,699",
      status: "Delivered",
      date: "2025-10-22",
    },
  ];

  return (
    <>
      {/* Summary Cards */}
      {/* {loading && <p className="text-md">Loading...</p>} */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-2 gap-3 mb-4">
        {totals.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-lg cursor-pointer transition"
            onClick={() => router.push(`/dashboard/${item.label.toLowerCase()}`)}
          >
            <div>
              <p className="sm:text-md lg:text-xl">{item.label}</p>
              {loading && <SmBtnLoader />}
              {!loading && <h2 className="text-2xl font-bold text-gray-600">
                {item.value}
              </h2>}
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${item.color}`}
            >
              <item.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:gap-2 gap-3">
        {/* Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Data Distribution
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer minWidth={100} minHeight={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent Orders
            </h3>
            <button className="text-sm text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Total</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-3 font-medium text-gray-800">
                      {order.id}
                    </td>
                    <td className="py-2 px-3">{order.customer}</td>
                    <td className="py-2 px-3">{order.total}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="py-2 px-3">{order.date}</td>
                    <td className="py-2 px-3 text-right">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;