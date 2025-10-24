import {
  Edit2,
  Trash2,
} from "lucide-react";

function ResourceList({ loading, title, items, onEdit, onDelete, renderSub }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="space-y-2">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-sm text-gray-500">No items</div>}
        {items.length > 0 && items.map((it) => {
          const value = renderSub(it);
          return (
            <div key={it._id} className="flex items-center justify-between border rounded p-2 bg-white">
              <div>
                <div className="font-medium">{it.name || it.title || it._id}</div>
                {renderSub && value && <div className="text-xs font-bold text-white bg-green-500 rounded p-1">{renderSub(it)}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(it)} className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(it)} className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="h-4 w-4 text-red-500" />
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
