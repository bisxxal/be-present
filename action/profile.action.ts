'use server'

import { authOptions } from "@/lib/auth" 
import prisma from "@/lib/prisma"; 
import { getServerSession } from "next-auth"

export async function addTimeTable(subjects: { subjectName: string; startTime: string; endTime: string, day: string }[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 401, message: "Unauthorized" };
  }
  try {
    const timeTableEntries = subjects.map(subject => ({
      userId: session.user.id,
      subjectName: subject.subjectName.toLowerCase(),
      startTime: subject.startTime,
      endTime: subject.endTime,
      dayOfWeek: Number(subject.day),
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


export const getOneTimeTable = async (id: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { status: 401, message: "Unauthorized" };
    }

    const timeTable = await prisma.timeTable.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!timeTable) {
      return { status: 404, message: "Time table not found" };
    }

    return { status: 200, data: timeTable };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
}

export const updateTimeTable = async (data: { id?: string; subjectName: string; startTime: string; endTime: string; dayOfWeek: string }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { status: 401, message: "Unauthorized" };
    }
    const subjectName = data.subjectName;
    const startTime = data.startTime;
    const endTime = data.endTime;
    const day = data.dayOfWeek;

    if (!subjectName || !startTime || !endTime || !day) {
      return { status: 400, message: "All fields are required" };
    }

    const timeTable = await prisma.timeTable.update({
      where: {
        id: data.id,
        userId: session.user.id,
      },
      data: {
        subjectName: subjectName.toLowerCase(),
        startTime:  (startTime),
        endTime:  (endTime),
        dayOfWeek: Number(day),
      },
    });

    return { status: 200, message: "Time table updated successfully", data: timeTable };
  }
  catch (error) {

    return { status: 500, message: "Internal server error" };
  }
}