'use client'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { addTimeTable } from '@/action/profile.action';
import { convertTo24Hour } from '@/lib/util';
import TimeTable from '@/components/timeTable';

type SubjectEntry = {
  subjectName: string;
  startTime: string;
  endTime: string;
  day: string
};

const TimeTablePage = () => {
  const client = useQueryClient()
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { subjectName: '', startTime: '', endTime: '', day: '' } // Default to Sunday,
  ]);

  const handleInputChange = (
    index: number,
    field: keyof SubjectEntry,
    value: string,
  ) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleTimeChange = (
    index: number,
    field: 'startTime' | 'endTime',
    date: Date | null,
    day: string = '', 
  ) => {
    if (!date) return;

    const formattedTime = format(date, 'h:mm aa');
    handleInputChange(index, field, formattedTime);
  };

  const handleAddRow = () => {
    setSubjects([...subjects, { subjectName: '', startTime: '', endTime: '', day: '' }]);
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
        client.invalidateQueries({ queryKey: ['timetable'] });
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
    <div className="w-full mx-auto">
      <h1 className="text-2xl text-center my-4 font-bold">Add Weekly Timetable</h1>

      <form onSubmit={handleSubmit} className=" max-md:w-[90%] w-[70%] mx-auto space-y-4">
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
            <select onChange={(e) => handleInputChange(index, 'day', e.target.value)}>
              <option value="">Select Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">WednesDay</option>
              <option value="4">Thusday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>

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

export default TimeTablePage;
 