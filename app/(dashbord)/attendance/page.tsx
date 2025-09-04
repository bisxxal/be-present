'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {  X, CheckCircle, XCircle,  Clock, Loader } from 'lucide-react';
import { createAttendanceRecords } from '@/action/attendance.action';
import { toastError, toastSuccess } from '@/lib/toast';
import { useGetAttendance, useGetTimeTable } from '@/hooks/useGetAttendance';
import { months, years } from '@/lib/util';
import Loading from '@/components/ui/loading';

interface SubjectAttendance {
  [subjectName: string]: 'present' | 'absent' | null;
}
interface AttendanceData {
  [key: string]: {
    [day: number]: SubjectAttendance;
  };
}

const Attendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const startDate = new Date(selectedYear, selectedMonth, 1);
  const endDate = new Date(selectedYear, selectedMonth + 1, 0);

  const [iscreateing, setIsCreating] = useState(false);

  const { data } =  useGetTimeTable() 
  const {data: data2 , isLoading } =  useGetAttendance( startDate, endDate);

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getAttendanceKey = (): string => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
  };

  const getAttendanceForDate = (date: number): 'present' | 'absent' | null => {
    const key = getAttendanceKey();
    const subjectAttendance = attendanceData[key]?.[date];
    if (!subjectAttendance) return null;

    const statuses = Object.values(subjectAttendance);
    if (statuses.every((s) => s === 'present')) return 'present';
    if (statuses.every((s) => s === 'absent')) return 'absent';

    return null;
  };

  const getStatistics = () => {
    const key = getAttendanceKey();
    const monthData = attendanceData[key] || {};
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    let present = 0;
    let absent = 0;
    let unmarked = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      const subjects = monthData[i] || {};
      for (const status of Object.values(subjects)) {
        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else unmarked++;
      }
    }

    return { present, absent, unmarked, total: daysInMonth };
  };
  const stats = getStatistics();
  const openModal = (date: number) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }; 
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const updateAttendance = (date: number, subjectName: string, status: 'present' | 'absent' | null) => {
    const key = getAttendanceKey(); // e.g. "2025-07"
    setAttendanceData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [date]: {
          ...(prev[key]?.[date] || {}),
          [subjectName]: status,
        },
      },
    }));
  };

  const handleFinalSubmit = async () => {
    const key = getAttendanceKey();
    const dateKey = Number(selectedDate); // ensure it's a number
    if (!dateKey || isNaN(dateKey)) {
      return toastError('Invalid or no date selected.');
    }
    const dailyAttendance = attendanceData[key]?.[dateKey];
    if (!dailyAttendance || Object.keys(dailyAttendance).length === 0) {
      return toastError('No attendance marked for this date.');
    }
    const records = Object.entries(dailyAttendance)
      .map(([subjectName, status]) => {
        const timetableEntry = data?.data?.find((item: any) => item.subjectName === subjectName);
        return timetableEntry && {
          timeTableId: timetableEntry.id,
          present: status === 'present',
        };
      })
      .filter((record): record is { timeTableId: string; present: boolean } => record !== null);

    if (records.length === 0) {
      return toastError('No valid subjects marked.');
    }

    const payload = {
      date: new Date(selectedYear, selectedMonth, dateKey),
      records,
    };

    setIsCreating(true);
    const res = await createAttendanceRecords(payload);

    if (res.status === 200) {
      toastSuccess(data?.message ?  data?.message :'Attendance marked successfully.');
      setIsModalOpen(false);
    } else {
      toastError(res.message);
    }
    setIsCreating(false);
  };

  useEffect(() => {
    if (!data?.data || !data2?.data) return;
    const timetableMap = data.data.reduce((acc, curr) => {
      acc[curr.id] = curr.subjectName;
      return acc;
    }, {} as Record<string, string>);

    const transformedData: AttendanceData = {};

    for (const record of data2.data) {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const day = date.getDate();
      const subjectName = timetableMap[record.timeTableId];

      if (!subjectName) continue;

      if (!transformedData[monthKey]) {
        transformedData[monthKey] = {};
      }

      if (!transformedData[monthKey][day]) {
        transformedData[monthKey][day] = {};
      }

      transformedData[monthKey][day][subjectName] = record.present ? 'present' : 'absent';
    }

    setAttendanceData(transformedData);
  }, [data, data2]);

  const today = useMemo(() => new Date(), []);
  const isToday = selectedDate === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  return (
    <div className="min-h-screen   w-full text-white p-6 max-md:p-1">
      <div className=" w-[80%] max-md:w-full mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"> Attendance</h1>
        </div>

        {/* Controls */}
        <div className="card  rounded-lg p-6 mb-6">
          <div className="flex gap-4 items-start sm:items-center justify-between">
            <div className="flex  items-center flex-row gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className=" bg-[black]  rounded-lg px-3 py-2 focus:outline-none "
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="  bg-[black]  rounded-lg px-3 py-2 focus:outline-none  "
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statistics */}
            <div className="text-right">
              <h3 className="text-lg font-semibold max-md:text-center mb-2">Statistics</h3>
              <div className="flex gap-4 text-sm">
                <div className="text-green-400 max-md:text-center">
                { !isLoading ? <>
                <CheckCircle className="w-4 h-4 inline mr-1" />
                  Present: {stats.present}  </> : <Loading boxes={2} parent=' flex-row w-full ' child=' max-md:w-14 w-20 max-md:h-14 h-4 rounded-xl ' />
                  }
                </div>
                <div className="text-red-400 max-md:text-center">
                 {!isLoading && <>
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Absent: {stats.absent}
                  </>  }
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="card rounded-lg max-md:px-1 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {months[selectedMonth]} {selectedYear}
          </h2>

          <div className="grid grid-cols-7 gap-3 max-md:gap-1 ">
            { [ 'Sun' ,'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-400 p-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2"></div>
            ))}

            {/* Date cells */}
            {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }).map((_, index) => {
              const date = index + 1;
              const attendance = getAttendanceForDate(date);
              const isToday = today.getDate() === date &&
                today.getMonth() === selectedMonth &&
                today.getFullYear() === selectedYear;
              return (
                <div
                  key={date}
                  onClick={() => {
                    openModal(date);
                  }}
                  className={`
                    relative p-4 rounded-lg max-md:rounded cursor-pointer transition-all duration-200 hover:scale-105 border
                    ${isToday ? 'border-[#ffffff74] buttonbg !rounded-lg ' : 'border-[#ffffff17]'}
                    ${attendance === 'present' ? 'bg-green-900 border-green-500' :
                      attendance === 'absent' ? 'bg-red-900 border-red-500' :
                        'bg-[#2d2b55] hover:bg-[#1a1a2e]'}
                  `}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">{date} { }</div>
                    <div className="space-y-1">
                      {attendance === 'present' && (
                        <div className="flex items-center justify-center text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                        <span className=' max-md:hidden'>Present</span>
                        </div>
                      )}
                      {attendance === 'absent' && (
                        <div className="flex items-center justify-center text-red-400 text-sm">
                          <XCircle className="w-4 h-4 mr-1" />
                           <span className=' max-md:hidden'>Absent</span>
                        </div>
                      )}
                      {attendance === null && (
                        <div className="text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isModalOpen && selectedDate && (
          <div className="fixed inset-0 bg-[#ffffff11] backdrop-blur-[40px] flex flex-col items-center justify-center z-50 p-4 max-md:p-2">
            <div className="bg-[#0f0f1a83] z-10  overflow-scroll max-md:h-fit h-full rounded-3xl p-6  w-[93%] max-md:w-[96%]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl max-md:text-lg font-semibold flex items-center gap-2">
                  Attendance for {months[selectedMonth]} {selectedDate}, {selectedYear}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="  w-full flex flex-wrap gap-1 max-md:gap-x-2">
                {(() => {
                  const dayOfWeek = new Date(selectedYear, selectedMonth, selectedDate).getDay();
                  const filteredSubjects = data?.data?.filter((item: any) =>
                    item.dayOfWeek === dayOfWeek || item.dayOfWeek === null
                  );
                  if (!filteredSubjects || filteredSubjects.length === 0) {
                    return (
                      <div className="text-center w-full text-gray-600 p-6">No subjects scheduled for this day.</div>
                    );
                  }
                  if (isLoading) {
                    return (
                      <Loading boxes={4} parent=' flex flex-wrap flex-row gap-1 max-md:gap-x-2 ' child=' w-[230px] max-md:w-[160px] h-[150px] rounded-3xl ' />
                    );
                  }
                  return filteredSubjects.map((item: any, index: number) => {
                    const subjectName = item.subjectName;
                    const status = attendanceData[getAttendanceKey()]?.[selectedDate]?.[subjectName] ?? null;
                    const handleClick = (status: 'present' | 'absent') => {
                      updateAttendance(selectedDate, subjectName, status);
                    };
                    const handleClear = () => {
                      updateAttendance(selectedDate, subjectName, null);
                    };
                    const bgToClass =status === 'present'? 'to-[#00800044]': status === 'absent'? 'to-[#ff000051]': 'to-[#ffffff1f]';
                    return (
                      <div
                        key={index}
                        className={` flex bg-gradient-to-tl ${bgToClass} from-[#ffffff00] flex-col w-[230px] max-md:w-[160px] gap-2 p-4 max-md:p-2 mb-2 border-2 border-[#ffffff1e] rounded-3xl `}
                      >
                        <div>
                          <h2 className="text-xl capitalize text-center max-md:text-lg my-1 font-semibold">{subjectName}</h2>
                          <p className=' max-md:text-xs max-md:text-center'>  {item.startTime} ~ {item.endTime}</p>
                          {/* <p className=' max-md:text-xs max-md:text-center'>End Time: </p> */}
                        </div>

                        {status ? (
                          <div className="flex justify-between flex-col items-center gap-4 max-md:gap-1">
                            <p className={`font-semibold disabled:opacity-50 p-2 w-full center rounded-xl border max-md:text-xs ${status === 'present' ? 'bg-[#00800044] border-green-500   text-green-600' : ' bg-[#ff000051] border-[red] text-red-600'}`}>
                              ✅ {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                            <button onClick={handleClear}  
                            disabled={!isToday} hidden={!isToday}
                             className="text-sm px-3 py-2  border border-gray-400 w-full rounded-md ">Clear</button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                             disabled={!isToday}
                              onClick={() => handleClick('present')}
                              className="w-full flex disabled:opacity-50 items-center justify-center gap-2  buttongreen text-white max-md:py-1 max-md:px-0.5 py-2 px-4 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5" />
                                Present
                            </button>
                            <button
                             disabled={!isToday}
                              onClick={() => handleClick('absent')}
                              className="w-full  disabled:opacity-50 flex items-center justify-center gap-2 buttonred  text-white max-md:py-1 max-md:px-0.5 py-2 px-4 rounded-lg"
                            >
                              <XCircle className="w-5 h-5" />
                               Absent
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
              <button
              disabled={Object.keys(attendanceData[getAttendanceKey()]?.[selectedDate] || {}).length === 0 
              ||  !isToday
              }
              hidden={!isToday}
                onClick={() => handleFinalSubmit()}
                className={`disabled:opacity-50 center w-full mt-6 buttonbg text-white px-6 py-3 rounded-md`}
              >
            { iscreateing ? <Loader className=' animate-spin ' /> :" Final Submit"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Attendance;