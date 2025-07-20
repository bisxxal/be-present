'use client'
import { getDayName, weeks } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import Loading from './ui/loading';
import { Trash2 } from 'lucide-react';
import { deleteAttendance } from '@/action/attendance.action';
import { toastError, toastSuccess } from '@/lib/toast';
import { TimeTableProps } from '@/lib/constant';
import { useGetTimeTable } from '@/hooks/useGetAttendance';

const TimeTable = ({ type, setCurrentClass, setRemaining }: { type: "view" | "edit", setCurrentClass?: React.Dispatch<React.SetStateAction<TimeTableProps | undefined>>, setRemaining?: React.Dispatch<React.SetStateAction<number>> }) => {
    const client = useQueryClient()
    const { data, isLoading } = useGetTimeTable()


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

    return (
        <div className="w-fit mt-7 overflow-scroll max-md:w-full max-md:px-2 mx-auto ">
            <div className="flex w-fit ">
                {weeks.map((day, idx) => (
                    <div key={idx} className={` w-[220px] max-md:w-[150px] text-center border border-[#ffffff30] 
                ${isToday === idx + 1 ? " bg-gradient-to-r  from-pink-500 to-rose-500 !rounded-none " : "  "} font-semibold text-gray-400 p-2 `}>
                        {day}
                    </div>
                ))}
            </div>
           

            <div className="flex mx-auto w-fit border-r border-b border-[#ffffff30]">
            {[1, 2, 3, 4, 5, 6].map((day) => {
                const subjectsForDay = data?.data?.filter((item: any) => item.dayOfWeek === day) || [];
                return (
                    <div key={day}>
                        {subjectsForDay.length > 0 && !isLoading ? (
                            subjectsForDay.map((item: any, idx: number) => (
                                <div key={idx}
                                    className={` max-md:w-[150px] w-[220px]  h-[120px] border border-[#ffffff30] ${isToday === item.dayOfWeek ? " bg-gradient-to-r from-pink-500 to-rose-500  !rounded-none " : " bg-gradient-to-br to-[#ffffff13] from-[#ffffff00] "} relative bg-[#ffffff06] p-3 `}>
                                    {type === 'edit' && <h2 onClick={() => deleteTimeTableMutation.mutate(item.id)} className='absolute right-1 top-1 hover:bg-red-500/20 w-fit rounded-full p-1.5 text-red-500'> <Trash2 size={20} /> </h2>}
                                    <h2 className="text-md capitalize font-semibold">{item.subjectName}</h2>
                                    <p className="text-sm">Start: {item.startTime}</p>
                                    <p className="text-sm">End: {item.endTime}</p>
                                    <p className="text-sm">Day: {getDayName(item.dayOfWeek)}</p>
                                </div>
                            ))
                        ) : (
                            isLoading ? <Loading boxes={1} child=" max-md:w-[150px] border-x w-[220px]  h-[120px] !rounded-none" parent="w-full " /> :
                                <div className="max-md:w-[150px] w-[220px] h-[120px] border border-[#ffffff30] bg-gradient-to-br to-[#ffffff13] from-[#ffffff00] flex items-center justify-center text-sm text-gray-400 italic rounded-none">No Class</div>
                        )}
                    </div>
                );
            })}
        </div>
        </div>
    );
}

export default TimeTable
 