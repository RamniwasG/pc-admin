"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAxios } from "@/api/axios-instance";
import SidebarButton from "@/components/sidebar-btn";
import ResourceManager from "@/components/resource-mgr";
import OrdersPanel from "@/components/order-panel";
import GoBack from "@/components/go-back";
import UsersList from "../users";
import { sidebarMenuItems } from "@/constants";
import ConfirmDialog from "@/shared/confirm-dialog";
import { capitalizeWords } from "@/utils";

// --- Main Admin Dashboard ---
export default function AdminDashboardComp({ section }) {
  const [active, setActive] = useState(section); // categories | subcategories | products | orders
  const api = useAxios();
  // local state for lists
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // loading & editing states
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // item being edited
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  // fetch lists by selected section
  const fetchItemsBySection = useCallback(async() => {
    setLoading(true);
    try {
      const { data } = await api.get(`/${section === 'users' ? 'auth' : section}/fetchAll${capitalizeWords(section)}`);
      switch(section) {
        case 'categories':
          setCategories(data.categories);
          break;
        case 'subcategories':
          setSubcategories(data.subcategories);
          break;
        case 'products':
          setProducts(data.products);
          break;
        case 'orders':
          setOrders(data.orders);
          break;
        default:
          setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
      setError(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItemsBySection();
  }, [fetchItemsBySection]);

  // --- Category actions ---
  async function addCategory(payload) {
    try {
      const res = await api.post("/categories/add", payload);
      setCategories((s) => [...s, res.data]);
    } catch(error) {
      setError(error);
    }
  }
  async function updateCategory(id, payload) {
    try {
      await api.put(`/categories/${id}`, payload);
      setCategories((s) => s.map((c) => (c._id === id ? { ...c, ...payload } : c)));
    } catch(error) {
      setError(error);
    }
  }
  async function deleteItem(id) {
    setOpen(true);
    setSelectedId(id);
  }

  async function handleDelete() {
    switch(section) {
      case 'categories':
        await deleteCategory();
        break;
      case 'subcategories':
        await deleteSubCategory();
        break;
      case 'products':
        await deleteProduct();
        break;
      case 'orders':
        await deleteOrder();
        break;
      default:
        await deleteUser();
    }
  }

  function clearIdAndCloseModel() {
    setOpen(false);
    setSelectedId(null);
  }

  async function deleteCategory() {
    try {
      await api.delete(`/categories/${selectedId}`);
      setCategories((s) => s.filter((c) => c._id !== selectedId));
      clearIdAndCloseModel();
      // refresh dependant lists
      // fetchAll();
    } catch(err) {
      setError(err);
    }
  }

  // --- Subcategory actions ---
  async function addSub(payload) {
    const res = await api.post("/subcategories/add", payload);
    setSubcategories((s) => [...s, res.data]);
  }
  async function updateSub(id, payload) {
    const payloadData = { name: payload.name, description: payload.description, categoryId: typeof payload.category === "string" ? payload.category : payload.category._id };
    await api.put(`/subcategories/${id}`, payloadData);
    setSubcategories((s) => s.map((c) => (c._id === id ? { ...c, ...payload } : c)));
  }
  async function deleteSubCategory() {
    try {
      await api.delete(`/subcategories/${selectedId}`);
      setSubcategories((s) => s.filter((c) => c._id !== selectedId));
      clearIdAndCloseModel();
      // fetchAll();
    } catch(error) {
      setError(error);
    }
  }

  // --- Products actions ---
  async function addProduct(payload) {
    const { categoryId, subcategoryId, images } = payload;
    setLoading(true);
    try {
      // First upload images
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      const { data } = await api.post('/uploads/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // if success, add product now
      if(data.success) {
        const res = await api.post("/products/add", 
          { ...payload, category: categoryId, subcategory: subcategoryId, images: data.images }
        );
        setProducts((s) => [...s, res.data]);
      }
      setLoading(false);
    } catch(error) {
      setError(error);
      setLoading(false);
    }
  }
  async function updateProduct(id, payload) {
    await api.put(`/products/${id}`, payload);
    setProducts((s) => s.map((p) => (p._id === id ? { ...p, ...payload } : p)));
  }
  async function deleteProduct() {
    try {
      await api.delete(`/products/${selectedId}`);
      setProducts((s) => s.filter((p) => p._id !== selectedId));
      clearIdAndCloseModel();
    } catch(err) {
      setError(err);
    }
  }

  // --- Users actions ---
  async function addUser(payload) {
    const formData = new FormData();
    const { name, email, image
    } = payload;
    const [firstName, lastName] = name.split(" ");
    formData.append("profile", {firstName, lastName, avatarUrl: image.name });
    formData.append("email", email);
    const res = await api.post("/users/add", formData);
    setUsers((s) => [...s, res.data]);
  }
  async function updateUser(id, payload) {
    const { email, phone, role, isActive
    } = payload;
    console.log(payload)
    await api.put(`/auth/update-profile/${id}`, { email, phone, role, isActive: isActive === 'active' ? true : false });
    setUsers((s) => s.map((u) => (u._id === id ? { ...u, ...payload } : u)));
  }
  async function deleteUser() {
    try {
      await api.delete(`/auth/remove/${selectedId}`);
      setUsers((s) => s.filter((u) => u._id !== selectedId));
      clearIdAndCloseModel();
    } catch(error) {
      setError(error);
    }
  }

  // create order
  async function createOrder(payload) {
    const res = await api.post("/orders", payload);
    setOrders((s) => [...s, res.data]);
  }
  async function deleteOrder() {
    try {
      await api.delete(`/orders/${selectedId}`);
      setOrders((s) => s.filter((u) => u._id !== selectedId));
      clearIdAndCloseModel();
    } catch(error) {
      setError(error);
    }
  }

  // --- UI helper: render right panel per active ---
  function RightPanel() {
    switch (active) {
      case "categories":
        return (
          <ResourceManager
            resource="categories"
            loading={loading}
            items={categories}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteItem}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "subcategories":
        return (
          <ResourceManager
            resource="subcategories"
            loading={loading}
            items={subcategories}
            extra={{ categories }}
            onAdd={addSub}
            onUpdate={updateSub}
            onDelete={deleteItem}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "products":
        return (
          <ResourceManager
            resource="products"
            loading={loading}
            items={products}
            extra={{ categories, subcategories }}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteItem}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "users":
        return (
          <UsersList
            resource="users"
            loading={loading}
            items={users}
            onAdd={addUser}
            onUpdate={updateUser}
            onDelete={deleteUser}
            editing={editing}
            setEditing={setEditing}
          />
        );
      case "orders":
        return <OrdersPanel orders={orders} onCreate={createOrder} />;
      default:
        return null;
    }
  }

  const getDialogTitle = (section) => {
    let title = 'Delete '
    switch(section) {
      case 'categories':
        title += 'Category'
        break;
      case 'subcategories':
        title += 'Subcategory'
        break;
      case 'products':
        title += 'Product'
        break;
      case 'orders':
        title += 'Order'
        break;
      default:
        title += 'User'
    }

    return title;
  }

  return (<>
    <ConfirmDialog
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={handleDelete}
      title={getDialogTitle(section)}
      message="Do you really want to delete this?"
    />
    <div className="bg-gray-50">
      <GoBack href="/dashboard" label="Back" classes="mb-0 px-2" />
      <div className="mx-auto grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        {error && <p className="bg-red text-sm">{error}</p>}
        <aside className="col-span-12 sm:col-span-4 md:col-span-2 bg-white rounded-lg shadow p-3">
          <nav className="space-y-2">
            {sidebarMenuItems.map((item) => (
              <SidebarButton
                key={item.label}
                active={active === item.label.toLowerCase()}
                onClick={() => setActive(item.label.toLowerCase())}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          {/* <div className="mt-6 text-xs text-gray-400">Mock data saved in localStorage under key: <code>{MOCK_LS_KEY}</code></div> */}
        </aside>

        {/* Right main panel */}
        <main className="col-span-12 sm:col-span-8 md:col-span-10">
          <div className="bg-white rounded-lg shadow p-4">
            {error}
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

