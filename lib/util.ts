export function convertTo24Hour(timeStr: string  ): string {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  let h = parseInt(hours);
  const m = parseInt(minutes);

  if (modifier === 'PM' && h < 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}
export const COLORS = [
  '#A48FFF', // Bright Teal
  '#64B5F5', // Aqua Green
];
export const COLORS2 = [
  '#FF79C6', // Bright Orange
  '#845EC2', // Bold Violet
];

export const getDayName = (dayIndex: number | null | undefined): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (dayIndex === null || dayIndex === undefined) return 'Unknown';
  return days[dayIndex];
};

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const years = [2025, 2026, 2027];

export const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const formatDate = (dateStr: Date | string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });

  const getOrdinal = (n: any) => {
    if (n > 3 && n < 21) return 'th'; // 11th, 12th, 13th...
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinal(day)} ${month}`;
};

export const badgeImages = (badgeNumber: number) => {
  if (badgeNumber >= 3 && badgeNumber <= 4) {
    return { name: "Getting Started", img: '/b3.png' };
  }
  if (badgeNumber > 4 && badgeNumber <= 6) {
    return { img: '/b5.png', name: "Consistent Champ" };
  }
  if (badgeNumber > 6 && badgeNumber <= 13) {
    return { img: '/bg7.png', name: "One Week Wonder" };
  }
  if (badgeNumber >= 14 && badgeNumber <= 29) {
    return { img: '/b14.png', name: "Two Week Titan" };
  }
  if (badgeNumber >= 30) {
    return { img: '/b30.png', name: "Monthly Master" };
  }

  return null; // default case if badge doesn't match any range
};
export const getUnlockedAchievements = (badgeNumber: number) => {
  return [
    { name: "Getting Started", img: '/b3.png', unlocked: badgeNumber >= 3, streak: 3 },
    { name: "Consistent Champ", img: '/b5.png', unlocked: badgeNumber >= 5, streak: 5 },
    { name: "One Week Wonder", img: '/bg7.png', unlocked: badgeNumber >= 7, streak: 7 },
    { name: "Two Week Titan", img: '/b14.png', unlocked: badgeNumber >= 14, streak: 14 },
    { name: "Monthly Master", img: '/b30.png', unlocked: badgeNumber >= 30, streak: 30 }
  ];
};

export const countHowManyDays = (badgeNumber:number) => {

  let count = 0;
  let badgename = '';

  if (badgeNumber < 3) {
    count = 3;
    badgename = 'Your First badge';
  }
  if (badgeNumber >= 3) {
    count = 5;
    badgename = 'Consistent Champ';
  }
  if (badgeNumber >= 5) {
    count = 7;
    badgename = 'One Week Wonder';
  }
  if (badgeNumber >= 7) {
    count = 14;
    badgename = 'Two Week Titan';
  }
  if (badgeNumber >= 14) {
    count = 30;
    badgename = 'Monthly Master';
  }

  const r = count - badgeNumber;
  return { count: r, badgeName: badgename }
};
export const weeklyDataFormatedata = (dateData:{date:string , present:number,absent:number}[]) => {
  
  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

const today = new Date(); 
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weeklyData = [];

  for (let i = 0; i < 6; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + mondayOffset + i);

    const formattedDate = formatDate(currentDate);
    const matched = dateData.find(entry => entry.date === formattedDate);

    const attended = matched ? matched.present > 0 ? true: false : 'pending';

    weeklyData.push({
      day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      attended,
      date: String(currentDate.getDate()).padStart(2, '0')
    });
  }
  return weeklyData;

}
export function countMonthlyClasses(  classesPerWeek: number ): number {
  const year =  new Date().getFullYear();
  const  month = new Date().getMonth();  
  let classDays = 0;
    const date = new Date(year, month, 1); // month is 0-indexed

    while (date.getMonth() === month) {
        const day = date.getDay();
        // Skip Sundays (0 = Sunday)
        if (day !== 0 && day !== 6) { // Assuming classes are not held on weekends
            classDays++;
        }
        date.setDate(date.getDate() + 1);
    }
 
    const classesPerDay = classesPerWeek / 6;

    const totalClasses = Math.floor(classDays * classesPerDay);
    return totalClasses;
}
