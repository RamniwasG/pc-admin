import { Layers, Lock, Package, Settings, ShoppingCart, Tag, User, Users } from "lucide-react";

export const roles = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "seller", label: "Seller" },
];

export const orderStatuses = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash_on_delivery", label: "Cash on Delivery" },
];

export const userPrifileMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Change Password", href: "/change-password", icon: Lock },
];

export const sidebarMenuItems = [
  { label: "Categories", href: "/categories", icon: Layers },
  { label: "Subcategories", href: "/subcategories", icon: Tag },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Users", href: "/users", icon: Users },
];