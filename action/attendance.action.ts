'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
 
export async function createAttendanceRecords(input: {
  date: Date;
  records: { timeTableId: string; present: boolean; }[];
}) {
    const {  date, records } = input;
    if(records?.length === 0) {
        return { status: 400, message: "No records to create." };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return { status: 401, message: "Unauthorized" };
    }
    
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

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
          },
          create: {
            userId:session.user.id,
            timeTableId: record.timeTableId,
            present: record.present,
            date: dayStart,
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
    };
  } catch (err) {
    return {
      status: 500,
      message: 'Attendance creation failed.',
    };
  }
}
  
export const getAttendance = async (startDate: Date, endDate: Date) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { status: 401, message: "Unauthorized" };
        }

        const attendance = await prisma.attendance.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: {
                timeTable: {
                    select: {
                        subjectName: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        return { status: 200, data: attendance };
    } catch (error) {

        return { status: 500, message: "Internal server error" };
    }
};

export const deleteAttendance = async (id: string) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { status: 401, message: "Unauthorized" };
        }

        const attendance = await prisma.timeTable.delete({
            where: {
                id,
                userId: session.user.id,
            },
        });
        if (!attendance) {
            return { status: 404, message: "Attendance not found" };
        }
        return { status: 200, message: "Attendance deleted successfully", data: attendance };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
    }
}