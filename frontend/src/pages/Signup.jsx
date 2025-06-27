"use client"

import { useState, useEffect } from "react"
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
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/signup`, formData, {
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

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float-${i % 4 + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )

  const GlowingOrb = ({ className, delay = 0 }) => (
    <div 
      className={`absolute rounded-full blur-xl opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <FloatingParticles />
      <GlowingOrb className="w-96 h-96 bg-purple-500 top-10 -left-20" delay={0} />
      <GlowingOrb className="w-80 h-80 bg-pink-500 bottom-10 -right-20" delay={2} />
      <GlowingOrb className="w-64 h-64 bg-indigo-500 top-1/2 left-1/4" delay={4} />

      <div className="w-full max-w-4xl h-full flex items-center justify-center relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 w-full h-full max-h-[90vh] items-center">
          {/* Left Side - Branding */}
          <div 
            className={`hidden lg:flex flex-col justify-center text-white space-y-6 transition-all duration-1000 ${
              mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div>
              <h1 className="text-6xl font-bold mb-4 group">
                <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                  Solo
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
                  Grind
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Join the freelancing revolution
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: "⚡", text: "Lightning fast setup", gradient: "from-pink-500 to-purple-500" },
                { icon: "🔒", text: "Bank-level security", gradient: "from-purple-500 to-indigo-500" },
                { icon: "🌟", text: "Premium experience", gradient: "from-indigo-500 to-blue-500" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 group cursor-pointer transition-all duration-500 hover:translate-x-2 animate-fade-in-up`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg`}>
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span className="text-lg transition-colors duration-300 group-hover:text-purple-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div 
            className={`w-full max-w-md mx-auto transition-all duration-1000 ${
              mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-6 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-white mb-2">
                Solo
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Grind
                </span>
              </h1>
              <p className="text-gray-300">Join the freelancing revolution</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:shadow-3xl animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Create Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-white font-medium mb-3">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.role === "freelancer" ? "scale-105" : ""
                      }`}
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
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 hover:shadow-lg ${
                          formData.role === "freelancer"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg animate-pulse-glow"
                            : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40"
                        }`}
                      >
                        <div className="text-xl mb-1 transition-transform duration-300 hover:scale-110">💼</div>
                        <div className="text-white font-semibold text-sm">Freelancer</div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.role === "client" ? "scale-105" : ""
                      }`}
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
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 hover:shadow-lg ${
                          formData.role === "client"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 shadow-lg animate-pulse-glow"
                            : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40"
                        }`}
                      >
                        <div className="text-xl mb-1 transition-transform duration-300 hover:scale-110">🎯</div>
                        <div className="text-white font-semibold text-sm">Client</div>
                      </div>
                    </label>
                  </div>
                  {errors.role && (
                    <span className="text-red-400 text-sm mt-1 block animate-shake animate-fade-in">
                      {errors.role}
                    </span>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  {[
                    { name: "name", type: "text", placeholder: "Full Name", icon: "👤" },
                    { name: "email", type: "email", placeholder: "Email Address", icon: "📧" },
                    { name: "password", type: "password", placeholder: "Password (min. 6 characters)", icon: "🔐" }
                  ].map((field, index) => (
                    <div 
                      key={field.name}
                      className="animate-fade-in-up relative group"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="relative">
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          placeholder={field.placeholder}
                          className={`w-full px-4 py-3 pl-12 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400/50 focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:scale-105 ${
                            errors[field.name] ? "border-red-400 animate-shake" : ""
                          } ${
                            focusedField === field.name ? "shadow-lg shadow-purple-400/20" : ""
                          }`}
                        />
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-lg transition-all duration-300 ${
                          focusedField === field.name ? "scale-110 rotate-12" : ""
                        }`}>
                          {field.icon}
                        </div>
                        {formData[field.name] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 animate-bounce-in">
                            ✓
                          </div>
                        )}
                      </div>
                      {errors[field.name] && (
                        <span className="text-red-400 text-sm mt-1 block animate-fade-in animate-shake">
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 animate-slide-down animate-shake">
                    <span className="text-red-300 text-sm">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent animate-fade-in-up group ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-600 hover:to-pink-600 hover:-translate-y-1"
                  }`}
                  style={{ animationDelay: '0.8s' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <span className="group-hover:tracking-wider transition-all duration-300">
                      Join SoloGrind
                    </span>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-2 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                  <p className="text-gray-300 text-sm">
                    Already have an account?{" "}
                    <a 
                      href="/login" 
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-all duration-300 hover:underline hover:scale-105 inline-block"
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% { transform: scale(0.9); }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.3);
          }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(-15px) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          75% { transform: translateY(-35px) rotate(270deg); }
        }

        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(-40px) rotate(144deg); }
          80% { transform: translateY(-10px) rotate(288deg); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 9s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}

export default Signup