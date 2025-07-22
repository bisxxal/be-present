# 📚 Be Present

A comprehensive attendance tracking application built with Next.js that helps students monitor their class attendance, maintain streaks, and visualize their academic progress through interactive charts and analytics.

## ✨ Features

### 📊 Analytics & Visualization
- **Interactive Charts**: Pie charts, bar charts, and area charts to visualize attendance patterns
- **Subject-wise Tracking**: Monitor attendance for individual subjects
- **Calendar Heatmap**: Visual representation of attendance over time
- **Present/Absent Statistics**: Detailed breakdown of attendance records

### 🎯 Gamification & Motivation
- **Attendance Streaks**: Track consecutive days of attendance
- **Achievement Badges**: Unlock badges for attendance milestones
  - 3-day streak badge
  - 7-day streak badge
  - 14-day streak badge
  - 30-day streak badge
- **Progress Tracking**: Visual indicators to motivate consistent attendance

### 📅 Schedule Management
- **Custom Timetable**: Add and manage your class schedule
- **Smart Attendance**: Mark attendance based on your timetable
- **Subject Organization**: Organize classes by subjects and time slots

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **Charts**:  Recharts
- **UI Components**: Custom components with Tailwind
- **Authentication**: Next Auth for secure login

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Database (PostgreSQL/MySQL/SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/attendance-tracker.git
   cd attendance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your database URL and other required variables:
   ```env
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Setting Up Your Timetable
1. Navigate to the "Timetable" section
2. Add your subjects and class timings
3. Configure recurring schedules for each day of the week

### Marking Attendance
1. Go to the "Attendance" page
2. Select the current date
3. Mark yourself present or absent for each scheduled class
4. View real-time updates to your statistics

### Viewing Analytics
- **Dashboard**: Overview of your attendance statistics
- **Charts**: Visual representation of your attendance patterns
- **Calendar**: Heatmap showing your attendance history
- **Streaks**: Track your consecutive attendance days

### Earning Badges
- Maintain consistent attendance to unlock achievement badges
- View your badge collection in the profile section
- Share your achievements to stay motivated

## 📊 Database Schema

 
## 🎨 Screenshots

[Add screenshots of your app here]

 
## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 

⭐ **Star this repository if you find it helpful!**

Made with ❤️ by Bishal