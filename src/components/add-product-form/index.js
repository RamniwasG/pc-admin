import {
  Save,
  X,
} from "lucide-react";
import ResourceList from "../resource-list";
import { useMemo, useEffect, useState } from "react";
import ProductFormDrawer from "../product-form-drawer";

// --- Resource Manager: generic for categories/subcategories/products ---
function AddProductForm({ editing, setEditing, resource, onAdd, onUpdate, extra }) {
  // resource: 'categories' | 'subcategories' | 'products'
  const isProduct = resource === "products";
  const isSub = resource === "subcategories";

  const emptyForm = useMemo(() => {
    if (isProduct) return { 
        title: "", description: "", price: 0, discount: 0, // basic info
        categoryId: "", subcategoryId: "", // relational fields
        stock: 0, brand: "", // inventory details
        size: "", color: "", WUnit: "", weight: "", // various product specs
        rating: 0, image: null // additional attributes
    };
    if (isSub) return { name: "", category: "" };
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
      await onUpdate(editing._id, form);
    } else {
      await onAdd(form);
    }
    setForm(emptyForm);
    setEditing(null);
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-6 overflow-y-auto h-[calc(100%-65px)]">
        {isProduct ? (
            <div className="third-col space-y-2">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                name="title"
                placeholder="Enter product title"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Description"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Price"
                />
            </div>

            {/* Discount */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Discount"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Choose category</option>
                {extra.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>

            {/* Subcategory */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select value={form.subcategoryId || ""} onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" disabled={!form.categoryId}>
                    <option value="">Choose subcategory</option>
                    {extra.subcategories?.filter((s) => s.category._id === form.categoryId).map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
            </div>

            {/* Stock */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Stock"
                />
            </div>

            {/* Brand */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Brand"
                />
            </div>

            {/* Size */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <select
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select Size</option>
                    {["Small", "Medium", "Large", "8mm", "10mm", "12mm", "16mm"].map(
                        (s) => (
                            <option key={s} value={s}>{s}</option>
                        )
                    )}
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <select
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select Color</option>
                    {["Black", "Red", "White", "Yellow", "Orange", "Blue"].map(
                        (s) => (
                            <option key={s} value={s}>{s}</option>
                        )
                    )}
                </select>
            </div>

            {/* Weight */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <select
                    value={form.WUnit}
                    onChange={(e) => setForm((f) => ({ ...f, WUnit: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select Weight Unit</option>
                        {["g", "kg", "pound"].map((w) => (
                        <option key={w} value={w}>
                            {w}
                        </option>
                    ))}
                </select>
            </div>
            {form.WUnit && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Weight Value</label>
                    <input
                        type="number"
                        value={form.weight}
                        onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Weight"
                    />
                </div>
            )}

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files }))}
                    accept="image/*"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                    type="text"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Rating"
                />
            </div>
            </div>
        ) : isSub ? (
            <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Subcategory title" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                <input value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                <select value={typeof form.category === 'string' ? form.category : form.category?._id} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Choose category</option>
                    {extra.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </>
        ) : (
            <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category title" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                <input value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </>
        )}

        <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => {
                setForm(emptyForm);
                setEditing(null); 
            }} className="w-full py-2 bg-red-500 text-white rounded-md font-medium hover:bg-blue-700 transition">
                {/* <X className="h-4 w-4" /> */}
                <span>Clear</span>
            </button>
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
                {/* <Save className="h-4 w-4" /> */}
                <span>{editing ? "Update" : "Save"}</span>
            </button>
        </div>
    </form>
  );
}

export default AddProductForm;
