'use client'
import React, { useState, useEffect } from 'react';
import { Calendar,  Target, Flame,  CheckCircle2, XCircle, Award, BarChart3, Activity } from 'lucide-react';

const ProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animateProgress, setAnimateProgress] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setAnimateProgress(true), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  // Sample data - replace with your actual data
  const weeklyData = [
    { day: 'Mon', attended: true, date: '15' },
    { day: 'Tue', attended: true, date: '16' },
    { day: 'Wed', attended: true, date: '17' },
    { day: 'Thu', attended: false, date: '18' },
    { day: 'Fri', attended: true, date: '19' },
    { day: 'Sat', attended: true, date: '20' },
    { day: 'Sun', attended: true, date: '21' }
  ];

  const monthlyStats = {
    totalDays: 30,
    attendedDays: 25,
    missedDays: 5,
    attendanceRate: 83.3,
    currentStreak: 12,
    longestStreak: 18
  };

  const achievements = [
    { name: "Getting Started", unlocked: true, streak: 3 },
    { name: "Consistent Champ", unlocked: true, streak: 5 },
    { name: "One Week Wonder", unlocked: true, streak: 7 },
    { name: "Two Week Titan", unlocked: false, streak: 14 },
    { name: "Monthly Master", unlocked: false, streak: 30 }
  ];

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "from-blue-500 to-purple-500" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animateProgress ? strokeDashoffset : circumference}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
              <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  const StreakCounter = ({ streak, label }) => (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Flame className="w-6 h-6 text-orange-400" />
        <span className="text-3xl font-bold text-white">{streak}</span>
        <Flame className="w-6 h-6 text-orange-400" />
      </div>
      <p className="text-orange-200 font-medium">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Progress Tracker
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Monitor your attendance journey with detailed insights and visual progress tracking
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Attendance Rate */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Attendance Rate</h3>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-center">
              <CircularProgress percentage={monthlyStats.attendanceRate} size={100} />
            </div>
          </div>

          {/* Current Streak */}
          <StreakCounter streak={monthlyStats.currentStreak} label="Current Streak" />

          {/* Total Present Days */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-200">Days Present</h3>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{monthlyStats.attendedDays}</div>
              <div className="text-green-200 text-sm">out of {monthlyStats.totalDays} days</div>
            </div>
          </div>

        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-2 border border-gray-700/50">
            {['week', 'month' ].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly View */}
        {selectedPeriod === 'week' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">This Week's Attendance</h2>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {weeklyData.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 ${
                    day.attended
                      ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/50'
                      : 'bg-gradient-to-br from-red-500/30 to-pink-500/30 border border-red-500/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-lg font-bold text-white mb-1">{day.date}</div>
                  <div className="text-sm text-gray-300 mb-2">{day.day}</div>
                  {day.attended ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Progress Chart */}
        {selectedPeriod === 'month' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Monthly Overview</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Progress Bar */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Attendance Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-green-400">Present Days</span>
                      <span className="text-white">{monthlyStats.attendedDays}/{monthlyStats.totalDays}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: animateProgress ? `${(monthlyStats.attendedDays / monthlyStats.totalDays) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-red-400">Missed Days</span>
                      <span className="text-white">{monthlyStats.missedDays}/{monthlyStats.totalDays}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: animateProgress ? `${(monthlyStats.missedDays / monthlyStats.totalDays) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Stats */}
              <div className="flex justify-center">
                <CircularProgress percentage={monthlyStats.attendanceRate} size={150} strokeWidth={12} />
              </div>
            </div>
          </div>
        )}

        {/* Achievement Progress */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievement Progress</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                    : 'bg-gray-800/50 border-gray-600/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-600'
                }`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold mb-2 text-sm ${
                  achievement.unlocked ? 'text-yellow-200' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-xs ${
                  achievement.unlocked ? 'text-yellow-300' : 'text-gray-500'
                }`}>
                  {achievement.streak} day streak
                </p>
                {achievement.unlocked && (
                  <div className="mt-2 text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full">
                    Unlocked!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;