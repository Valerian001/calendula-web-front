"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Star,
  TrendingDown,
  Zap,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useGetFashionQuery,
  useGetFoodQuery,
  useGetGadgetQuery,
} from "@/store/services/storeApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCartItems, removeItem } from "@/store/slices/cartSlice";

export default function CalendulaShopping() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteItems, setFavoriteItems] = useState(new Set<number>());
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  // ---- Fetch products from API ----
  const { data: fashionData = [], isLoading: loadingFashion } =
    useGetFashionQuery();
  const { data: foodData = [], isLoading: loadingFood } = useGetFoodQuery();
  const { data: gadgetData = [], isLoading: loadingGadget } =
    useGetGadgetQuery();

  // Merge products from all categories
  const products = useMemo(() => {
    return [
      ...fashionData.map((item: any) => ({
        ...item,
        category: "fashion",
      })),
      ...foodData.map((item: any) => ({
        ...item,
        category: "food",
      })),
      ...gadgetData.map((item: any) => ({
        ...item,
        category: "gadget",
      })),
    ];
  }, [fashionData, foodData, gadgetData]);

  // Categories
  const categories = [
    { id: "all", name: "All Products" },
    { id: "fashion", name: "Fashion" },
    { id: "food", name: "Food" },
    { id: "gadget", name: "Gadgets" },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Favorite toggle
  const toggleFavorite = (productId: number) => {
    setFavoriteItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  // Cart toggle (increment qty if exists)
  const toggleCart = (product: any) => {
    const exists = cartItems.find((item) => item.id === product.id);

    if (exists) {
      if (exists.quantity > 1) {
        // Decrease quantity by 1
        dispatch(setCartItems(cartItems.filter((item) => item.id !== product.id)));
      } else {
        // Quantity = 1 → remove completely
        dispatch(setCartItems(cartItems.filter((item) => item.id !== product.id)));
      }
    } else {
      // Add new product with quantity = 1
      dispatch(setCartItems([...cartItems, { ...product, quantity: 1 }]));
    }
  };

  // Loading state with skeleton shimmer
  if (loadingFashion || loadingFood || loadingGadget) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800/40 rounded-2xl h-72"
          />
        ))}
      </div>
    );
  }

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
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          </div>

          {/* Search + Category */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/30"
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
              key={`${product.category || product.category_id}-${product.id}`}
              className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                      favoriteItems.has(product.id)
                        ? "bg-yellow-400 text-black"
                        : "bg-black/50 text-white hover:bg-yellow-400 hover:text-black"
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
                    <span className="text-sm text-gray-300">
                      {product.rating || 4.5}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₦{product.originalPrice}
                      </span>
                    )}
                    <motion.span
                      key={product.price}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl font-bold text-yellow-400"
                    >
                      ₦{product.price}
                    </motion.span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => toggleCart(product)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    cartItems.some((item) => item.id === product.id)
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : "bg-gray-700/50 text-white hover:bg-yellow-400 hover:text-black border border-gray-600/50 hover:border-yellow-400"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItems.some((item) => item.id === product.id)
                    ? "In Cart"
                    : "Add to Cart"}
                </button>

                {/* Negotiate Button */}
                <Link href={`/shop/${product.category || product.category_id}/${product.id}`}>
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
