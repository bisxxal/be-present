'use client'
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  Eye,
  Clock,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '500+', label: 'Institutions' },
    { number: '24/7', label: 'Support' }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Monitor attendance instantly with live updates and notifications for immediate insights.',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reports and analytics to identify patterns and improve attendance rates.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access from any device with our responsive design and native mobile apps.',
      gradient: 'from-orange-500 to-yellow-400'
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Role-based access control for administrators, teachers, and students.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automated timetable integration with intelligent attendance predictions.',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const demoTimeTable = [
    { subject: 'Mathematics', time: '9:00 AM', room: 'Room 101', status: 'present' },
    { subject: 'Physics', time: '10:30 AM', room: 'Lab 202', status: 'late' },
    { subject: 'Chemistry', time: '1:00 PM', room: 'Lab 301', status: 'upcoming' },
    { subject: 'English', time: '2:30 PM', room: 'Room 105', status: 'upcoming' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0F0F1A' }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Moving Particles */}
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

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">Be Present</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Features</a>
            <a href="#demo" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Demo</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Pricing</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">Contact</a>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:bg-purple-500/10">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                <button className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:scale-105 transition-all duration-300">Sign In</button>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-all duration-300">Sign Up</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="transform transition-all duration-1000"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp">
                Smart <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">Attendance</span>
                <br />Management System
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp delay-200">
                Revolutionize how you track, analyze, and manage attendance with our cutting-edge platform. 
                Perfect for schools, colleges, and organizations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-fadeInUp delay-400">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden">
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="group px-8 py-4 border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500 hover:bg-opacity-10 transition-all duration-300 flex items-center hover:scale-105">
                <Eye className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-110 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${600 + index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 group-hover:animate-pulse">{stat.number}</div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative z-10 px-6 py-16 bg-gradient-to-b from-transparent via-gray-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 animate-fadeInUp">See It In Action</h2>
            <p className="text-xl text-gray-300 animate-fadeInUp delay-200">Experience the power of our attendance tracking system</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Today's Attendance Card */}
            <div className="group bg-gradient-to-br from-slate-800/50 via-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-xl mb-6 text-center flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                  Today's Attendance
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-2xl animate-pulse">
                      94%
                    </div>
                    <div className="absolute -inset-4 rounded-full border-4 border-gradient-to-r from-green-500/30 to-emerald-400/30 animate-spin"></div>
                  </div>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-gray-300">Present</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse delay-200"></div>
                    <span className="text-sm text-gray-300">Absent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Trends Card */}
            <div className="group bg-gradient-to-br from-slate-800/50 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-xl mb-6 text-center flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  Attendance Trends
                </h3>
                <div className="h-64 flex items-end justify-center space-x-2">
                  {[85, 92, 78, 96, 88, 94, 89].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-1000 hover:scale-110"
                      style={{ 
                        height: `${height}%`,
                        width: '20px',
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Timetable Card */}
            <div className="group bg-gradient-to-br from-slate-800/50 via-emerald-900/20 to-green-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-xl mb-6 text-center flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                  Today's Schedule
                </h3>
                <div className="space-y-3">
                  {demoTimeTable.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 backdrop-blur-sm rounded-xl hover:bg-slate-600/40 transition-all duration-300 group-hover:scale-105 border border-slate-600/30">
                      <div>
                        <div className="text-white font-medium">{item.subject}</div>
                        <div className="text-gray-400 text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time} • {item.room}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        item.status === 'present' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' :
                        item.status === 'late' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {item.status === 'present' ? 'Present' : 
                         item.status === 'late' ? 'Late' : 'Upcoming'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to manage attendance effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 border-y border-purple-500/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fadeInUp">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 animate-fadeInUp delay-200">
            Join thousands of institutions already using Be Present to streamline their attendance management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Start Your Free Trial
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500 hover:bg-opacity-10 transition-all duration-300 hover:scale-105">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Be Present</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Be Present. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;