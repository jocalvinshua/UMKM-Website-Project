import { useEffect, useState } from "react";
import { assets, dummyAddress } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Cart() {
  const [showAddress, setShowAddress] = useState(false);

  const {
    products,
    navigate,
    currency,
    cartItem,
    removeFromCart,
    getCartCount,
    updateCart,
    getCartAmount,
    addMyOrders,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState(dummyAddress);
  const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
  const [paymentOption, setPaymentOption] = useState("COD");

  // ✅ safer getCart with ID check
  const getCart = () => {
    const tempArray = [];

    for (const key in cartItem) {
      const product = products.find(
        (item) => String(item._id) === String(key)
      );

      if (product) {
        tempArray.push({ ...product, quantity: cartItem[key] });
      } else {
        console.warn("⚠️ Product not found for cart key:", key);
      }
    }

    setCartArray(tempArray);
  };

  useEffect(() => {
    if (products.length > 0) {
      getCart();
    }
  }, [products, cartItem]);

  const placeOrder = async () => {
    if (cartArray.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // ✅ Validate product IDs before sending
    const invalidProducts = cartArray.filter((p) => !p._id);
    if (invalidProducts.length > 0) {
      console.error("Invalid products:", invalidProducts);
      toast.error("Invalid Product ID found. Please refresh your cart.");
      return;
    }

    if (paymentOption === "COD") {
      try {
        const orderData = {
          items: cartArray.map(({ _id, quantity }) => ({
            productId: _id,
            quantity,
          })),
          address: selectedAddress,
        };

        await addMyOrders(orderData);
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to place order. Please try again.");
      }
    } else {
      toast.success("Proceeding to online payment...");
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        {cartArray.length === 0 ? (
          <div>
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <button
              onClick={() => {
                navigate("/product");
                scrollTo(0, 0);
              }}
              className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
            >
              <img
                src={assets.arrow_right_icon_colored}
                className="group-hover:-translate-x-1 transition"
              />
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
              <p className="text-left">Product Details</p>
              <p className="text-center">Subtotal</p>
              <p className="text-center">Action</p>
            </div>

            {cartArray.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
              >
                <div className="flex items-center md:gap-6 gap-3">
                  <div
                    onClick={() => {
                      navigate(
                        `/product/${product.category.toLowerCase()}/${product._id}`
                      );
                      scrollTo(0, 0);
                    }}
                    className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                  >
                    <img
                      className="max-w-full h-full object-cover"
                      src={Array.isArray(product.image) ? product.image[0] : product.image}
                      alt={product.name}
                    />
                  </div>
                  <div>
                    <p className="hidden md:block font-semibold">
                      {product.name}
                    </p>
                    <div className="font-normal text-gray-500/70">
                      <p>
                        Weight: <span>{product.weight || "N/A"}</span>
                      </p>
                      <div className="flex items-center">
                        <p>Qty:</p>
                        <select
                          className="outline-none ml-1"
                          value={cartItem[product._id] ?? product.quantity}
                          onChange={(e) =>
                            updateCart(product._id, parseInt(e.target.value))
                          }
                        >
                          {Array.from(
                            { length: Math.max(9, cartItem[product._id]) },
                            (_, i) => i + 1
                          ).map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center">
                  {currency}
                  {product.offerPrice * product.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer mx-auto"
                >
                  <img
                    src={assets.remove_icon}
                    alt="remove"
                    className="inline-block w-6 h-6"
                  />
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                navigate("/product");
                scrollTo(0, 0);
              }}
              className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
            >
              <img
                src={assets.arrow_right_icon_colored}
                className="group-hover:-translate-x-1 transition"
              />
              Continue Shopping
            </button>
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        {/* Address Section */}
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address Found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          {/* Payment */}
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        {/* Summary */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary/90 transition"
          disabled={cartArray.length === 0}
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed Order"}
        </button>
      </div>
    </div>
  );
}
