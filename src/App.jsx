import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home.jsx"
import Products from "./pages/Products.jsx"
import NotFound from "./pages/NotFound.jsx"
import Cart from "./pages/Cart.jsx"
import CheckOut from "./pages/CheckOut.jsx"
import Contact from "./pages/Contact.jsx"
import Navbar from "./components/Navbar.jsx"
// import ProductsDetails from "./pages/ProductsDetails.jsx"

export default function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product" element={<Products/>}/>
        {/* <Route path="/product/:id" element={<ProductsDetails/>}/> */}
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/CheckOut" element={<CheckOut/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}