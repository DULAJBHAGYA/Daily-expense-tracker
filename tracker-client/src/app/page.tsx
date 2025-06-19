"use client"
import React from 'react';
import Image from "next/image";
import { ArrowRight, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandinPage() {
  const router = useRouter();

  const handleClick = () => {
      router.push('/sign-in')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col">
      {/* Navigation */}
      <nav className="relative z-50 px-20 py-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
            <span className="text-4xl font-bold text-slate-800">WeSpend</span>
          </div>
          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-800 leading-tight">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    WeSpend
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Take control of your finances with our intuitive expense tracking platform. 
                  Monitor spending, set budgets, and achieve your financial goals effortlessly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button  onClick={handleClick} className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2">
                  <span>Click Here to Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Monthly Overview</h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">Total Spent</div>
                          <div className="text-sm text-slate-600">This month</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-slate-800">2,847 lkr</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Food & Dining</span>
                        <span className="text-sm font-medium">847 lkr</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Transportation</span>
                        <span className="text-sm font-medium">420 lkr</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}