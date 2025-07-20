'use client'
// import React, { useEffect, useState } from 'react';
// import { Scissors, ChevronRight, Sparkles } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { getSession, signIn } from 'next-auth/react';
// import Link from 'next/link';


// const SignInPage = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAnimation, setShowAnimation] = useState(false);

//   async function myFunction() {
//     const session = await getSession();
//     if(session?.user){
//       router.push(`/dashbord`);
//     }
//   }

//   useEffect(() => {
//     myFunction();
//     setTimeout(() => setShowAnimation(true), 100);
//   }, []);

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true);
//     try {
//       await signIn('google');
//     } catch (error) {
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Background Animation */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
//         <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 opacity-30">
//           <Scissors className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDelay: '0s' }} />
//         </div>
//         <div className="absolute top-1/3 right-1/3 opacity-30">
//           <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
//         </div>
//         <div className="absolute bottom-1/4 right-1/4 opacity-30">
//           <Scissors className="w-10 h-10 text-blue-400 animate-bounce" style={{ animationDelay: '2s' }} />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen mt-10 max-md:mt-0 flex items-center justify-center px-6">
//         <div className="max-w-md w-full">
//           {/* Logo and Brand */}
//           <div className={`text-center mb-12 transform transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
//             <Link href={'/'} className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 max-md:mb-3 shadow-lg">
//               <Scissors className="w-10 h-10 text-white" />
//             </Link>
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
//               Sign-in
//             </h1>
//             <div className="text-2xl md:text-3xl font-semibold text-gray-300 mb-2">
//               <span className="text-purple-400">No wait</span> && <span className="text-pink-400">haircut</span>
//             </div>
//             <p className="text-gray-400 text-lg">
//               Welcome back to Quick Haircut
//             </p>
//           </div>

//           {/* Sign In Card */}
//           <div className={`bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl transform transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
//               <p className="text-gray-300">Sign in to manage your appointments and find nearby salons</p>
//             </div>

//             {/* Google Sign In Button */}
//             <button 
//               onClick={handleGoogleSignIn}
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-8 py-4 font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   <h2 className='whitespace-nowrap'>Sign in with Google</h2>
//                 </>
//               )}
//             </button>



//             {/* Features Preview */}
//             <div className="mt-8 pt-6 border-t border-white/20">
//               <p className="text-center text-gray-300 text-sm mb-4">What you'll get:</p>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="flex items-center gap-2 text-gray-300">
//                   <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//                   Real-time queue updates
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-300">
//                   <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
//                   Appointment booking
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-300">
//                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                   Service history
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-300">
//                   <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//                   Nearby salon finder
//                 </div>
//               </div>
//             </div>
//           </div>


//       {/* Back to Home */}
//       <div className="absolute top-6 left-6 z-20">
//         <button 
//           onClick={() => router.push('/')}
//           className="bg-white/10 backdrop-blur-sm text-white rounded-full p-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all transform hover:scale-105"
//         >
//           <ChevronRight className="w-5 h-5 rotate-180" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;

import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowLeft, Shield, Users, Zap, Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google OAuth process
    setTimeout(() => {
      setIsLoading(false);
      // Here you would redirect to Google OAuth or handle the authentication
      alert('Redirecting to Google Sign In...');
    }, 2000);
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with Google OAuth 2.0'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Different dashboards for students, teachers, and admins'
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Get started immediately with your Google account'
    }
  ];

  // Demo stats animation
  const [currentStat, setCurrentStat] = useState(0);
  const stats = ['10K+ Students', '500+ Schools', '99.9% Uptime', '24/7 Support'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F0F1A' }}>

       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         {/* Floating Orbs */}
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
         <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>      
         <div className="absolute inset-0">
           {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            className="flex absolute top-10 left-10   bg-[#ffffff1a] rounded-full p-2   group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft fill='white' size={20} className=" group-hover:-translate-x-1 transition-transform duration-300" />
          </button>

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-400">Sign in to your Be Present account</p>
          </div>

          {/* Sign In Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Sign in with Google</h2>
              <p className="text-gray-400 text-sm">Access your dashboard securely</p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-30 rounded-xl">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-purple-400 font-medium mb-1">Secure Authentication</p>
                  <p className="text-xs text-gray-300">We use Google OAuth 2.0 for secure access. Your Google password is never shared with us.</p>
                </div>
              </div>
            </div>
 
          </div>

          <div className="mb-8">
            <div className="h-16 flex items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-500">
                {stats[currentStat]}
              </div>
            </div>
          </div> 

          <div className="mt-8 text-center">  
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SignInPage;


