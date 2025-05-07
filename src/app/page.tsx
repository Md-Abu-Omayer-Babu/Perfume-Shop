import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-r from-purple-900 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center h-full text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
              Discover Your <br /> Signature Scent
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-lg">
              Explore our exclusive collection of luxury perfumes crafted for the modern connoisseur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium text-lg transition duration-300 inline-flex items-center"
              >
                Shop Now <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                href="/products?featured=true" 
                className="bg-transparent hover:bg-white/10 border border-white text-white px-8 py-3 rounded-md font-medium text-lg transition duration-300"
              >
                Featured Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative h-80 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <Image
                src="/images/men-category.jpg" 
                alt="Men's Perfumes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">For Him</h3>
                  <Link 
                    href="/products?gender=Men" 
                    className="inline-block bg-white text-purple-800 px-6 py-2 rounded-md font-medium hover:bg-purple-800 hover:text-white transition duration-300"
                  >
                    Shop Men
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative h-80 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <Image
                src="/images/women-category.jpg" 
                alt="Women's Perfumes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">For Her</h3>
                  <Link 
                    href="/products?gender=Women" 
                    className="inline-block bg-white text-purple-800 px-6 py-2 rounded-md font-medium hover:bg-purple-800 hover:text-white transition duration-300"
                  >
                    Shop Women
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative h-80 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <Image
                src="/images/unisex-category.jpg" 
                alt="Unisex Perfumes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Unisex</h3>
                  <Link 
                    href="/products?gender=Unisex" 
                    className="inline-block bg-white text-purple-800 px-6 py-2 rounded-md font-medium hover:bg-purple-800 hover:text-white transition duration-300"
                  >
                    Shop Unisex
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Fragrances</h2>
            <Link 
              href="/products?featured=true" 
              className="text-purple-700 hover:text-purple-900 inline-flex items-center font-medium"
            >
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* This would normally come from the backend */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative h-64">
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">Luxury Perfume</h3>
                  <p className="text-gray-600 text-sm mb-2">Brand Name</p>
                  <div className="mb-3">
                    <span className="font-bold text-lg">$99.99</span>
                  </div>
                  <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-gray-500">J</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jessica T.</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"I've received so many compliments since I started wearing this perfume. The fragrance lasts all day and the packaging is absolutely beautiful!"</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-gray-500">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael K.</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The customer service was excellent! They helped me find the perfect scent for my style. Fast shipping and the bottle is exactly as pictured."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-gray-500">A</span>
                </div>
                <div>
                  <h4 className="font-semibold">Amelia R.</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The fragrance selection is incredible. I love that they provide detailed notes for each perfume. I found my new signature scent and couldn't be happier!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Newsletter</h2>
            <p className="text-purple-200 mb-8">Subscribe to get special offers, free giveaways, and exclusive deals on our premium fragrances.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
