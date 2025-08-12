'use client'
import { countMonthlyClasses, getDayName, weeks } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import Loading from './ui/loading';
import { Trash2 } from 'lucide-react';
import { deleteAttendance } from '@/action/attendance.action';
import { toastError, toastSuccess } from '@/lib/toast';
import { TimeTableProps } from '@/lib/constant';
import { useGetTimeTable } from '@/hooks/useGetAttendance';
import Link from 'next/link';

const TimeTable = ({ type, setCurrentClass, setRemaining, currentClass }: { currentClass: TimeTableProps | undefined, type: "view" | "edit", setCurrentClass?: React.Dispatch<React.SetStateAction<TimeTableProps | undefined>>, setRemaining?: React.Dispatch<React.SetStateAction<number>> }) => {
    const client = useQueryClient()
    const { data, isLoading } = useGetTimeTable()
    const [show , setShow] = useState('');
    const isToday = new Date().getDay();


    const deleteTimeTableMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteAttendance(id);
            return res;
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toastSuccess(data.message);
                setShow('');
                client.invalidateQueries({ queryKey: ['timetable'] });
                
            } else {
                toastError(data.message);
            }
        },
    });
    useEffect(() => {
        if (!data?.data) return;
        const todaysClasses = data.data.filter((item: any) => item.dayOfWeek === isToday);
 
        const parseTimeToDate = (timeStr: string) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        };
        const remainingClasses = todaysClasses.filter((cls: any) => {
            if (!cls.endTime) return false;
            const classEndTime = parseTimeToDate(cls.endTime);
            return classEndTime > new Date();
        });
        if (setRemaining && remainingClasses) {
            setRemaining(remainingClasses?.length);
        }
        const currentClass = remainingClasses.find((cls: any) => {
            if (!cls.startTime || !cls.endTime) return false;
            const classStart = parseTimeToDate(cls.startTime);
            const classEnd = parseTimeToDate(cls.endTime);
            const now = new Date();
            return now >= classStart && now <= classEnd;
        });
        if (currentClass && setCurrentClass) {
            setCurrentClass(currentClass);
        }
    }, [data]);

    const [totalClasses, setTotalclass] = useState(() => {
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem('classes');
            return val ? parseFloat(val) : null;
        }
        return null;
    })
   
    useEffect(() => {
        if (data?.data && !totalClasses) {
            const total = countMonthlyClasses(data?.data?.length);
            setTotalclass(total);
            if (typeof window !== 'undefined') {
                localStorage.setItem('classes', total.toString());
            }
        }
    }, [totalClasses,data]);

    return (
        <div className="w-fit mt-7 overflow-scroll max-md:w-full max-md:px-2 mx-auto ">

            {show && <div className='center fixed top-0 right-0 p-2 w-full h-full bg-[#0000003f] backdrop-blur-2xl z-[40] '>

                <div className='flex flex-col gap-2 max-md:w-[90%] w-[500px] bg-[#ffffff46] p-4 rounded-xl shadow-lg'>
                    <p className=' text-center'>Are you sure want to delete Subject ?</p>
                    <div className=' center gap-3'>
                    <button onClick={()=>setShow('')} className='!rounded-xl border  center py-3 px-8'>Cancel </button>
                        <button onClick={()=>deleteTimeTableMutation.mutate(show)} className='!rounded-xl buttonred !py-3 !px-8'>Delete</button>
                    </div>
                </div>
                
            </div>}
            <div className="flex w-fit ">
                {weeks.map((day, idx) => (
                    <div key={idx} className={` w-[220px] max-md:w-[150px] text-center border border-[#ffffff30] 
                 font-semibold text-gray-400 p-2 `}>
                        {day}
                    </div>
                ))}
            </div>


            <div className="flex mx-auto w-fit border-x border-b border-[#ffffff30]">
                {[1, 2, 3, 4, 5, 6].map((day) => {
                    const subjectsForDay = data?.data?.filter((item: any) => item.dayOfWeek === day) || [];
                    return (
                        <div key={day}>
                            {subjectsForDay.length > 0 && !isLoading ? (
                                subjectsForDay.map((item: any, idx: number) => {
                                    const bgColor = currentClass?.subjectName === item.subjectName ? ' bg-gradient-to-r from-green-600 /20 to-emerald-600 /20 ' : isToday === item.dayOfWeek ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 !rounded-none " : " bg-gradient-to-br to-[#ffffff13] from-[#ffffff00] ";
                                    return (
                                        <div key={idx}
                                            className={` max-md:w-[150px] w-[220px]  h-[120px] border border-[#ffffff30]  ${bgColor} relative bg-emerald-5 p-3 `}>
                                            {type === 'edit' && <h2 onClick={() => setShow(item.id)} className='absolute right-1 top-1 hover:bg-red-500/20 w-fit   rounded-full p-1.5 text-red-500'> <Trash2 size={20} /> </h2>}
                                            <h2 className="text-md capitalize font-semibold">{item.subjectName}</h2>
                                            <p className="text-sm">Start: {item.startTime}</p>
                                            <p className="text-sm">End: {item.endTime}</p>
                                            <p className="text-sm">Day: {getDayName(item.dayOfWeek)}</p>
                                        </div>
                                    )
                                }
                                )
                            ) : (
                                isLoading ? <Loading boxes={1} child=" max-md:w-[150px] border-x w-[220px]  h-[120px] !rounded-none" parent="w-full " /> :
                                    <div className="max-md:w-[150px] w-[220px] h-[120px] border border-[#ffffff30] bg-gradient-to-br to-[#ffffff13] from-[#ffffff00] flex items-center justify-center text-sm text-gray-400 italic rounded-none">No Class</div>
                            )}
                        </div>
                    );
                })}
            </div>

            { data?.data?.length === 0 && type ==='view'&&<Link href={`/timetable`} className='mt-10 buttonbg w-fit center mx-auto'>Add your Timetable</Link>}
        </div>
    );
}

export default TimeTable
