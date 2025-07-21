'use server'

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
 
export async function addTimeTable(subjects: { subjectName: string; startTime: string; endTime: string ,day:string }[]) {
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
            dayOfWeek: Number(subject.day)  ,  
        }));
        
        const createdEntries = await prisma.timeTable.createMany({
            data: timeTableEntries,
        });

        return { status: 200, message: "Timetable created successfully", data: createdEntries };
    } catch (error) {
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
        return { status: 500, message: "Internal server error" };
    }
}
 