/*
E‑commerce Admin Portal (single-file React component)
Tech: React + Tailwind CSS + lucide-react
Features:
- Add / edit / delete Categories
- Add Subcategories nested under Categories
- Add Products with selection of Category & Subcategory
- Image upload with preview
- Client-side validation
- LocalStorage persistence (mock backend)

Usage:
- Drop this file into a React + Tailwind project (e.g. create-react-app or Next.js).
- Install lucide-react: `npm install lucide-react`
- Ensure Tailwind is configured in the project.

This file default-exports a React component you can import and render in your admin route/page.
*/
"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  PlusCircle,
  Trash2,
  Edit2,
  Image,
  FileText,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

// Helper: localStorage keys and helpers
const LS_KEY = "ecom_admin_data_v1";

function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { categories: [], products: [] };
    return JSON.parse(raw);
  } catch (e) {
    return { categories: [], products: [] };
  }
}

function saveData(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Simple unique id
const uid = () => Math.random().toString(36).slice(2, 9);

export default function EcommerceAdminPortal() {
  const [data, setData] = useState(() => loadData());

  // UI state
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryParentId, setSubcategoryParentId] = useState("");

  const [productForm, setProductForm] = useState({
    id: null,
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    imageDataUrl: "",
  });

  const fileInputRef = useRef(null);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // ----- Category CRUD -----
  function addOrUpdateCategory(e) {
    e?.preventDefault?.();
    const name = categoryName.trim();
    if (!name) return alert("Category name required");

    if (editingCategoryId) {
      setData((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === editingCategoryId ? { ...c, name } : c
        ),
      }));
      setEditingCategoryId(null);
    } else {
      const newCat = { id: uid(), name, subcategories: [] };
      setData((prev) => ({ ...prev, categories: [...prev.categories, newCat] }));
    }

    setCategoryName("");
  }

  function editCategory(cat) {
    setCategoryName(cat.name);
    setEditingCategoryId(cat.id);
  }

  function deleteCategory(catId) {
    if (!confirm("Delete category and its subcategories & detach products?")) return;
    setData((prev) => ({
      categories: prev.categories.filter((c) => c.id !== catId),
      products: prev.products.map((p) =>
        p.categoryId === catId ? { ...p, categoryId: "", subcategoryId: "" } : p
      ),
    }));
  }

  // ----- Subcategory CRUD -----
  function addSubcategory(e) {
    e?.preventDefault?.();
    const name = subcategoryName.trim();
    const parent = subcategoryParentId;
    if (!name || !parent) return alert("Subcategory name and parent category required");

    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === parent
          ? { ...c, subcategories: [...(c.subcategories || []), { id: uid(), name }] }
          : c
      ),
    }));

    setSubcategoryName("");
    setSubcategoryParentId("");
  }

  function deleteSubcategory(catId, subId) {
    if (!confirm("Delete subcategory and detach products?")) return;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === catId
          ? { ...c, subcategories: (c.subcategories || []).filter((s) => s.id !== subId) }
          : c
      ),
      products: prev.products.map((p) =>
        p.subcategoryId === subId ? { ...p, subcategoryId: "" } : p
      ),
    }));
  }

  // ----- Product CRUD -----
  function startEditProduct(p) {
    setProductForm({ ...p });
  }

  function resetProductForm() {
    setProductForm({ id: null, title: "", description: "", price: "", categoryId: "", subcategoryId: "", imageDataUrl: "" });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      // quick guard for very large files
      alert("Image is larger than 3MB — choose a smaller image");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductForm((prev) => ({ ...prev, imageDataUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function saveProduct(e) {
    e?.preventDefault?.();
    const { title, price, categoryId } = productForm;
    if (!title.trim()) return alert("Product title required");
    if (!price || isNaN(Number(price))) return alert("Valid product price required");
    if (!categoryId) return alert("Please choose a category");

    if (productForm.id) {
      // update
      setData((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === productForm.id ? { ...productForm } : p)),
      }));
    } else {
      const newProduct = { ...productForm, id: uid(), createdAt: Date.now() };
      setData((prev) => ({ ...prev, products: [...prev.products, newProduct] }));
    }

    resetProductForm();
  }

  function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    setData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  }

  // helper: get subcategories for a category id
  function getSubcats(cid) {
    return data.categories.find((c) => c.id === cid)?.subcategories || [];
  }

  // UI components (small)
  const Section = ({ title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {/* Left column: Categories & Subcategories */}
        <div className="md:col-span-1 space-y-6">
          <Section title={<><FileText className="h-5 w-5"/> Categories</>}>
            <form onSubmit={addOrUpdateCategory} className="flex gap-2">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 input px-3 py-2 border rounded-md"
              />
              <button type="submit" className="btn inline-flex items-center gap-2">
                {editingCategoryId ? <Save className="h-4 w-4"/> : <PlusCircle className="h-4 w-4"/>}
                <span className="text-sm">{editingCategoryId ? "Save" : "Add"}</span>
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {data.categories.length === 0 && (
                <div className="text-sm text-gray-500">No categories yet.</div>
              )}

              {data.categories.map((cat) => (
                <div key={cat.id} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{cat.name}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => editCategory(cat)} className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 className="h-4 w-4"/>
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="h-4 w-4 text-red-500"/>
                      </button>
                    </div>
                  </div>

                  {/* subcategories */}
                  <div className="mt-2 text-sm text-gray-600">
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cat.subcategories.map((s) => (
                          <span key={s.id} className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded shadow-sm">
                            {s.name}
                            <button onClick={() => deleteSubcategory(cat.id, s.id)} className="p-1">
                              <X className="h-3 w-3"/>
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs italic text-gray-400">No subcategories</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title={<><ChevronDown className="h-5 w-5"/> Add Subcategory</>}>
            <form onSubmit={addSubcategory} className="space-y-3">
              <select
                value={subcategoryParentId}
                onChange={(e) => setSubcategoryParentId(e.target.value)}
                className="w-full input px-3 py-2 border rounded-md"
              >
                <option value="">Choose parent category</option>
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  placeholder="Subcategory name"
                  className="flex-1 input px-3 py-2 border rounded-md"
                />
                <button type="submit" className="btn inline-flex items-center gap-2">
                  <PlusCircle className="h-4 w-4"/>
                  <span className="text-sm">Add</span>
                </button>
              </div>
            </form>
          </Section>
        </div>

        {/* Middle: Product Form */}
        <div className="md:col-span-2 space-y-6">
          <Section title={<><Image className="h-5 w-5"/> Product</>}>
            <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <input
                  value={productForm.title}
                  onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Product title"
                  className="w-full input px-3 py-2 border rounded-md"
                />

                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description"
                  rows={4}
                  className="w-full input px-3 py-2 border rounded-md"
                />

                <div className="flex gap-2">
                  <input
                    value={productForm.price}
                    onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="Price"
                    className="w-40 input px-3 py-2 border rounded-md"
                    inputMode="numeric"
                  />

                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm((p) => ({ ...p, categoryId: e.target.value, subcategoryId: "" }))}
                    className="flex-1 input px-3 py-2 border rounded-md"
                  >
                    <option value="">Choose category</option>
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={productForm.subcategoryId}
                    onChange={(e) => setProductForm((p) => ({ ...p, subcategoryId: e.target.value }))}
                    className="w-48 input px-3 py-2 border rounded-md"
                    disabled={!productForm.categoryId}
                  >
                    <option value="">Choose subcategory</option>
                    {getSubcats(productForm.categoryId).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn inline-flex items-center gap-2">
                    <Save className="h-4 w-4"/>
                    <span>{productForm.id ? "Update" : "Save"} Product</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => resetProductForm()}
                    className="btn-ghost inline-flex items-center gap-2"
                  >
                    <X className="h-4 w-4"/>
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="border border-dashed rounded-md p-3 flex flex-col items-center justify-center gap-3 min-h-[180px]">
                  {productForm.imageDataUrl ? (
                    <img src={productForm.imageDataUrl} alt="preview" className="max-h-40 object-contain" />
                  ) : (
                    <div className="text-center text-sm text-gray-400">
                      <Image className="mx-auto" />
                      <div className="mt-2">No image</div>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div className="flex w-full gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn w-full inline-flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4"/>
                      <span>Add Image</span>
                    </button>
                    {productForm.imageDataUrl && (
                      <button
                        type="button"
                        onClick={() => setProductForm((p) => ({ ...p, imageDataUrl: "" }))}
                        className="btn-ghost w-24"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Section>

          {/* Product list */}
          <Section title={<><FileText className="h-5 w-5"/> Products</>}>
            <div className="space-y-3">
              {data.products.length === 0 && <div className="text-sm text-gray-500">No products added yet.</div>}

              <div className="grid gap-3">
                {data.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 border rounded-md p-3 bg-white">
                    <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {p.imageDataUrl ? (
                        <img src={p.imageDataUrl} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <Image className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-gray-500">{p.description}</div>
                      <div className="text-xs text-gray-400 mt-1">Price: ₹{p.price} • Category: {data.categories.find(c=>c.id===p.categoryId)?.name || '-'}{p.subcategoryId ? ' / ' + (data.categories.find(c=>c.id===p.categoryId)?.subcategories.find(s=>s.id===p.subcategoryId)?.name || '') : ''}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditProduct(p)} className="p-2 hover:bg-gray-100 rounded">
                        <Edit2 className="h-4 w-4"/>
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-gray-100 rounded">
                        <Trash2 className="h-4 w-4 text-red-500"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 text-xs text-gray-400">Data stored in browser localStorage under key: <code>{LS_KEY}</code></div>
    </div>
  );
}
