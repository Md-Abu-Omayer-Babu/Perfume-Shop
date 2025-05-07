"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiArrowRight, FiArrowLeft, FiTrash2, FiLock } from "react-icons/fi";
import { useCart } from "@/components/providers/CartProvider";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  
  const shippingCost = subtotal > 75 ? 0 : 8.99;
  const taxRate = 0.07; // 7% tax rate
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;

  const handleUpdateQuantity = (id: string, size: string, newQuantity: number) => {
    updateQuantity(id, size, newQuantity);
  };

  const handleRemoveItem = (id: string, size: string) => {
    removeFromCart(id, size);
  };

  const confirmClearCart = () => {
    if (isRemovingAll) {
      clearCart();
      setIsRemovingAll(false);
    } else {
      setIsRemovingAll(true);
    }
  };

  // Close the confirmation modal if user clicks away
  const handleCancelRemoveAll = () => {
    setIsRemovingAll(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">Looks like you haven't added any perfumes to your cart yet.</p>
            </div>
            <Link href="/products" className="inline-flex items-center bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 transition-colors">
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items ({totalItems})</h2>
                    <button
                      onClick={confirmClearCart}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <FiTrash2 className="mr-1" /> Remove All
                    </button>
                  </div>
                </div>

                {/* Confirmation Modal */}
                {isRemovingAll && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelRemoveAll}>
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Remove all items?</h3>
                      <p className="text-gray-600 mb-6">Are you sure you want to remove all items from your cart? This action cannot be undone.</p>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelRemoveAll}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={clearCart}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Remove All
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart Items List */}
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={`${item._id}-${item.size}`} className="p-6 flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 relative">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 768px) 100vw, 96px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 sm:ml-6 flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.brand} • {item.size}</p>
                          <p className="text-lg font-medium text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center mt-4 sm:mt-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center mr-6">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.size, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <div className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.size, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id, item.size)}
                            className="text-gray-400 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Continue Shopping */}
                <div className="p-6 border-t border-gray-200">
                  <Link href="/products" className="text-purple-700 hover:text-purple-900 flex items-center text-sm font-medium">
                    <FiArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span className="text-gray-900 font-medium">${shippingCost.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">${taxAmount.toFixed(2)}</span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="text-sm text-gray-500 pt-2">
                      <p>Free shipping on orders over $75</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link 
                    href="/checkout" 
                    className="w-full mt-6 bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 flex items-center justify-center font-medium"
                  >
                    Proceed to Checkout <FiArrowRight className="ml-2" />
                  </Link>

                  {/* Payment Options */}
                  <div className="mt-6">
                    <div className="flex items-center justify-center mb-3">
                      <FiLock className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Secure Checkout</span>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}