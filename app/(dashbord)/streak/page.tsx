'use client'
import { useFilteredDate } from '@/hooks/useFilteredData';
import { calculateStreak } from '@/lib/streak';
import { badgeImages, countHowManyDays, getUnlockedAchievements, weeklyDataFormatedata } from '@/lib/util';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Activity, Award, BarChart3, Calendar, CheckCircle2, Clock, Flame, Target, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const ProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const today = useMemo(() => new Date(), []);
  const defaultStart = startOfMonth(today);
  const defaultEnd = endOfMonth(today);

  const [badge, setBadge] = useState<number>();

  const { presentData, totalPersentages, dateData, } = useFilteredDate(defaultStart, defaultEnd)

  useEffect(() => {
    const res = calculateStreak(dateData)
    setBadge(res);
  }, [dateData, badge])

  const weeklyData = weeklyDataFormatedata(dateData);
  const monthlyStats = {
    attendedDays: presentData.find(item => item.type === 'present')?.value || 0,
    missedDays: presentData.find(item => item.type === 'absent')?.value || 0,
    currentStreak: badge || 0,
    totalClasses: typeof window !== 'undefined' && localStorage.getItem('classes') ? Number(localStorage.getItem('classes')) : 0,
  };

  const attendedPercent = monthlyStats.totalClasses ? (monthlyStats.attendedDays / monthlyStats.totalClasses) * 100 : 0;
  const missedPercent = monthlyStats.totalClasses ? (monthlyStats.missedDays / monthlyStats.totalClasses) * 100 : 0;

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    percentage = parseFloat(percentage);
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
              <stop offset="100%" stopColor="#8b5cf6" /> {/* purple-500 */}
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#374151" // gray-700
            strokeWidth={strokeWidth}
          />

          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="butt"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{(percentage)}%</span>
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
     {badgeImages(badge)?.name && <p className="text-orange-200 mt-3 font-medium">You have Got {badgeImages(badge)?.name}  </p>}
      <p className="text-orange-200 mt-3 font-medium"> {countHowManyDays(badge)?.count} more to day to get {countHowManyDays(badge)?.badgeName}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}

        <div className="text-center mb-12 max-md:mb-8">
          <div className="inline-flex   max-md:flex-col max-md:w-full  max-md:mb-0 items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Streak Tracker
            </h1>

            {badge ? badgeImages(badge)?.img && <Image loading='lazy' width={200} height={200} src={badgeImages(badge as string)?.img} className=' border-none outline-none w-36 h-36 max-md:w-52 max-md:h-52  ' alt="" /> : ''}
          </div>
          <p className="text-gray-300  max-w-2xl mx-auto">
            Monitor your attendance journey with detailed insights and visual progress tracking
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Attendance Rate */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Attendance Rate</h3>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-center">
              <CircularProgress percentage={totalPersentages[0]?.percentage || '0%'} size={100} />
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
              <div className="text-4xl mt-1 font-bold text-white mb-2">{monthlyStats.attendedDays}</div>
              <div className="text-sm mt-5 font-medium text-green-200 mb-2">out of {monthlyStats.totalClasses} classes</div>
            </div>
          </div>

        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-2 border border-gray-700/50">
            {['week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${selectedPeriod === period
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 max-md:px-2 border border-gray-700/50 shadow-xl mb-12">
            <div className="flex items-center max-md:justify-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl max-md:text-xl font-bold text-white">This Week's Attendance</h2>
            </div>
            <div className="center flex-wrap gap-4 max-md:gap-2">
              {weeklyData.map((day, index) => (
                <div
                  key={index}
                  className={`w-[150px] border rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 ${day.attended === true
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30  border-green-500/50'
                    : day.attended === 'pending' ? " bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 " : 'bg-gradient-to-br from-red-500/30 to-pink-500/30 border border-red-500/50'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-lg font-bold text-white mb-1">{day.date}</div>
                  <div className="text-sm text-gray-300 mb-2">{day.day}</div>
                  {day.attended === true ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto" />
                  ) : (
                    day.attended === 'pending' ? (
                      <Clock className="w-6 h-6 text-yellow-400 mx-auto" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                    ))}
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
                      <span className="text-white">{monthlyStats.attendedDays} /  {Number(monthlyStats.totalClasses)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: attendedPercent ? `${attendedPercent}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-red-400">Missed Days</span>
                      <span className="text-white">{monthlyStats.missedDays} / {Number(monthlyStats.totalClasses)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: missedPercent ? `${missedPercent}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Stats */}
              <div className="flex justify-center">
                <CircularProgress percentage={totalPersentages[0]?.percentage || '0'} size={150} strokeWidth={12} />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 max-md:px-6 border border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievement Progress</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {getUnlockedAchievements(badge).map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:scale-105 ${achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                  : 'bg-gray-800/50 border-gray-600/50'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-24 h-24  rounded-full center mx-auto mb-3 flex items-center justify-center ${achievement.unlocked ? 'bg-yellow-500/80' : 'bg-gray-600'
                  }`}>
                  {/* <Award className="w-6 h-6 text-white" /> */}
                  <Image loading='lazy' width={150} height={150} src={achievement.img} className=' drop-shadow-md drop-shadow-[#00000080] border-none outline-none w-full h-full ' alt="" />
                </div>
                <h3 className={`font-semibold mb-2 text-sm ${achievement.unlocked ? 'text-yellow-200' : 'text-gray-400'
                  }`}>
                  {achievement.name}
                </h3>
                <p className={`text-xs ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-500'
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