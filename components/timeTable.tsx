'use client'
import { getTimeTable } from '@/action/profile.action';
import { getDayName } from '@/lib/util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import Loading from './ui/loading';
import { Calendar, Trash, Trash2 } from 'lucide-react';
import { deleteAttendance } from '@/action/attendance.action';
import { toastError, toastSuccess } from '@/lib/toast';

const TimeTable = ({type}:{type:"view"|"edit"}) => {
    const client = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['timetable'],
        queryFn: (async () => await getTimeTable()),
    });
    const isToday = new Date().getDay();

    const deleteTimeTableMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteAttendance(id);
            return res;
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toastSuccess(data.message);
                client.invalidateQueries({ queryKey: ['timetable'] });
            } else {
                toastError(data.message);
            }
        },
    });
    return (
        <div className="w-fit overflow-scroll max-md:w-full    mx-auto ">
            <div className="p-3 w-fit mx-auto rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="flex w-full ">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={idx} className={` w-[220px] max-md:w-[150px] text-center border border-[#ffffff30] 
                    ${isToday === idx + 1 ? " bg-gradient-to-r  from-pink-500 to-rose-500 !rounded-none  " : "  "}
                     font-semibold text-gray-400 p-2 `}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="flex mx-auto">
                {[1, 2, 3, 4, 5, 6].map((day) => {
                    const subjectsForDay = data?.data?.filter((item: any) => item.dayOfWeek === day) || [];
                    return (
                        <div key={day} className=" ">
                            {subjectsForDay.length > 0 && !isLoading ? (
                                subjectsForDay.map((item: any, idx: number) => (
                                    <div key={idx}
                                        className={` max-md:w-[150px] w-[220px]  h-[120px] border border-[#ffffff30] ${isToday === item.dayOfWeek ? " bg-gradient-to-r from-pink-500 to-rose-500  !rounded-none " : "bg-gradient-to-br to-[#ffffff13] from-[#ffffff00]"} relative bg-[#ffffff06] p-3 `}>
                                        {type ==='edit' && <h2 onClick={()=>deleteTimeTableMutation.mutate(item.id)} className='absolute right-1 top-1 hover:bg-red-500/20 w-fit rounded-full p-1.5 text-red-500'> <Trash2 size={20}/> </h2>}
                                        <h2 className="text-md font-semibold">{item.subjectName}</h2>
                                        <p className="text-sm">Start: {item.startTime}</p>
                                        <p className="text-sm">End: {item.endTime}</p>
                                        <p className="text-sm">Day: {getDayName(item.dayOfWeek)}</p>
                                    </div>
                                ))
                            ) : (
                                isLoading ? <Loading boxes={1} child=" max-md:w-[150px] border-x w-[220px]  h-[120px] !rounded-none" parent="w-full " /> :
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
