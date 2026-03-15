'use client'
import {   PanelRightOpen } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

const Navbar = () => {
    const { data, status } = useSession();
    const [toogle, setToogle] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setToogle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div ref={ref} className='flex fixed top-0 left-0 w-full backdrop-blur-2xl z-[30] justify-between shadow border-b  border-[#ff79c529] h-[60px] items-center p-5 max-md:p-3   '>
            {<Link href={`${data?.user ? "/dashboard" : '/'}`} className=' bg-gradient-to-r flex from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl center gap-2 max-md:text-lg whitespace-nowrap textbase font-bold'>
                <Image loading='lazy' width={150} height={150} src="/logo.png" className="w-20 h-20 max-md:w-14 max-md:h-14 drop-shadow-lg drop-shadow-[#fbaa6478] rotate-12 logoanimation" alt="Logo" />
                <p className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">  Be Present</p>
            </Link>}
            {
                status !== 'loading' && data ? <div className='center gap-2 max-md:gap-1'>
                    <Link href={`/profile`}>
                        <Image loading='lazy' src={data.user.image!} alt="User Avatar" width={40} height={40} className=' max-md:w-8  rounded-full' />
                    </Link>
                    {<div className='relative group '>

                        <label onClick={() => setToogle(!toogle)} className='bg-[#ffffff2d] p-1.5 rounded-lg flex cursor-pointer' htmlFor='is'>
                            <PanelRightOpen className='text-gray-100' size={20} />
                        </label>

                        {toogle && <div className=' flex appear absolute  py-3.5 w- z-30 flex-col gap-2  text-white p-2  rounded-3xl bg-[#19084f] !backdrop-blur-[25px] -left-[40px] -top-[70px] '>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/dashboard`}> Dashbord </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] px-[40px] center' href={`/attendance`}> Attendance </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/track`}> Track </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/timetable`}> Time Table </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/streak`}> Streak </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/pdf`}> Pdf </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/history`}> History </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/profile`}>Profile</Link>
                        </div>}
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