// types/attendance.ts
import { Prisma } from '@prisma/client';

// Utility types for common queries
export type UserWithDepartment = Prisma.UserGetPayload<{
  include: {
    department: true;
    organization: true;
  };
}>;

export type AttendanceWithUser = Prisma.AttendanceGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        employeeId: true;
        department: {
          select: {
            name: true;
            code: true;
          };
        };
      };
    };
  };
}>;

export type AttendanceRequestWithUser = Prisma.AttendanceRequestGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        employeeId: true;
      };
    };
    approver: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

// Input types for API operations
export interface CreateAttendanceInput {
  userId: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'WORK_FROM_HOME' | 'ON_LEAVE' | 'HOLIDAY';
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  location?: string;
}

export interface AttendanceFilters {
  userId?: string;
  departmentId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string[];
  organizationId: string;
}

export interface AttendanceStats {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  workFromHome: number;
  onLeave: number;
  holidays: number;
  attendancePercentage: number;
}

// utils/attendance.ts
import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';

const prisma = new PrismaClient();

export class AttendanceService {
  // Create or update attendance record
  static async upsertAttendance(data: CreateAttendanceInput & { organizationId: string }) {
    const { userId, date, organizationId, ...attendanceData } = data;
    
    // Calculate total hours if both check-in and check-out times are provided
    let totalHours: number | undefined;
    if (attendanceData.checkInTime && attendanceData.checkOutTime) {
      const diffMs = attendanceData.checkOutTime.getTime() - attendanceData.checkInTime.getTime();
      totalHours = diffMs / (1000 * 60 * 60); // Convert to hours
    }

    return await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date.toISOString().split('T')[0]), // Ensure date-only format
        },
      },
      update: {
        ...attendanceData,
        totalHours,
        updatedAt: new Date(),
      },
      create: {
        userId,
        organizationId,
        date: new Date(date.toISOString().split('T')[0]),
        ...attendanceData,
        totalHours,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
      },
    });
  }

  // Get attendance records with filters
  static async getAttendanceRecords(filters: AttendanceFilters, page = 1, limit = 50) {
    const { userId, departmentId, startDate, endDate, status, organizationId } = filters;
    
    const where: Prisma.AttendanceWhereInput = {
      organizationId,
      ...(userId && { userId }),
      ...(startDate && endDate && {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }),
      ...(status && status.length > 0 && {
        status: {
          in: status as any[],
        },
      }),
      ...(departmentId && {
        user: {
          departmentId,
        },
      }),
    };

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              employeeId: true,
              department: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        orderBy: [
          { date: 'desc' },
          { user: { firstName: 'asc' } },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get attendance statistics for a user
  static async getAttendanceStats(
    userId: string,
    organizationId: string,
    period: 'month' | 'year' = 'month',
    date: Date = new Date()
  ): Promise<AttendanceStats> {
    const startDate = period === 'month' ? startOfMonth(date) : startOfYear(date);
    const endDate = period === 'month' ? endOfMonth(date) : endOfYear(date);

    // Get all attendance records for the period
    const records = await prisma.attendance.findMany({
      where: {
        userId,
        organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
      },
    });

    // Count different status types
    const statusCounts = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDays = records.length;
    const present = statusCounts.PRESENT || 0;
    const absent = statusCounts.ABSENT || 0;
    const late = statusCounts.LATE || 0;
    const halfDay = statusCounts.HALF_DAY || 0;
    const workFromHome = statusCounts.WORK_FROM_HOME || 0;
    const onLeave = statusCounts.ON_LEAVE || 0;
    const holidays = statusCounts.HOLIDAY || 0;

    // Calculate attendance percentage (excluding holidays)
    const workingDays = totalDays - holidays;
    const attendedDays = present + late + halfDay + workFromHome;
    const attendancePercentage = workingDays > 0 ? (attendedDays / workingDays) * 100 : 0;

    return {
      totalDays,
      present,
      absent,
      late,
      halfDay,
      workFromHome,
      onLeave,
      holidays,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    };
  }

  // Get monthly attendance summary for multiple users
  static async getMonthlyAttendanceSummary(
    organizationId: string,
    month: number,
    year: number,
    departmentId?: string
  ) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const records = await prisma.attendance.findMany({
      where: {
        organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(departmentId && {
          user: {
            departmentId,
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Group by user and calculate stats
    const userStats = records.reduce((acc, record) => {
      const userId = record.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: record.user,
          records: [],
          stats: {
            totalDays: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            workFromHome: 0,
            onLeave: 0,
            holidays: 0,
            attendancePercentage: 0,
          },
        };
      }
      
      acc[userId].records.push(record);
      acc[userId].stats.totalDays++;
      acc[userId].stats[record.status.toLowerCase() as keyof AttendanceStats]++;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate attendance percentages
    Object.values(userStats).forEach((userStat: any) => {
      const { stats } = userStat;
      const workingDays = stats.totalDays - stats.holidays;
      const attendedDays = stats.present + stats.late + stats.halfDay + stats.workFromHome;
      stats.attendancePercentage = workingDays > 0 ? Math.round((attendedDays / workingDays) * 100 * 100) / 100 : 0;
    });

    return Object.values(userStats);
  }

  // Bulk create attendance records (useful for imports)
  static async bulkCreateAttendance(records: CreateAttendanceInput[]) {
    const attendanceRecords = records.map(record => ({
      ...record,
      date: new Date(record.date.toISOString().split('T')[0]),
    }));

    return await prisma.attendance.createMany({
      data: attendanceRecords,
      skipDuplicates: true,
    });
  }

  // Get attendance calendar data for a specific month
  static async getAttendanceCalendar(
    userId: string,
    organizationId: string,
    month: number,
    year: number
  ) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
        totalHours: true,
        notes: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Convert to calendar format
    const calendar = records.reduce((acc, record) => {
      const dateKey = format(record.date, 'yyyy-MM-dd');
      acc[dateKey] = {
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalHours: record.totalHours,
        notes: record.notes,
      };
      return acc;
    }, {} as Record<string, any>);

    return calendar;
  }
}