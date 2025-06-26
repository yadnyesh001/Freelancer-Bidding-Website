"use client"

import { useState } from "react"
import axios from "axios"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.role) {
      newErrors.role = "Please select your role"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      console.log("Signup successful:", response.data)
    } catch (error) {
      if (error.response) {
        setErrors({ submit: error.response.data.message || "Signup failed" })
      } else if (error.request) {
        setErrors({ submit: "Network error. Please check your connection." })
      } else {
        setErrors({ submit: "An unexpected error occurred." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl h-full flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-8 w-full h-full max-h-[90vh] items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-6">
            <div>
              <h1 className="text-6xl font-bold mb-4">
                Solo
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Grind
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">Join the freelancing revolution</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <span className="text-lg">Lightning fast setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">🔒</span>
                </div>
                <span className="text-lg">Bank-level security</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">🌟</span>
                </div>
                <span className="text-lg">Premium experience</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                Solo
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Grind
                </span>
              </h1>
              <p className="text-gray-300">Join the freelancing revolution</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`cursor-pointer ${formData.role === "freelancer" ? "scale-105" : ""} transition-all duration-200`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="freelancer"
                        checked={formData.role === "freelancer"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                          formData.role === "freelancer"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg"
                            : "bg-white/10 border-white/30 hover:bg-white/20"
                        }`}
                      >
                        <div className="text-xl mb-1">💼</div>
                        <div className="text-white font-semibold text-sm">Freelancer</div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer ${formData.role === "client" ? "scale-105" : ""} transition-all duration-200`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="client"
                        checked={formData.role === "client"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                          formData.role === "client"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 shadow-lg"
                            : "bg-white/10 border-white/30 hover:bg-white/20"
                        }`}
                      >
                        <div className="text-xl mb-1">🎯</div>
                        <div className="text-white font-semibold text-sm">Client</div>
                      </div>
                    </label>
                  </div>
                  {errors.role && <span className="text-red-400 text-sm mt-1 block">{errors.role}</span>}
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-white/20 focus:outline-none transition-all duration-300 ${
                        errors.name ? "border-red-400" : ""
                      }`}
                    />
                    {errors.name && <span className="text-red-400 text-sm mt-1 block">{errors.name}</span>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-white/20 focus:outline-none transition-all duration-300 ${
                        errors.email ? "border-red-400" : ""
                      }`}
                    />
                    {errors.email && <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password (min. 6 characters)"
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-white/20 focus:outline-none transition-all duration-300 ${
                        errors.password ? "border-red-400" : ""
                      }`}
                    />
                    {errors.password && <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>}
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3">
                    <span className="text-red-300 text-sm">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Join SoloGrind"
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-300 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
