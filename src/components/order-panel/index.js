import {
  PlusCircle,
} from "lucide-react";

function OrdersPanel({ orders, onCreate }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">Orders</h4>
        <button onClick={() => onCreate({ customer: "Test", total: 999, items: [] })} className="btn inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create Test Order</span>
        </button>
      </div>

      {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet</div>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order {o._id}</div>
                <div className="text-sm text-gray-500">Customer: {o.customer} • Total: ₹{o.total}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPanel;
