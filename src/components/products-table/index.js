"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { capitalizeWords } from "@/utils";
import Image from "next/image";

export default function ProductsTable({ loading, rows, cols, onDelete, setEditing }) {
  
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
              {cols.map((col) => (
                <th key={col} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
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
                  {Object.keys(item).filter(k => k !== '_id' && k !== '__v').map((key => {
                    let value = item[key];
                    if(Array.isArray(value) && value.length > 0) {
                      value = value.join(', ');
                    } else if(Array.isArray(value) && value.length === 0) {
                      value = '--';
                    } else if(typeof value === 'boolean') {
                      value = value || '--';
                    }

                    if(key === 'isActive' || key === 'isFeatured') {
                      return <td key={key} className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !item.isActive
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                          >
                          {item.isActive ? 'active' : 'inactive'}
                        </span>
                      </td>
                    }
                    if(key === 'category' || key === 'subcategory') {
                      return <td key={key} className="px-4 py-2 text-sm text-gray-800">
                        {key === 'category' ? item?.category?.name : item?.subcategory?.name}
                      </td>
                    }
                    if(key === 'images' && item.images.length > 0) {
                      return item.images.map((img, idx) => (
                        <td key={idx} className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={img.url}
                            width={10}
                            height={10}
                            alt="preview"
                            className="w-full h-10 object-cover hover:cursor-pointer"
                          />
                        </td>
                      ))
                    }
                    if(['size', 'color', 'images', 'tags'].includes(key) && value.length === 0) {
                      return <td key={key} className="px-4 py-2 text-sm text-gray-800">N/A</td>
                    }
                    return <td key={key} className="px-4 py-2 text-sm text-gray-800">{value || 'N/A'}</td>
                }))}
                  
                  
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