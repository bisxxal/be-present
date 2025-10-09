import { getAttendance } from "@/action/attendance.action";
import { getTimeTable } from "@/action/profile.action";
import { SubjectEntry } from "@/lib/constant";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetAttendance = (startDate: Date, endDate: Date) => {
  const { data, isLoading } = useQuery({
    queryKey: ['attendance', startDate, endDate],
    queryFn: (async () => await getAttendance(startDate, endDate)),
  });

  return { data: data, isLoading, }
}


export const useGetTimeTable = () => {
  const [localData, setLocalData] = useState<SubjectEntry[] | null>(null);
  const [isCheckingLocal, setIsCheckingLocal] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('subjectsData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalData(parsed);
      } catch (error) {
      }
    }
    setIsCheckingLocal(false);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['timetable'],
    queryFn: async () => {
      const fetched = await getTimeTable();
      localStorage.setItem('subjectsData', JSON.stringify(fetched));
      setLocalData(fetched);
      return fetched;
    },
    enabled: !isCheckingLocal && localData === null, // only enable fetch when check is done
  });

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);


  return {
    data: localData,
    isLoading: isCheckingLocal || (localData === null && isLoading),
    refetchTimeTable: refetch, // Expose refetch

  };
};