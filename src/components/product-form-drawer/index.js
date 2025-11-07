"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import AddProductForm from "../add-product-form";

function getAddResourceText(resource, editing) {
  switch (resource) {
    case "categories":
      return `${editing ? 'Edit' : 'Add'} Category`;
    case "subcategories":
      return `${editing ? 'Edit' : 'Add'} Subcategory`;
    case "products":
      return `${editing ? 'Edit' : 'Add'} Product`;
    case "users":
      return `${editing ? 'Edit' : 'Add'} User`;
    default:
      return "Add Resource";
  }
}

// --- Product Form Drawer Component ---

export default function ProductFormDrawer({ editing, setEditing, resource, onAdd, onUpdate, extra }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {/* 🔘 Add Resource Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
      >
        <Plus size={18} className="mr-2"/>{getAddResourceText(resource, editing)}
      </button>

      {/* 🔲 Overlay (dim background) */}
      {(open || editing) && (
        <div
          onClick={() => { setOpen(null); setEditing(null); }}
          className={`fixed inset-0 bg-transparent z-40 transition-opacity duration-400 ${
            (open || editing) ? "bg-opacity-40" : "bg-opacity-0"
          }`}
        ></div>
      )}

      {/* 🧾 Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[320px] md:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          (open || editing) ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-500 text-white">
          <h2 className="text-lg font-semibold">
            {getAddResourceText(resource, editing)}
          </h2>
          <button
            onClick={() => {setOpen(false); setEditing(null);}}
            className="text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <AddProductForm
          editing={editing}
          setEditing={setEditing}
          resource={resource}
          onAdd={onAdd}
          onUpdate={onUpdate}
          extra={extra}
        />
      </div>
    </div>
  );
}