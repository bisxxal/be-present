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
    { month: 'Jan', rate: 25 },
    { month: 'Feb', rate: 88 },
    { month: 'Mar', rate: 32 },
    { month: 'Apr', rate: 39 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: 41 },
    { month: 'Jul', rate: 51 },
    { month: 'Aug', rate: 91 },
    { month: 'Nov', rate: 11 },
    { month: 'Dec', rate: 61 },
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
      description: 'Comprehensive reports and analytics to identify patterns and improve attendance rates.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee and data encryption.',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access from any device with our responsive design and native mobile apps.',
      gradient: 'from-orange-500 to-yellow-400'
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Role-based access control for administrators, teachers, and students.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automated timetable integration with intelligent attendance predictions.',
      gradient: 'from-indigo-500 to-purple-500'
    }
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