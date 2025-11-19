'use client'
import { countMonthlyClasses } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react'
import Loading from './ui/loading';
import { Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { deleteAttendance } from '@/action/attendance.action';
import { toastError, toastSuccess } from '@/lib/toast';
import { TimeTableProps } from '@/lib/constant';
import { useGetTimeTable } from '@/hooks/useGetAttendance';
import Link from 'next/link';

interface TimeTablePropsExtended {
    currentClass: TimeTableProps | undefined, type: "view" | "edit", setCurrentClass?: React.Dispatch<React.SetStateAction<TimeTableProps | undefined>>, setRemaining?: React.Dispatch<React.SetStateAction<number>>
}

const TimeTable = ({ type, setCurrentClass, setRemaining, currentClass }: TimeTablePropsExtended) => {
    const client = useQueryClient();
    const { data, isLoading ,refetchTimeTable} = useGetTimeTable();
    const [show, setShow] = useState('');
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
    });

    useEffect(() => {
        if (data?.data && !totalClasses) {
            const total = countMonthlyClasses(data?.data?.length);
            setTotalclass(total);
            if (typeof window !== 'undefined') {
                localStorage.setItem('classes', total.toString());
            }
        }
    }, [totalClasses, data]);

    const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const parseTime = (timeStr: string): number => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const timeSlots = useMemo(() => {
        if (!data?.data) return [];

        const slotMap = new Map<string, string>();

        data.data.forEach((item: any) => {
            const start = item.startTime;
            const end = item.endTime;

            if (!start || !end) return;

            // If this startTime already exists, keep the one with the earlier endTime
            if (slotMap.has(start)) {
                const existingEnd = slotMap.get(start)!;
                if (parseTime(end) < parseTime(existingEnd)) {
                    slotMap.set(start, end);
                }
            } else {
                slotMap.set(start, end);
            }
        });

        // Convert to array of "start - end" strings
        const slotArray = Array.from(slotMap.entries()).map(
            ([start, end]) => `${start} - ${end}`
        );

        // Sort by start time
        slotArray.sort((a, b) => {
            const [aStart] = a.split(' - ');
            const [bStart] = b.split(' - ');
            return parseTime(aStart) - parseTime(bStart);
        });

        return slotArray;

    }, [data]);

    return (
        <div className="mt-7 overflow-auto w-full max-md:px-2">

            <div className=' flex items-end justify-end '>
            <button onClick={ ()=>refetchTimeTable()} className=' buttonbg p-2 round '><RefreshCw /></button>
            </div>
            {show && (
                <div className='center fixed top-0 right-0 p-2 w-full h-full bg-[#0000003f] backdrop-blur-2xl z-[40]'>
                    <div className='flex flex-col gap-2 max-md:w-[90%] w-[500px] bg-[#ffffff46] p-4 rounded-xl shadow-lg'>
                        <p className=' text-center'>Are you sure you want to delete this subject?</p>
                        <div className='center gap-3'>
                            <button onClick={() => setShow('')} className='!rounded-xl border center py-3 px-8'>Cancel</button>
                            <button onClick={() => deleteTimeTableMutation.mutate(show)} className='!rounded-xl buttonred !py-3 !px-8'>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full px-5 max-md:px-2 overflow-auto">
                {isLoading ? <div className=" mx-auto text-sm text-white">
                    <div className=' flex !items-start  !justify-start w-full'>
                        <p className="border whitespace-nowrap min-w-[200px]  max-md:min-w-[105px] h-[40px] flex border-[#ffffff30] center bg-[#ffffff10]">Day / Time</p>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index}>
                                <Loading boxes={1} child='w-[200px]  max-md:w-[105px] h-[40px]  border-x border-[#ffffff46] ' parent=' !items-start !gap-0 !justify-start   ' />
                            </div>
                        ))}
                    </div>
                    <div className=' flex justify-start items-start flex-col  '>
                        {weeks.map((day, dayIdx) => {
                            return (
                                <div key={dayIdx} className='flex items-start justify-start'>
                                    <div className="border border-[#ffffff30] min-w-[200px]  max-md:min-w-[105px] h-[100px] p-2 font-semibold text-gray-300 bg-[#ffffff05]">
                                        {day}
                                    </div>
                                    <Loading boxes={1} child='  w-[200px]  max-md:w-[105px] h-[100px]  border-y border-[#ffffff46] ' parent=' !flex-row  !gap-0  !justify-start !items-start ' />
                                    <Loading boxes={1} child='  w-[200px]  max-md:w-[105px] h-[100px]  border border-[#ffffff46] ' parent=' !flex-row  !gap-0  !justify-start !items-start ' />
                                    <Loading boxes={1} child='  w-[200px]  max-md:w-[105px] h-[100px]  border-y border-r border-[#ffffff46] ' parent=' !flex-row   !gap-0 !justify-start !items-start ' />
                                </div>
                            );
                        })}
                    </div>
                </div>

                    : <table className="table-auto border-collapse mx-auto text-sm text-white">
                        <thead>
                            <tr>
                                <th className="border border-[#ffffff30] p-2 text-left bg-[#ffffff10]">Day / Time</th>
                                {timeSlots.map((slot, idx) => (
                                    <th key={idx} className="border border-[#ffffff30] whitespace-nowrap p-2 bg-[#ffffff10]">
                                        {slot}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>


                            {weeks.map((day, dayIdx) => {
                                const dayIndex = dayIdx + 1;
                                return (
                                    <tr key={day}>
                                        <td className="border border-[#ffffff30] p-2 font-semibold text-gray-300 bg-[#ffffff05]">
                                            {day}
                                        </td>

                                        {(() => {
                                            const cells = [];
                                            let col = 0;

                                            const parseTime = (timeStr: string): number => {
                                                const [time, modifier] = timeStr.split(' ');
                                                let [hours, minutes] = time.split(':').map(Number);
                                                if (modifier === 'PM' && hours < 12) hours += 12;
                                                if (modifier === 'AM' && hours === 12) hours = 0;
                                                return hours * 60 + minutes;
                                            };

                                            while (col < timeSlots.length) {
                                                const [slotStart, slotEnd] = timeSlots[col].split(' - ');
                                                const slotStartTime = parseTime(slotStart);

                                                // Find subject that starts exactly at this slot start time
                                                const subject = data?.data?.find(
                                                    (item: any) =>
                                                        item.dayOfWeek === dayIndex &&
                                                        parseTime(item.startTime) === slotStartTime
                                                );

                                                if (!subject) {
                                                    // No subject at this time
                                                    cells.push(
                                                        <td
                                                            key={`${dayIndex}-${col}`}
                                                            className="border border-[#ffffff30] w-[200px] h-[100px] p-2 align-top bg-gradient-to-br to-[#ffffff13] from-[#ffffff00]"
                                                        >
                                                            <p className="text-gray-400 text-center mt-7 italic text-sm">No Class</p>
                                                        </td>
                                                    );
                                                    col++;
                                                    continue;
                                                }

                                                // Calculate colspan by checking how many timeSlots this subject spans
                                                const subjectStart = parseTime(subject.startTime);
                                                const subjectEnd = parseTime(subject.endTime);
                                                let span = 0;

                                                for (let i = col; i < timeSlots.length; i++) {
                                                    const [tsStart, tsEnd] = timeSlots[i].split(' - ');
                                                    const tsStartTime = parseTime(tsStart);
                                                    const tsEndTime = parseTime(tsEnd);

                                                    if (tsStartTime >= subjectStart && tsEndTime <= subjectEnd) {
                                                        span++;
                                                    } else {
                                                        break;
                                                    }
                                                }

                                                const isCurrent = currentClass && currentClass?.id === subject?.id;
                                                const bgColor = isCurrent
                                                    ? ' bg-gradient-to-r from-green-700/70 to-green-600/20 '
                                                    : isToday === dayIndex
                                                        ? ' bg-gradient-to-br to-rose-500/50 from-pink-600/80 border-red-500/40 !rounded-none'
                                                        : 'bg-gradient-to-br to-[#ffffff13] from-[#ffffff00]';

                                                cells.push(
                                                    <td
                                                        key={`${dayIndex}-${col}`}
                                                        colSpan={span}
                                                        className={`border border-[#ffffff30] w-[200px] h-[100px] p-2 align-top ${bgColor} relative`}
                                                    >
                                                        {type === 'edit' && (
                                                            <div className="flex backdrop-blur-xl gap-2 rounded-full bg-[#ffffff20] absolute right-1 top-1">
                                                                <Link href={`/edit/${subject.id}`} className="hover:bg-green-500/20 rounded-full p-1.5 text-green-500">
                                                                    <Pencil size={18} />
                                                                </Link>
                                                                <p onClick={() => setShow(subject.id)} className="hover:bg-red-500/20 rounded-full p-1.5 text-red-500">
                                                                    <Trash2 size={18} />
                                                                </p>
                                                            </div>
                                                        )}
                                                        <h2 className="capitalize text-center mt-7 font-semibold text-md">{subject.subjectName}</h2>
                                                    </td>
                                                );

                                                col += span; // Skip over the spanned columns
                                            }

                                            return cells;
                                        })()}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>}
            </div>

            {data?.data?.length === 0 && type === 'view' && (
                <Link href={`/timetable`} className='mt-10 buttonbg w-fit center mx-auto'>Add your Timetable</Link>
            )}
        </div>
    );
};

export default TimeTable;
