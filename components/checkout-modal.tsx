"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CartItem,
  CheckoutModalProps,
  formatGramDisplay,
} from "@/lib/products";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  MapPin,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface KhaltiPayload {
  pidx?: string;
  idx?: string;
  token?: string;
  amount?: number;
  mobile?: string;
  product_identity?: string;
  product_name?: string;
}

interface KhaltiError {
  message?: string;
  code?: string;
}

declare global {
  interface Window {
    KhaltiCheckout?: {
      new (config: unknown): {
        show: (options: { amount: number }) => void;
      };
    };
  }
}

// Shipping rates by location (NPR)
const SHIPPING_RATES: Record<string, { rate: number; label: string }> = {
  kathmandu: { rate: 100, label: "Kathmandu Valley" },
  lalitpur: { rate: 100, label: "Lalitpur" },
  bhaktapur: { rate: 100, label: "Bhaktapur" },
  pokhara: { rate: 150, label: "Pokhara" },
  other: { rate: 200, label: "Other Locations" },
};

// Tax rate (13% VAT in Nepal)
const TAX_RATE = 0.13;

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  total,
  singleProduct,
}: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    location: "kathmandu",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  // Compute effective cart items and total based on props
  const effectiveCartItems: CartItem[] = singleProduct
    ? [singleProduct]
    : cartItems || [];

  const effectiveSubtotal = singleProduct
    ? (singleProduct.calculatedPrice || singleProduct.nrsPrice) *
      (singleProduct.quantity || 1)
    : total || 0;

  // Calculate order summary with shipping and tax
  const calculateOrderSummary = useCallback(() => {
    const shippingRate =
      SHIPPING_RATES[customerInfo.location]?.rate || SHIPPING_RATES.other.rate;
    const tax = Math.round(effectiveSubtotal * TAX_RATE);
    const shipping = shippingCalculated ? shippingRate : 0;
    const finalTotal = effectiveSubtotal + tax + shipping;

    setOrderSummary({
      subtotal: effectiveSubtotal,
      shipping,
      tax,
      discount: 0,
      total: finalTotal,
    });
  }, [effectiveSubtotal, customerInfo.location, shippingCalculated]);

  useEffect(() => {
    calculateOrderSummary();
  }, [calculateOrderSummary]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setPaymentError(null);
      setValidationErrors({});
      // Show success toast for modal opening
      toast.success("Checkout Ready", {
        description: "Please fill in your details to complete your order",
        duration: 3000,
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Load Khalti SDK with retry mechanism
  const loadKhaltiSDK = useCallback(async () => {
    if (typeof window === "undefined" || window.KhaltiCheckout) return;

    const maxRetries = 3;
    let retries = 0;

    const loadScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2024.4.22.0.0.0/khalti-checkout.iffe.js";
        script.async = true;
        script.onload = () => {
          console.log("Khalti SDK loaded successfully");
          resolve();
        };
        script.onerror = () => {
          reject(new Error("Failed to load Khalti SDK"));
        };
        document.body.appendChild(script);
      });
    };

    while (retries < maxRetries) {
      try {
        await loadScript();
        return;
      } catch (err) {
        retries++;
        console.error(`Khalti SDK load attempt ${retries} failed:`, err);
        if (retries >= maxRetries) {
          setPaymentError(
            "Failed to load payment gateway. Please refresh the page or try again later.",
          );
          showErrorToast(
            "Payment gateway unavailable. Please refresh the page.",
          );
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadKhaltiSDK();
    }
  }, [isOpen, loadKhaltiSDK]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Auto-calculate shipping when location changes
    if (name === "location") {
      setShippingCalculated(true);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!customerInfo.name.trim()) {
      errors.name = "Full name is required";
    } else if (customerInfo.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!customerInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!customerInfo.address.trim()) {
      errors.address = "Delivery address is required";
    } else if (customerInfo.address.trim().length < 10) {
      errors.address =
        "Please enter a complete address (at least 10 characters)";
    }

    if (!customerInfo.city.trim()) {
      errors.city = "City is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      duration: 5000,
    });
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 5000,
    });
  };

  const handleKhaltiPayment = async () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (effectiveCartItems.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      // Check if Khalti is available
      if (!window.KhaltiCheckout) {
        throw new Error(
          "Payment gateway is not loaded. Please refresh the page.",
        );
      }

      // Khalti configuration
      const config = {
        publicKey:
          process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY ||
          "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
        productIdentity: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productName: "SUNYA Premium Products",
        productUrl: window.location.origin,
        amount: orderSummary.total * 100, // Amount in paisa
        return_url: `${window.location.origin}/checkout/result`,
        website_url: window.location.origin,
        purchase_order_id: `order_${Date.now()}`,
        purchase_order_name: "SUNYA Premium Products Order",
        customer_info: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        eventHandler: {
          onSuccess: (payload: KhaltiPayload) => {
            console.log("Payment success:", payload);
            setIsPaymentLoading(false);
            showSuccessToast("Payment successful! Order confirmed.");

            // Store order details in session storage for result page
            sessionStorage.setItem(
              "lastOrder",
              JSON.stringify({
                orderId: payload.pidx || payload.idx,
                amount: orderSummary.total,
                items: effectiveCartItems,
                customer: customerInfo,
                timestamp: Date.now(),
              }),
            );

            onClose();
            // Redirect to success page
            window.location.href = `/checkout/result?status=success&transaction_id=${payload.pidx || payload.idx}`;
          },
          onError: (error: KhaltiError) => {
            console.error("Payment error:", error);
            setIsPaymentLoading(false);
            const errorMessage =
              error?.message || "Payment failed. Please try again.";
            setPaymentError(errorMessage);
            showErrorToast(errorMessage);
          },
          onClose: () => {
            console.log("Payment widget closed");
            setIsPaymentLoading(false);
          },
        },
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
      };

      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: orderSummary.total * 100 });
    } catch (error: unknown) {
      console.error("Payment initialization error:", error);
      setIsPaymentLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize payment. Please try again.";
      setPaymentError(errorMessage);
      showErrorToast(errorMessage);
    }
  };

  const handleEsewaPayment = async () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (effectiveCartItems.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      // Store order details for result page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: `esewa_${Date.now()}`,
          amount: orderSummary.total,
          items: effectiveCartItems,
          customer: customerInfo,
          timestamp: Date.now(),
        }),
      );

      // eSewa configuration
      const esewaConfig = {
        amt: orderSummary.subtotal,
        psc: orderSummary.shipping,
        pdc: 0,
        txAmt: orderSummary.tax,
        tAmt: orderSummary.total,
        pid: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        scd: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || "EPAYTEST",
        su: `${window.location.origin}/checkout/result?status=success&gateway=esewa`,
        fu: `${window.location.origin}/checkout/result?status=failed&gateway=esewa`,
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        process.env.NEXT_PUBLIC_ESEWA_URL ||
        "https://uat.esewa.com.np/epay/main";

      Object.keys(esewaConfig).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = esewaConfig[key as keyof typeof esewaConfig].toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: unknown) {
      console.error("eSewa payment error:", error);
      setIsPaymentLoading(false);
      showErrorToast("Failed to process eSewa payment. Please try again.");
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateForm()) {
      showErrorToast("Please fill in all required fields correctly");
      return;
    }

    if (effectiveCartItems.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    setIsPaymentLoading(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store order details
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: `cod_${Date.now()}`,
          amount: orderSummary.total,
          items: effectiveCartItems,
          customer: customerInfo,
          timestamp: Date.now(),
          paymentMethod: "Cash on Delivery",
        }),
      );

      showSuccessToast("Order placed successfully! You will pay on delivery.");
      setIsPaymentLoading(false);
      onClose();
      window.location.href = "/checkout/result?status=success&gateway=cod";
    } catch (error) {
      setIsPaymentLoading(false);
      showErrorToast("Failed to place order. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPaymentLoading) {
          onClose();
        }
      }}
    >
      <Card
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white text-black transition-transform duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-black">Secure Checkout</h2>
          <button
            onClick={() => !isPaymentLoading && onClose()}
            className="hover:bg-gray-100 p-1 rounded disabled:opacity-50"
            disabled={isPaymentLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Payment Error</p>
                <p className="text-red-600 text-sm">{paymentError}</p>
                <button
                  onClick={() => {
                    setPaymentError(null);
                    loadKhaltiSDK();
                  }}
                  className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium underline"
                >
                  Retry Loading Payment Gateway
                </button>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-black mb-3">Order Summary</h3>
            {effectiveCartItems.length > 0 ? (
              <>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  {effectiveCartItems.map((item) => {
                    const itemPrice =
                      item.calculatedPrice || item.nrsPrice || 0;
                    const itemTotal = itemPrice * (item.quantity || 1);
                    const gramDisplay = item.selectedGrams
                      ? ` (${formatGramDisplay(item.selectedGrams)})`
                      : "";

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.name}
                          {gramDisplay} x{item.quantity || 1}
                        </span>
                        <span className="font-medium">
                          NPR {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>NPR {orderSummary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (13%)</span>
                    <span>NPR {orderSummary.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingCalculated
                        ? `NPR ${orderSummary.shipping.toLocaleString()}`
                        : "Calculated below"}
                    </span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-NPR {orderSummary.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-black text-lg">
                    <span>Total</span>
                    <span>NPR {orderSummary.total.toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-red-500">No items to checkout.</p>
            )}
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Information
            </h3>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-black mb-2"
              >
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className={`bg-white border-gray-300 text-black placeholder:text-gray-500 ${
                  validationErrors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                placeholder="Enter your full name"
                disabled={isPaymentLoading}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 text-black placeholder:text-gray-500 ${
                    validationErrors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="your@email.com"
                  disabled={isPaymentLoading}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 text-black placeholder:text-gray-500 ${
                    validationErrors.phone
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="98XXXXXXXX"
                  disabled={isPaymentLoading}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-black mb-2"
              >
                Delivery Location *
              </label>
              <select
                id="location"
                name="location"
                value={customerInfo.location}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FF6900] focus:border-transparent"
                disabled={isPaymentLoading}
              >
                {Object.entries(SHIPPING_RATES).map(
                  ([key, { label, rate }]) => (
                    <option key={key} value={key}>
                      {label} (NPR {rate})
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-black mb-2"
              >
                City *
              </label>
              <Input
                id="city"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                className={`bg-white border-gray-300 text-black placeholder:text-gray-500 ${
                  validationErrors.city
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                placeholder="e.g., Kathmandu"
                disabled={isPaymentLoading}
              />
              {validationErrors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-black mb-2"
              >
                Delivery Address *
              </label>
              <Input
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                className={`bg-white border-gray-300 text-black placeholder:text-gray-500 ${
                  validationErrors.address
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                placeholder="Street address, landmark, house number"
                disabled={isPaymentLoading}
              />
              {validationErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.address}
                </p>
              )}
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </h3>

            <Button
              onClick={handleKhaltiPayment}
              disabled={isPaymentLoading || effectiveCartItems.length === 0}
              className="w-full text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: "linear-gradient(135deg, #5C2D91 0%, #7B3FA0 100%)",
                boxShadow: "0 4px 15px rgba(92, 45, 145, 0.3)",
              }}
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with Khalti
                </>
              )}
            </Button>

            <Button
              onClick={handleEsewaPayment}
              disabled={isPaymentLoading || effectiveCartItems.length === 0}
              className="w-full text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: "linear-gradient(135deg, #60BB46 0%, #7BC142 100%)",
                boxShadow: "0 4px 15px rgba(96, 187, 70, 0.3)",
              }}
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with eSewa
                </>
              )}
            </Button>

            <Button
              onClick={handleCashOnDelivery}
              disabled={isPaymentLoading || effectiveCartItems.length === 0}
              variant="outline"
              className="w-full py-3 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 mr-2" />
                  Cash on Delivery
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center">
            Your payment information is processed securely. We do not store your
            payment details.
          </p>
        </div>
      </Card>
    </div>
  );
}
