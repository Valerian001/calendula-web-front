"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star, TrendingDown, Zap, Eye} from 'lucide-react';
import Link from 'next/link';

export default function CalendulaShopping() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteItems, setFavoriteItems] = useState(new Set());
  const [cartItems, setCartItems] = useState(new Set());
  const [priceAnimations, setPriceAnimations] = useState<{ [key: number]: number }>({});

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "electronics",
      originalPrice: 129.99,
      currentPrice: 89.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
      rating: 4.5,
      reviews: 234,
      discount: 31,
      negotiable: true
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      category: "clothing",
      originalPrice: 45.00,
      currentPrice: 32.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center",
      rating: 4.8,
      reviews: 156,
      discount: 29,
      negotiable: true
    },
    {
      id: 3,
      name: "Smart Fitness Tracker",
      category: "electronics",
      originalPrice: 199.99,
      currentPrice: 149.99,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
      rating: 4.3,
      reviews: 89,
      discount: 25,
      negotiable: true
    },
    {
      id: 4,
      name: "Ceramic Coffee Mug Set",
      category: "home",
      originalPrice: 34.99,
      currentPrice: 24.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop&crop=center",
      rating: 4.7,
      reviews: 312,
      discount: 29,
      negotiable: true
    },
    {
      id: 5,
      name: "Leather Crossbody Bag",
      category: "accessories",
      originalPrice: 89.99,
      currentPrice: 67.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center",
      rating: 4.6,
      reviews: 178,
      discount: 24,
      negotiable: true
    },
    {
      id: 6,
      name: "Indoor Plant Collection",
      category: "home",
      originalPrice: 67.50,
      currentPrice: 48.99,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      rating: 4.4,
      reviews: 92,
      discount: 27,
      negotiable: true
    },
    {
      id: 7,
      name: "Vintage Sunglasses",
      category: "accessories",
      originalPrice: 78.00,
      currentPrice: 58.50,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&crop=center",
      rating: 4.2,
      reviews: 145,
      discount: 25,
      negotiable: true
    },
    {
      id: 8,
      name: "Ergonomic Desk Chair",
      category: "furniture",
      originalPrice: 299.99,
      currentPrice: 219.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      rating: 4.5,
      reviews: 67,
      discount: 27,
      negotiable: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'furniture', name: 'Furniture' }
  ];

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle favorite toggle
  const toggleFavorite = (productId: number) => {
    setFavoriteItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Handle cart toggle
  const toggleCart = (productId: number) => {
    setCartItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Simulate price negotiations
  useEffect(() => {
    const interval = setInterval(() => {
      const productId = products[Math.floor(Math.random() * products.length)].id;
      setPriceAnimations(prev => ({
        ...prev,
        [productId]: Date.now()
      }));
      
      setTimeout(() => {
        setPriceAnimations(prev => {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        });
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-white">Shop</h1>
            </div>
            <div className="text-sm text-gray-400">
              {cartItems.size} items in cart
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ₦{
                    selectedCategory === category.id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/30'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-300 ₦{
                      favoriteItems.has(product.id)
                        ? 'bg-yellow-400 text-black'
                        : 'bg-black/50 text-white hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-black/50 rounded-full backdrop-blur-sm text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {product.discount}% OFF
                  </div>
                )}

                {/* Negotiable Badge */}
                {product.negotiable && (
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Negotiable
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-300">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      ₦{product.originalPrice}
                    </span>
                    <span className={`text-xl font-bold text-yellow-400 transition-all duration-300 ₦{
                      priceAnimations[product.id] ? 'scale-110' : ''
                    }`}>
                      ₦{product.currentPrice}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => toggleCart(product.id)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ₦{
                    cartItems.has(product.id)
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-gray-700/50 text-white hover:bg-yellow-400 hover:text-black border border-gray-600/50 hover:border-yellow-400'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItems.has(product.id) ? 'In Cart' : 'Add to Cart'}
                </button>

                {/* Negotiate Button */}
                <Link href={`/shop/1`} >
                  <div className="w-full mt-2 py-2 px-4 rounded-xl bg-transparent border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-sm font-medium">
                    Make an Offer
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}