import { useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ProductList = () => {
  const { products = [], currency, axios, fetchProducts } = useAppContext();

  // Toggle stock status
  const stockToggle = useCallback(
    async (id, inStock) => {
      try {
        const { data } = await axios.post("/api/product/change-stock", {
          id,
          inStock,
        });

        if (data.success) {
          fetchProducts();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    },
    [axios, fetchProducts]
  );

  return (
    <div className="noScrollBar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        {/* Empty State */}
        {products.length === 0 && (
          <p className="text-gray-500 text-sm mt-6">No products found...</p>
        )}

        {products.length > 0 && (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold hidden md:block">
                    Selling Price
                  </th>
                  <th className="px-4 py-3 font-semibold">In Stock</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-gray-500/20"
                  >
                    {/* Product + Image */}
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">{product.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}
                      {product.offerPrice}
                    </td>

                    {/* Toggle */}
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() =>
                            stockToggle(product._id, !product.inStock)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
