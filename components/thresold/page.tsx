'use client' 
import { endOfMonth, startOfMonth } from 'date-fns';
import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Target, TrendingUp, TrendingDown, Calendar, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { useFilteredDate } from '@/hooks/useFilteredData';
 

const AttendanceThresholdTracker = ({ startDate, endDate }) => {
  const [attendanceGoal, setAttendanceGoal] = useState(75);
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const today = useMemo(() => new Date(), []);
  const defaultStart = startOfMonth(today);
  const defaultEnd = endOfMonth(today);
  const {  data ,  } = useFilteredDate(defaultStart, defaultEnd)

  
  console.log(data)
  useEffect(() => {

    if(!data || data.length === 0) {
      setSubjectData([]);
      return;
    }
    // Group attendance data by subject (timeTableId)
    const groupedBySubject =  data.reduce((acc, record) => {
      const key = record.timeTableId;
      if (!acc[key]) {
        acc[key] = {
          timeTableId: record.timeTableId,
          subjectName: record.timeTable.subjectName,
          attendances: []
        };
      }
      acc[key].attendances.push(record);
      return acc;
    }, {});

    // Process each subject's data to calculate statistics
    const processedData = Object.values(groupedBySubject).map(subject => {
      const totalClasses = subject.attendances.length;
      const attendedClasses = subject.attendances.filter(att => att.present).length;
      const currentPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
      
      // Calculate how many classes can be missed while maintaining the goal
      const requiredAttended = Math.ceil((attendanceGoal / 100) * totalClasses);
      const canMiss = Math.max(0, attendedClasses - requiredAttended);
      
      // Forecast: classes that can be missed before falling below threshold
      // Estimate future classes based on current pattern
      const futureClasses = Math.max(10, Math.ceil(totalClasses * 0.5)); // Assume 50% more classes or minimum 10
      const totalFutureClasses = totalClasses + futureClasses;
      const requiredFutureAttended = Math.ceil((attendanceGoal / 100) * totalFutureClasses);
      const maxMissable = Math.max(0, attendedClasses - requiredFutureAttended);

      // Sort attendances by date for recent pattern display
      const sortedAttendances = [...subject.attendances].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return {
        timeTableId: subject.timeTableId,
        subjectName: subject.subjectName,
        totalClasses,
        attendedClasses,
        currentPercentage,
        canMiss,
        maxMissable,
        status: currentPercentage >= attendanceGoal ? 'safe' : 'warning',
        attendances: sortedAttendances
      };
    });

    setSubjectData(processedData);
  }, [data, attendanceGoal]);

  const calculateOverallStats = () => {
    const totalClasses = subjectData.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = subjectData.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    
    return {
      totalClasses,
      totalAttended,
      overallPercentage,
      status: overallPercentage >= attendanceGoal ? 'safe' : 'warning'
    };
  };

  const overallStats = calculateOverallStats();

  const getStatusColor = (status) => {
    return status === 'safe' ? 'text-emerald-400' : 'text-red-400';
  };

  const getStatusIcon = (status) => {
    return status === 'safe' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;
  };

  const filteredData = selectedSubject === 'all' ? subjectData : subjectData.filter(s => s.timeTableId === selectedSubject);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="relative">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Attendance Threshold Tracker
                </h1>
                <p className="text-gray-400 text-lg mt-1">Monitor your attendance goals with smart forecasting</p>
                {startDate && endDate && (
                  <p className="text-gray-500 text-sm mt-1">
                    Period: {formatDate(startDate)} - {formatDate(endDate)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Goal Setting */}
              <div className="flex items-center gap-4">
                <label className="text-lg font-medium text-gray-300">Minimum Goal:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceGoal}
                    onChange={(e) => setAttendanceGoal(Number(e.target.value))}
                    className="w-24 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-200"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-4">
                <label className="text-lg font-medium text-gray-300">Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-200"
                >
                  <option value="all">All Subjects</option>
                  {subjectData.map(subject => (
                    <option key={subject.timeTableId} value={subject.timeTableId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        {selectedSubject === 'all' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Overall Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Total Classes</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{overallStats.totalClasses}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">Classes Attended</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{overallStats.totalAttended}</p>
                </div>
                
                <div className={`bg-gradient-to-br ${overallStats.status === 'safe' ? 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' : 'from-red-500/20 to-red-600/20 border-red-500/30'} backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-transform duration-200`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(overallStats.status)}
                    <span className={`text-sm font-medium ${getStatusColor(overallStats.status)}`}>
                      Current Percentage
                    </span>
                  </div>
                  <p className={`text-3xl font-bold ${getStatusColor(overallStats.status)}`}>
                    {overallStats.overallPercentage.toFixed(1)}%
                  </p>
                </div>
                
                <div className={`bg-gradient-to-br ${overallStats.status === 'safe' ? 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' : 'from-red-500/20 to-red-600/20 border-red-500/30'} backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-transform duration-200`}>
                  <div className="flex items-center gap-3 mb-2">
                    {overallStats.status === 'safe' ? 
                      <TrendingUp className="w-6 h-6 text-emerald-400" /> : 
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    }
                    <span className={`text-sm font-medium ${getStatusColor(overallStats.status)}`}>
                      Status
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${getStatusColor(overallStats.status)}`}>
                    {overallStats.status === 'safe' ? 'On Track' : 'Below Goal'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject-wise Analysis */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {selectedSubject === 'all' ? 'Subject-wise Analysis' : 'Subject Analysis'}
          </h2>
          
          {filteredData.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Attendance Data Found</h3>
              <p className="text-gray-500">No attendance records found for the selected period.</p>
            </div>
          ) : (
            filteredData.map((subject) => (
              <div key={subject.timeTableId} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
                  
                  {/* Subject Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{subject.subjectName}</h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{subject.totalClasses} classes recorded</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm ${
                      subject.status === 'safe' 
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}>
                      {getStatusIcon(subject.status)}
                      <span className="font-medium">
                        {subject.status === 'safe' ? 'On Track' : 'Below Goal'}
                      </span>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-all duration-200">
                      <p className="text-sm font-medium text-gray-400 mb-1">Total Classes</p>
                      <p className="text-2xl font-bold text-white">{subject.totalClasses}</p>
                    </div>
                    
                    <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-400/40 transition-all duration-200">
                      <p className="text-sm font-medium text-emerald-400 mb-1">Classes Attended</p>
                      <p className="text-2xl font-bold text-emerald-300">{subject.attendedClasses}</p>
                    </div>
                    
                    <div className={`backdrop-blur-sm border rounded-xl p-4 transition-all duration-200 ${
                      subject.status === 'safe' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/40' 
                        : 'bg-red-500/10 border-red-500/30 hover:border-red-400/40'
                    }`}>
                      <p className={`text-sm font-medium mb-1 ${getStatusColor(subject.status)}`}>
                        Current Percentage
                      </p>
                      <p className={`text-2xl font-bold ${getStatusColor(subject.status)}`}>
                        {subject.currentPercentage.toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 hover:border-blue-400/40 transition-all duration-200">
                      <p className="text-sm font-medium text-blue-400 mb-1">Classes Can Miss</p>
                      <p className="text-2xl font-bold text-blue-300">{subject.canMiss}</p>
                    </div>
                  </div>

                  {/* Forecasting */}
                  <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-yellow-400 mb-4 flex items-center gap-3">
                      <div className="p-1 bg-yellow-500/20 rounded-lg">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      Forecasting & Recommendations
                    </h4>
                    
                    {subject.status === 'safe' ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">
                            You're currently meeting your <span className="text-emerald-400 font-semibold">{attendanceGoal}%</span> attendance goal.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">
                            You can afford to miss up to <span className="text-blue-400 font-semibold">{subject.maxMissable}</span> more classes 
                            this semester while maintaining your goal.
                          </p>
                        </div>
                        {subject.maxMissable <= 2 && (
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                            <p className="text-orange-300 font-medium">
                              Warning: You have very few classes left to miss. Be careful!
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">
                            You're currently below your <span className="text-red-400 font-semibold">{attendanceGoal}%</span> attendance goal.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">
                            You need to attend <span className="text-yellow-400 font-semibold">all remaining classes</span> to improve your percentage.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">
                            Consider speaking with your instructor about make-up opportunities.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Attendance Pattern */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                      <div className="p-1 bg-purple-500/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      Recent Attendance Pattern
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {subject.attendances.slice(-10).map((attendance, index) => (
                        <div
                          key={attendance.id}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all duration-200 hover:scale-110 ${
                            attendance.present 
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25' 
                              : 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25'
                          }`}
                          title={`${formatDate(attendance.date)} - ${attendance.present ? 'Present' : 'Absent'}`}
                        >
                          {attendance.present ? 'P' : 'A'}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      <span className="text-emerald-400">Green = Present</span>, <span className="text-red-400">Red = Absent</span> (Last 10 classes)
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceThresholdTracker;