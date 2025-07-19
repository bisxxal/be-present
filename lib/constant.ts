export interface AttendanceDataProps {
  date: Date;
  timeTable: {
    subjectName: string;
  };
  present: boolean;
  userId: string;
  timeTableId: string;
}