import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext" // FIXED: Path adjusted back to '../context/AppContext'
import { dummyOrders } from "../assets/assets"
import toast from "react-hot-toast"
import axios from "axios" // FIXED: Import axios

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState([])
  const { currency } = useAppContext()

  const fetchOrders = async () => {
    try {
      // Endpoint ini menggunakan authUser middleware, jadi userId diambil dari cookie/token.
      const { data } = await axios.get('/api/order/user')
      if (data.success) {
        setMyOrders(data.orders)
      } else { toast.error(data.message || "Failed to fetch orders") }
    } catch (error) {
      // Pastikan error di-handle, terutama jika token kadaluwarsa
      toast.error("Failed to fetch orders. Please login again.")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Fungsi utilitas untuk menampilkan tipe pembayaran
  const getPaymentTypeLabel = (typeCode) => {
    // Asumsi: 0 = COD, 1 = Online. Sesuaikan jika kode payment Anda berbeda.
    if (typeCode === 0) return "Cash on Delivery (COD)"
    if (typeCode === 1) return "Online Payment"
    return "Unknown"
  }

  return (
    <div className="mt-16">
      <div className="flex flex-col items-end w-max mb-8">
        <h1 className="text-2xl md:text-3xl font-medium uppercase">My Orders</h1>
        <div className="w-16 h-0.5 rounded-full bg-primary"></div>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-center text-xl text-gray-500 p-10">No orders found.</p>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl shadow-lg'>
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col border-b pb-4 mb-4">
              <span className="truncate">Order ID: {order._id}</span>
              <span className="mt-2 md:mt-0">
                Payment: 
                <span className="font-semibold text-gray-600 ml-1">
                  {getPaymentTypeLabel(order.paymentType)}
                </span>
              </span>
              <span className="mt-2 md:mt-0">
                Total Amount: 
                <span className="font-semibold text-primary ml-1">
                  {currency}{order.amount}
                </span>
              </span>
            </p>

            {/* Render items within the order */}
            {order.items.map((item, idx) => {
              // Menghitung harga per produk (menggunakan offerPrice jika ada)
              const productPrice = item.product?.offerPrice || item.product?.price || 0;
              const itemTotal = productPrice * item.quantity;

              return (
                <div 
                  key={idx} 
                  // FIXED: typo order.items.lenght -> order.items.length
                  className={`relative bg-white text-gray-500/70 ${idx < order.items.length - 1 && "border-b"} border-gray-200 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                > 
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0">
                      {/* Pastikan item.product adalah objek yang di-populate */}
                      <img 
                        src={item.product?.image?.[0] || 'https://placehold.co/64x64/E0F2F1/0F766E?text=IMG'} 
                        alt={item.product?.name || 'Product Image'} 
                        className="w-16 h-16 object-cover rounded" 
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-800">
                        {item.product?.name || 'Product Deleted'}
                      </h2>
                      <p className="text-sm">Category: {item.product?.category || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-sm md:text-base">
                    <p>Quantity: {item.quantity || "1"}</p>
                    <p>Status: <span className={`font-medium ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}`}>{order.status}</span></p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <p className="text-primary text-lg font-medium flex-shrink-0">
                    {currency}{itemTotal.toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
