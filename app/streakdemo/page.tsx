'use client'
import React, { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { benefits, streakData } from '@/lib/dummy';

const StreakInfoPage = () => {
  const [activeCard, setActiveCard] = useState(0);
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative ">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 animate-fade-in">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Attendance Streaks
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transform your attendance into a game of consistency. Build powerful habits, earn rewards,
              and watch your academic success soar with our streak system.
            </p>
          </div>

          {/* What is a Streak Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-700/50 shadow-2xl animate-slide-up">
              <div className="flex items-start gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    What is an Attendance Streak?
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    An attendance streak is the number of consecutive days you've attended classes without missing a single session.
                    It's your commitment meter – showing how dedicated you are to your education.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <h3 className="text-green-400 font-semibold mb-2">✅ Streak Continues When:</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• You attend all scheduled classes</li>
                        <li>• You mark attendance on time</li>
                        <li>• You maintain consistency daily</li>
                      </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <h3 className="text-red-400 font-semibold mb-2">❌ Streak Breaks When:</h3>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• You miss any scheduled class</li>
                        <li>• You forget to mark attendance</li>
                        <li>• You have an unexcused absence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Badges Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-fade-in">
              Unlock Amazing Badges
            </h2>
            <div className=" flex flex-wrap justify-center gap-6 ">
              {streakData.map((streak, index) => {
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up group`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setActiveCard(index)}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 bg-gr adient-to-r ${streak.color} rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Image width={100} height={100} src={streak.icon} className=' w-36 h-36  ' alt="" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-2xl font-bold text-white">{streak.length}</span>
                          <span className={`px-3 py-1 bg-gradient-to-r ${streak.color} text-white text-sm font-semibold rounded-full`}>
                            {streak.badge}
                          </span>
                        </div>
                        <p className="text-gray-300 text-lg">{streak.message}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${streak.color} ${activeCard === index ? 'animate-ping' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Why Streaks Matter
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                  >
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>


          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 shadow-2xl animate-fade-in">
              <Flame className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Streak?</h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Every journey begins with a single step. Start attending consistently today and watch your streak grow!
              </p>
              <button className="bg-white text-orange-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Begin Your Streak Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StreakInfoPage;