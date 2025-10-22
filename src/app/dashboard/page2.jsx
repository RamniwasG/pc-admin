/*
Admin Dashboard - Sidebar + CRUD
Tech: React (single-file), Tailwind CSS, lucide-react, axios, axios-mock-adapter

Features:
- Left sidebar navigation: Categories, Subcategories, Products, Orders
- Right main panel shows List and Add/Edit forms for the selected resource
- Fully functional mock backend implemented with axios-mock-adapter and persisted to localStorage (so no external server required)
- Uses Tailwind for styling and lucide-react for icons
- Axios abstraction included; replace mock adapter with real API baseURL easily

Usage
1. Put this file into a React project (CRA or Next.js page). Save as AdminDashboard.jsx and import into your app.
2. Install dependencies:
   npm install axios axios-mock-adapter lucide-react
3. Ensure Tailwind CSS is set up in the project.
4. Start the app — you'll have a working admin dashboard with mock API backed by localStorage.

Notes
- To connect a real backend, remove or disable the `setupMockAdapter()` call and set axios.defaults.baseURL to your API base URL.
- The mock persists data in localStorage under key `admin_dashboard_mock` so data survives reloads.
*/
"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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

// --- Mock backend setup (uses localStorage) ---
const MOCK_LS_KEY = "admin_dashboard_mock";

function loadMockData() {
  try {
    const raw = localStorage.getItem(MOCK_LS_KEY);
    if (!raw) {
      // seed data
      const seed = {
        categories: [
          { id: "cat1", name: "Clothing" },
          { id: "cat2", name: "Electronics" },
        ],
        subcategories: [
          { id: "sub1", name: "T-Shirts", categoryId: "cat1" },
          { id: "sub2", name: "Laptops", categoryId: "cat2" },
        ],
        products: [
          { id: "p1", title: "Basic Tee", price: 499, categoryId: "cat1", subcategoryId: "sub1" },
        ],
        orders: [],
      };
      localStorage.setItem(MOCK_LS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { categories: [], subcategories: [], products: [], orders: [] };
  }
}

function saveMockData(data) {
  localStorage.setItem(MOCK_LS_KEY, JSON.stringify(data));
}

function setupMockAdapter() {
  const mock = new MockAdapter(axios, { delayResponse: 250 });
  // initialize
  let state = loadMockData();

  // helpers
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Categories
  mock.onGet("/categories").reply(() => [200, state.categories]);
  mock.onPost("/categories").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.categories.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/categories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.categories = state.categories.map((c) => (c.id === id ? { ...c, ...body } : c));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/categories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.categories = state.categories.filter((c) => c.id !== id);
    // also detach subcategories & products
    state.subcategories = state.subcategories.map((s) => (s.categoryId === id ? { ...s, categoryId: "" } : s));
    state.products = state.products.map((p) => (p.categoryId === id ? { ...p, categoryId: "", subcategoryId: "" } : p));
    saveMockData(state);
    return [204];
  });

  // Subcategories
  mock.onGet("/subcategories").reply(() => [200, state.subcategories]);
  mock.onPost("/subcategories").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.subcategories.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/subcategories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.subcategories = state.subcategories.map((s) => (s.id === id ? { ...s, ...body } : s));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/subcategories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.subcategories = state.subcategories.filter((s) => s.id !== id);
    state.products = state.products.map((p) => (p.subcategoryId === id ? { ...p, subcategoryId: "" } : p));
    saveMockData(state);
    return [204];
  });

  // Products
  mock.onGet("/products").reply(() => [200, state.products]);
  mock.onPost("/products").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.products.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/products\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.products = state.products.map((p) => (p.id === id ? { ...p, ...body } : p));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/products\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.products = state.products.filter((p) => p.id !== id);
    saveMockData(state);
    return [204];
  });

  // Orders (read-only seed + simple create)
  mock.onGet("/orders").reply(() => [200, state.orders]);
  mock.onPost("/orders").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.orders.push(item);
    saveMockData(state);
    return [201, item];
  });

  return mock;
}

// call the mock setup. Remove this if you will use a real backend.
setupMockAdapter();

// --- axios defaults ---
axios.defaults.baseURL = "/"; // change to your API base when using real backend

