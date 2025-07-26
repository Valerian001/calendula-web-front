"use client"
import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Zap, MessageCircle, X, Check, AlertCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';

type NegotiationEntry = {
  type: string;
  price?: number;
  message?: string;
  timestamp: Date;
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [bargainStage, setBargainStage] = useState('initial'); // initial, negotiating, accepted, denied, vendors
  const [proposedPrice, setProposedPrice] = useState('');
  const [negotiationHistory, setNegotiationHistory] = useState<NegotiationEntry[]>([]);
  const [currentVendorPrice, setCurrentVendorPrice] = useState(89.99);

  // Sample product data
  const product = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    brand: "AudioTech Pro",
    category: "Electronics",
    originalPrice: 129.99,
    currentPrice: 89.99,
    lowestPrice: 75.00, // Vendor's minimum acceptable price
    rating: 4.5,
    reviews: 234,
    inStock: 15,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&crop=center"
    ],
    description: "Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and crystal-clear audio reproduction.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Quick charge: 10 min = 3 hours playback",
      "Foldable design",
      "Built-in microphone"
    ],
    vendor: {
      name: "TechGear Store",
      rating: 4.8,
      totalSales: 1250
    }
  };

  // Alternative vendors with same product
  const alternativeVendors = [
    { name: "ElectroHub", price: 92.99, rating: 4.6, sales: 890 },
    { name: "GadgetWorld", price: 87.50, rating: 4.4, sales: 650 },
    { name: "SoundStation", price: 95.00, rating: 4.7, sales: 1100 }
  ];

  const handleBargainStart = () => {
    setShowBargainModal(true);
    setBargainStage('initial');
    setCurrentVendorPrice(product.currentPrice);
  };

  const handleInitialResponse = (accepted: boolean) => {
    if (accepted) {
      setBargainStage('accepted');
    } else {
      setBargainStage('negotiating');
    }
  };


