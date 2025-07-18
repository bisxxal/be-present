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
 
export async function createAttendanceRecords(input: {
  date: Date;
  records: { timeTableId: string; present: boolean; remarks?: string | null }[];
}) {
    const {  date, records } = input;
    if(records?.length === 0) {
        return { status: 400, message: "No records to create." };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return { status: 401, message: "Unauthorized" };
    }


  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0); // 🔥 KEY FIX


  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  try {
    const results = await Promise.all(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            userId_timeTableId_date: {
              userId:session.user.id,
              timeTableId: record.timeTableId,
              date: dayStart,
            },
          },
          update: {
            present: record.present,
            remarks: record.remarks ?? null,
            markedAt: new Date(),
          },
          create: {
            userId:session.user.id,
            timeTableId: record.timeTableId,
            present: record.present,
            remarks: record.remarks ?? null,
            date: dayStart,
            markedAt: new Date(),
          },
        })
      )
    );
    if (results.length === 0) {
      return { status: 400, message: "No records to update or create." };
    }
    return {
      status: 200,
      message: 'Attendance saved successfully.',
    //   data: results,
    };
  } catch (err) {
    console.error('createAttendanceRecords Error', err);
    return {
      status: 500,
      message: 'Attendance creation failed.',
    };
  }
}

