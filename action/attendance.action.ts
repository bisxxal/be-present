'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";

  
type AttendanceInput = {
  userId: string;
  date: Date | string;
  records: {
    timeTableId: string;
    present: boolean;
    remarks?: string;
  }[];
};

export async function createAttendanceRecords(input: AttendanceInput) {
  const {   date, records } = input;

  try {
    const session = await getServerSession(authOptions);
                if (!session) {
                    return { status: 401, message: "Unauthorized" };
                }

    const attendanceDate = typeof date === 'string' ? new Date(date) : date;

    console.log(attendanceDate, records);

    const created = await Promise.all(
      records.map(record =>
        prisma.attendance.create({
          data: {
            userId: session.user.id,
            timeTableId: record.timeTableId,
            date: attendanceDate,
            present: record.present,
            markedAt: new Date(),
            remarks: record.remarks ?? null,
          },
        })
      )
    );
    console.log(created)

    // revalidatePath('/dashboard'); // Optional: revalidate any cached page
    return { status: 200, message: 'Attendance marked successfully', data: created };
  } catch (error) {
    console.error('[createAttendanceRecords]', error);
    return { status: 500, message: 'Failed to mark attendance' };
  }
}
