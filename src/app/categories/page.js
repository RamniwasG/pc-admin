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
export default function CategoriesList() {
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
      const { data } = await axios.get("/categories");
      setCategories(data);
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
        </div>
      </div>
    </div>
  );
}
