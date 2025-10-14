'use client';
import { getAttendanceForHeatmap } from '@/action/attendance.action';
import { FilteredDataProps } from '@/lib/constant';
import { toastSuccess } from '@/lib/toast';
import {  Loader } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

const LOCAL_STORAGE_KEY = 'attendanceHeatmapData';

const ProfilePage = () => {
  const [updated, setUpdated] = useState(false);
  const { data, status } = useSession();
  const fetchAndCacheData = async () => {
    setUpdated(true);
    // localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      const response = await getAttendanceForHeatmap();
      if (response.status !== 200) {
        return;
      }
      const formatted = response && response.data?.reduce((acc: FilteredDataProps[], curr: { date: Date }) => {
        const date = new Date(curr.date);
        const formattedDate = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const existing = acc.find(item => item.date === formattedDate);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date: formattedDate, count: 1 });
        }
        return acc;
      }, []);

      if (formatted?.length === 0) {
        return;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formatted));
    } catch (error) {
    }
    finally {
      toastSuccess('Data updated successfully!');
      setUpdated(false);
    }
  };

  const handelLogOut = () => {
    
    localStorage.removeItem('attendanceHeatmapData');
    localStorage.removeItem('classes')
    localStorage.removeItem('subjectsData');
    localStorage.removeItem('nextauth.message');
    toastSuccess('Logged out successfully!');
    signOut();
  };

  return (
    <div className='w-full p-20 max-md:p-2 '>

      <div className=' card w-[80%] max-md:w-[95%] mx-auto p-5 rounded-3xl shadow-lg text-white'>
        <div className='text-3xl max-md:text-2xl text-center mb-6 font-bold'>Profile</div>
        {status === 'loading' ? (
          <p></p>
        ) : (
          <div className='text-lg text-center'>
            <Image src={data?.user?.image!} alt="User Avatar" height={100} width={100} className='rounded-full w-32 h-32 mx-auto' />
            <p className='capitalize mt-5'><strong>Hiii , </strong> {data?.user?.name}</p>
            <p><strong>Signed as :</strong> {data?.user?.email}</p>
            {<button onClick={() => handelLogOut()} className=" buttonred rounded-full w-full mt-4 py-2   max-md:py-1.5">Logout</button>}
            {<button onClick={() => fetchAndCacheData()} className=" buttonbg rounded-full w-full mt-4 py-2 center  max-md:py-1.5">{updated ? <Loader className=' animate-spin ' /> : 'Update Streak'}</button>}
          </div>
        )}
      </div>



      <Link href={`/`} className=" bg-gradient-to-r mt-20 center w-fit mx-auto from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center transform rotate-3 hover:rotate-12 transition-transform duration-300">
         <Image loading='lazy' width={250} height={250} src="/logo.png" className="w-24 h-24 drop-shadow-xl drop-shadow-[#0000006e] rotate-[16deg]  " alt="Logo" />
      </Link>


    </div>
  )
}

export default ProfilePage