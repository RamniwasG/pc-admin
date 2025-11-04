/*
Admin Dashboard - Sidebar + CRUD
Tech: React (single-file), Tailwind CSS, lucide-react, api, api-mock-adapter

Features:
- Left sidebar navigation: Categories, Subcategories, Products, Orders
- Right main panel shows List and Add/Edit forms for the selected resource
- Fully functional mock backend implemented with api-mock-adapter and persisted to localStorage (so no external server required)
- Uses Tailwind for styling and lucide-react for icons
- api abstraction included; replace mock adapter with real API baseURL easily

Usage
1. Put this file into a React project (CRA or Next.js page). Save as AdminDashboard.jsx and import into your app.
2. Install dependencies:
   npm install api api-mock-adapter lucide-react
3. Ensure Tailwind CSS is set up in the project.
4. Start the app — you'll have a working admin dashboard with mock API backed by localStorage.

Notes
- To connect a real backend, remove or disable the `setupMockAdapter()` call and set api.defaults.baseURL to your API base URL.
- The mock persists data in localStorage under key `admin_dashboard_mock` so data survives reloads.
*/
"use client";
import React, { useEffect, useMemo, useState } from "react";
import MockAdapter from "axios-mock-adapter";
import {
  Grid,
  Box,
  List,
  ShoppingCart,
  Folder,
  Tag,
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useAxios } from "@/api/axios-instance";
import SidebarButton from "@/components/sidebar-btn";
import ResourceManager from "@/components/resource-mgr";
import OrdersPanel from "@/components/order-panel";
import GoBack from "@/components/go-back";

// --- Main Admin Dashboard ---
export default function AdminDashboardComp({ section }) {
  const [active, setActive] = useState(section); // categories | subcategories | products | orders
  const api = useAxios();
  // local state for lists
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // loading & editing states
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // item being edited

  // fetch lists
  async function fetchAll() {
    setLoading(true);
    try {
      // const { data } = await api.get("/categories/getAll");
      const [cats, subs] = await Promise.all([
        api.get("/categories/fetchAllCategories").then((r) => r.data),
        api.get("/subcategories/fetchAllSubCategories").then((r) => r.data),
        // api.get("/products/fetchAllProducts").then((r) => r.data),
        // api.get("/orders/getAll").then((r) => r.data),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      // setProducts(prods);
      // setOrders(ords);
    } catch (e) {
      console.error(e);
      alert("Failed to load data");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // --- Category actions ---
  async function addCategory(payload) {
    const res = await api.post("/categories/add", payload);
    setCategories((s) => [...s, res.data]);
  }
  async function updateCategory(id, payload) {
    await api.put(`/categories/${id}`, payload);
    setCategories((s) => s.map((c) => (c._id === id ? { ...c, ...payload } : c)));
  }
  async function deleteCategory(id) {
    if (!confirm("Delete category?")) return;
    await api.delete(`/categories/${id}`);
    setCategories((s) => s.filter((c) => c._id !== id));
    // refresh dependant lists
    fetchAll();
  }

  // --- Subcategory actions ---
  async function addSub(payload) {
    const res = await api.post("/subcategories/add", payload);
    setSubcategories((s) => [...s, res.data]);
  }
  async function updateSub(id, payload) {
    const payloadData = { name: payload.name, description: payload.description, categoryId: typeof payload.category === "string" ? payload.category : payload.category._id };
    await api.put(`/subcategories/${id}`, payloadData);
    setSubcategories((s) => s.map((c) => (c._id === id ? { ...c, ...payload } : c)));
  }
  async function deleteSub(id) {
    if (!confirm("Delete subcategory?")) return;
    await api.delete(`/subcategories/${id}`);
    setSubcategories((s) => s.filter((c) => c._id !== id));
    fetchAll();
  }

  // --- Products actions ---
  async function addProduct(payload) {
    const formData = new FormData();
    const { title, description, price, stock, categoryId, subcategoryId,
        brand, size, color, WUnit, weight, image, rating 
    } = payload;
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", categoryId);
    formData.append("subcategory", subcategoryId);
    formData.append("brand", brand);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("weight", weight + " " + WUnit);
    formData.append("image", image);
    formData.append("rating", rating);
    const res = await api.post("/products/add", formData);
    setProducts((s) => [...s, res.data]);
  }
  async function updateProduct(id, payload) {
    await api.put(`/products/${id}`, payload);
    setProducts((s) => s.map((p) => (p._id === id ? { ...p, ...payload } : p)));
  }
  async function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    await api.delete(`/products/${id}`);
    setProducts((s) => s.filter((p) => p._id !== id));
  }

  // --- Orders actions (read-only in this mock) ---
  // create order (for testing)
  async function createOrder(payload) {
    const res = await api.post("/orders", payload);
    setOrders((s) => [...s, res.data]);
  }

  // --- UI helper: render right panel per active ---
  function RightPanel() {
    switch (active) {
      case "categories":
        return (
          <ResourceManager
            resource="categories"
            loading={loading}
            items={categories}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "subcategories":
        return (
          <ResourceManager
            resource="subcategories"
            loading={loading}
            items={subcategories}
            extra={{ categories }}
            onAdd={addSub}
            onUpdate={updateSub}
            onDelete={deleteSub}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "products":
        return (
          <ResourceManager
            resource="products"
            loading={loading}
            items={products}
            extra={{ categories, subcategories }}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "orders":
        return <OrdersPanel orders={orders} onCreate={createOrder} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-4 grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="col-span-12 sm:col-span-4 md:col-span-3 bg-white rounded-lg shadow p-3">
          <GoBack href="/dashboard" label="Dashboard" />
          {/* <div className="mb-4 flex items-center gap-2">
            <Grid className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Admin</h2>
          </div> */}

          <nav className="space-y-2">
            <SidebarButton active={active === "users"} onClick={() => setActive("users")} icon={Layers} label="Users" />
            <SidebarButton active={active === "products"} onClick={() => setActive("products")} icon={Layers} label="Products" />
            <SidebarButton active={active === "categories"} onClick={() => setActive("categories")} icon={Folder} label="Categories" />
            <SidebarButton active={active === "subcategories"} onClick={() => setActive("subcategories")} icon={Tag} label="Subcategories" />
            <SidebarButton active={active === "orders"} onClick={() => setActive("orders")} icon={ShoppingCart} label="Orders" />
          </nav>

          {/* <div className="mt-6 text-xs text-gray-400">Mock data saved in localStorage under key: <code>{MOCK_LS_KEY}</code></div> */}
        </aside>

        {/* Right main panel */}
        <main className="col-span-12 sm:col-span-8 md:col-span-9">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              {/* <h3 className="text-lg font-semibold capitalize">{active}</h3> */}
              <div>{loading ? <span className="text-sm text-gray-500">Loading...</span> : null}</div>
            </div>

            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

