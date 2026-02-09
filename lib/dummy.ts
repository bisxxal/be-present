import { BarChart3, Calendar, Clock, Shield, Smartphone, TrendingUp, Trophy, Users } from "lucide-react";

export const demoAttendanceData = [
    { name: 'Present', value: 89, color: '#a48fff' },
    { name: 'Absent', value: 30, color: '#EF4444' },
  ];

  export const filteredData = []

  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    filteredData.push({ date: date.toISOString().split('T')[0], count: Math.floor(Math.random() * 10) });
  }

export const demoTrendData = [
  { month: 'Jan', present: 10 },
  { month: 'Feb', present: 70 },
  { month: 'Mar', present: 50 },
  { month: 'Apr', present: 20 },
  { month: 'May', present: 10 },
  { month: 'Jun', present: 25 },
  { month: 'Jul', present: 70 },
  { month: 'Aug', present: 50 },
  { month: 'Sep', present: 30 },
  { month: 'Oct', present: 10 },
  { month: 'Nov', present: 70 },
  { month: 'Dec', present: 30 },
];
 
  export const demoTimeTable = [
    { time: '09:00 AM', subject: 'C++', room: 'Room 101', status: 'present' },
    { time: '10:30 AM', subject: 'Java', room: 'Lab A', status: 'present' },
    { time: '02:00 PM', subject: 'Python', room: 'Lab B', status: 'late' },
    { time: '03:30 PM', subject: 'Java script', room: 'Room 205', status: 'upcoming' }
  ];


  export const features = [
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Monitor attendance instantly with live updates and notifications for immediate insights.',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reports and analytics to identify patterns and improve attendance presents.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.',
      gradient: 'from-green-500 to-emerald-400'
    },
    // {
    //   icon: Shield,
    //   title: 'Pdf Support',
    //   description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.',
    //   gradient: 'from-green-500 to-emerald-400'
    // },
     
  ];

  export const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Schools & Colleges' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  export const streakData = [
    { length: "3 days", badge: "Getting Started", message: "You're on a roll!", icon: '/b3.png', color: "from-green-400 to-emerald-500" },
    { length: "5 days", badge: "Consistent Champ", message: "5-day streak! Keep going!", icon: '/b5.png', color: "from-blue-400 to-cyan-500" },
    { length: "7 days", badge: "One Week Wonder", message: "One full week of wins!", icon: '/bg7.png', color: "from-purple-400 to-pink-500" },
    { length: "14 days", badge: "Two Week Titan", message: "Two weeks strong!", icon: '/b14.png', color: "from-orange-400 to-red-500" },
    { length: "30 days", badge: "Monthly Master", message: "You're unstoppable!", icon: '/b30.png', color: "from-yellow-400 to-amber-500" }
  ];

  export const benefits = [
    {
      icon: TrendingUp,
      title: "Build Better Habits",
      description: "Consistent attendance creates lasting study patterns and improves academic performance."
    },
    {
      icon: Calendar,
      title: "Visual Progress",
      description: "See your commitment visualized through beautiful streak counters and achievement badges."
    },
    {
      icon: Trophy,
      title: "Unlock Rewards",
      description: "Earn exclusive badges and titles as you maintain longer attendance streaks."
    },
    {
      icon: Clock,
      title: "Stay Motivated",
      description: "Daily streak reminders keep you accountable and motivated to attend every class."
    }
  ];