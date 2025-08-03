"use client"
import React from 'react';
import Image from "next/image";
import { ArrowRight, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/utils/theme';

export default function LandinPage() {
  const router = useRouter();
  const { theme } = useThemeStore();

  const handleClick = () => {
      router.push('/sign-in')
  }

  return (
    <div className={`h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-slate-50 to-emerald-50'} flex flex-col transition-colors duration-200`}>
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
                <button onClick={handleClick} className="group px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2">
                  <span>Click Here to Get Started</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className={`relative z-10 rounded-3xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Monthly Overview</h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
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
                        <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Transportation</span>
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>420 lkr</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-200'}`}>
                        <div className="bg-emerald-400 h-2 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}