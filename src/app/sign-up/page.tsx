import { SignUp } from '@stackframe/stack';
import { TrendingUp, Zap, Shield, Mail } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex overflow-hidden">
     
          
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-md w-full">

      <div>
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
</div>

  );
}