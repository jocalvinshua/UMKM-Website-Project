import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

export default function ProductCategory() {
    const { products } = useAppContext();
      const { category } = useParams();
    
      // safe category lookup
      const searchCategory = categories.find(
        (item) => item.path?.toLowerCase() === category
      );
  
      // FIXED: normalize product.category
      const filteredProducts = products.filter((product) => {
        let cat = product.category;
    
        // if category is array, take first one
        if (Array.isArray(cat)) {
          cat = cat[0];
        }
    
        // if null/undefined, make empty
        cat = String(cat || "").toLowerCase();
    
        return cat === category;
      });
  
      return (
        <div className="mt-16">
          {searchCategory && (
            <div className="flex flex-col items-end w-max">
              <h2 className="text-2xl font-medium">
                {searchCategory.text.toUpperCase()}
              </h2>
              <div className="w-16 h-0.5 bg-primary rounded-full"></div>
            </div>
          )}
    
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-2xl font-medium text-primary">
                No Product In This Category
              </p>
            </div>
          )}
        </div>
      );
}
