"use client";
import React from "react";
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

const Dashboard = () => {
  // --- Dashboard data (replace with real API data later)
  const totals = [
    { label: "Products", value: 150, icon: Package, color: "bg-blue-500" },
    { label: "Categories", value: 10, icon: Tags, color: "bg-green-500" },
    { label: "Subcategories", value: 25, icon: Layers, color: "bg-yellow-500" },
    { label: "Orders", value: 420, icon: ShoppingCart, color: "bg-red-500" },
  ];

  const pieData = [
    { name: "Products", value: 150, color: "#3b82f6" },
    { name: "Categories", value: 10, color: "#22c55e" },
    { name: "Subcategories", value: 25, color: "#eab308" },
    { name: "Orders", value: 420, color: "#ef4444" },
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

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {totals.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-lg cursor-pointer transition"
          >
            <div onClick={() => router.push(`/dashboard/manage`)}>
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
            <ResponsiveContainer>
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