
'use client'
import DateButton from '@/components/ui/dateButtons';
import { AttendanceDataProps } from '@/lib/constant';
import { COLORS, COLORS2 } from '@/lib/util';
import React, { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { endOfMonth, isValid, parseISO, startOfMonth } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useGetAttendance } from '@/hooks/useGetAttendance';
import Loading from './ui/loading';

const TrackComponent = () => {
  const today = useMemo(() => new Date(), []);
  const defaultStart = startOfMonth(today);
  const defaultEnd = endOfMonth(today);
  const searchParams = useSearchParams();
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  const startDate = startParam && isValid(parseISO(startParam)) ? parseISO(startParam) : defaultStart;
  const endDate = endParam && isValid(parseISO(endParam)) ? parseISO(endParam) : defaultEnd;

  const [presentData, setPresentData] = useState<{ type: string; value: number }[]>([])
  const [totalPersentages, setTotalPercentages] = useState<{ type: string; percentage: string }[]>([])
  const [subjCount, setSubjCount] = useState<{ name: string; present: number; absent: number }[]>([])
  const [dateData, setDateData] = useState<{ date: string; present: number; absent: number }[]>([]);

  const { data, isLoading } = useGetAttendance(startDate, endDate);

  useEffect(() => {
    if (!data?.data) return;

    const attendanceList: AttendanceDataProps[] = data.data;

    // Grouped summary by subject
    const subjectSummary: Record<string, { name: string; present: number; absent: number }> = {};

    // Grouped summary by date
    const dateSummary: Record<string, { date: string; present: number; absent: number }> = {};

    // Present/Absent overall counts
    const presentCount = { present: 0, absent: 0 };

    attendanceList.forEach(entry => {
      const subjectName = entry.timeTable.subjectName;
      const dateStr = new Date(entry.date).toLocaleDateString();

      // Subject-wise count
      if (!subjectSummary[subjectName]) {
        subjectSummary[subjectName] = { name: subjectName, present: 0, absent: 0 };
      }
      if (entry.present) {
        subjectSummary[subjectName].present += 1;
        presentCount.present += 1;
      } else {
        subjectSummary[subjectName].absent += 1;
        presentCount.absent += 1;
      }

      // Date-wise count
      if (!dateSummary[dateStr]) {
        dateSummary[dateStr] = { date: dateStr, present: 0, absent: 0 };
      }
      if (entry.present) {
        dateSummary[dateStr].present += 1;
      } else {
        dateSummary[dateStr].absent += 1;
      }
    });

    // Calculate percentages
    const total = presentCount.present + presentCount.absent;
    const percentages = [
      { type: 'present', percentage: ((presentCount.present / total) * 100).toFixed(2) + '%', },
      { type: 'absent', percentage: ((presentCount.absent / total) * 100).toFixed(2) + '%', },
    ];

    // Set state
    setPresentData([
      { type: 'present', value: presentCount.present },
      { type: 'absent', value: presentCount.absent },
    ]);
    setSubjCount(Object.values(subjectSummary));
    setDateData(Object.values(dateSummary));
    setTotalPercentages(percentages);
  }, [data]);

  return (
    <div className=' w-full min-h-screen overflow-hidden'>
      <DateButton startDate={startDate} endDate={endDate} />
      <div className=' w-[100%] mx-auto my-10 p-5   center flex-col gap-4  rounded-lg shadow-lg '>
       {presentData[0]?.value !== 0 && !isLoading ? <div className='card w-full max-md:flex-col card flex justify-evenly px-10 max-md:px-2 h-[500px] border-2 border-[#ffffff21] rounded-3xl items-center'>
          <div className=' w-[50px]  max-md:w-full '>
            
              <PieChart className='border-none outline-none' width={370} height={400}>
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
                  cursor={false}
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
            {presentData[0]?.value !== 0 && presentData[1]?.value !== 0 && totalPersentages.map((item, index) => (
              <div key={index} className='flex gap-1 justify-between items-center'>
                <span className='text-white capitalize'>{item.type}</span>:
                <span className='text-white'>{item.percentage}</span>
              </div>
            ))}
          </div>
        </div> : isLoading ? <Loading boxes={1} parent=' h-[500px] ' child='rounded-3xl w-full h-full ' />  
        : <p className=' text-gray-500 mt-10 whitespace-nowrap'>No data Found</p>}

        <div className='w-full flex flex-wrap justify-evenly items-center gap-4'>
          {subjCount.length !== 0  && !isLoading ? subjCount.map((subject, index) => {
            const chartData = [
              { type: 'Present', value: subject.present },
              { type: 'Absent', value: subject.absent },
            ];
            return (
              <div key={index} 
              className={` center flex-col max-md:w-full ${Number(((subject.present / (subject.present + subject.absent)) * 100).toFixed(1)) > 75 ? " card " : "bg-gradient-to-br to-rose-500/30  from-rose-600/20 border-red-500/40"} text-center relative border-2 border-[#ffffff4a] rounded-4xl `} >

                <h1 className=' -mb-13 mt-5  text-lg text-center font-medium '>{subject?.name.toUpperCase()}</h1>
                <PieChart width={300} height={300}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={2}
                    label={(entry) => `${entry.type}`}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
                      fontWeight: 'normal',
                    }} />
                </PieChart>

                <div className=' -mt-10 mb-2  text-white'>
                  <p>Present:   {((subject.present / (subject.present + subject.absent)) * 100).toFixed(1)}%</p>
                  <p>Absent:   {((subject.absent / (subject.present + subject.absent)) * 100).toFixed(1)}%</p>
                </div>
              </div>
            );
          }) : isLoading ? <Loading boxes={5} parent=' h-[305px] w-full !flex-row !flex-wrap' child='rounded-3xl max-md:w-full w-[19.1%] h-full ' />  
        : <p className=' text-gray-500 mt-10 whitespace-nowrap'>No data Found</p>}
        </div>

        <div className=' w-full '>

          {subjCount.length !== 0 && <div className=' w-full h-[400px] card rounded-3xl mb-4 card p-2 px-4'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={730} height={250} data={subjCount}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff20',
                    color: 'white',
                    fontSize: '19px',
                    borderRadius: '5px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid transparent',
                  }}
                  itemStyle={{
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 'bold',
                  }} />
                <Legend />
                <Bar dataKey="present" radius={6} fill="#a48fff" name={'present'} />
                <Bar dataKey="absent" radius={6} fill="#f75cb4" name={'absent'} />
              </BarChart>
            </ResponsiveContainer >
          </div>}


          {dateData.length !== 0 && <div className=' w-full h-[400px] rounded-3xl mb-4 card p-2 px-4'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={730} height={250} data={dateData}>
                <CartesianGrid strokeDasharray="0.1 0" vertical={false} opacity={0.1} />
                <XAxis tickFormatter={(value) => value.slice(0, 5)} style={{ fontSize: '12px' }} dataKey="date" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff20',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '19px',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid transparent',
                  }}
                  itemStyle={{
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 'bold',
                  }} />
                <Legend />
                <Bar dataKey="present" radius={6} fill="#a48fff" name={'present'} />
                <Bar dataKey="absent" radius={6} fill="#f75cb4" name={'absent'} />
              </BarChart>
            </ResponsiveContainer >
          </div>}

        </div>


        {dateData.length !== 0 && <div className=' w-full h-[400px] border rounded-3xl mb-4 card p-2 px-4'>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={1200} height={400}
              data={dateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorcredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D47" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D44D66" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colordebit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8a70fd" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8a70fd" stopOpacity={0.3} />
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
                stroke="#a48fff"
                fillOpacity={0.2}
                fill="url(#colordebit)"
                stackId="2"
              // dot={{ fill: '#a48fff', strokeWidth: 1, r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="absent"
                stroke="#E11D47"
                fillOpacity={0.5}
                fill="url(#colorcredit)"
                stackId="1"
              // dot={{ fill: '#E11D47', strokeWidth: 1, r: 0.1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>}
      </div>


    </div>
  )
}

export default TrackComponent