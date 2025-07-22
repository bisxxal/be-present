import { getAttendanceForHeatmap } from '@/action/attendance.action';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { formatDate } from '@/lib/util';
import { FilteredDataProps } from '@/lib/constant';
 const LOCAL_STORAGE_KEY = 'attendanceHeatmapData';

const HeatMapCalender = () => {
    const [filteredData, setFilteredData] = useState<FilteredDataProps[]>([]);
    useEffect(() => {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setFilteredData(parsed);
            } catch (error) {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                fetchAndCacheData();
            }
        } else {
            fetchAndCacheData();
        }
    }, []);

    const fetchAndCacheData = async () => {
        try {
            const response = await getAttendanceForHeatmap();
            if (response.status !== 200) {
                return;
            }
            const formatted = response && response.data?.reduce((acc: FilteredDataProps[], curr: { date: Date }) => {
                const date = new Date(curr.date);
                const formattedDate = date.toISOString().split('T')[0];
                const existing = acc.find(item => item.date === formattedDate);
                if (existing) {
                    existing.count += 1;
                } else {
                    acc.push({ date: formattedDate, count: 1 });
                }
                return acc;
            }, []);

            if( formatted?.length === 0) {
                return;
            }
            setFilteredData(formatted);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formatted));
        } catch (error) {
            console.error('Failed to fetch attendance data:', error);
        }
    };

    return (
        <div className="bg-[#0d1117] mt-20 border  border-[#ffffff26] px-60 max-md:px-2 lg:32 p-4 rounded-3xl text-white">
            {/* <h2 className="text-xl mb-4">Attendance Heatmap</h2> */}
            <CalendarHeatmap
                className="focus:outline-none"
                endDate={new Date()}
                showWeekdayLabels={false}
                values={filteredData}
                classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    const count = Math.min(value.count, 4);
                    return `color-github-dark-${count}`;
                }}
                tooltipDataAttrs={(value:FilteredDataProps) => ({
                    'data-tooltip-id': 'heatmap-tooltip',
                    'data-tooltip-content': value.date
                        ? `${value.count} present on ${formatDate(value.date)}`
                        : 'Not present',
                })}
                horizontal={true}
                gutterSize={2}
            />
            <ReactTooltip id="heatmap-tooltip" />
            <div className="flex items-center gap-2 mt-4 text-sm">
                <span className="text-gray-400">Less</span>
                <div className="w-4 h-4 bg-[#151B23] border border-gray-600 rounded-sm" />
                <div className="w-4 h-4 bg-[#0e4429] rounded-sm" />
                <div className="w-4 h-4 bg-[#006d32] rounded-sm" />
                <div className="w-4 h-4 bg-[#26a641] rounded-sm" />
                <div className="w-4 h-4 bg-[#39d353] rounded-sm" />
                <span className="text-gray-400">More</span>
            </div>
        </div>
    );
};

export default HeatMapCalender;
