import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";

const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper: format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ===== UI: Loading =====
  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center text-gray-700">
        Loading orders...
      </div>
    );
  }

  // ===== UI: Error =====
  if (error) {
    return (
      <div className="p-10 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // ===== UI: No Orders =====
  if (orders.length === 0) {
    return (
      <div className="p-10 flex items-center justify-center text-gray-600">
        No orders received yet.
      </div>
    );
  }

  return (
    <div className="noScrollBar md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] 
                     md:items-center gap-5 p-5 max-w-4xl rounded-md 
                     border border-gray-300 text-gray-800"
        >
          {/* Products Info */}
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              src={assets.box_icon || "/placeholder.png"}
              alt="boxIcon"
            />

            <div className="flex flex-col justify-center">
              {order.items?.length > 0 ? (
                order.items.map((item, i) => (
                  <p key={i} className="font-medium">
                    {item.product?.name || "Unknown Product"}{" "}
                    {item.quantity > 1 && (
                      <span className="text-primary">x {item.quantity}</span>
                    )}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No items</p>
              )}
            </div>
          </div>

          {/* Address Info */}
          <div className="text-sm">
            {order.address ? (
              <>
                <p className="font-medium mb-1">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}, {order.address.zipcode},{" "}
                  {order.address.country}
                </p>
              </>
            ) : (
              <p className="italic text-gray-500">No address available</p>
            )}
          </div>

          {/* Amount */}
          <p className="font-medium text-base my-auto text-black/70">
            {currency} {order.amount}
          </p>

          {/* Payment Details */}
          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentType || "Unknown"}</p>
            <p>Date: {formatDate(order.createdAt)}</p>
            <p>Payment: {order.isPaid ? "Paid 🔥" : "Pending ⏳"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
