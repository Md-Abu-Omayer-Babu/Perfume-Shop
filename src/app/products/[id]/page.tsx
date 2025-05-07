"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FiArrowLeft, FiShoppingBag, FiStar, FiShare2, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  gender: string;
  category: string;
  sizes: string[];
  fragranceNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  images: string[];
  countInStock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  isNew: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product details");
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    // In a real app, you'd check against inventory
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    // In a real app, you'd add to cart using context/redux
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleToggleWishlist = () => {
    setWishlistAdded(!wishlistAdded);
    toast.success(
      wishlistAdded
        ? "Removed from your wishlist!"
        : "Added to your wishlist!"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-4 rounded-md w-full max-w-md">
          <p className="text-red-800 text-center">{error || "Product not found"}</p>
          <div className="mt-4 text-center">
            <Link
              href="/products"
              className="bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-700">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-purple-700">
              Perfumes
            </Link>
            <span className="mx-2">›</span>
            <Link href={`/products?gender=${product.gender}`} className="hover:text-purple-700">
              {product.gender}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden mb-4">
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  New
                </div>
              )}
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === index
                        ? "ring-2 ring-purple-700"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="mb-2">
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-purple-700 text-sm hover:text-purple-800"
              >
                {product.brand}
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating) ? "fill-current" : ""
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">{product.numReviews} reviews</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Fragrance Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fragrance Notes</h3>
              <div className="flex flex-wrap gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Top Notes</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm">
                    {product.fragranceNotes?.top?.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Heart Notes</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm">
                    {product.fragranceNotes?.middle?.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Base Notes</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm">
                    {product.fragranceNotes?.base?.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`border px-4 py-2 rounded-md text-sm ${
                      selectedSize === size
                        ? "border-purple-700 bg-purple-50 text-purple-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart & Wishlist */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 flex items-center justify-center"
              >
                <FiShoppingBag className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`py-3 px-4 rounded-md flex items-center justify-center ${
                  wishlistAdded
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiHeart className={wishlistAdded ? "fill-current" : ""} />
              </button>
              <button
                onClick={handleShare}
                className="py-3 px-4 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
              >
                <FiShare2 />
              </button>
            </div>
            
            {/* Additional Info */}
            <div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">Details & Shipping</h3>
                </div>
                <div className="pt-3">
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Gender: {product.gender}</li>
                    <li>Category: {product.category}</li>
                    <li>Free shipping on all domestic orders over $75</li>
                    <li>International shipping available</li>
                    <li>30-day returns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products - would be implemented with actual data in production */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Placeholder items */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative h-60">
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">Related Perfume</h3>
                  <p className="text-gray-600 text-sm mb-2">Brand</p>
                  <div className="mb-2">
                    <span className="font-bold">$89.99</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}