"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiXCircle, FiShoppingBag, FiHome } from "react-icons/fi";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success") === "true";
  const [orderNumber, setOrderNumber] = useState("");
  
  useEffect(() => {
    // Generate a random order number for demo purposes
    // In a real app, this would come from your backend
    if (success) {
      const randomOrderNum = `PB-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(randomOrderNum);
    }
    
    // If no success parameter is provided, redirect to home
    if (!searchParams.get("success")) {
      router.push("/");
    }
  }, [success, searchParams, router]);

  if (!success) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="rounded-full bg-red-100 h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Failed</h1>
            <p className="text-lg text-gray-600 mb-8">
              There was a problem processing your order. Please try again or contact customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cart" 
                className="bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 inline-flex items-center justify-center"
              >
                <FiShoppingBag className="mr-2" /> Return to Cart
              </Link>
              <Link 
                href="/contact" 
                className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 inline-flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-10 text-center">
            <div className="rounded-full bg-green-100 h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="border border-gray-200 rounded-md p-6 mb-8 max-w-md mx-auto">
              <div className="text-sm text-gray-500 mb-2">Order Number</div>
              <div className="text-xl font-bold text-gray-900 mb-4">{orderNumber}</div>
              
              <div className="text-sm text-gray-500 mb-2">Estimated Delivery</div>
              <div className="text-lg font-medium text-gray-900">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="mb-3 text-sm text-gray-500">Order Status</div>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200"></div>
                  </div>
                  <ul className="relative flex justify-between">
                    <li className="flex flex-col items-center">
                      <div className="bg-purple-700 h-5 w-5 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-900 mt-2">Confirmed</span>
                    </li>
                    <li className="flex flex-col items-center">
                      <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-500 mt-2">Processing</span>
                    </li>
                    <li className="flex flex-col items-center">
                      <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-500 mt-2">Shipped</span>
                    </li>
                    <li className="flex flex-col items-center">
                      <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-500 mt-2">Delivered</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                A receipt has been sent to your email address. You can also view your order details in your account dashboard.
              </p>
              <p className="text-sm text-gray-500">
                If you have any questions about your order, please contact our customer support.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 inline-flex items-center justify-center"
              >
                <FiShoppingBag className="mr-2" /> Continue Shopping
              </Link>
              <Link 
                href="/" 
                className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 inline-flex items-center justify-center"
              >
                <FiHome className="mr-2" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Product Recommendation Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder recommended products - in a real app these would be based on the user's purchase */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mb-4"></div>
                  <h3 className="text-sm font-medium text-gray-900">Recommended Perfume</h3>
                  <p className="text-xs text-gray-500 mb-2">Brand</p>
                  <p className="text-sm font-bold">$89.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}