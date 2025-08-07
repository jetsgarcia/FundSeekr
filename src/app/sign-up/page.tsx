import { SignUp } from "@stackframe/stack";
import { TrendingUp, Zap, Shield, Mail } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex overflow-hidden">
      {/* Left side - Enhanced Features */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-12 py-5 flex-col justify-center items-center text-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-28 translate-x-28"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
              Join FundSeekr
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-xl font-medium whitespace-nowrap">
              Connect with the right investors or discover promising startups
            </p>
          </div>

          {/* Enhanced Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group hover:bg-white/10 dark:hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 dark:border-slate-700/50 dark:hover:border-slate-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 p-3 rounded-lg shadow group-hover:shadow-lg transition-shadow">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-yellow-200 transition-colors">
                    AI Recommendation Engine
                  </h3>
                  <p className="text-blue-100 text-base leading-relaxed">
                    Smart matchmaking that analyzes profiles to generate highly
                    relevant investor-startup connections
                  </p>
                  <div className="mt-2 flex items-center text-yellow-200 text-xs font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    Artificial Intelligence
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:bg-white/10 dark:hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 dark:border-slate-700/50 dark:hover:border-slate-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 dark:from-emerald-500 dark:to-green-600 p-3 rounded-lg shadow group-hover:shadow-lg transition-shadow">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-green-200 transition-colors">
                    Automated Pitch Generation
                  </h3>
                  <p className="text-blue-100 text-base leading-relaxed">
                    Generate personalized pitch emails tailored to each
                    investor&apos;s profile and preferences
                  </p>
                  <div className="mt-2 flex items-center text-green-200 text-xs font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Save 10+ hours per week
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:bg-white/10 dark:hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 dark:border-slate-700/50 dark:hover:border-slate-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 dark:from-violet-500 dark:to-purple-600 p-3 rounded-lg shadow group-hover:shadow-lg transition-shadow">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-purple-200 transition-colors">
                    Analytics Dashboard
                  </h3>
                  <p className="text-blue-100 text-base leading-relaxed">
                    Track match rates, engagement levels, and optimize your
                    fundraising strategy
                  </p>
                  <div className="mt-2 flex items-center text-purple-200 text-xs font-medium">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Real-time insights & metrics
                  </div>
                </div>
              </div>
            </div>

            <div className="group hover:bg-white/10 dark:hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 dark:border-slate-700/50 dark:hover:border-slate-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-red-400 to-rose-500 dark:from-rose-500 dark:to-red-600 p-3 rounded-lg shadow group-hover:shadow-lg transition-shadow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-red-200 transition-colors">
                    Enterprise Security
                  </h3>
                  <p className="text-blue-100 text-base leading-relaxed">
                    End-to-end encryption and compliance with Philippine Data
                    Privacy Act
                  </p>
                  <div className="mt-2 flex items-center text-red-200 text-xs font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    Bank-grade security standards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-md w-full">
          <SignUp
            fullPage={true}
            automaticRedirect={true}
            firstTab="password"
            extraInfo={
              <>
                By signing up, you agree to our <a href="/terms">Terms</a>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
