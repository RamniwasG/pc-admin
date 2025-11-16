"use client"

import React, { useMemo, useState } from "react";

/**
 * Props:
 * - categories: Array of { _id: string, name: string, subcategories: [{ _id: string, name: string }] }
 * - onSelect: function(subcategory) => void  (optional)
 * - placeholderCategory: string (optional)
 *
 * Example categories shape:
 * [
 *   { _id: 'c1', name: 'Clothing', subcategories: [{ _id: 's1', name: 'Shirts' }, ...] },
 *   ...
 * ]
 */

export default function SubcategoryFilter({
  categories = [],
  onSelect = () => {},
  placeholderCategory = "Filter",
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const [search, setSearch] = useState("");

  // find list of subcategories for the selected category (or empty array)
  const subcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    const cat = categories.find((c) => String(c._id) === String(selectedCategoryId));
    return cat?.subcategories ?? [];
  }, [selectedCategoryId, categories]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = subcategories.slice();
    if (q) {
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return sortAZ ? -1 : 1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return sortAZ ? 1 : -1;
      return 0;
    });
    return list;
  }, [subcategories, search, sortAZ]);

  return (
    <div className="w-full max-w-[160px] mr-5">
      {/* <label className="block text-sm font-medium text-gray-700 mb-2">Category</label> */}
      <div className="flex gap-2">
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            onSelect(e.target.value);
            setSelectedCategoryId(e.target.value);
          }}
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>{placeholderCategory}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* <button
          type="button"
          onClick={() => setSortAZ((s) => !s)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100"
          aria-pressed={sortAZ}
          title={sortAZ ? "Sorting A → Z" : "Sorting Z → A"}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={sortAZ ? "M3 7h6l-3 4m0 0l3 4H3" : "M3 17h6l-3-4m0 0l3-4H3"} />
          </svg>
          <span className="sr-only">Toggle sort</span>
        </button> */}
      </div>

      {/* <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter subcategories</label>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subcategory"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!selectedCategoryId}
        />
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">{selectedCategoryId ? `${filteredSorted.length} subcategory(ies)` : "Choose a category to view subcategories"}</p>

        <ul className="mt-2 max-h-56 overflow-auto divide-y divide-gray-100 rounded-md border border-gray-100 bg-white">
          {selectedCategoryId && filteredSorted.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">No subcategories found.</li>
          )}

          {filteredSorted.map((s) => (
            <li key={s._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="text-left text-sm text-gray-700 w-full"
              >
                {s.name}
              </button>
              <span className="ml-3 text-xs text-gray-400">{s._id}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
