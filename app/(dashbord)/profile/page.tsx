'use client';
import { GraduationCap } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const ProfilePage = () => {
  const { data, status } = useSession();
  return (
    <div className='w-full p-20 max-md:p-2 '>

      <div className=' card w-[80%] max-md:w-[95%] mx-auto p-5 rounded-3xl shadow-lg text-white'>
        <div className='text-3xl max-md:text-2xl text-center mb-6 font-bold'>Profile Information</div>
        {status === 'loading' ? (
          <p></p>
        ) : (
          <div className='text-lg text-center'>
            <Image src={data?.user?.image!} alt="User Avatar" height={100} width={100} className='rounded-full w-32 h-32 mx-auto' />
            <p className=' mt-5'><strong>Name:</strong> {data?.user?.name}</p>
            <p><strong>Email:</strong> {data?.user?.email}</p>
            {<button onClick={() => signOut()} className=" buttonred rounded-full w-full mt-4 py-2   max-md:py-1.5">Logout</button>}
          </div>
        )}
      </div>



      <Link href={`/`} className="p-3 bg-gradient-to-r mt-20 center w-fit mx-auto from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-12 transition-transform duration-300">
        <GraduationCap className="w-16 h-16 text-white" size={23} />
      </Link>


    </div>
  )
}

export default ProfilePage