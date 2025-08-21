'use client'
import { convertTo24Hour } from '@/lib/util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Loading from '@/components/ui/loading';
import { Loader } from 'lucide-react';
import { toastError, toastSuccess } from '@/lib/toast';
import { getOneTimeTable, updateTimeTable } from '@/action/profile.action';
 

const Edit = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';

  const client = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['edittimetable', id],
    queryFn: async () => await getOneTimeTable(id),
  });

  // ✅ State to hold start & end time
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // ✅ Set time after data is fetched
  useEffect(() => {
    if (data?.data) {
      const { startTime, endTime } = data.data;
      if (startTime) setStartTime(new Date(`1970-01-01T${convertTo24Hour(startTime)}`));
      if (endTime) setEndTime(new Date(`1970-01-01T${convertTo24Hour(endTime)}`));
    }
  }, [data]);

  const handleTimeChange = (
    field: 'startTime' | 'endTime',
    date: Date | null,
  ) => {
    if (!date) return;
    field === 'startTime' ? setStartTime(date) : setEndTime(date);
  };

  const updateTimeTableMutation = useMutation({
    mutationFn: async (formData: any) => {
      return await updateTimeTable(formData);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toastSuccess(data.message);
        client.invalidateQueries({ queryKey: ['timetable'] });
      } else {
        toastError(data.message);
      }
    },
  });

  const handelSumbit = (formdata: FormData) => {
    const subjectName = formdata.get('subject') as string;
    const day = parseInt(formdata.get('day') as string);

    if (!startTime || !endTime) {
      toastError('Start time or end time missing');
      return;
    }

    const payload = {
      id,
      subjectName,
      dayOfWeek: day,
      startTime: format(startTime, 'h:mm aa'),
      endTime: format(endTime, 'h:mm aa'),
    };

    updateTimeTableMutation.mutate(payload);
  };

  if (isLoading) return <Loading parent='  w-full  mx-auto ' child='w-[50%]  rounded-3xl mt-[47px] max-md:w-[90%] h-[290px]' boxes={1} />

  return (
    <div className="w-full h-full">
      <form
        className="w-[50%] mt-[110px] max-md:w-[90%] mx-auto flex flex-col items-center gap-2 card rounded-3xl bordercolor p-4"
        action={handelSumbit}
      >
        <h2 className=' text-2xl font-bold'>Update timetable</h2>
        <div className="w-full flex gap-4 items-center">
          <input defaultValue={data?.data?.subjectName} type="text" placeholder="subjectname" name="subject" />
          <select className="my-1 max-md:w-full" defaultValue={String(data?.data?.dayOfWeek)} name="day">
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>
        </div>

        <div className="w-full mt-5 flex items-center justify-between">
          <div className=' flex flex-col gap-2' >
            <label htmlFor="">Starting time</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => handleTimeChange('startTime', date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            placeholderText="Start Time"
            className="px-3 py-2 border w-full rounded-lg"
          />
          </div>

          <div className=' flex flex-col gap-2' >
          <label htmlFor="">Ending time</label>
          <DatePicker
            selected={endTime}
            onChange={(date) => handleTimeChange('endTime', date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            placeholderText="End Time"
            className="px-3 py-2 border max-md:w-full rounded-lg"
          />
         </div>
        </div>

        <button
          type="submit"
          className="block w-full mt-4 center buttonbg text-white px-4 py-2 rounded-md"
        >
          {updateTimeTableMutation.isPending ? <Loader className="animate-spin" /> : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default Edit;