'use client'
import { getAttendance } from '@/action/attendance.action';
import TimeTable from '@/components/timeTable';
import { AttendanceDataProps } from '@/lib/constant';
import { COLORS2 } from '@/lib/util';
import { useQuery } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
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

  return (
    <div className=' w-full p-20 max-md:p-2'>
      <div className='text-3xl text-center mb-6 font-bold'>Welcome , <span className=' bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-rose-500'>👋🏻 {session?.user?.name} !!</span> 
        <p className=' bg-clip-text  text-transparent bg-gradient-to-br from-indigo-500 to-pink-500'>{new Date().getDay() === 0 ? 'Happy sunday 🎉' :''}</p>
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