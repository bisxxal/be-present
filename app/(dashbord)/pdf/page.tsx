'use client'
import Dowload from '@/components/dowload';
import Loading from '@/components/ui/loading';
import { useFilteredDate } from '@/hooks/useFilteredData';
import { useGetTimeTable } from '@/hooks/useGetAttendance';
import React, { useState, useEffect } from 'react';

const PdfPage = () => {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth()  , 1);
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);
    const [presentData, setPresentData] = useState<
        { date: string; present: boolean; subject: string }[]
    >([]);

    const { data ,isLoading } = useGetTimeTable();
    const { data: data2 } = useFilteredDate(startDate, endDate);
    const today = new Date();

    const dateRange = Array.from(
        { length: endDate.getDate() },
        (_, index) => {
            const d = new Date(startDate.getFullYear(), startDate.getMonth(), index + 1);
            return d;
        }
    );
    useEffect(() => {
        if (data?.data) {
            const unique = data.data.reduce((acc: string[], item: any) => {
                const subject = item.subjectName.toLowerCase();
                if (!acc.includes(subject)) {
                    acc.push(subject);
                }
                return acc;
            }, []);
            setUniqueSubjects(unique);
        }
    }, [data]);


    useEffect(() => {
        if (data2) {
            const formatted = data2.map((item: any) => ({
                date: new Date(item.date).toDateString(),
                present: item.present,
                subject: item?.timeTable?.subjectName.toLowerCase()
            }));
            setPresentData(formatted);
        }
    }, [data2]);

    const getAttendanceStatus = (dateObj: Date, subject: string) => {
           
        const date = dateObj.toDateString();
        const isSunday = dateObj.getDay() === 0;
        if (isSunday) return ;
        if (dateObj > today) return  ;

        const record = presentData.find(
            (entry) => entry.date === date && entry.subject === subject
        );

        if (!record) return <span className=' text-xs'>NM</span>;
        return record.present ? <span>✅</span> : <span>❌</span>;
    }; 
    return (
        <div className='p-4'>
            <Dowload  text={`be-present_From_${startDate.toDateString()}_To_${endDate.toDateString()}`} />
            <div id='receipt' className=' py-10 '>
                <h1   className='text-center text-2xl font-semibold'>Month Overview</h1>
                <p className='text-center max-md:text-base max-md:mb-4 text-xl font-medium'>
                    From {startDate.toDateString()} To {endDate.toDateString()}
                </p>

                <div className='center mt-4 gap-2 w-fit  text-sm '>
                    <div className=' bordercolor px-3 py-1 rounded-2xl whitespace-nowrap w-fit flex items-center justify-center gap-2'>Present ✅ </div>
                    <div className=' bordercolor px-3 py-1 rounded-2xl whitespace-nowrap w-fit flex items-center justify-center gap-2'>Absent ❌</div>
                    <div className=' bordercolor px-3 py-1 rounded-2xl whitespace-nowrap w-fit flex items-center justify-center gap-2'>NM: Not marked</div>
                    <div className=' bordercolor px-3 py-1 rounded-2xl w-fit flex items-center justify-center gap-2'><span className=' w-7 rounded-2xl h-4 bg-[#3400826a] '></span>Holiday</div>
                </div>

              { !isLoading ? <div  className='pr-3 overflow-visible visible mt-6'>
                    <table className=' border border-[#cecece] min-w-full'>
                        <thead  className='  border border-[#cf3232]'>
                            <tr>
                                <th className='border border-[#cecece] px-2 py-2'>Date</th>
                                {uniqueSubjects.map((subject, index) => (
                                    <th key={index} className='border border-[#cecece] w-10 capitalize px-1 py-1 text-sm'>
                                        {subject}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody >
                            {dateRange.map((dateObj, index) => {
                            const isSunday = dateObj.getDay() === 0;
                            return (
                                <tr key={index} className={isSunday ? 'bg-[#3400826a]' : ''}>
                                <td className='border border-[#cecece] px-2 py-2 !w-10 text-center'>
                                    {dateObj.getDate()}
                                </td>
                                {uniqueSubjects.map((subject, subIndex) => (
                                    <td
                                    key={subIndex}
                                    className='border border-[#cecece] text-center'
                                    >
                                    {getAttendanceStatus(dateObj, subject)}
                                    </td>
                                ))}
                                </tr>
                            );
                            })}
                        </tbody>
                        <tr className="font-semibold bg-[#1A1A2E] text-white">
                            <td className='border border-[#cecece] px-2 py-2 text-center'>Total Present</td>
                            {uniqueSubjects.map((subject, subIndex) => {
                                const totalPresent = presentData.filter(
                                    (entry) =>
                                        entry.present &&
                                        entry.subject === subject &&
                                        new Date(entry.date) >= startDate &&
                                        new Date(entry.date) <= endDate
                                ).length;

                                return (
                                    <td
                                        key={`total-${subIndex}`}
                                        className='border border-[#cecece] px-4 py-2 text-center'
                                    >
                                        {totalPresent}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr className=" hidden max-md:table-row font-semibold   text-white">
                            <td className=' text-center'> Happy Day</td>
                            
                        </tr>
                    </table>
                </div>:
                <Loading parent='w-full h-screen !mt-6' child='w-full h-full !h-[100vh]' boxes={1}    />
                }
            </div>
        </div>
    );
};

export default PdfPage;

