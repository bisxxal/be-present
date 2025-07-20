'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react'

const ProfilePage = () => {
  const { data, status } = useSession();
  return (
    <div className='w-full p-20 max-md:p-2 '>

      <div className=' bg-indigo-500/10 border-2 border-blue-500 w-[80%] mx-auto p-5 rounded-3xl shadow-lg text-white'>
        <div className='text-3xl text-center mb-6 font-bold'>Profile Information</div>
        {status === 'loading' ? (
          <p></p>
        ) : (
          <div className='text-lg text-center'>
            <Image src={data?.user?.image!} alt="User Avatar" height={100} width={100} className='rounded-full w-32 h-32 mx-auto' />
            <p className=' mt-5'><strong>Name:</strong> {data?.user?.name}</p>
            <p><strong>Email:</strong> {data?.user?.email}</p>

            {<button onClick={() => signOut()} className=" bg-gradient-to-br from-rose-400  to-pink-700 rounded-full w-full mt-4 py-2   max-md:py-1.5">Logout</button>}
          </div>
        )}
      </div>

    </div>
  )
}

export default ProfilePage