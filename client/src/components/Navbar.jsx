import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { useState,useEffect } from "react"
import { useAppContext } from "../context/AppContext"

const Navbar = () => {
    const { 
        setShowLogin,
        searchQuery, 
        setSearchQuery, 
        navigate, 
        user, 
        isLoggedIn, 
        showUserMenu, 
        setShowUserMenu,
        getCartCount,
        LogOut
    
    } = useAppContext();

    const handleOpenLogin = () => {
        setShowLogin(true);
    };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        if(searchQuery.length > 0){
            navigate('/product')
        }
    },[searchQuery]);

    const publicNavLinks = [
        { to: "/", text: "Home" },
        { to: "/product", text: "All Product" },
        { to: "/aboutUs", text: "About Us" },
    ]

    // Use a single function to toggle the mobile menu state.
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    // Use a single function to toggle the user menu dropdown state.
    const toggleUserMenu = () => {
        setShowUserMenu((prev) => !prev)
    }

    const handleLogOut = () => {
        LogOut();
        setShowUserMenu(false)
        // Note: For a real app, do not set isLoggedIn directly from here.
        // The AppContext should handle authentication state changes.
    }

    // A helper function for the NavLink class to apply active styling.
    const getNavLinkClass = ({ isActive }) =>
        `transition hover:text-primary ${
            isActive ? "text-primary font-semibold" : "text-gray-700"
        }`

    
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b bg-navbar relative transition-all">
            {/* Logo linked to the home page */}
            <NavLink to="/">
                <img className="w-32 sm:w-40" src={assets.logo} alt="Website Logo" />
            </NavLink>

            {/* Main navigation menu for both desktop and mobile */}
            <div
                className={`flex-col items-start sm:flex sm:flex-row sm:items-center sm:gap-8 text-sm ${
                    isMobileMenuOpen
                        ? "flex absolute top-[60px] left-0 w-full bg-white shadow-md py-4 px-5 z-20"
                        : "hidden"
                }`}
            >
                {/* Map over public links */}
                {publicNavLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        // Close mobile menu on link click
                        onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                        className={({ isActive }) =>
                            `${getNavLinkClass({ isActive })} ${isMobileMenuOpen ? "w-full py-2 border-b border-gray-200" : ""}`
                        }
                    >
                        {link.text}
                    </NavLink>
                ))}

                {/* Search bar, only visible on large screens */}
                <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=> setSearchQuery(e.target.value)}className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img className="w-4 h-4 cursor-pointer" src={assets.search_icon} alt="Search Icon" />
                </div>

                {/* Shopping cart icon */}  
                <div className="relative cursor-pointer">
                    <img onClick={() => navigate("/cart")}
                    
                    className="w-6 h-6" src={assets.cart_icon} alt="Shopping Cart" />
                    <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">{getCartCount()}</span>
                </div>

                {isLoggedIn ? (
                    <div className="relative">
                        <img
                          onClick={toggleUserMenu}
                          className="w-8 h-8 rounded-full cursor-pointer"
                          src={assets.profile_icon}
                          alt="User Profile"
                        />
                        {showUserMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <NavLink to="/my-orders">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                My Orders
                              </button>
                            </NavLink>
                            <button
                              onClick={handleLogOut}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </div>
                    )}
  </div>
) : (
  <button
    onClick={handleOpenLogin}
    className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
  >
    Login
  </button>
)}

            </div>

            {/* Mobile menu button, only visible on small screens */}
            <button
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="sm:hidden"
            >
                <img className="w-6 h-6" src={isMobileMenuOpen ? assets.close : assets.menu_icon} alt="Menu" />
            </button>
        </nav>
    )
}

export default Navbar;
