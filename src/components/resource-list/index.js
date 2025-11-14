import {
  Edit2,
  Trash2,
} from "lucide-react";
import { capitalizeWords } from "@/utils";
import Image from "next/image";
import CustomTable from "../custom-table";
import ProductsTable from "../products-table";

function ResourceList({title, loading, items, editing, onEdit, onDelete }) {
  const {_id, __v, ...rest} = items.length > 0 ? items[0] : {};
  return (
    <div className={`space-y-2 ${title === 'subcategories' ? 'categories-list' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{capitalizeWords(title)}</p>
      </div>
      <div className="space-y-2">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-sm text-gray-500">No items</div>}
        {items.length > 0 && (title === 'categories' || title === 'subcategories')
          ? <CustomTable
            resource={title}
            loading={loading}
            rows={items}
            cols={Object.keys(rest)}
            onDelete={onDelete}
            setEditing={onEdit}
          />
          : <ProductsTable
            loading={loading}
            rows={items}
            cols={Object.keys(rest)}
            onDelete={onDelete}
            setEditing={onEdit}
          />
        }
      </div>
    </div>
  );
}

export default ResourceList;
