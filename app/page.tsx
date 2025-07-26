"use client"
import React, { useState, useEffect, use } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setPriceAnimation(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <Image src="/logo.png" alt="Calendula Logo" width={300} height={300} className="rounded-full" />
          </div>
          <div className="hidden md:flex space-x-8 text-gray-300">
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Shop</a>
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">How it Works</a>
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Login/Signup</a>
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Contact Us</a>
          </div>
          <div className="hflex md:hidden space-x-8 text-gray-300">
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Login/Signup</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main heading with stagger animation */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mb-8 leading-tight">
              Welcome to
              <br />
              <span className="text-yellow-400 animate-pulse">Calendula</span>
            </h1>
          </div>

          {/* Subtitle with delay */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light max-w-4xl mx-auto leading-relaxed">
              The first online store that allows
            </p>
            <div className="relative inline-block">
              <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-12 relative">
                bargaining on products
                <span className="absolute -inset-2 bg-yellow-400/20 blur-lg rounded-lg animate-pulse" />
              </p>
            </div>
          </div>

          {/* Interactive pricing demo */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-16`}>
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 max-w-md mx-auto border border-gray-700/50">
              <div className="text-gray-300 mb-4">Vintage Bag</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 line-through text-xl">₦5000.00</span>
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 transition-all duration-500">
                ₦{[4800, 4700, 4500][priceAnimation]}
              </div>
              <div className="text-sm text-gray-400 mt-2">Price negotiated in real-time</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button className="group relative inline-flex items-center gap-4 bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25">
              <span className="relative z-10">No fuss, straight to shopping</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </button>
          </div>

          {/* Feature highlights */}
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mt-20`}>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Zap, title: "Instant Bargaining", desc: "Real-time price negotiations" },
                { icon: TrendingUp, title: "Best Deals", desc: "Always get the lowest price" },
                // { icon: Sparkles, title: "Smart Matching", desc: "AI-powered deal optimization" }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                  <feature.icon className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
    </div>
  );
}
