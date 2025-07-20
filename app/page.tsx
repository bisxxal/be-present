'use client'; 
  
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GraduationCap, Calendar, Users, Award,Shield,Zap,BarChart3,Eye,LogIn,UserPlus,Menu,X, Smartphone, Clock, TrendingUp} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AttendanceTrackerLanding = () => {
  const {data ,status} = useSession();

  const router = useRouter()
  if(data?.user && status === 'authenticated') {
    router.push('/dashboard');
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const demoAttendanceData = [
    { name: 'Present', value: 89, color: '#a48fff' },
    { name: 'Absent', value: 30, color: '#EF4444' },
  ];

  const demoTrendData = [
    { month: 'Jan', rate: 25 },
    { month: 'Feb', rate: 88 },
    { month: 'Mar', rate: 32 },
    { month: 'Apr', rate: 39 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: 41 },
    { month: 'Jul', rate: 51 },
    { month: 'Aug', rate: 91 },
    { month: 'Nov', rate: 11 },
    { month: 'Dec', rate: 61 },
  ];

  const demoTimeTable = [
    { time: '09:00 AM', subject: 'C++', room: 'Room 101', status: 'present' },
    { time: '10:30 AM', subject: 'Java', room: 'Lab A', status: 'present' },
    { time: '02:00 PM', subject: 'Python', room: 'Lab B', status: 'late' },
    { time: '03:30 PM', subject: 'Java script', room: 'Room 205', status: 'upcoming' }
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

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Schools & Colleges' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];
 
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F1A' }}>
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
      <nav className="border-b border-gray-800 max-md:px-3 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 max-md:space-x-2">
            <div className="w-10 h-10 max-md:w-9 max-md:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold max-md:tex-lg text-white">Be Present</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
            
            <div className="flex items-center space-x-3">
              <Link href={'/sign-in'} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                 <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden rounded-3xl overflow-hidden absolute backdrop-blur-2xl w-1/2 right-0  mt-4 pb-4 border p-2 px-4 border-gray-800 pt-4">
            <div className="flex flex-col center space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-white">Demo</a>
                <Link href={'/sign-in'} className="px-4 py-2 w-full center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Attendance</span>
              <br />Management System
            </h1>
            <p className="text-base text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionize how you track, analyze, and manage attendance with our cutting-edge platform. 
              Perfect for schools, colleges, and organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link href={'/sign-in'} className="px-8 py-4 max-md:w-[90%] bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </Link>
              <button className="px-8 py-4 max-md:w-[90%] center border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500 hover:bg-opacity-10 transition-all duration-300 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="px-6 py-16 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-xl max-md:text-base text-gray-300">Experience the power of our attendance tracking system</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Attendance Overview Pie Chart */}
            <div className="bg-gradient-to-br from-slate-800/50 via-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden ">
              <h3 className="text-white center font-semibold text-xl mb-6 text-center  gap-2">Today's Attendance  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" /></h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={demoAttendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={3000}
                  >
                    {demoAttendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {demoAttendanceData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Trend Area Chart */}
            <div className=" group bg-gradient-to-br from-slate-800/50 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
              <h3 className="text-white font-semibold text-xl mb-6 center text-center  gap-2">Attendance Trends <BarChart3 className="w-5 h-5 mr-2 text-blue-400" /></h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={demoTrendData}>
                  <CartesianGrid strokeDasharray="1 1" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  {/* <YAxis stroke="#9CA3AF" /> */}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#8B5CF6" 
                    fill="url(#colorGradient)" 
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Timetable */}
            <div className="group bg-gradient-to-br from-slate-800/50 via-emerald-900/20 to-green-900/20 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 relative overflow-hidden">
              <h3 className="text-white font-semibold text-xl mb-6 text-center center gap-2 ">Today's Schedule                   <Calendar className="w-5 h-5 mr-2 text-emerald-400" /></h3>
              <div className="space-y-4">
                {demoTimeTable.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 backdrop-blur-sm rounded-xl hover:bg-slate-600/40 transition-all duration-300 group-hover:scale-105 border border-slate-600/30">
                    <div>
                      <div className="text-white font-medium">{item.subject}</div>
                      <div className="text-gray-400 text-sm">{item.time} • {item.room}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'present' ? 'bg-green-500 bg-opacity-20 text-green-200' :
                      item.status === 'late' ? 'bg-yellow-500 bg-opacity-20 text-yellow-200' :
                      'bg-blue-500 bg-opacity-20 text-blue-200'
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
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl max-md:text-base text-gray-300">Everything you need to manage attendance effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-indigo-800/20 to-slate-900/10 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-y border-purple-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl  max-md:text-base text-gray-300 mb-8">
            Join thousands of institutions already using Be Present to streamline their attendance management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href={'/sign-in'} className="px-8 py-4  max-md:w-[90%]  bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Free Trial
            </Link>
            <button className="px-8 py-4  max-md:w-[90%]  border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:border-purple-500 hover:bg-purple-500 hover:bg-opacity-10 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
 <footer className="px-6 pt-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
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

      </section>

      {/* Footer */}
      
    </div>
  );
};

export default AttendanceTrackerLanding;

   