'use client'
import { getTimeTable } from '@/action/profile.action';
import { getDayName } from '@/lib/util';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from './ui/loading';
import { Calendar } from 'lucide-react';

const TimeTable = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['timetable'],
        queryFn: (async () => await getTimeTable()),
    });
    const isToday = new Date().getDay();
    return (
        <div className="w-[95%] max-md:w-full mx-auto ">
            <div className="p-3 w-fit mx-auto rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="grid grid-cols-6  ">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={idx} className={` text-center border border-[#ffffff30] ${isToday === idx + 1 ? " bg-gradient-to-r  from-pink-500 to-rose-500 !rounded-none  " : "  "} font-semibold text-gray-400 p-2 `}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Timetable subjects grouped by dayOfWeek (1 to 6) */}
            <div className="grid grid-cols-6  ">
                {[1, 2, 3, 4, 5, 6].map((day) => {
                    const subjectsForDay = data?.data?.filter((item: any) => item.dayOfWeek === day) || [];
                    return (
                        <div key={day} className=" ">
                            {subjectsForDay.length > 0 && !isLoading ? (
                                subjectsForDay.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`border    border-[#ffffff30] ${isToday === item.dayOfWeek ? " bg-gradient-to-r from-pink-500 to-rose-500  !rounded-none " : "bg-[#ffffff06]"} bg-[#ffffff06] p-3 `}>
                                        <h2 className="text-md font-semibold">{item.subjectName}</h2>
                                        <p className="text-sm">Start: {item.startTime}</p>
                                        <p className="text-sm">End: {item.endTime}</p>
                                        <p className="text-sm">Day: {getDayName(item.dayOfWeek)}</p>
                                    </div>
                                ))
                            ) : (
                                isLoading ? <Loading boxes={1} child=" !w-[180px] !h-[120px] !rounded-none" parent="w-full  !grid !grid-cols-6  " /> :
                                    <div className="text-center mt-10   text-sm text-gray-500 italic">No Class</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TimeTable




// 
// 

// const getSubjectColor = (subject) => {
//     const colors = {
//         'Mathematics': 'from-blue-500 to-cyan-500',
//         'Physics': 'from-purple-500 to-pink-500',
//         'Chemistry': 'from-green-500 to-emerald-500',
//         'English': 'from-orange-500 to-red-500',
//         'Biology': 'from-lime-500 to-green-500',
//         'History': 'from-amber-500 to-orange-500',
//         'Computer Science': 'from-indigo-500 to-purple-500',
//         'Art': 'from-pink-500 to-rose-500',
//         'Geography': 'from-teal-500 to-cyan-500',
//         'Physical Education': 'from-red-500 to-pink-500',
//         'Music': 'from-violet-500 to-purple-500',
//         'Literature': 'from-slate-500 to-gray-500',
//     };
//     return colors[subject] || 'from-gray-500 to-slate-500';
// };
