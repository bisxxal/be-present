'use client'

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { addTimeTable, getTimeTable } from '@/action/profile.action';

type SubjectEntry = {
  subjectName: string;
  startTime: string;
  endTime: string;
};

const ProfilePage = () => {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { subjectName: '', startTime: '', endTime: '' },
  ]);

  const handleInputChange = (
    index: number,
    field: keyof SubjectEntry,
    value: string
  ) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleTimeChange = (
    index: number,
    field: 'startTime' | 'endTime',
    date: Date | null
  ) => {
    if (!date) return;

    const formattedTime = format(date, 'h:mm aa');
    handleInputChange(index, field, formattedTime);
  };

  const handleAddRow = () => {
    setSubjects([...subjects, { subjectName: '', startTime: '', endTime: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const createTimeTableMutation = useMutation({
    mutationFn: async (formData: SubjectEntry[]) => {
      const res = await addTimeTable(formData);
      return res;
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const subject of subjects) {
      if (!subject.subjectName || !subject.startTime || !subject.endTime) {
        toast.error('All fields are required in each row.');
        return;
      }
    }

    createTimeTableMutation.mutate(subjects);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-2xl text-center my-4 font-bold">Add Weekly Timetable</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {subjects.map((entry, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 items-center border border-gray-300/30 p-4 rounded-lg"
          >
            <input
              type="text"
              placeholder="Subject Name"
              value={entry.subjectName}
              onChange={(e) => handleInputChange(index, 'subjectName', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />

            <DatePicker
              selected={entry.startTime ? new Date(`1970-01-01T${convertTo24Hour(entry.startTime)}`) : null}
              onChange={(date) => handleTimeChange(index, 'startTime', date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              className="px-3 py-2 border rounded-lg"
            />

            <DatePicker
              selected={entry.endTime ? new Date(`1970-01-01T${convertTo24Hour(entry.endTime)}`) : null}
              onChange={(date) => handleTimeChange(index, 'endTime', date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              placeholderText="End Time"
              className="px-3 py-2 border rounded-lg"
            />

            {subjects.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddRow}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md"
        >
          ➕ Add Subject
        </button>

        <button
          type="submit"
          className="block w-full mt-4  buttonbg text-white px-4 py-2 rounded-md  "
        >
          {createTimeTableMutation.isPending ? 'Submitting...' : 'Submit Timetable'}
        </button>
      </form>

      <TimeTable />
    </div>
  );
};

export default ProfilePage;

// Helper function to convert "h:mm aa" to 24-hour time (needed for Date constructor)
function convertTo24Hour(timeStr: string): string {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  let h = parseInt(hours);
  const m = parseInt(minutes);

  if (modifier === 'PM' && h < 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

const TimeTable = () =>{
  const {data , isLoading} = useQuery({
    queryKey: ['timetable'],  
    queryFn: (async() => await getTimeTable()),
  });
  return (
    <div className="w-full p-20">
      <h1 className="text-2xl font-bold mb-4">Your Timetable</h1>

      <div>
        {
          data && data?.data.map((item: any, index: number) => (
            <div key={index} className="  card p-4 mb-2 rounded-lg ">
              <h2 className="text-lg font-semibold">{item.subjectName}</h2>
              <p>Start Time: {item.startTime}</p>
              <p>End Time: {item.endTime}</p> 
              </div>
              ))
        }
      </div>
    </div>
  );
}
