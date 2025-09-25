"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShoppingCart,
  Zap,
  MessageCircle,
  X,
  Check,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  useGetFashionByIdQuery,
  useGetFoodByIdQuery,
  useGetGadgetByIdQuery,
} from "@/store/services/storeApi";
import { skipToken } from "@reduxjs/toolkit/query";
import Image from "next/image";
import BargainModal from "@/components/BargainModal";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

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
  const [bargainStage, setBargainStage] = useState("initial");
  const [proposedPrice, setProposedPrice] = useState("");
  const [negotiationHistory, setNegotiationHistory] = useState<
    NegotiationEntry[]
  >([]);
  const [currentVendorPrice, setCurrentVendorPrice] = useState(89.99);
  const dispatch = useDispatch();

  const { category, id } = useParams<{ category: string; id: string }>();
  const normalizedCategory = category?.toLowerCase();

  const fashionQuery = useGetFashionByIdQuery(
    normalizedCategory === "fashion" ? Number(id) : skipToken
  );
  const foodQuery = useGetFoodByIdQuery(
    normalizedCategory === "food" ? Number(id) : skipToken
  );
  const gadgetQuery = useGetGadgetByIdQuery(
    normalizedCategory === "gadget" ? Number(id) : skipToken
  );

  const productx = fashionQuery.data || foodQuery.data || gadgetQuery.data;

  // --- Mock fallback data (normalized shape) ---
  const mockproduct = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    brand: "AudioTech Pro",
    category: "Electronics",
    originalPrice: 129.99,
    currentPrice: 89.99,
    lowestPrice: 75.0,
    rating: 4.5,
    reviews: 234,
    inStock: 15,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center",
    ],
    description:
      "Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and crystal-clear audio reproduction.",
    vendor: {
      name: "TechGear Store",
      rating: 4.8,
      totalSales: 1250,
    },
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
        negotiatedPrice: product.currentPrice, // or bargain price if accepted
      })
    );
  };

  // --- Normalize API product to match mock shape ---
  const normalizedProduct = productx
    ? {
        id: productx[0].id ?? mockproduct.id,
        name: productx[0].name ?? mockproduct.name,
        brand: productx[0].brand ?? mockproduct.brand,
        category: productx[0].category ?? mockproduct.category,
        originalPrice: Number(productx[0].originalPrice) || mockproduct.originalPrice,
        currentPrice:
          Number(productx[0].price) || mockproduct.currentPrice,
        lowestPrice:
          Number(productx[0].bargain_price) || mockproduct.lowestPrice,
        rating: Number(productx.rating) || mockproduct.rating,
        reviews: Number(productx.reviews) || mockproduct.reviews,
        inStock: Number(productx.inStock) || mockproduct.inStock,
        images: productx[0].image
          ? [productx[0].image]
          : mockproduct.images,
        description: productx[0].shipdt ?? mockproduct.description,
        vendor: {
          name: productx[0].vendor?.name ?? mockproduct.vendor.name,
          rating: productx.vendor?.rating ?? mockproduct.vendor.rating,
          totalSales:
            productx.vendor?.totalSales ?? mockproduct.vendor.totalSales,
        },
      }
    : mockproduct;

  const product = normalizedProduct;

  // --- Loading state ---
  if (fashionQuery.isLoading || foodQuery.isLoading || gadgetQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading product details...</p>
      </div>
    );
  }

  // --- Error state ---
  if (fashionQuery.isError || foodQuery.isError || gadgetQuery.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400">
        <p>Failed to load product. Please try again later.</p>
      </div>
    );
  }

  // --- Rest of your component (UI) ---
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
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isFavorite
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-gray-300 hover:text-white"
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
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover rounded-xl"
              />
              <button
                onClick={() =>
                  setSelectedImage(Math.max(0, selectedImage - 1))
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage(
                    Math.min(product.images.length - 1, selectedImage + 1)
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">
                {product.brand} • {product.category}
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {product.rating}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {/* <span className="text-2xl text-gray-400 line-through">
                  ₦{product.originalPrice}
                </span> */}
                <span className="text-4xl font-bold text-yellow-400">
                  ₦{product.currentPrice}
                </span>
                {/* <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(
                    ((product.originalPrice - product.currentPrice) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </span> */}
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Vendor:</span>
                  <span className="text-white font-semibold">
                    {product.vendor.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Stock:</span>
                  <span className="text-green-400 font-semibold">
                    {product.inStock} available
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-700/50 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  -
                </button>
                <span className="px-4 py-3 text-white font-semibold min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.inStock, quantity + 1))
                  }
                  className="p-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setShowBargainModal(true)}
                className="flex-1 bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Bargaining
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bargain Modal (unchanged) */}
      {showBargainModal && <div><BargainModal
        product={product}
        quantity={quantity}
        showBargainModal={showBargainModal}
        setShowBargainModal={setShowBargainModal}
      />
      </div>}
    </div>
  );
}
