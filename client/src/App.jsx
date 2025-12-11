import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Footer from "./components/Footer.jsx"
import { useAppContext } from "./context/AppContext.jsx"
import Login from "./components/Login.jsx"
import Products from "./pages/Products.jsx"
import ProductCategory from "./pages/ProductCategory.jsx"
import ProductDetails from "./pages/ProductDetails.jsx"
import Cart from "./pages/Cart.jsx"
import AddAddress from "./pages/AddAddress.jsx"
import MyOrders from "./pages/MyOrders.jsx"
import SellerLogin from "./components/seller/SellerLogin.jsx"
import SellerLayout from "./pages/Seller/SellerLayout.jsx"
import AddProduct from "./pages/Seller/AddProduct.jsx"
import ProductList from "./pages/Seller/ProductList.jsx"
import Orders from "./pages/Seller/Orders.jsx"

const App = () => {
  const isAdminPage = useLocation().pathname.startsWith("/admin")
  const { showLogin, isAdmin } = useAppContext()

  return (
    <div className="min-h-screen text-gray-700 bg-white">
      {showLogin && <Login />}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Only render Navbar + Footer if NOT admin page */}
      {!isAdminPage && <Navbar />}

      <div className="px-4 md:px-16 xl:px-24">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={isAdmin ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  )
}

export default App
