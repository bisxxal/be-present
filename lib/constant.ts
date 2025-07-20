export interface AttendanceDataProps {
  date: Date;
  timeTable: {
    subjectName: string;
  };
  present: boolean;
  userId: string;
  timeTableId: string;
}
export interface TimeTableProps {
  dayOfWeek: number | null;  
  createdAt: Date;
  endTime: string;
  id: string;
  startTime: string;
  subjectName: string;
  userId:string
}