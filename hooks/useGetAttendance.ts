import { getAttendance } from "@/action/attendance.action";
import { getTimeTable } from "@/action/profile.action";
import { useQuery } from "@tanstack/react-query";

export const useGetAttendance = ( startDate: Date, endDate: Date) => {
       const { data ,isLoading } =useQuery({
        queryKey: ['attendance', startDate, endDate],
        queryFn: (async () => await getAttendance(startDate, endDate)),
    });

    return{data: data,isLoading,}
}

export const useGetTimeTable = () => {
     const { data, isLoading } = useQuery({
        queryKey: ['timetable'],
        queryFn: (async () => await getTimeTable()),
      });

    return { data, isLoading };
}