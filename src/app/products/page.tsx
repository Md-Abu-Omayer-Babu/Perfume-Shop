"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { FiFilter, FiX, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  gender: string;
  category: string;
  sizes: string[];
  images: string[];
  rating: number;
  featured: boolean;
  isNew: boolean;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [genderFilter, setGenderFilter] = useState(searchParams.get("gender") || "");
  const [brandFilter, setBrandFilter] = useState(searchParams.get("brand") || "");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  
  // Available filter options - would come from API in production
  const brands = ["Chanel", "Dior", "Gucci", "Tom Ford", "Yves Saint Laurent", "Jo Malone", "Versace"];
  const categories = ["Eau de Parfum", "Eau de Toilette", "Cologne", "Body Mist"];
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, genderFilter, brandFilter, priceRange, sortBy, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const search = searchParams.get("search") || "";
      const featured = searchParams.get("featured") || "";
      const isNew = searchParams.get("isNew") || "";
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (genderFilter) queryParams.append("gender", genderFilter);
      if (brandFilter) queryParams.append("brand", brandFilter);
      if (featured) queryParams.append("featured", featured);
      if (isNew) queryParams.append("isNew", isNew);
      if (sortBy) queryParams.append("sort", sortBy);
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "12");
      
      const response = await axios.get(`/api/products?${queryParams.toString()}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    // In a real app, you'd add to cart using context/redux
    toast.success(`${product.name} added to cart!`);
  };

  const resetFilters = () => {
    setGenderFilter("");
    setBrandFilter("");
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("");
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {genderFilter 
              ? `${genderFilter}'s Perfumes` 
              : searchParams.get("featured") 
                ? "Featured Fragrances" 
                : searchParams.get("isNew") 
                  ? "New Arrivals" 
                  : "All Perfumes"
            }
          </h1>
          <p className="text-gray-600 mt-2">
            Discover luxury fragrances that resonate with your personal style
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear all
                </button>
              </div>
              
              {/* Gender Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Gender</h4>
                <div className="space-y-2">
                  {["Men", "Women", "Unisex"].map((gender) => (
                    <div key={gender} className="flex items-center">
                      <input
                        id={`gender-${gender}`}
                        name="gender"
                        type="radio"
                        checked={genderFilter === gender}
                        onChange={() => setGenderFilter(gender)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`gender-${gender}`} className="ml-3 text-sm text-gray-700">
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        name="brand"
                        type="checkbox"
                        checked={brandFilter === brand}
                        onChange={() => setBrandFilter(brandFilter === brand ? "" : brand)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-700">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">${priceRange.min}</span>
                  <span className="text-sm text-gray-600">${priceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2"
                />
              </div>
              
              {/* Sort By */}
              <div>
                <h4 className="font-medium mb-3">Sort By</h4>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={toggleFilters}
            className="fixed bottom-6 left-6 z-50 lg:hidden bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-800"
          >
            {filterOpen ? <FiX size={24} /> : <FiFilter size={24} />}
          </button>
          
          {/* Mobile Filter Overlay */}
          {filterOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button onClick={toggleFilters}>
                    <FiX size={24} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Same filters as desktop, just in the mobile overlay */}
                {/* Gender Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Gender</h4>
                  <div className="space-y-2">
                    {["Men", "Women", "Unisex"].map((gender) => (
                      <div key={gender} className="flex items-center">
                        <input
                          id={`mobile-gender-${gender}`}
                          name="mobile-gender"
                          type="radio"
                          checked={genderFilter === gender}
                          onChange={() => setGenderFilter(gender)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`mobile-gender-${gender}`} className="ml-3 text-sm text-gray-700">
                          {gender}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Brands</h4>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          id={`mobile-brand-${brand}`}
                          name="mobile-brand"
                          type="checkbox"
                          checked={brandFilter === brand}
                          onChange={() => setBrandFilter(brandFilter === brand ? "" : brand)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`mobile-brand-${brand}`} className="ml-3 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">${priceRange.min}</span>
                    <span className="text-sm text-gray-600">${priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2"
                  />
                </div>
                
                {/* Sort By */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      fetchProducts();
                      toggleFilters();
                    }}
                    className="flex-1 bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      resetFilters();
                      toggleFilters();
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                      <Link href={`/products/${product._id}`} className="block relative h-64">
                        {product.featured && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            Featured
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            New
                          </div>
                        )}
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
                      </Link>
                      <div className="p-4">
                        <Link href={`/products/${product._id}`} className="block">
                          <h3 className="text-lg font-semibold mb-1 hover:text-purple-700 transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                        <div className="mb-3">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${
                                  i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            aria-label="Add to cart"
                          >
                            <FiShoppingCart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === index + 1
                              ? "bg-purple-700 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}