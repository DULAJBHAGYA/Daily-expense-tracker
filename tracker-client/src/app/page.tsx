"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ArrowRight, Wallet, TrendingUp, Shield, Zap, CheckCircle, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/utils/theme';

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    router.push('/sign-in')
  }

  if (!mounted) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col transition-colors duration-200 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 px-4 sm:px-20 py-8 sm:py-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
              <span className="text-2xl sm:text-4xl font-bold text-slate-800">WeSpend</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      💶 Smart Finance Management
                    </div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-slate-800">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                      WeSpend
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl leading-relaxed max-w-lg text-slate-600">
                    Take control of your finances with our intuitive expense tracking platform. 
                    Monitor spending, set budgets, and achieve your financial goals effortlessly.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleClick} className="group px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 shadow-lg">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-300">
                    Watch Demo
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Free Forever</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Bank-Level Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Real-time Sync</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Smart Analytics</span>
                  </div>
                </div>
              </div>

              {/* Simple Dashboard Preview for non-mounted state */}
              <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-3xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white/80 backdrop-blur-sm border border-white/20">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800">Monthly Overview</h3>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm sm:text-base text-slate-800">Total Spent</div>
                            <div className="text-xs sm:text-sm text-slate-600">This month</div>
                          </div>
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-slate-800">2,847 lkr</div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-slate-600">Food & Dining</span>
                          <span className="text-xs sm:text-sm font-medium text-slate-700">847 lkr</span>
                        </div>
                        <div className="w-full rounded-full h-2 bg-slate-200">
                          <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-slate-600">Transportation</span>
                          <span className="text-xs sm:text-sm font-medium text-slate-700">420 lkr</span>
                        </div>
                        <div className="w-full rounded-full h-2 bg-slate-200">
                          <div className="bg-emerald-400 h-2 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-slate-50 to-emerald-50'} flex flex-col transition-colors duration-200 overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${theme === 'dark' ? 'bg-emerald-900' : 'bg-emerald-200'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-200'}`}></div>
        <div className={`absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-200'}`}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-20 py-8 sm:py-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
            <span className={`text-2xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>WeSpend</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                    💶 Smart Finance Management
                  </div>
                </div>
                <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    WeSpend
                  </span>
                </h1>
                <p className={`text-lg sm:text-xl leading-relaxed max-w-lg ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                  Take control of your finances with our intuitive expense tracking platform. 
                  Monitor spending, set budgets, and achieve your financial goals effortlessly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleClick} className="group px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 shadow-lg">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Real-time Sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Smart Analytics</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block pt-16">
              {/* Enhanced Dashboard Preview with Interactive Elements */}
              <div className={`relative z-20 rounded-3xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 backdrop-blur-sm border -mt-12 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/20' : 'bg-white/80 border-white/20'}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Monthly Overview</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className={`font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Total Spent</div>
                          <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>This month</div>
                        </div>
                      </div>
                      <div className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>2,847 lkr</div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Food & Dining</span>
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>847 lkr</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-200'}`}>
                        <div className="bg-emerald-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Transportation</span>
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>420 lkr</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-200'}`}>
                        <div className="bg-emerald-400 h-2 rounded-full w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Mobile App Preview */}
              <div className="absolute -bottom-8 -right-8 w-32 h-64 rounded-3xl shadow-2xl bg-gray-900 p-2 transform -rotate-12 hover:rotate-0 transition-transform duration-500 z-30">
                <div className="w-full h-full bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-2xl p-3 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                    <div className="text-white text-xs font-medium">WeSpend</div>
                  </div>
                  <div className="flex-1 bg-white/20 rounded-lg p-2">
                    <div className="space-y-2">
                      <div className="h-2 bg-white/30 rounded animate-pulse"></div>
                      <div className="h-2 bg-white/30 rounded w-3/4 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="h-2 bg-white/30 rounded w-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Statistics Card */}
              <div className={`absolute top-8 -left-8 w-48 h-32 rounded-2xl shadow-xl backdrop-blur-sm border transform rotate-6 hover:rotate-0 transition-transform duration-500 z-30 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/20' : 'bg-white/90 border-white/20'}`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div className="text-xs text-emerald-500 font-medium animate-pulse">+12.5%</div>
                  </div>
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>lkr 2.4M</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Saved by users</div>
                </div>
              </div>

              {/* Enhanced Feature Showcase */}
              <div className={`absolute bottom-8 -left-4 w-56 rounded-2xl shadow-xl backdrop-blur-sm border transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-30 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/20' : 'bg-white/90 border-white/20'}`}>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Bank-Level Security</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>256-bit encryption</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Real-time Sync</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Instant updates</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple & Clean Elements */}
              
              {/* Main Statistics Card - Top Right */}
              <div className={`absolute top-8 -right-4 w-44 rounded-2xl shadow-xl backdrop-blur-sm border transform rotate-2 hover:rotate-0 transition-transform duration-500 z-30 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/20' : 'bg-white/90 border-white/20'}`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div className="text-xs text-emerald-500 font-medium animate-pulse">+12.5%</div>
                  </div>
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>lkr 2.4M</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Saved by users</div>
                </div>
              </div>

              {/* Quick Add Button - Bottom Right */}
              <div className={`absolute bottom-8 -right-4 w-36 rounded-2xl shadow-xl backdrop-blur-sm border transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-30 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/20' : 'bg-white/90 border-white/20'}`}>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Quick Add</span>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">+</span>
                    </div>
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Tap to add expense</div>
                </div>
              </div>

              {/* Green Blob Background Elements for Right Side */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-400 rounded-full opacity-20 animate-blob z-10"></div>
              <div className="absolute -bottom-12 -right-4 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-blob animation-delay-2000 z-10"></div>
              <div className="absolute top-1/3 -right-2 w-20 h-20 bg-emerald-500 rounded-full opacity-12 animate-blob animation-delay-4000 z-10"></div>
              <div className="absolute bottom-1/3 -right-6 w-16 h-16 bg-emerald-200 rounded-full opacity-18 animate-blob animation-delay-1000 z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}