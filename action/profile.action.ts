'use server'

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"

 

type RecordInput = {
  timeTableId: string;
  present: boolean;
  remarks?: string | null;
};

 
export async function addTimeTable(subjects: { subjectName: string; startTime: string; endTime: string }[]) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status: 401, message: "Unauthorized" };
    }

    try {
        const timeTableEntries = subjects.map(subject => ({
            userId: session.user.id,
            subjectName: subject.subjectName,
            startTime: subject.startTime,
            endTime: subject.endTime,
        }));

        const createdEntries = await prisma.timeTable.createMany({
            data: timeTableEntries,
        });

        return { status: 200, message: "Timetable created successfully", data: createdEntries };
    } catch (error) {
        console.error("Error creating timetable:", error);
        return { status: 500, message: "Internal server error" };
    }
}



export const getTimeTable = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { status: 401, message: "Unauthorized" };
        }
        const timeTable = await prisma.timeTable.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return { status: 200, data: timeTable };
    } catch (error) {
        console.error("Error fetching timetable:", error);
        return { status: 500, message: "Internal server error" };
    }
}
export const getAttendance = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { status: 401, message: "Unauthorized" };
        }
        const attendance = await prisma.attendance.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                date: 'desc',
            },
        });

        return { status: 200, data: attendance };
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return { status: 500, message: "Internal server error" };
    }
}