"use client"

import React, { useState } from "react";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// --- Schemas ---
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupStep1Schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phonenumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10,11}$/, "Please enter a valid phone number"),
});

const signupStep2Schema = z
  .object({
    location: z.string().min(1, "Location is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Forms
  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const signupStep1Form = useForm({ resolver: zodResolver(signupStep1Schema) });
  const signupStep2Form = useForm({ resolver: zodResolver(signupStep2Schema) });

  // Location suggestions
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const mockLocations = [
    { name: "Awka, Anambra State", lat: 6.212, lon: 7.074 },
    { name: "Lagos, Lagos State", lat: 6.5244, lon: 3.3792 },
    { name: "Abuja, FCT", lat: 9.0765, lon: 7.3986 },
    { name: "Port Harcourt, Rivers State", lat: 4.8156, lon: 7.0498 },
    { name: "Kano, Kano State", lat: 12.0022, lon: 8.592 },
    { name: "Ibadan, Oyo State", lat: 7.3775, lon: 3.947 },
  ];

  // --- Handlers ---
  const handleLoginSubmit = async (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login data:", data);
      alert("Login successful!");
    }, 2000);
  };

  const handleSignupNext = (data) => {
    console.log("Step 1 Data:", data);
    setStep(2);
  };

  const handleSignupSubmit = async (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Signup data:", data);
      alert("Account created successfully!");
    }, 2000);
  };

  const handleLocationSearch = (value, onChange) => {
    onChange(value);
    if (value.length > 1) {
      const filtered = mockLocations.filter((loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (location, onChange) => {
    onChange(location.name);
    setShowLocationSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Calendula"}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? "Sign in to your account"
              : "Create your account to start bargaining"}
          </p>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
          {isLogin ? (
            // --- Login Form ---
            <form
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-6"
            >
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...loginForm.register("username")}
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border rounded-xl text-white"
                    placeholder="Enter your username"
                  />
                </div>
                {loginForm.formState.errors.username && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...loginForm.register("password")}
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border rounded-xl text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          ) : (
            // --- Signup Form ---
            <>
              {step === 1 ? (
                <form
                  onSubmit={signupStep1Form.handleSubmit(handleSignupNext)}
                  className="space-y-6"
                >
                  {/* First Name */}
                  <input
                    type="text"
                    placeholder="First name"
                    {...signupStep1Form.register("first_name")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep1Form.formState.errors.first_name && (
                    <p className="text-sm text-red-400">
                      {signupStep1Form.formState.errors.first_name.message}
                    </p>
                  )}

                  {/* Last Name */}
                  <input
                    type="text"
                    placeholder="Last name"
                    {...signupStep1Form.register("last_name")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep1Form.formState.errors.last_name && (
                    <p className="text-sm text-red-400">
                      {signupStep1Form.formState.errors.last_name.message}
                    </p>
                  )}

                  {/* Username */}
                  <input
                    type="text"
                    placeholder="Username"
                    {...signupStep1Form.register("username")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep1Form.formState.errors.username && (
                    <p className="text-sm text-red-400">
                      {signupStep1Form.formState.errors.username.message}
                    </p>
                  )}

                  {/* Phone */}
                  <input
                    type="tel"
                    placeholder="Phone number"
                    {...signupStep1Form.register("phonenumber")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep1Form.formState.errors.phonenumber && (
                    <p className="text-sm text-red-400">
                      {signupStep1Form.formState.errors.phonenumber.message}
                    </p>
                  )}

                  <button type="submit" className="w-full bg-yellow-400 py-3 rounded-xl">
                    Next Step
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={signupStep2Form.handleSubmit(handleSignupSubmit)}
                  className="space-y-6"
                >
                  {/* Location */}
                  <Controller
                    name="location"
                    control={signupStep2Form.control}
                    render={({ field }) => (
                      <div className="relative">
                        <input
                          type="text"
                          {...field}
                          onChange={(e) => handleLocationSearch(e.target.value, field.onChange)}
                          placeholder="Location"
                          className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                        />
                        {showLocationSuggestions && (
                          <div className="absolute top-full left-0 w-full bg-gray-800 rounded-xl shadow-lg">
                            {locationSuggestions.map((loc, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => selectLocation(loc, field.onChange)}
                                className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                              >
                                {loc.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {signupStep2Form.formState.errors.location && (
                    <p className="text-sm text-red-400">
                      {signupStep2Form.formState.errors.location.message}
                    </p>
                  )}

                  {/* Password */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...signupStep2Form.register("password")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep2Form.formState.errors.password && (
                    <p className="text-sm text-red-400">
                      {signupStep2Form.formState.errors.password.message}
                    </p>
                  )}

                  {/* Confirm Password */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...signupStep2Form.register("confirmPassword")}
                    className="w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white"
                  />
                  {signupStep2Form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-400">
                      {signupStep2Form.formState.errors.confirmPassword.message}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-600 py-3 rounded-xl text-white"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-yellow-400 py-3 rounded-xl"
                    >
                      {isLoading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Toggle */}
          <div className="mt-8 text-center text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-400 font-semibold"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
