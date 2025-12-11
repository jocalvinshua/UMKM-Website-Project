import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, cartItem, addToCart, removeFromCart, updateCart, navigate } =
    useAppContext();

  if (!product) return null;

  // --- SAFE CATEGORY HANDLING ---
  // Category bisa berbentuk: string / object / array / null
  const category = (() => {
    if (typeof product.category === "string") {
      return product.category.toLowerCase();
    }
    if (Array.isArray(product.category) && product.category.length > 0) {
      return String(product.category[0]).toLowerCase();
    }
    if (typeof product.category === "object" && product.category !== null) {
      return String(
        product.category.value ||
          product.category.name ||
          Object.values(product.category)[0]
      ).toLowerCase();
    }
    return "unknown";
  })();

  const goToDetails = () => {
    navigate(`/product/${category}/${product._id}`);
    scrollTo(0, 0);
  };

  return (
    <div
      onClick={goToDetails}
      className="border border-gray-200 rounded-lg md:px-4 px-3 py-3 bg-white min-w-56 max-w-56 w-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Product Image */}
      <div className="group flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition-transform max-w-26 md:max-w-36"
          src={product.image}
          alt={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="text-gray-500/70 text-sm mt-2">
        <p>{product.category?.name || product.category?.value || product.category}</p>

        <p className="text-gray-800 font-medium text-lg truncate w-full">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                src={
                  product.rating > i ? assets.star_icon : assets.star_dull_icon
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          <p className="ml-1 text-xs text-gray-500">
            ({product.rating || 0})
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-semibold text-primary">
            {currency}
            {product.offerPrice}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through font-normal">
              {currency}
              {product.price}
            </span>
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItem[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/30 md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium hover:bg-primary/20 transition"
              >
                <img src={assets.cart_icon} alt="cart" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/20 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full hover:text-primary-dark"
                >
                  -
                </button>
                <span className="w-5 text-center">
                  {cartItem[product._id]}
                </span>
                <button
                  onClick={() =>
                    updateCart(product._id, cartItem[product._id] + 1)
                  }
                  className="cursor-pointer text-md px-2 h-full hover:text-primary-dark"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
