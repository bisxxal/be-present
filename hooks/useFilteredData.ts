import { AttendanceDataProps } from "@/lib/constant";
import { useEffect, useMemo, useState } from "react";
import { useGetAttendance } from "./useGetAttendance";

 

export const useFilteredDate = (startDate: Date, endDate: Date) => {
  const [presentData, setPresentData] = useState<{ type: string; value: number }[]>([]);
  const [totalPersentages, setTotalPercentages] = useState<{ type: string; percentage: string }[]>([]);
  const [subjCount, setSubjCount] = useState<{ name: string; present: number; absent: number }[]>([]);
  const [dateData, setDateData] = useState<{ date: string; present: number; absent: number }[]>([]);

  const { data, isLoading } = useGetAttendance(startDate, endDate);

  useEffect(() => {
    if (!data?.data) return;
    const attendanceList: AttendanceDataProps[] = data.data;

    const subjectSummary: Record<string, { name: string; present: number; absent: number }> = {};
    const dateSummary: Record<string, { date: string; present: number; absent: number }> = {};
    const presentCount = { present: 0, absent: 0 };

    attendanceList.forEach(entry => {
      const subjectName = entry.timeTable.subjectName;
      const subjectKey = subjectName.toLowerCase(); // for case-insensitive matching
      const dateStr = new Date(entry.date).toLocaleDateString();

      // Subject-wise count
      if (!subjectSummary[subjectKey]) {
        subjectSummary[subjectKey] = { name: subjectName, present: 0, absent: 0 };
      }
      if (entry.present) {
        subjectSummary[subjectKey].present += 1;
        presentCount.present += 1;
      } else {
        subjectSummary[subjectKey].absent += 1;
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

    const total = presentCount.present + presentCount.absent;
    const percentages = [
      { type: 'present', percentage: ((presentCount.present / total) * 100).toFixed(2) },
      { type: 'absent', percentage: ((presentCount.absent / total) * 100).toFixed(2) },
    ];

    setPresentData([
      { type: 'present', value: presentCount.present },
      { type: 'absent', value: presentCount.absent },
    ]);
    setSubjCount(Object.values(subjectSummary));
    setDateData(Object.values(dateSummary));
    setTotalPercentages(percentages);
  }, [data]);

  return {
    presentData,
    totalPersentages,
    subjCount,
    data: data?.data,
    dateData,
    isLoading,
  };
};
