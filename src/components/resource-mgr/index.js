import {
  Save,
  X,
} from "lucide-react";
import ResourceList from "../resource-list";
import { useMemo, useEffect, useState } from "react";
import ProductFormDrawer from "../product-form-drawer";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3">
        <div className="flex justify-end">
          <ProductFormDrawer
            editing={editing}
            setEditing={setEditing}
            resource={resource}
            onAdd={onAdd}
            onUpdate={onUpdate}
            extra={extra}
          />
        </div>
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
    </div>
  );
}

export default ResourceManager;