// --- Reusable components ---
const SidebarButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 ${active ? "bg-gray-100 font-semibold" : ""}`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm">{label}</span>
  </button>
);

function ResourceList({ title, items, onEdit, onDelete, renderSub }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-sm text-gray-500">No items</div>}
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between border rounded p-2 bg-white">
            <div>
              <div className="font-medium">{it.name || it.title || it.id}</div>
              {renderSub && <div className="text-xs text-gray-500">{renderSub(it)}</div>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(it)} className="p-1 hover:bg-gray-100 rounded">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(it)} className="p-1 hover:bg-gray-100 rounded">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Admin Dashboard ---
export default function AdminDashboard() {
  const [active, setActive] = useState("categories"); // categories | subcategories | products | orders

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
      const [cats, subs, prods, ords] = await Promise.all([
        axios.get("/categories").then((r) => r.data),
        axios.get("/subcategories").then((r) => r.data),
        axios.get("/products").then((r) => r.data),
        axios.get("/orders").then((r) => r.data),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setProducts(prods);
      setOrders(ords);
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
    const res = await axios.post("/categories", payload);
    setCategories((s) => [...s, res.data]);
  }
  async function updateCategory(id, payload) {
    await axios.put(`/categories/${id}`, payload);
    setCategories((s) => s.map((c) => (c.id === id ? { ...c, ...payload } : c)));
  }
  async function deleteCategory(id) {
    if (!confirm("Delete category?")) return;
    await axios.delete(`/categories/${id}`);
    setCategories((s) => s.filter((c) => c.id !== id));
    // refresh dependant lists
    fetchAll();
  }

  // --- Subcategory actions ---
  async function addSub(payload) {
    const res = await axios.post("/subcategories", payload);
    setSubcategories((s) => [...s, res.data]);
  }
  async function updateSub(id, payload) {
    await axios.put(`/subcategories/${id}`, payload);
    setSubcategories((s) => s.map((c) => (c.id === id ? { ...c, ...payload } : c)));
  }
  async function deleteSub(id) {
    if (!confirm("Delete subcategory?")) return;
    await axios.delete(`/subcategories/${id}`);
    setSubcategories((s) => s.filter((c) => c.id !== id));
    fetchAll();
  }

  // --- Products actions ---
  async function addProduct(payload) {
    const res = await axios.post("/products", payload);
    setProducts((s) => [...s, res.data]);
  }
  async function updateProduct(id, payload) {
    await axios.put(`/products/${id}`, payload);
    setProducts((s) => s.map((p) => (p.id === id ? { ...p, ...payload } : p)));
  }
  async function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    await axios.delete(`/products/${id}`);
    setProducts((s) => s.filter((p) => p.id !== id));
  }

  // --- Orders actions (read-only in this mock) ---
  // create order (for testing)
  async function createOrder(payload) {
    const res = await axios.post("/orders", payload);
    setOrders((s) => [...s, res.data]);
  }

  // --- UI helper: render right panel per active ---
  function RightPanel() {
    switch (active) {
      case "categories":
        return (
          <ResourceManager
            resource="categories"
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
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-lg shadow p-3">
          <div className="mb-4 flex items-center gap-2">
            <Grid className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Admin</h2>
          </div>

          <nav className="space-y-2">
            <SidebarButton active={active === "categories"} onClick={() => setActive("categories")} icon={Folder} label="Categories" />
            <SidebarButton active={active === "subcategories"} onClick={() => setActive("subcategories")} icon={Tag} label="Subcategories" />
            <SidebarButton active={active === "products"} onClick={() => setActive("products")} icon={Layers} label="Products" />
            <SidebarButton active={active === "orders"} onClick={() => setActive("orders")} icon={ShoppingCart} label="Orders" />
          </nav>

          <div className="mt-6 text-xs text-gray-400">Mock data saved in localStorage under key: <code>{MOCK_LS_KEY}</code></div>
        </aside>

        {/* Right main panel */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize">{active}</h3>
              <div>{loading ? <span className="text-sm text-gray-500">Loading...</span> : null}</div>
            </div>

            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Resource Manager: generic for categories/subcategories/products ---
function ResourceManager({ resource, items, extra = {}, onAdd, onUpdate, onDelete, editing, setEditing }) {
  // resource: 'categories' | 'subcategories' | 'products'
  const isProduct = resource === "products";
  const isSub = resource === "subcategories";

  const emptyForm = useMemo(() => {
    if (isProduct) return { title: "", price: "", categoryId: "", subcategoryId: "" };
    if (isSub) return { name: "", categoryId: "" };
    return { name: "" };
  }, [isProduct, isSub]);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!editing) setForm(emptyForm);
    else setForm(editing);
  }, [editing, emptyForm]);

  async function submit(e) {
    e.preventDefault();
    if (editing) {
      await onUpdate(editing.id, form);
    } else {
      await onAdd(form);
    }
    setForm(emptyForm);
    setEditing(null);
  }

  function startEdit(item) {
    setEditing(item);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ResourceList
          title={`${resource} list`}
          items={items}
          onEdit={startEdit}
          onDelete={(it) => onDelete(it.id)}
          renderSub={(it) => {
            if (isProduct) {
              const cat = extra.categories?.find((c) => c.id === it.categoryId)?.name || "-";
              const sub = extra.subcategories?.find((s) => s.id === it.subcategoryId)?.name || "-";
              return `${cat} / ${sub}`;
            }
            if (isSub) {
              const cat = extra.categories?.find((c) => c.id === it.categoryId)?.name || "-";
              return `Category: ${cat}`;
            }
            return null;
          }}
        />
      </div>

      <div className="md:col-span-1">
        <div className="border rounded p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{editing ? "Edit" : "Add New"} {resource.replace(/s$/, "")}</h4>
            {editing && (
              <button onClick={() => { setEditing(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {isProduct ? (
              <>
                <input value={form.title || ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full input px-3 py-2 border rounded" />
                <input value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price" className="w-full input px-3 py-2 border rounded" />

                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))} className="w-full input px-3 py-2 border rounded">
                  <option value="">Choose category</option>
                  {extra.categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select value={form.subcategoryId || ""} onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))} className="w-full input px-3 py-2 border rounded" disabled={!form.categoryId}>
                  <option value="">Choose subcategory</option>
                  {extra.subcategories?.filter((s) => s.categoryId === form.categoryId).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </>
            ) : isSub ? (
              <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Subcategory name" className="w-full input px-3 py-2 border rounded" />
                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full input px-3 py-2 border rounded">
                  <option value="">Choose category</option>
                  {extra.categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </>
            ) : (
              <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category name" className="w-full input px-3 py-2 border rounded" />
              </>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>{editing ? "Update" : "Add"}</span>
              </button>
              <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); }} className="btn-ghost inline-flex items-center gap-2">
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({ orders, onCreate }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">Orders</h4>
        <button onClick={() => onCreate({ customer: "Test", total: 999, items: [] })} className="btn inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create Test Order</span>
        </button>
      </div>

      {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet</div>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order {o.id}</div>
                <div className="text-sm text-gray-500">Customer: {o.customer} • Total: ₹{o.total}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
