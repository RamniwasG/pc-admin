"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { capitalizeWords } from "@/utils";

export default function CustomTable({ resource, loading, rows, cols, onDelete, setEditing }) {
  // Fake data (replace with API call)
//   const [items, setItems] = useState(rows || []);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Pagination logic
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const data = rows.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
              {cols.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  {capitalizeWords(col)}
                </th>
              ))}
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
            !loading && data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{item.name || '--'}</td>
                  {(resource ==='categories' || resource === 'subcategories' ) && <td className="px-4 py-2 text-sm text-gray-800">{item.description || '--'}</td>}
                  {item?.category && <td className="px-4 py-2 text-sm text-gray-800">{item?.category?.name || '--'}</td>}
                  {item.role && (item.phone || item.email) && <td className="px-4 py-2 text-sm text-gray-600">{item.role === 'customer' ? item.phone : item.email}</td>}
                  {item.role && <td className="px-4 py-2 text-sm text-gray-800 font-semibold">{item.role}</td>}
                  {Object.keys(item).includes('isActive') && <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        !item.isActive
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setEditing(item)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => item.role === 'super' ? {} : onDelete(item._id)}
                      className={`${item.role === 'super' ? 'text-gray-400' : 'text-red-600'} cursor-${item.role === 'super' ? 'not-allowed' : 'pointer'} hover:${item.role !== 'admin' ? 'text-red-800' : ''} p-1 ml-2`}
                      disabled={item.role === 'super'}
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
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between rows-center mt-4">
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
    </>
  );
}