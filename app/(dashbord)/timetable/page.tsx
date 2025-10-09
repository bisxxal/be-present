'use client'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { addTimeTable } from '@/action/profile.action';
import { convertTo24Hour } from '@/lib/util';
import TimeTable from '@/components/timeTable';
import { Loader } from 'lucide-react';
import { toastError, toastSuccess } from '@/lib/toast';
import { useGetTimeTable } from '@/hooks/useGetAttendance';
import { SubjectEntry } from '@/lib/constant';
import { useRouter } from 'next/navigation';

const TimeTablePage = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectEntry[]>([{ subjectName: '', startTime: '', endTime: '', day: '1' }]);
  const { data } = useGetTimeTable()
const { refetchTimeTable } = useGetTimeTable();

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
      localStorage.removeItem('subjectsData');
      if (data.status === 200) {
        toastSuccess(data.message);
        setSubjects([{ subjectName: '', startTime: '', endTime: '', day: '' }]); // Reset form

        refetchTimeTable();

      } else {
        toastError(data.message);
      }
    },

  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const subject of subjects) {
      if (!subject.subjectName || !subject.startTime || !subject.endTime) {
        toastError('All fields are required in each row.');
        return;
      }
    }
    createTimeTableMutation.mutate(subjects);
  };

  return (
    <div className="w-full pb-10 mx-auto overflow-hidden">
      <h1 className="text-2xl text-center my-4 font-bold">Add Your Timetable</h1>

      <form onSubmit={handleSubmit} className=" max-md:w-[98%] w-[70%] mx-auto space-y-4">
        {subjects.map((entry, index) => (
          <div
            key={index}
            className="flex lg:w-fit mx-auto max-md:flex-col max-md:gap-1 max-md:px-2 gap-4 items-center border border-gray-300/30 p-4 rounded-lg"
          >
            <div className=' w-[45%] max-md:w-full center gap-2'>
              <input
                type="text"
                placeholder="Enter new subject"
                value={entry.subjectName}
                onChange={(e) => handleInputChange(index, 'subjectName', e.target.value)}
                className="px-3 py-2 border max-md:w-full w-[400px] rounded-lg"
              />
              {data?.data && <select
                onChange={(e) => handleInputChange(index, 'subjectName', e.target.value)}
                className="px-3 py-2 border max-md:w-full w-[400px] rounded-lg "
              >
                <option value="">Select Subject</option>
                {Array.from(
                  new Map(
                    (data?.data || []).map((item: any) => [item.subjectName.toLowerCase(), item])
                  ).values()
                ).map((item: any) => (
                  <option key={item.id} value={item.subjectName}>
                    {item.subjectName}
                  </option>
                ))}
              </select>}

            </div>

            <select className=' my-1 max-md:w-full' value={entry.day} defaultValue="1" required onChange={(e) => handleInputChange(index, 'day', e.target.value)}>
              {/* <option value="">Day</option> */}
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>

            <div className=' w-full gap-3 flex items-center justify-between '>
              <DatePicker
                selected={entry.startTime ? new Date(`1970-01-01T${convertTo24Hour(entry.startTime)}`) : null}
                onChange={(date) => handleTimeChange(index, 'startTime', date)}
                showTimeSelect
                showTimeSelectOnly 
                timeIntervals={5}
                dateFormat="h:mm aa"
                placeholderText="Start Time"
                className="px-3 py-2 border  w-full rounded-lg"
              />
 
              <DatePicker
                selected={entry.endTime ? new Date(`1970-01-01T${convertTo24Hour(entry.endTime)}`) : null}
                onChange={(date) => handleTimeChange(index, 'endTime', date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                dateFormat="h:mm aa"
                placeholderText="End Time"
                className="px-3 py-2 border max-md: w-full rounded-lg"
              />
            </div>

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
          className="bg-gradient-to-br from-indigo-500  to-blue-500 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add Subject
        </button>

        <button
          type="submit"
          className="block w-full mt-4 center  buttonbg text-white px-4 py-2 rounded-md  "
        >
          {createTimeTableMutation.isPending ? <Loader className=' animate-spin' /> : 'Submit Timetable'}
        </button>
      </form>

      <TimeTable type="edit" />
    </div>
  );
};

export default TimeTablePage;