const handlePriceProposal = () => {
  const proposed = parseFloat(proposedPrice);
  const newNegotiation = {
    type: 'customer_offer',
    price: proposed,
    timestamp: new Date()
  };

  setNegotiationHistory(prev => [...prev, newNegotiation]);

  const acceptableCounter = product.lowestPrice * 1.1;

  const isFirstProposal = negotiationHistory.length === 0;

  const lastVendorCounter = negotiationHistory
    .slice()
    .reverse()
    .find(entry => entry.type === 'vendor_counter');

  const hasCounteredOnce = !!lastVendorCounter;

  const isAcceptingCounter = lastVendorCounter && proposed === lastVendorCounter.price;

  setTimeout(() => {
    if (proposed < product.lowestPrice) {
      // DENY if below lowest price
      setNegotiationHistory(prev => [...prev, {
        type: 'vendor_deny',
        message: "This price is too low. Please make a reasonable offer.",
        timestamp: new Date()
      }]);
      setBargainStage('denied');
    } else if (isAcceptingCounter || (!isFirstProposal && proposed >= acceptableCounter && hasCounteredOnce)) {
      // ACCEPT if accepting counter or offering acceptable price after first proposal
      setNegotiationHistory(prev => [...prev, {
        type: 'vendor_accept',
        price: proposed,
        timestamp: new Date()
      }]);
      setCurrentVendorPrice(proposed);
      setBargainStage('accepted');
    } else if (!hasCounteredOnce && proposed >= product.lowestPrice && proposed < acceptableCounter) {
      // COUNTER ONCE
      const counterOffer = Math.min(acceptableCounter, currentVendorPrice - 2);
      setNegotiationHistory(prev => [...prev, {
        type: 'vendor_counter',
        price: counterOffer,
        timestamp: new Date()
      }]);
      setCurrentVendorPrice(counterOffer);
    } else if (hasCounteredOnce && proposed >= product.lowestPrice) {
      // ACCEPT any ≥ lowestPrice after counter
      setNegotiationHistory(prev => [...prev, {
        type: 'vendor_accept',
        price: proposed,
        timestamp: new Date()
      }]);
      setCurrentVendorPrice(proposed);
      setBargainStage('accepted');
    } else {
      // DENY anything else
      setNegotiationHistory(prev => [...prev, {
        type: 'vendor_deny',
        message: "This price is too low. Please make a reasonable offer.",
        timestamp: new Date()
      }]);
      setBargainStage('denied');
    }
  }, 1500);

  setProposedPrice('');
};



  const handleAddToCart = () => {
    setShowBargainModal(false);
    // Add to cart logic here
    alert(`Added to cart at ₦₦{currentVendorPrice.toFixed(2)}`);
  };

  const handleCheckout = () => {
    setShowBargainModal(false);
    // Proceed to checkout logic here
    alert(`Proceeding to checkout at ₦₦{currentVendorPrice.toFixed(2)}`);
  };

  const BargainModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-white">Price Negotiation</h2>
          </div>
          <button
            onClick={() => setShowBargainModal(false)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {bargainStage === 'initial' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Current Price</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-6">₦{currentVendorPrice.toFixed(2)}</div>
              <p className="text-gray-300 mb-8">The vendor is offering this price. Would you like to accept it or negotiate?</p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleInitialResponse(true)}
                  className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Accept Price
                </button>
                <button
                  onClick={() => handleInitialResponse(false)}
                  className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Negotiate
                </button>
              </div>
            </div>
          )}

          {bargainStage === 'negotiating' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Negotiation Chat</h3>
                <div className="bg-gray-800/50 rounded-xl p-4 max-h-60 overflow-y-auto space-y-3">
                  {negotiationHistory.map((item, index) => (
                    <div key={index} className={`flex ₦{item.type.includes('customer') ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-xl ₦{
                        item.type.includes('customer') 
                          ? 'bg-yellow-400 text-black' 
                          : item.type === 'vendor_deny'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gray-700 text-white'
                      }`}>
                        {item.price && <div className="font-semibold">₦{item.price.toFixed(2)}</div>}
                        {item.message && <div className="text-sm">{item.message}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Offer</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                      <input
                        type="number"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                        placeholder="Enter your price"
                        className="w-full pl-8 pr-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
                        step="0.01"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={handlePriceProposal}
                      disabled={!proposedPrice || parseFloat(proposedPrice) <= 0}
                      className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      Send Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {bargainStage === 'accepted' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Price Agreed!</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-6">₦{currentVendorPrice.toFixed(2)}</div>
              <p className="text-gray-300 mb-8">Great! You&apos;ve successfully negotiated the price. What would you like to do next?</p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}

          {bargainStage === 'denied' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Offer Declined</h3>
              <p className="text-gray-300 mb-8">Your price proposal was below the vendor&apos;s minimum. You can make another offer or check other vendors.</p>
              
              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={() => setBargainStage('negotiating')}
                  className="px-8 py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300"
                >
                  Make Another Offer
                </button>
                <button
                  onClick={() => setBargainStage('vendors')}
                  className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Other Vendors
                </button>
              </div>
            </div>
          )}

          {bargainStage === 'vendors' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Alternative Vendors</h3>
              <div className="space-y-4">
                {alternativeVendors.map((vendor, index) => (
                  <div key={index} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:border-yellow-400/50 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{vendor.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{vendor.rating}</span>
                          <span>•</span>
                          <span>{vendor.sales} sales</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">₦{vendor.price}</div>
                        <button className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors duration-300">
                          Start Bargaining
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
              Back to Shop
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors duration-300 ₦{
                  isFavorite ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-800/40 rounded-2xl overflow-hidden aspect-square">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors duration-300 ₦{
                    selectedImage === index ? 'border-yellow-400' : 'border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">{product.brand} • {product.category}</div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ₦{
                          i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{product.rating}</span>
                  <span className="text-gray-400">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl text-gray-400 line-through">₦{product.originalPrice}</span>
                <span className="text-4xl font-bold text-yellow-400">₦{product.currentPrice}</span>
                <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}% OFF
                </span>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Vendor:</span>
                  <span className="text-white font-semibold">{product.vendor.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Stock:</span>
                  <span className="text-green-400 font-semibold">{product.inStock} available</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-700/50 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  -
                </button>
                <span className="px-4 py-3 text-white font-semibold min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                  className="p-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleBargainStart}
                className="flex-1 bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Bargaining
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bargain Modal */}
      {showBargainModal && <BargainModal />}
    </div>
  );
}