'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GraduationCap, Calendar, BarChart3, Eye, LogIn, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { formatDate } from '@/lib/util';
import { FilteredDataProps } from '@/lib/constant';
import { demoAttendanceData, demoTimeTable, demoTrendData, features, filteredData, stats } from '@/lib/dummy';

const AttendanceTrackerLanding = () => {
  const { data, status } = useSession();

  const router = useRouter()
  if (data?.user && status === 'authenticated') {
    router.push('/dashboard');
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="flex  items-center space-x-8">
            <a href="#features" className="text-gray-300 hidden md:flex  hover:text-white transition-colors">Features</a>
            <a href="#demo" className="text-gray-300 hidden md:flex  hover:text-white transition-colors">Demo</a>

            <div className="flex items-center space-x-3">
              <Link href={'/sign-in'} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}

        </div>


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

      <section className="bg-[#0d1117] mt-3   px-60 max-md:px-2  p-4 rounded-3xl text-white">
        <h2 className="text-3xl text-center font-semibold mb-4">Maintain Streaks</h2>
        <CalendarHeatmap
          className="focus:outline-none"
          endDate={'2025-12-12'}
          showWeekdayLabels={false}
          values={filteredData}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            const count = Math.min(value.count, 4);
            return `color-github-dark-${count}`;
          }}
          tooltipDataAttrs={(value: FilteredDataProps) => ({
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': value.date
              ? `${value.count} present on ${formatDate(value.date)}`
              : 'Not present',
          })}
          horizontal={true}
          gutterSize={2}
        />
        <ReactTooltip id="heatmap-tooltip" />
        <div className="flex items-center gap-2 mt-4 text-sm">
          <span className="text-gray-400">Less</span>
          <div className="w-4 h-4 bg-[#151B23] border border-gray-600 rounded-sm" />
          <div className="w-4 h-4 bg-[#0e4429] rounded-sm" />
          <div className="w-4 h-4 bg-[#006d32] rounded-sm" />
          <div className="w-4 h-4 bg-[#26a641] rounded-sm" />
          <div className="w-4 h-4 bg-[#39d353] rounded-sm" />
          <span className="text-gray-400">More</span>
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
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
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
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'present' ? 'bg-green-500 bg-opacity-20 text-green-200' :
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
            {features?.map((feature, index) => (
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

