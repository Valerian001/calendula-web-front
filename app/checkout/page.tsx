"use client"

import React, { useState, useRef } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone, Lock, Copy, Check, Upload, X, FileText, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStage, setPaymentStage] = useState('transfer'); // transfer, receipt, success
  const [copiedAccount, setCopiedAccount] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sample order data
  const order = {
    items: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        brand: "AudioTech Pro",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center",
        price: 75.99,
        originalPrice: 89.99,
        quantity: 1,
        negotiatedPrice: true
      }
    ],
    subtotal: 75.99,
    shipping: 12.50,
    tax: 7.64,
    total: 96.13,
    orderNumber: "ORD-2025-0001"
  };

  // Bank account details
  const bankDetails = {
    bankName: "First National Bank",
    accountName: "Calendula Store Ltd.",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    reference: `CAL-${order.orderNumber}`
  };

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'NG'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  const handleFileUpload = (file) => {
    if (file && (file.type.includes('image') || file.type.includes('pdf'))) {
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentStage('success');
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentStage('transfer');
      // Redirect to order confirmation page
      alert('Order completed successfully! Redirecting to confirmation page...');
    }, 3000);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        {/* Modal Header */}
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

        {/* Modal Content */}
        <div className="p-6">
          {paymentStage === 'transfer' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Bank Transfer Details</h3>
                <p className="text-gray-300">Transfer the exact amount to complete your order</p>
              </div>

              {/* Amount to Pay */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-6 mb-6 text-center">
                <div className="text-sm text-gray-300 mb-2">Amount to Pay</div>
                <div className="text-4xl font-bold text-yellow-400">${order.total.toFixed(2)}</div>
                <div className="text-sm text-gray-400 mt-2">Order #{order.orderNumber}</div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-800/40 rounded-xl p-6 space-y-4 mb-6">
                <h4 className="font-semibold text-white mb-4">Transfer to:</h4>
                
                {[
                  { label: 'Bank Name', value: bankDetails.bankName, key: 'bank' },
                  { label: 'Account Name', value: bankDetails.accountName, key: 'name' },
                  { label: 'Account Number', value: bankDetails.accountNumber, key: 'account' },
                  { label: 'Routing Number', value: bankDetails.routingNumber, key: 'routing' },
                  { label: 'Reference', value: bankDetails.reference, key: 'reference' }
                ].map((detail, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">{detail.label}</div>
                      <div className="font-mono text-white">{detail.value}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(detail.value, detail.key)}
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

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-blue-400 mb-2">Important Instructions:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Use the reference number when making the transfer</li>
                  <li>• Transfer the exact amount: ${order.total.toFixed(2)}</li>
                  <li>• Keep your receipt for upload verification</li>
                  <li>• Payment confirmation may take 1-3 business days</li>
                </ul>
              </div>

              <button
                onClick={() => setPaymentStage('receipt')}
                className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300"
              >
                I've Made the Transfer
              </button>
            </div>
          )}

          {paymentStage === 'receipt' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Upload Payment Receipt</h3>
                <p className="text-gray-300">Please upload your bank transfer receipt for verification</p>
              </div>

              {/* File Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 mb-6 ${
                  isDragOver 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : uploadedFile 
                      ? 'border-green-400 bg-green-400/10' 
                      : 'border-gray-600 bg-gray-800/20'
                }`}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto">
                      {uploadedFile.type.includes('pdf') ? (
                        <FileText className="w-8 h-8 text-green-400" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{uploadedFile.name}</div>
                      <div className="text-sm text-gray-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">
                        Drag and drop your receipt here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-yellow-400 underline hover:text-yellow-300"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-sm text-gray-400">Supports: JPG, PNG, PDF (Max 10MB)</p>
                    </div>
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

              {/* Upload Requirements */}
              <div className="bg-gray-800/40 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-white mb-3">Receipt Requirements:</h5>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Clear image showing transfer details
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Amount must match: ${order.total.toFixed(2)}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Reference number should be visible: {bankDetails.reference}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Bank name and timestamp must be clear
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentStage('transfer')}
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

          {paymentStage === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Payment Submitted Successfully!</h3>
              <p className="text-gray-300 mb-6">
                Your payment receipt has been uploaded and is being verified. 
                You'll receive an email confirmation once the payment is processed.
              </p>
              <div className="bg-gray-800/40 rounded-xl p-4">
                <p className="text-sm text-gray-400">
                  Order Number: <span className="text-white font-mono">{order.orderNumber}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
            <div className="text-yellow-400 font-semibold">
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">Contact Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    placeholder="Street address"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-4 border border-yellow-400/50 rounded-xl bg-yellow-400/10">
                  <input
                    type="radio"
                    id="bank_transfer"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-yellow-400"
                  />
                  <label htmlFor="bank_transfer" className="ml-3 flex items-center gap-2 text-white font-medium">
                    <CreditCard className="w-5 h-5" />
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                      <div className="text-xs text-gray-400">{item.brand}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.negotiatedPrice && (
                          <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                            Negotiated
                          </span>
                        )}
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">${item.price.toFixed(2)}</div>
                      {item.originalPrice > item.price && (
                        <div className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pricing Breakdown */}
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
                  <span className="text-yellow-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Pay Button */}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-bold hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Pay Now
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-3">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
}