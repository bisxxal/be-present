'use client'
import TimeTable from '@/components/timeTable';
import { useGetAttendance } from '@/hooks/useGetAttendance';
import { AttendanceDataProps, TimeTableProps } from '@/lib/constant';
import { COLORS2 } from '@/lib/util';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const DashBoardMainaPage = () => {
  const { data: session } = useSession();
  const [presentData, setPresentData] = useState<{ type: string; value: number }[]>([])
  const [totalPersentages, setTotalPercentages] = useState<{ type: string; percentage: string }[]>([])
  const [remainingday, setRemaining] = useState(0)
  const [currentClass, setCurrentClass] = useState<TimeTableProps>();
  const [show, setShow] = useState(false);
  const [dateData, setDateData] = useState<{ date: string; present: number; absent: number }[]>([]);

  const today = useMemo(() => new Date(), []);
  const defaultStart = startOfMonth(today);
  const defaultEnd = endOfMonth(today);

  const { data, isLoading } = useGetAttendance(defaultStart, defaultEnd);

  useEffect(() => {
    if (!data?.data) return;
    const attendanceList: AttendanceDataProps[] = data.data;
    const dateSummary: Record<string, { date: string; present: number; absent: number }> = {};

    const presentCount = { present: 0, absent: 0 };
    attendanceList.forEach(entry => {

      const dateStr = new Date(entry.date).toLocaleDateString();

      if (entry.present) {
        presentCount.present += 1;
      } else {
        presentCount.absent += 1;
      }

      if (!dateSummary[dateStr]) {
        dateSummary[dateStr] = { date: dateStr, present: 0, absent: 0 };
      }
      if (entry.present) {
        dateSummary[dateStr].present += 1;
      } else {
        dateSummary[dateStr].absent += 1;
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
    setDateData(Object.values(dateSummary));
    console.log(currentClass)
  }, [data]);


  return (
    <div className=' w-full p-20 mb-20 max-md:p-2'>
      <div className="  max-md:mt-10 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-3 px-8 max-md:py-4  border border-purple-500/30 mb-8">
        <div className="flex  max-md:gap-5 max-md:flex-col items-center justify-between">
          <div>
            <div className='text-3xl max-md:text-2xl mb-6 max-md:mt-4  font-bold'>Welcome , 👋🏻
              <span className=' bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-rose-500'> {session?.user?.name} !!</span>
              {new Date().getDay() === 0 && <p className=' bg-clip-text  text-transparent bg-gradient-to-br from-indigo-500 to-pink-500'>{new Date().getDay() === 0 ? 'Happy sunday 🎉' : ''}</p>}
            </div>
            <p className="text-gray-300 text-lg">You have <span className="text-purple-400 font-semibold"><span className=' text-xl'>{remainingday}</span> remaining classes</span> today.</p>
            <p>Your current attendance rate is <span className={`text-xl font-medium  ${Number(totalPersentages[0]?.percentage) > 75 ? ' text-green-400  ' : ' text-red-400  '} font-semibold `}>{totalPersentages[0]?.percentage || '0%'}</span></p>
            {currentClass?.subjectName && (
              <p>Current Class :
                <span className='text-green-400 text-xl font-medium capitalize'>
                  {currentClass.subjectName}
                </span>
              </p>
            )}
          </div>
          <PieChart className='[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground' width={400} height={240}>
            <Pie data={presentData} dataKey="value"
              paddingAngle={3}
              fill="red"
              cx="50%" cy="50%" nameKey='type' innerRadius={60} outerRadius={100}
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
      </div>

      <div onClick={() => setShow(!show)} className="p-3 bg-gradient-to-r my-3 center w-fit mx-auto from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-12 transition-transform duration-300">
        <Calendar className="w-7 h-7 text-white" size={23} />
      </div>

      {show && <TimeTable type='view' setRemaining={setRemaining} currentClass={currentClass} setCurrentClass={setCurrentClass} />}

      {dateData.length !== 0 && <div className=' w-full h-[400px] border rounded-3xl mt-4 card p-2 px-4'>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={1200} height={400}
            data={dateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorcredit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff79c6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff79c6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colordebit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64b5f6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#64b5f6" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis tickFormatter={(value) => value.slice(0, 5)} style={{ fontSize: '12px' }} dataKey="date" stroke="#ffffff28" />
            <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
            <CartesianGrid strokeDasharray="1 0" vertical={false} opacity={0.1} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: '#E11D47',
                fontWeight: 'bold',
                fontSize: '15px',
              }} />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#64b5f6"
              fillOpacity={0.2}
              fill="url(#colordebit)"
              stackId="2"
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#ff79c6"
              fillOpacity={0.5}
              fill="url(#colorcredit)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>}
    </div>
  )
}

export default DashBoardMainaPage