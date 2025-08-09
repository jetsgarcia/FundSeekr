"use client";

import { SignIn } from "@stackframe/stack";

export default function LoginPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex overflow-hidden">
      {/* Left side - Enhanced Features (mirrors Sign Up page) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-12 py-5 flex-col justify-center items-center text-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-28 translate-x-28"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
              Welcome to FundSeekr!
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mb-6">
              Connect with founders or investors and grow your startup together with
              FundSeekr, the matchmaking platform with AI-powered Pitch Generation
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form (mirrors Sign Up layout) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-md w-full">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
