import {
  Save,
  X,
} from "lucide-react";
import ResourceList from "../resource-list";
import { useMemo, useEffect, useState } from "react";

// --- Resource Manager: generic for categories/subcategories/products ---
function ResourceManager({ loading, resource, items, extra = {}, onAdd, onUpdate, onDelete, editing, setEditing }) {
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

  function startEdit(item) {
    setEditing(item);
  }
console.log(extra);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ResourceList
          title={`${resource} list`}
          loading={loading}
          items={items}
          editing={editing}
          onEdit={startEdit}
          onDelete={(it) => onDelete(it._id)}
          renderSub={(it) => {
            if (isProduct) {
              const cat = extra.categories?.find((c) => c._id === it.categoryId)?.name || "-";
              const sub = extra.subcategories?.find((s) => s._id === it.subcategoryId)?.name || "-";
              return `${cat} / ${sub}`;
            }
            if (isSub) {
              const catId = typeof it.category === "string" ? it.category : it.category?._id;
              const cat = extra.categories?.find((c) => c._id === catId)?.name || "-";
              return `${cat}`;
            }
            return null;
          }}
        />
      </div>

      <div className="md:col-span-1 mt-2">
        <div className="shadow-md rounded p-4 bg-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{editing ? "Edit" : "Add New"} {resource.replace(/ies$/, "y")}</h4>
            {editing && (
              <button onClick={() => { setEditing(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {isProduct ? (
              <div className="third-col space-y-2">
                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">Product Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Description"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium mb-1">Price</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Price"
                    />
                </div>

                {/* Discount */}
                <div>
                    <label className="block font-medium mb-1">Discount (%)</label>
                    <input
                        type="number"
                        value={form.discount}
                        onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Discount"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block font-medium mb-1">Subcategory</label>
                    <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))} className="w-full input px-3 py-1 border rounded">
                    <option value="">Choose category</option>
                    {extra.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Subcategory */}
                <div>
                    <label className="block font-medium mb-1">Subcategory</label>
                    <select value={form.subcategoryId || ""} onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))} className="w-full input px-3 py-1 border rounded" disabled={!form.categoryId}>
                        <option value="">Choose subcategory</option>
                        {extra.subcategories?.filter((s) => s.category._id === form.categoryId).map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>

                {/* Stock */}
                <div>
                    <label className="block font-medium mb-1">Stock</label>
                    <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Stock"
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="block font-medium mb-1">Brand</label>
                    <input
                        type="text"
                        value={form.brand}
                        onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Brand"
                    />
                </div>

                {/* Size */}
                <div>
                    <label className="block font-medium mb-1">Size</label>
                    <select
                        value={form.size}
                        onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
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
                    <label className="block font-medium mb-1">Color</label>
                    <select
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
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
                    <label className="block font-medium mb-1">Weight</label>
                    <select
                        value={form.WUnit}
                        onChange={(e) => setForm((f) => ({ ...f, WUnit: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
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
                        <label className="block font-medium mb-1">Weight Value</label>
                        <input
                            type="number"
                            value={form.weight}
                            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                            required
                            className="w-full border p-1 rounded"
                            placeholder="Weight"
                        />
                    </div>
                )}

                {/* Image Upload */}
                <div>
                    <label className="block font-medium mb-1">Product Image</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.files }))}
                        accept="image/*"
                        required
                        className="w-full"
                    />
                </div>

                {/* Rating */}
                <div>
                    <label className="block font-medium mb-1">Rating</label>
                    <input
                        type="text"
                        value={form.rating}
                        onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                        required
                        className="w-full border p-1 rounded"
                        placeholder="Rating"
                    />
                </div>
              </div>
            ) : isSub ? (
              <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Subcategory title" className="w-full input px-3 py-2 border rounded" />
                <input value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full input px-3 py-2 border rounded" />
                <select value={typeof form.category === 'string' ? form.category : form.category?._id} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full input px-3 py-2 border rounded">
                  <option value="">Choose category</option>
                  {extra.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </>
            ) : (
              <>
                <input value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category title" className="w-full input px-3 py-2 border rounded" />
                <input value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full input px-3 py-2 border rounded" />
              </>
            )}

            <div className="flex justify-end gap-3 mt-3">
              <button type="button" onClick={() => { setForm(emptyForm); setEditing(null); }} className="bg-red-500 text-white rounded p-1 inline-flex items-center gap-2">
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
              <button type="submit" className="btn bg-green-500 text-white rounded p-1 inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>{editing ? "Update" : "Save"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResourceManager;
