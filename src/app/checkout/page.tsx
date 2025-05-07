"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiCreditCard, FiShieldOff, FiLock, FiCheckCircle } from "react-icons/fi";
import { useCart } from "@/components/providers/CartProvider";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const shippingCost = subtotal > 75 ? 0 : 8.99;
  const taxRate = 0.07; // 7% tax rate
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  });
  
  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    fullName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "credit-card",
  });
  
  // Handle changes to the shipping form
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle changes to the billing form
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle changes to the payment form
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox for "billing same as shipping"
  const handleSameAsShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setBillingInfo(prev => ({ 
      ...prev, 
      sameAsShipping: checked,
      fullName: checked ? shippingInfo.fullName : prev.fullName,
      address: checked ? shippingInfo.address : prev.address,
      apartment: checked ? shippingInfo.apartment : prev.apartment,
      city: checked ? shippingInfo.city : prev.city,
      state: checked ? shippingInfo.state : prev.state,
      zipCode: checked ? shippingInfo.zipCode : prev.zipCode,
      country: checked ? shippingInfo.country : prev.country,
    }));
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentInfo(prev => ({ ...prev, paymentMethod: method }));
  };
  
  // Handle form submission for each step
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setFormStep(2);
    
    // If billing is same as shipping, update billing info
    if (billingInfo.sameAsShipping) {
      setBillingInfo(prev => ({
        ...prev,
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        apartment: shippingInfo.apartment,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      }));
    }
  };
  
  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for billing if not same as shipping
    if (!billingInfo.sameAsShipping) {
      if (!billingInfo.fullName || !billingInfo.address || !billingInfo.city || !billingInfo.zipCode) {
        toast.error("Please fill in all required billing fields");
        return;
      }
    }
    
    setFormStep(3);
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (paymentInfo.paymentMethod === "credit-card") {
      if (!paymentInfo.cardNumber || !paymentInfo.nameOnCard || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast.error("Please fill in all payment details");
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      // Simulate API call to process payment and create order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you'd make an API call here to create the order
      /*
      const response = await axios.post("/api/orders", {
        shippingInfo: { ...shippingInfo },
        billingInfo: billingInfo.sameAsShipping ? { ...shippingInfo } : { ...billingInfo },
        paymentMethod: paymentInfo.paymentMethod,
        items: cartItems,
        totalAmount,
        subtotal,
        shippingCost,
        taxAmount,
      });
      */
      
      // Simulate successful order
      toast.success("Order placed successfully!");
      clearCart(); // Clear the cart
      router.push("/checkout/confirmation?success=true");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("There was a problem processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiShieldOff className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2 mb-8">You need to add items to your cart before checking out.</p>
            <Link href="/products" className="inline-flex items-center bg-purple-700 text-white py-3 px-6 rounded-md hover:bg-purple-800 transition-colors">
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex flex-col items-center ${formStep >= 1 ? "text-purple-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${formStep >= 1 ? "bg-purple-100" : "bg-gray-100"}`}>
                {formStep > 1 ? <FiCheckCircle className="h-6 w-6" /> : <span>1</span>}
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            <div className={`w-12 md:w-24 h-1 ${formStep >= 2 ? "bg-purple-700" : "bg-gray-200"} mx-2`}></div>
            <div className={`flex flex-col items-center ${formStep >= 2 ? "text-purple-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${formStep >= 2 ? "bg-purple-100" : "bg-gray-100"}`}>
                {formStep > 2 ? <FiCheckCircle className="h-6 w-6" /> : <span>2</span>}
              </div>
              <span className="text-sm">Billing</span>
            </div>
            <div className={`w-12 md:w-24 h-1 ${formStep >= 3 ? "bg-purple-700" : "bg-gray-200"} mx-2`}></div>
            <div className={`flex flex-col items-center ${formStep >= 3 ? "text-purple-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${formStep >= 3 ? "bg-purple-100" : "bg-gray-100"}`}>
                <span>3</span>
              </div>
              <span className="text-sm">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Column */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              {/* Step 1: Shipping Information */}
              {formStep === 1 && (
                <form onSubmit={handleShippingSubmit}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={shippingInfo.apartment}
                        onChange={handleShippingChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Zip/Postal Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-between">
                    <Link href="/cart" className="text-purple-700 hover:text-purple-900 flex items-center text-sm font-medium">
                      <FiArrowLeft className="mr-2" /> Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="bg-purple-700 text-white py-2 px-6 rounded-md hover:bg-purple-800"
                    >
                      Continue to Billing
                    </button>
                  </div>
                </form>
              )}
              
              {/* Step 2: Billing Information */}
              {formStep === 2 && (
                <form onSubmit={handleBillingSubmit}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={billingInfo.sameAsShipping}
                          onChange={handleSameAsShippingChange}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Billing address is the same as shipping address
                        </span>
                      </label>
                    </div>
                    
                    {!billingInfo.sameAsShipping && (
                      <>
                        {/* Billing Address */}
                        <div>
                          <label htmlFor="billing-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="billing-fullName"
                            name="fullName"
                            value={billingInfo.fullName}
                            onChange={handleBillingChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="billing-address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            id="billing-address"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="billing-apartment" className="block text-sm font-medium text-gray-700 mb-1">
                            Apartment, suite, etc. (optional)
                          </label>
                          <input
                            type="text"
                            id="billing-apartment"
                            name="apartment"
                            value={billingInfo.apartment}
                            onChange={handleBillingChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="billing-city" className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              id="billing-city"
                              name="city"
                              value={billingInfo.city}
                              onChange={handleBillingChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="billing-state" className="block text-sm font-medium text-gray-700 mb-1">
                              State/Province *
                            </label>
                            <input
                              type="text"
                              id="billing-state"
                              name="state"
                              value={billingInfo.state}
                              onChange={handleBillingChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="billing-zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                              Zip/Postal Code *
                            </label>
                            <input
                              type="text"
                              id="billing-zipCode"
                              name="zipCode"
                              value={billingInfo.zipCode}
                              onChange={handleBillingChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="billing-country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            id="billing-country"
                            name="country"
                            value={billingInfo.country}
                            onChange={handleBillingChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="text-purple-700 hover:text-purple-900 flex items-center text-sm font-medium"
                    >
                      <FiArrowLeft className="mr-2" /> Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-700 text-white py-2 px-6 rounded-md hover:bg-purple-800"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}
              
              {/* Step 3: Payment Information */}
              {formStep === 3 && (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col space-y-3">
                      <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentInfo.paymentMethod === "credit-card"}
                          onChange={() => handlePaymentMethodChange("credit-card")}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">Credit / Debit Card</span>
                          <div className="flex gap-2 mt-1">
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentInfo.paymentMethod === "paypal"}
                          onChange={() => handlePaymentMethodChange("paypal")}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">PayPal</span>
                      </label>
                    </div>

                    {paymentInfo.paymentMethod === "credit-card" && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              value={paymentInfo.cardNumber}
                              onChange={handlePaymentChange}
                              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiCreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            value={paymentInfo.nameOnCard}
                            onChange={handlePaymentChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={paymentInfo.expiryDate}
                              onChange={handlePaymentChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              maxLength={4}
                              value={paymentInfo.cvv}
                              onChange={handlePaymentChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="flex items-center">
                        <FiLock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Your payment information is secure and encrypted</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="text-purple-700 hover:text-purple-900 flex items-center text-sm font-medium"
                    >
                      <FiArrowLeft className="mr-2" /> Back to Billing
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-purple-700 text-white py-2 px-6 rounded-md hover:bg-purple-800 flex items-center justify-center min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="max-h-64 overflow-auto mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item._id}-${item.size}`} className="flex mb-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden relative mr-4">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.brand} • {item.size}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
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

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}