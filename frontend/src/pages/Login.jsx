"use client"

import { useState, useEffect } from "react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    if (!email || !password) {
      setErrorMsg("All fields are required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert("Login successful!")
      console.log("User logged in with:", { email })
    } catch (err) {
      setErrorMsg("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 bg-white/10 rounded-full animate-pulse`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`w-full max-w-6xl h-full flex items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid lg:grid-cols-2 gap-16 w-full items-center">
          {/* Left Side - Branding & Features */}
          <div className={`hidden lg:flex flex-col justify-center text-white space-y-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="space-y-4">
              <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 animate-pulse">
                Welcome
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  Back
                </span>
              </h1>
              <p className="text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '1s' }}>
                Continue your freelancing journey with style
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: "🚀", title: "Instant Access", desc: "Jump right back into your projects", delay: "1.2s", gradient: "from-pink-500 to-purple-500" },
                { icon: "💼", title: "Your Dashboard", desc: "Manage all your work in one place", delay: "1.4s", gradient: "from-purple-500 to-indigo-500" },
                { icon: "⭐", title: "Premium Tools", desc: "Access advanced features", delay: "1.6s", gradient: "from-indigo-500 to-blue-500" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 group opacity-0 animate-slide-in-left`}
                  style={{ animationDelay: item.delay, animationFillMode: 'forwards' }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
                    <span className="text-xl animate-bounce" style={{ animationDelay: item.delay }}>{item.icon}</span>
                  </div>
                  <div className="transform transition-all duration-300 group-hover:translate-x-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`pt-8 opacity-0 animate-fade-in`} style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="flex -space-x-2">
                  {['from-pink-400 to-purple-400', 'from-purple-400 to-indigo-400', 'from-indigo-400 to-blue-400'].map((gradient, i) => (
                    <div 
                      key={i}
                      className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-full border-2 border-white shadow-lg animate-pulse`}
                      style={{ animationDelay: `${2 + i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <span className="text-sm font-medium">Join 10,000+ active freelancers</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`w-full max-w-md mx-auto transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8 animate-fade-in">
              <h1 className="text-5xl font-bold text-white mb-3">
                Solo
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse">
                  Grind
                </span>
              </h1>
              <p className="text-gray-300 text-lg">Welcome back to your journey</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl hover:bg-white/15 hover:scale-[1.02] relative overflow-hidden">
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100 blur-xl"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <h2 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                    Sign In
                  </h2>
                  <p className="text-gray-300">Access your SoloGrind account</p>
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 mb-6 animate-shake">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <span className="text-red-300 font-medium">{errorMsg}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Email Field */}
                  <div className={`animate-slide-in-up`} style={{ animationDelay: '1s', animationFillMode: 'forwards', opacity: 0 }}>
                    <label className="block text-white font-medium mb-3 text-sm uppercase tracking-wide">Email Address</label>
                    <div className="relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-4 pl-12 rounded-xl bg-white/10 border-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/25 scale-[1.02]' 
                            : 'border-white/30 hover:border-white/50'
                        }`}
                        placeholder="Enter your email"
                      />
                      <svg
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                          focusedField === 'email' ? 'text-purple-400 scale-110' : 'text-gray-400'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      {focusedField === 'email' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-10 blur-sm animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className={`animate-slide-in-up`} style={{ animationDelay: '1.2s', animationFillMode: 'forwards', opacity: 0 }}>
                    <label className="block text-white font-medium mb-3 text-sm uppercase tracking-wide">Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-4 pl-12 pr-12 rounded-xl bg-white/10 border-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          focusedField === 'password' 
                            ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/25 scale-[1.02]' 
                            : 'border-white/30 hover:border-white/50'
                        }`}
                        placeholder="Enter your password"
                      />
                      <svg
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                          focusedField === 'password' ? 'text-purple-400 scale-110' : 'text-gray-400'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
                      </svg>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z" />
                          </svg>
                        )}
                      </button>
                      {focusedField === 'password' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-10 blur-sm animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={`animate-slide-in-up`} style={{ animationDelay: '1.4s', animationFillMode: 'forwards', opacity: 0 }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden ${
                        isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 active:scale-95"
                      }`}
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-xl blur-lg"></div>
                      
                      <div className="relative z-10">
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3 group">
                            <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                            </svg>
                            <span>Sign In to SoloGrind</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Signup Link */}
                  <div className={`text-center pt-6 border-t border-white/20 animate-fade-in`} style={{ animationDelay: '1.6s', animationFillMode: 'forwards', opacity: 0 }}>
                    <p className="text-gray-300">
                      New to SoloGrind?{" "}
                      <a 
                        href="/signup" 
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 decoration-purple-400"
                      >
                        Create your account
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default Login