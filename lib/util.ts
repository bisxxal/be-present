export function convertTo24Hour(timeStr: string): string {
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
    '#00CEC9', // Cyan Blue
    '#F368E0', // Bright Pink
    '#FF8E72', // Vibrant Coral
    '#A29BFE', // Soft Purple
    '#FFD93D', // Vivid Yellow
    '#FDCB6E',  // Soft Orange
    '#FF6B6B', // Vivid Red
    '#1A8FE3', // Sky Blue
];
export const COLORS2 = [
  '#FF79C6', // Bright Orange
    '#845EC2', // Bold Violet
    '#F06595', // Hot Pink
    '#FCA311', // Deep Amber
    '#2EC4B6', // Teal Green
    '#3D5A80', // Slate Blue
    '#FF6F91', // Soft Rose
    '#C86DD7', // Electric Purple
    '#5EEAD4', // Minty Cyan
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

 