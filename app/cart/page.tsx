"use client";

import React, { useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Heart,
  RotateCcw,
  ShoppingBag,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setCartItems,
  updateQuantity,
  removeItem,
  restoreItem,
  toggleItemSelection,
  selectAll,
  deselectAll,
  clearRemovedItem,
} from "@/store/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems = [], removedItems = [], selectedItems = [] } = useSelector(
    (state: RootState) => state.cart
  );

  // Initial data (mock, later fetch via RTK Query)
  // useEffect(() => {
  //   dispatch(
  //     setCartItems([
  //       {
  //         id: 1,
  //         name: "Wireless Bluetooth Headphones",
  //         brand: "AudioTech Pro",
  //         image:
  //           "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
  //         originalPrice: 129.99,
  //         negotiatedPrice: 89.99,
  //         quantity: 1,
  //         maxQuantity: 10,
  //         inStock: 15,
  //         vendor: "TechGear Store",
  //       },
  //       {
  //         id: 2,
  //         name: "Organic Cotton T-Shirt",
  //         brand: "EcoWear",
  //         image:
  //           "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&crop=center",
  //         originalPrice: 45.0,
  //         negotiatedPrice: 32.0,
  //         quantity: 2,
  //         maxQuantity: 5,
  //         inStock: 8,
  //         vendor: "Fashion Hub",
  //       },
  //       {
  //         id: 3,
  //         name: "Smart Fitness Tracker",
  //         brand: "FitTech",
  //         image:
  //           "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop&crop=center",
  //         originalPrice: 199.99,
  //         negotiatedPrice: 149.99,
  //         quantity: 1,
  //         maxQuantity: 3,
  //         inStock: 5,
  //         vendor: "GadgetWorld",
  //       },
  //     ])
  //   );
  // }, [dispatch]);

  // Derived values
  const selectedCartItems = (cartItems ?? []).filter((item) =>
    (selectedItems ?? []).includes(item.id)
  );
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.negotiatedPrice * item.quantity,
    0
  );
  const originalSubtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const savings = originalSubtotal - subtotal;
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10.0) : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Auto-clear removed items after 10s
  useEffect(() => {
    if (removedItems.length > 0) {
      const timers = removedItems.map((item) =>
        setTimeout(() => {
          dispatch(clearRemovedItem(item.id));
        }, 10000)
      );
      return () => timers.forEach((t) => clearTimeout(t));
    }
  }, [removedItems, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            </div>
            <div className="text-sm text-gray-400">
              {(cartItems?.length ?? 0)} {(cartItems?.length === 1 ? "item" : "items")}
            </div>
          </div>
        </div>
      </div>

      {/* Removed Items Toast */}
      {(removedItems ?? []).length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          {(removedItems ?? []).map((item) => (
            <div
              key={item.id}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400">
                  <strong>{item.name}</strong> removed from cart
                </span>
              </div>
              <button
                onClick={() => dispatch(restoreItem(item))}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                Undo
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          // Empty cart
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping to find
              amazing deals!
            </p>
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-2 mx-auto">
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select all / deselect all */}
              <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={() =>
                      selectedItems.length === cartItems.length
                        ? dispatch(deselectAll())
                        : dispatch(selectAll())
                    }
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-800"
                  />
                  <span className="text-white font-medium">
                    Select All ({cartItems.length} items)
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {selectedItems.length} selected
                </span>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => dispatch(toggleItemSelection(item.id))}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400 mt-4"
                      />

                      {/* Product image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-xl object-cover bg-gray-700"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-400">{item.brand}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Sold by {item.vendor}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
                              <Heart className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => dispatch(removeItem(item.id))}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Negotiated Price
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg text-gray-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-2xl font-bold text-yellow-400">
                              ${item.negotiatedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-green-400">
                              Save $
                              {(
                                item.originalPrice - item.negotiatedPrice
                              ).toFixed(2)}
                            </span>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-600/50 rounded-xl bg-gray-700/50">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: item.id,
                                      quantity: item.quantity - 1,
                                    })
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-3 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-3 text-white font-semibold min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: item.id,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                                disabled={item.quantity >= item.maxQuantity}
                                className="p-3 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stock info */}
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {item.inStock > 5 ? (
                              `${item.inStock} in stock`
                            ) : (
                              <span className="text-orange-400">
                                Only {item.inStock} left!
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500">
                            Max quantity: {item.maxQuantity}
                          </span>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-400">
                            Subtotal:{" "}
                          </span>
                          <span className="text-lg font-bold text-white">
                            ${(item.negotiatedPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 sticky top-28">
                <h2 className="text-xl font-bold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({selectedItems.length}):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>You save:</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {subtotal < 100 && subtotal > 0 && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-sm text-blue-400">
                        Add ${(100 - subtotal).toFixed(2)} more for FREE
                        shipping!
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700/50 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total:</span>
                    <span className="text-yellow-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={selectedItems.length === 0}
                  className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <button className="w-full bg-gray-700/50 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600/50 transition-colors duration-300 border border-gray-600/50">
                  Continue Shopping
                </button>

                {selectedItems.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-xs text-gray-400 text-center">
                      🔒 Secure checkout • Your data is protected
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
