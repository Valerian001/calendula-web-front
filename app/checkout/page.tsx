/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Mail,
  Copy,
  Check,
  Upload,
  X,
  FileText,
  ImageIcon,
  CheckCircle,
  Lock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { CartItem } from "@/store/slices/cartSlice";


interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStage, setPaymentStage] = useState<
    "transfer" | "receipt" | "success"
  >("transfer");
  const [copiedAccount, setCopiedAccount] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.cartItems
  ) || [];

  const order = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum +
        (item.negotiatedPrice) *
          (item.quantity ?? 1),
      0
    );
    const shipping = subtotal > 0 ? 12.5 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )}`,
    };
  }, [cartItems]);

  // Bank account details
  const bankDetails = {
    bankName: "First National Bank",
    accountName: "Calendula Store Ltd.",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    reference: `CAL-${order.orderNumber}`,
  };

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "NG",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(""), 2000);
  };

  const handleFileUpload = (file: File) => {
    if (
      file &&
      (file.type.includes("image") || file.type.includes("pdf"))
    ) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentStage("success");
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentStage("transfer");
      alert(
        "Order completed successfully! Redirecting to confirmation page..."
      );
    }, 3000);
  };

  // --- Payment Modal ---
  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-white">Complete Payment</h2>
          </div>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStage === "transfer" && (
            <div>
              {/* Amount */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-6 mb-6 text-center">
                <div className="text-4xl font-bold text-yellow-400">
                  ${order.total.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Order #{order.orderNumber}
                </div>
              </div>

              {/* Bank details */}
              <div className="bg-gray-800/40 rounded-xl p-6 space-y-4 mb-6">
                {[
                  { label: "Bank Name", value: bankDetails.bankName, key: "bank" },
                  { label: "Account Name", value: bankDetails.accountName, key: "name" },
                  { label: "Account Number", value: bankDetails.accountNumber, key: "account" },
                  { label: "Routing Number", value: bankDetails.routingNumber, key: "routing" },
                  { label: "Reference", value: bankDetails.reference, key: "reference" },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                  >
                    <div>
                      <div className="text-sm text-gray-400">{detail.label}</div>
                      <div className="font-mono text-white">{detail.value}</div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(detail.value, detail.key)
                      }
                      className="p-2 rounded-lg bg-gray-600 hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                    >
                      {copiedAccount === detail.key ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPaymentStage("receipt")}
                className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300"
              >
                I've Made the Transfer
              </button>
            </div>
          )}

          {paymentStage === "receipt" && (
            <div>
              {/* Upload */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 ${
                  isDragOver
                    ? "border-yellow-400 bg-yellow-400/10"
                    : uploadedFile
                    ? "border-green-400 bg-green-400/10"
                    : "border-gray-600 bg-gray-800/20"
                }`}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="font-semibold text-white">
                      {uploadedFile.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium mb-2">
                      Drag & drop or{" "}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-yellow-400 underline hover:text-yellow-300"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentStage("transfer")}
                  className="flex-1 bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentComplete}
                  disabled={!uploadedFile}
                  className="flex-1 bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Submit Receipt
                </button>
              </div>
            </div>
          )}

          {paymentStage === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Payment Submitted!
              </h3>
              <p className="text-gray-300 mb-6">
                Your receipt has been uploaded and will be verified shortly.
              </p>
              <p className="text-sm text-gray-400">
                Order Number:{" "}
                <span className="text-white font-mono">
                  {order.orderNumber}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  console.log(order)

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <span className="text-yellow-400 font-semibold">
            Secure Checkout
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div className="bg-gray-800/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 xxx xxx xxxx"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-800/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP Code"
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-800/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Payment Method
            </h2>
            <div className="flex items-center p-4 border border-yellow-400/50 rounded-xl bg-yellow-400/10">
              <input
                type="radio"
                id="bank_transfer"
                name="payment"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-yellow-400"
              />
              <label
                htmlFor="bank_transfer"
                className="ml-3 text-white font-medium flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Bank Transfer
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/40 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">
              Order Summary
            </h2>


            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}          // 16 × 4 = 64 px (same as w‑16 h‑16)
                    height={64}
                    className="rounded-lg object-cover"
                    priority
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">
                      {item.name}
                    </h3>
                    <div className="text-xs text-gray-400">{item.brand}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.negotiatedPrice && (
                        <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                          Negotiated
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      $
                      {(item.negotiatedPrice).toFixed(
                        2
                      )}
                    </div>
                    {item.originalPrice &&
                      item.originalPrice > item.negotiatedPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-700/50 pt-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-700/50">
                <span>Total</span>
                <span className="text-yellow-400">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-bold hover:bg-yellow-500 flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Pay Now
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Your payment info is secure & encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
}
