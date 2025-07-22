import { parse, isSunday, format, differenceInCalendarDays } from 'date-fns'

type AttendanceDay = {
  date: string // e.g., "01/07/2025"
  present: number
  absent: number
}

export function calculateStreak(data: AttendanceDay[]): number {
  const parsedData = data
    .map(item => ({
      ...item,
      parsedDate: parse(item.date, 'dd/MM/yyyy', new Date())
    }))
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())

  let streak = 0
  let lastValidDate: Date | null = null

  for (const day of parsedData) {
    const { parsedDate, present, absent } = day

    if (isSunday(parsedDate)) {
      // skip Sundays
      continue
    }

    if (present > 0) {
      if (lastValidDate) {
        const daysDiff = differenceInCalendarDays(parsedDate, lastValidDate)
        if (daysDiff === 1 || (daysDiff > 1 && allSkippedWereSundays(lastValidDate, parsedDate))) {
          streak += 1
        } else {
          streak = 1
        }
      } else {
        streak = 1
      }

      lastValidDate = parsedDate
    } else if (absent > 0) {
      // break streak on absence
      streak = 0
      lastValidDate = null
    }
  }

  return streak
}

function allSkippedWereSundays(from: Date, to: Date): boolean {
  for (let d = new Date(from.getTime() + 86400000); d < to; d.setDate(d.getDate() + 1)) {
    if (!isSunday(d)) return false
  }
  return true
}
