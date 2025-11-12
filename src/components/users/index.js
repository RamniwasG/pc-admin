"use client";
import ProductFormDrawer from "../product-form-drawer";
import { capitalizeWords } from "@/utils";
import CustomTable from "../custom-table";

export default function UsersList({ resource, loading, items, onAdd, onUpdate, onDelete, editing, setEditing }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">{capitalizeWords(`${resource} list`)}</h2>
        <ProductFormDrawer
            editing={editing}
            setEditing={setEditing}
            resource={resource}
            onAdd={onAdd}
            onUpdate={onUpdate}
            extra={{
                roles: [{_id: 'admin', name: 'Admin'}, {_id: 'customer', name: 'Customer'}, {_id: 'staff', name: 'Staff'}, {_id: 'seller', name: 'Seller'}],
                statusArr: [{_id: 'active', name: 'active'}, {_id: 'inactive', name: 'inactive'}]
            }}
        />
      </div>

      <CustomTable
        resource={resource}
        loading={loading}
        rows={items}
        cols={['name', 'email', 'role', 'status']}
        onDelete={onDelete}
        setEditing={setEditing}
      />
      
    </div>
  );
}