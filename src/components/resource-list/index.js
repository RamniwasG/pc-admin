import {
  Edit2,
  Trash2,
} from "lucide-react";
import { capitalizeWords } from "@/utils";

function ResourceList({ loading, title, items, editing, onEdit, onDelete, renderSub }) {
  return (
    <div className={`space-y-2 ${title === 'subcategories list' ? 'categories-list' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{capitalizeWords(title)}</p>
      </div>
      <div className="space-y-2">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-sm text-gray-500">No items</div>}
        {items.length > 0 && items.map((it) => {
          const value = renderSub(it);
          return (
            <div key={it._id}
              onClick={() => onEdit(it)}
              className={`flex items-center justify-between border rounded p-2 ${editing?._id === it._id ? 'bg-lightblue' : 'bg-white'} hover:bg-gray-50 cursor-pointer`}
            >
              <div>
                <div className="font-medium">{it.name || it.title || it._id}</div>
                {renderSub && value && <div className="text-xs font-bold text-white bg-green-500 rounded p-1">{renderSub(it)}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(it)} className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="sm:h-4 lg:h-5 sm:w-4 lg:w-5" />
                </button>
                <button onClick={() => onDelete(it)} className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="sm:h-4 lg:h-5 sm:w-4 lg:w-5 text-red-500" />
                </button>
              </div>
            </div>
          )}
        )}
      </div>
    </div>
  );
}

export default ResourceList;
