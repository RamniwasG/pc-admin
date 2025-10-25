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
    if (isProduct) return { title: "", price: "", categoryId: "", subcategoryId: "" };
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ResourceList
          // title={`${resource} list`}
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
              <>
                <input value={form.title || ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full input px-3 py-2 border rounded" />
                <input value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price" className="w-full input px-3 py-2 border rounded" />

                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))} className="w-full input px-3 py-2 border rounded">
                  <option value="">Choose category</option>
                  {extra.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <select value={form.subcategoryId || ""} onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))} className="w-full input px-3 py-2 border rounded" disabled={!form.categoryId}>
                  <option value="">Choose subcategory</option>
                  {extra.subcategories?.filter((s) => s.categoryId === form.categoryId).map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </>
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
