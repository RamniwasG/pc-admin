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
import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Folder,
  Tag,
  Layers,
} from "lucide-react";
import { useAxios } from "@/api/axios-instance";
import SidebarButton from "@/components/sidebar-btn";
import ResourceManager from "@/components/resource-mgr";
import OrdersPanel from "@/components/order-panel";
import GoBack from "@/components/go-back";
import UsersList from "../users";
import { sidebarMenuItems } from "@/constants";

// --- Main Admin Dashboard ---
export default function AdminDashboardComp({ section }) {
  const [active, setActive] = useState(section); // categories | subcategories | products | orders
  const api = useAxios();
  // local state for lists
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // loading & editing states
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // item being edited

  // fetch lists
  async function fetchAll() {
    setLoading(true);
    try {
      const [cats, subs, prods, users] = await Promise.all([
        api.get("/categories/fetchAllCategories").then((r) => r.data),
        api.get("/subcategories/fetchAllSubCategories").then((r) => r.data),
        api.get("/products/fetchAllProducts").then((r) => r.data),
        api.get("/auth/fetchAllUsers").then((r) => r.data),
        // api.get("/orders/getAll").then((r) => r.data),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setProducts(prods);
      setUsers(users);
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
        brand, size, color, WUnit, weight, image, rating, discount
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
    formData.append("discount", discount);
    formData.append("weight", weight + " " + WUnit);
    formData.append("image", image.name);
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

  // --- Users actions ---
  async function addUser(payload) {
    const formData = new FormData();
    const { name, email, image
    } = payload;
    const [firstName, lastName] = name.split(" ");
    formData.append("profile", {firstName, lastName, avatarUrl: image.name });
    formData.append("email", email);
    const res = await api.post("/users/add", formData);
    setUsers((s) => [...s, res.data]);
  }
  async function updateUser(id, payload) {
    const formData = new FormData();
    const { name, email, image
    } = payload;
    const [firstName, lastName] = name.split(" ");
    formData.append("profile", {firstName, lastName, avatarUrl: image.name });
    formData.append("email", email);
    await api.put(`/users/${id}`, formData);
    setUsers((s) => s.map((u) => (u._id === id ? { ...u, ...payload } : u)));
  }
  async function deleteUser(id) {
    if (!confirm("Delete product?")) return;
    await api.delete(`/users/${id}`);
    setUsers((s) => s.filter((u) => u._id !== id));
  }

  // create order
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
      case "users":
        return (
          <UsersList
            resource="users"
            loading={loading}
            items={users}
            onAdd={addUser}
            onUpdate={updateUser}
            onDelete={deleteUser}
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
    <div className="bg-gray-50">
      <GoBack href="/dashboard" label="Back" classes="mb-0 px-2" />
      <div className="max-w-7xl mx-auto p-2 md:p-2 grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="col-span-12 sm:col-span-4 md:col-span-3 bg-white rounded-lg shadow p-3">
          <nav className="space-y-2">
            {sidebarMenuItems.map((item) => (
              <SidebarButton
                key={item.label}
                active={active === item.label.toLowerCase()}
                onClick={() => setActive(item.label.toLowerCase())}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          {/* <div className="mt-6 text-xs text-gray-400">Mock data saved in localStorage under key: <code>{MOCK_LS_KEY}</code></div> */}
        </aside>

        {/* Right main panel */}
        <main className="col-span-12 sm:col-span-8 md:col-span-9">
          <div className="bg-white rounded-lg shadow p-4">
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

