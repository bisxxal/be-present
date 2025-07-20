'use client'
import { getAttendance } from '@/action/attendance.action';
import TimeTable from '@/components/timeTable';
import { AttendanceDataProps } from '@/lib/constant';
import { COLORS2 } from '@/lib/util';
import { useQuery } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GraduationCap, Pause, Play, RotateCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const DashBoardMainaPage = () => {
  const { data: session } = useSession();
  const [presentData, setPresentData] = useState<{ type: string; value: number }[]>([])
  const [totalPersentages, setTotalPercentages] = useState<{ type: string; percentage: string }[]>([])

  const today = new Date();
  const defaultStart = startOfMonth(today);
  const defaultEnd = endOfMonth(today);

  const { data } = useQuery({
    queryKey: ['attendance', defaultStart, defaultEnd],
    queryFn: (async () => await getAttendance(defaultStart, defaultEnd)),
  });

  useEffect(() => {
    if (!data?.data) return;
    const attendanceList: AttendanceDataProps[] = data.data;
    const presentCount = { present: 0, absent: 0 };
    attendanceList.forEach(entry => {
      if (entry.present) {
        presentCount.present += 1;
      } else {
        presentCount.absent += 1;
      }
    });

    const total = presentCount.present + presentCount.absent;
    const percentages = [
      { type: 'present', percentage: ((presentCount.present / total) * 100).toFixed(2) + '%', },
      { type: 'absent', percentage: ((presentCount.absent / total) * 100).toFixed(2) + '%', },
    ];
    setPresentData([
      { type: 'present', value: presentCount.present },
      { type: 'absent', value: presentCount.absent },
    ]);
    setTotalPercentages(percentages);
  }, [data]);

     const [currentTime, setCurrentTime] = useState(new Date());
      const [animationPaused, setAnimationPaused] = useState(false);
    
      useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
      }, []);
  return (
    <div className=' w-full p-20 max-md:p-2'>

         <header className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="relative z-10 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Student Portal</h1>
                <p className="text-gray-400">Track your academic journey</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-mono text-white">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-gray-400">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='text-3xl text-center mb-6 max-md:mt-20 font-bold'>Welcome , <span className=' bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-rose-500'>👋🏻 {session?.user?.name} !!</span> 
        <p className=' bg-clip-text  text-transparent bg-gradient-to-br from-indigo-500 to-pink-500'>{new Date().getDay() === 0 ? 'Happy sunday 🎉' :''}</p>
      </div>


        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, Alex! 👋
              </h2>
              <p className="text-gray-300 text-lg">
                You have <span className="text-purple-400 font-semibold">3 classes</span> today. 
                Your current attendance rate is <span className="text-green-400 font-semibold">89.7%</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setAnimationPaused(!animationPaused)}
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                {animationPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      <TimeTable type='view' />

      <div className=' w-full mt-10 max-md:flex-col flex justify-evenly px-10 max-md:px-2 h-[400px] border-2 border-[#ffffff21] rounded-3xl items-center'>
        <div className=' w-[50px] max-md:w-full'>
          <PieChart width={400} height={400}>
            <Pie data={presentData} dataKey="value"
              paddingAngle={3}
              fill="red"
              cx="50%" cy="50%" nameKey='type' innerRadius={80} outerRadius={120}
              label={(entry) => `${entry.type}`}
            >
              {presentData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: 'white',
                fontWeight: 'bold',
              }} />
          </PieChart>
        </div>
        <div className='flex flex-col text-lg font-medium justify-between'>
          {totalPersentages.map((item, index) => (
            <div key={index} className='flex gap-1 justify-between items-center'>
              <span className='text-white capitalize'>{item.type}</span>:
              <span className='text-white'>{item.percentage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashBoardMainaPage