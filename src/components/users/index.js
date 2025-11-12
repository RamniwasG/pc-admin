"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ProductFormDrawer from "../product-form-drawer";
import { capitalizeWords } from "@/utils";

export default function UsersList({ resource, loading, items, onAdd, onUpdate, onDelete, editing, setEditing }) {
  // Fake data (replace with API call)
//   const [users, setUsers] = useState(items || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = items.slice(indexOfFirstItem, indexOfLastItem);

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

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                  Loading...
                </td>
              </tr>
            ) :
            !loading && currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{user.name || '--'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{user.role === 'customer' ? user.phone : user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 font-semibold">{user.role}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        !user.isActive
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setEditing(user)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => user.role === 'super' ? {} : onDelete(user._id)}
                      className={`${user.role === 'super' ? 'text-gray-400' : 'text-red-600'} cursor-${user.role === 'super' ? 'not-allowed' : 'pointer'} hover:${user.role !== 'admin' ? 'text-red-800' : ''} p-1 ml-2`}
                      disabled={user.role === 'super'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}