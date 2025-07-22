'use client'
import { AlignRight, GraduationCap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const { data, status } = useSession();
    return (
        <div className='flex fixed top-0 left-0 w-full backdrop-blur-2xl z-[30] justify-between shadow border-b-2  border-[#23233e] h-[60px] items-center p-5 max-md:p-3   '>
            {<Link href={`${data?.user ? "/dashboard" : '/'}`} className=' bg-gradient-to-r flex from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl center gap-2 max-md:text-lg whitespace-nowrap textbase font-bold'>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <p className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">  Be Present</p>
            </Link>}
            {
                status !== 'loading' && data ? <div className='center gap-2 max-md:gap-1'>
                    <Link href={`/profile`}>
                    <Image loading='lazy' src={data.user.image!} alt="User Avatar" width={40} height={40} className=' max-md:w-8  rounded-full' />
                    </Link>
                    {<div className='relative group '>
                        <label className=' cursor-pointer' htmlFor='is'>
                            <AlignRight className='' size={22} />
                        </label>
                        <input type="checkbox" hidden id="is" />
                        <div className='group-has-checked:flex hidden appear absolute  py-3.5 w- z-30 flex-col gap-2  text-white p-2  rounded-3xl bg-[#18084f87] !backdrop-blur-[25px] -left-[40px] -top-[70px] '>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/dashboard`}> Dashbord </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/profile`}>Profile</Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] px-[40px] center' href={`/attendance`}> Attendance </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/track`}> Track </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/timetable`}> Time Table </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/streak`}> Streak </Link>
                        </div>
                    </div>}
                </div> :
                    status !== 'loading' && <Link href="/sign-in" className="buttonbg p-2 px-6">
                        Sign In
                    </Link>
            }

        </div>
    )
}

export default Navbar