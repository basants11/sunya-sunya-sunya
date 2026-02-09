"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Home,
  Loader2,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetails {
  orderId: string;
  amount: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    calculatedPrice?: number;
    nrsPrice?: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  timestamp: number;
  paymentMethod?: string;
}

export default function ResultClient() {
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const status = params.get("status");
  const transactionId = params.get("transaction_id") || params.get("refId");
  const gateway = params.get("gateway");

  useEffect(() => {
    // Simulate processing time for better UX
    const timer = setTimeout(() => {
      // Try to get order details from session storage
      const storedOrder = sessionStorage.getItem("lastOrder");
      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          setOrderDetails(parsed);
        } catch {
          console.error("Failed to parse order details");
        }
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Clear cart on successful payment
  useEffect(() => {
    if (status === "success" && typeof window !== "undefined") {
      // Dispatch clear cart event
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { items: [] } }),
      );

      // Also clear localStorage cart
      localStorage.removeItem("sunya.cart");
      localStorage.removeItem("cart");
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <Loader2 className="w-12 h-12 mx-auto text-[#FF6900] animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing your order...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </Card>
      </div>
    );
  }

  const isSuccess = status === "success" || status === "Completed";
  const isFailed =
    status === "failed" || status === "Failed" || status === "cancelled";

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>

                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{transactionId}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {gateway ||
                        orderDetails.paymentMethod ||
                        "Online Payment"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">
                      NPR {orderDetails.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-gray-600 mb-2">Items Ordered:</p>
                    <ul className="space-y-1">
                      {orderDetails.items?.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>
                            NPR{" "}
                            {(
                              (item.calculatedPrice || item.nrsPrice || 0) *
                              item.quantity
                            ).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Delivery Address:
                    </p>
                    <p className="text-gray-800">
                      {orderDetails.customer?.name}
                      <br />
                      {orderDetails.customer?.address}
                      <br />
                      {orderDetails.customer?.city}
                      <br />
                      Phone: {orderDetails.customer?.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#FF6900] hover:bg-[#FF6900]/90">
                <Link href="/products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              A confirmation email has been sent to{" "}
              {orderDetails?.customer?.email || "your email address"}.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We are sorry, but your payment could not be processed. Please try
              again.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#FF6900] hover:bg-[#FF6900]/90">
                <Link href="/checkout">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              If you continue to experience issues, please contact our support
              team.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Default/unknown status
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Processing...
          </h1>
          <p className="text-gray-600 mb-6">
            We are processing your request. Please wait a moment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#FF6900] hover:bg-[#FF6900]/90">
              <Link href="/checkout">View Cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
