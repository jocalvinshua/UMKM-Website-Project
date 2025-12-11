import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { dummyProducts } from "../assets/assets"; 
import axios from "axios";

// Axios default setup
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  //  States
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [myOrders, setMyOrders] = useState([]);

  //  Logout handler
  const LogOut = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        setIsLoggedIn(false);
        toast.success(data.message || "Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  //  Login handler
  const LoginHandler = useCallback(async (email, password) => {
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        setShowLogin(false);
        toast.success(data.message || "Login successful!");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login request failed");
    }
  }, []);

  //  Fetch user session
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        console.log("Session recovered successfully.");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        console.log("No valid session found.");
      }
    } catch (error) {
      console.error("Error during session recovery:", error);
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  //  Fetch seller authentication
  const fetchSeller = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsAdmin(data.success);
    } catch (error) {
      setIsAdmin(false);
      console.error("Fetch seller error:", error);
    }
  }, []);

  //  Fetch products (dummy or API)
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    }
  }, []);


  //  Initial load
  useEffect(() => {
    fetchProducts();
    fetchSeller();
    fetchUser();
  }, [fetchProducts, fetchSeller, fetchUser]);

  //  Add to cart
  const addToCart = (productId) => {
    setCartItem((prev) => {
      const newCart = { ...prev };
      newCart[productId] = (newCart[productId] || 0) + 1;
      return newCart;
    });
    toast.success("Item added to cart");
  };

  //  Place order (fixed)
  const addMyOrders = async (orderData) => {
    try {
      const items = Object.entries(cartItem).map(([productId, qty]) => ({
        product: productId,   // 👈 INI WAJIB!
        quantity: qty,
      }));

      if (items.length === 0) {
        return toast.error("Your cart is empty!");
      }

      const { address } = orderData;

      const { data } = await axios.post("/api/order/cod", { items, address });

      if (data.success) {
        toast.success("Order placed successfully!");
        setCartItem({});
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  //  Cart utilities
  const getCartCount = () => {
    return Object.values(cartItem).reduce((sum, qty) => sum + qty, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItem) {
      const product = products.find((p) => p._id === id);
      if (product) total += (product.offerPrice || product.price) * cartItem[id];
    }
    return parseFloat(total.toFixed(2));
  };

  const updateCart = (productId, quantity) => {
    if (!productId) return;  // ⛔ stop kalau undefined

    setCartItem((prev) => {
      const newCart = { ...prev };
      if (quantity > 0) newCart[productId] = quantity;
      else delete newCart[productId];
      return newCart;
    });
    toast.success("Cart updated");
  };


  const removeFromCart = (productId) => {
    setCartItem((prev) => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] -= 1;
        if (newCart[productId] <= 0) delete newCart[productId];
      }
      return newCart;
    });
    toast.success("Item removed from cart");
  };

  //  Context value
  const value = {
    user, setUser,
    isAdmin, setIsAdmin,
    isLoggedIn, setIsLoggedIn,
    showUserMenu, setShowUserMenu,
    showLogin, setShowLogin,
    LoginHandler, LogOut,
    products, setProducts,
    searchQuery, setSearchQuery,
    cartItem, setCartItem,
    addToCart, removeFromCart, updateCart,
    getCartAmount, getCartCount,
    myOrders, setMyOrders, addMyOrders,
    navigate, currency, axios,
    fetchSeller, fetchProducts, fetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
