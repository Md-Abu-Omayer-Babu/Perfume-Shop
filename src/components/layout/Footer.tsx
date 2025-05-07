import Link from "next/link";
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Perfume Boutique</h3>
            <p className="text-gray-300 text-sm">
              Discover the perfect fragrance that captures your essence. 
              Our carefully curated collection features premium perfumes from 
              around the world.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="#" className="text-gray-300 hover:text-white">
                <FiInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FiFacebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/help/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-white">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/products" className="hover:text-white">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link href="/products?gender=Men" className="hover:text-white">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/products?gender=Women" className="hover:text-white">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white">
                  Featured Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products?isNew=true" className="hover:text-white">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and fragrance tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white py-2 px-4 pl-10 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Perfume Boutique. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/help/contact" className="text-sm text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;