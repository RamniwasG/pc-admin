import { capitalizeWords } from "@/utils";
import CustomTable from "../custom-table";
import ProductsTable from "../products-table";
import { useParams } from "next/navigation";
import SubcategoryFilter from "@/shared/subcategory-filter";
import { useState } from "react";

function ResourceList({title, loading, items, editing, onEdit, onDelete }) {
  const [selectedfilter, setSelectedFilter] = useState('');
  const {_id, __v, ...rest} = items.length > 0 ? items[0] : {};
  const { section } = useParams();
  let categoriesList = []
  if(section === 'subcategories' && items.length > 0) {
    items.forEach((i) => {
      const exist = categoriesList.find(c => c._id === i.category._id)
      if(!exist) {
        categoriesList.push(i.category);
      }
    });
  }
  categoriesList.push({_id: '0001', name: 'All'});
  
  return (
    <div className={`space-y-2 ${title === 'subcategories' ? 'categories-list' : ''}`}>
      <div className="flex items-center justify-between p-2">
        <p className="text-lg font-semibold">{capitalizeWords(title)}</p>
        {section === 'subcategories' && <SubcategoryFilter categories={categoriesList} onSelect={setSelectedFilter} />}
      </div>
      <div className="space-y-2">
        {(section === 'categories' || section === 'subcategories')
          ? <CustomTable
            resource={section}
            loading={loading}
            rows={
              (selectedfilter === '' || selectedfilter === '0001') 
              ? items 
              : items.filter((i) => i?.category?._id === selectedfilter)
            }
            cols={section === 'categories' ?
              ['Title', 'Description', 'CreatedAt', 'UpdatedAt'] : 
              ['Title', 'Description', 'Category', 'CreatedAt', 'UpdatedAt']}
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
