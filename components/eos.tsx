'use client'
import { createhistorySubject, getFirstDate } from '@/action/profile.action'
import { useFilteredDate } from '@/hooks/useFilteredData'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'

const Eos = () => {
    const client = new QueryClient();
  const [show, setShow] = useState(false);
   
  const { data: firstData } = useQuery({
    queryKey: ['fstdate'],
    queryFn: getFirstDate,
  });

  const startDate = firstData?.data?.date ? new Date(firstData.data.date): null;

  const endDate = useMemo(() => new Date(), []);
 
  const { subjCount } = useFilteredDate(startDate, endDate);
 
  const historyMutation = useMutation({
    mutationFn: (sem:string) => createhistorySubject(subjCount, sem),
    onSuccess: () => {
      setShow(false)
      localStorage.removeItem('subjectsData');
      client.invalidateQueries({ queryKey: ['timetable'] })
    },
  })

  const SumbitFormData = (formData:FormData) => {
    const sem = formData.get('sem') as string;
    historyMutation.mutate(sem);
  }
  return (
    <div>
      <div className="my-10 center">
        <button
          onClick={() => setShow(true)}
          className="buttonbg px-5"
        >
          End Of Semester
        </button>
      </div>

      {show && (
        <div className="center fixed top-0 right-0 p-2 w-full h-full bg-[#0000003f] backdrop-blur-2xl z-[40]">
          <div className="flex flex-col gap-2 max-md:w-[90%] w-[500px] bg-[#b8b8b81f] border border-[#ffffff24] p-4 rounded-2xl shadow-lg">
            <p className="text-center">
              Are you sure you want to delete this semester?
            </p>

            <form action={SumbitFormData} className="center gap-3 w-full ">
              <select required name="sem">
                <option value="">Select semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
              <button type='submit' className="rounded-xl bg-gradient-to-bl from-orange-500 to-amber-600 py-3 px-8">
                Make History
              </button>
            </form>
            <button
              onClick={() => setShow(false)} className="rounded-xl border  border-[#ff0000f0] bg-red-500/20 py-3 px-8">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Eos
