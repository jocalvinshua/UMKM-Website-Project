import { useAppContext } from "../context/AppContext"
import ProductCard from "../components/ProductCard"

export default function Products() {
  const { products, searchQuery } = useAppContext()

  // filter products by inStock AND searchQuery
  const filteredProducts = products.filter(
    (product) =>
      product.inStock &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mt-16">
      <h2 className="text-2xl md:text-3xl font-medium uppercase">All Product</h2>
      <div className="h-1 w-20 bg-primary mt-2 rounded"></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-gray-500">
            No products found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  )
}
