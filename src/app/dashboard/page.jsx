"use client";
import React, { useEffect, useState} from "react";
import {
  Package,
  Tags,
  Layers,
  ShoppingCart,
  MoreVertical,
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
import UserProfileDropdown from "@/components/user-profile-dropdown";
import api from "@/api/axios-instance";

const Dashboard = () => {
  // local state for lists
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  // loading & editing states
  const [loading, setLoading] = useState(false);

  // fetch lists
  async function fetchAll() {
    setLoading(true);
    try {
      // const { data } = await api.get("/categories/getAll");
      const [cats, subs, prods] = await Promise.all([
        api.get("/categories/getAll").then((r) => r.data),
        api.get("/subcategories/getAll").then((r) => r.data),
        api.get("/products/getAll").then((r) => r.data),
        // api.get("/orders/getAll").then((r) => r.data),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setProducts(prods);
      // setOrders(ords);
    } catch (e) {
      console.error(e);
      alert("Failed to load data");
    }
    setLoading(false);
  }

  const router = useRouter();

  // Auto login if token already exist
  useEffect(() => {
    const token = getUserToken();
    if(token) {
      router.push("/dashboard")
    }
    
    fetchAll();
  }, [])

  // --- Dashboard data (replace with real API data later)
  const totals = [
    { label: "Products", value: products.length, icon: Package, color: "bg-blue-500" },
    { label: "Categories", value: categories.length, icon: Tags, color: "bg-green-500" },
    { label: "Subcategories", value: subcategories.length, icon: Layers, color: "bg-yellow-500" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, color: "bg-red-500" },
  ];

  const pieData = [
    { name: "Products", value: products.length, color: "#3b82f6" },
    { name: "Categories", value: categories.length, color: "#22c55e" },
    { name: "Subcategories", value: subcategories.length, color: "#eab308" },
    { name: "Orders", value: orders.length, color: "#ef4444" },
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Dashboard
        </h1>
        <UserProfileDropdown />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {totals.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-lg cursor-pointer transition"
            onClick={() => router.push(`/dashboard/${item.label.toLowerCase()}`)}
          >
            <div>
              <p className="text-xl">{item.label}</p>
              <h2 className="text-2xl font-bold text-gray-600">
                {item.value}
              </h2>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Data Distribution
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer minWidth={0} minHeight={0}>
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
    </div>
  );
};

export default Dashboard;