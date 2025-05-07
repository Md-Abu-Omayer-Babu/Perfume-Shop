"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search results page
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-purple-800">
              Perfume Boutique
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                Home
              </Link>
              <Link href="/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                Perfumes
              </Link>
              <Link href="/products?gender=Men" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                Men
              </Link>
              <Link href="/products?gender=Women" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                Women
              </Link>
              <Link href="/products?featured=true" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                Featured
              </Link>
            </div>
          </div>

          {/* Search Form */}
          <div className="hidden sm:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
            <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search perfumes..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
            </form>
          </div>

          {/* User Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/cart" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
              <FiShoppingCart className="h-6 w-6" />
            </Link>

            {session ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    id="user-menu"
                    aria-haspopup="true"
                  >
                    <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>
                </div>
                <div className="flex space-x-2 ml-2">
                  {session.user?.isAdmin && (
                    <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-800">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-700 text-white hover:bg-purple-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              Home
            </Link>
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              Perfumes
            </Link>
            <Link href="/products?gender=Men" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              Men
            </Link>
            <Link href="/products?gender=Women" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              Women
            </Link>
            <Link href="/products?featured=true" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              Featured
            </Link>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search perfumes..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
            </form>

            <Link href="/cart" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
              <FiShoppingCart className="h-5 w-5 mr-2" /> Cart
            </Link>

            {/* Authentication links for mobile */}
            {session ? (
              <>
                <div className="px-3 py-2 rounded-md text-base font-medium text-gray-700">
                  {session.user?.name}
                </div>
                {session.user?.isAdmin && (
                  <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800">
                  Sign In
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-purple-700 text-white hover:bg-purple-800">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;