'use client'
import { AlignRight, Scissors } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const { data, status } = useSession();
    return (
        <div className=' flex justify-between shadow  h-[60px] items-center p-5 max-md:p-3   '>
            {<Link href={`/`} className='text-2xl center gap-2 max-md:text-lg whitespace-nowrap textbase font-bold'>Be Present</Link>}
            {
                status !== 'loading' && data ? <div className='center gap-2 max-md:gap-1'>
                    <div className='max-md:w-[80px] max-md:h-full text-base max-md:text-[10px]'>Welcome , 👋🏻 {data.user.name}</div>
                    <img loading='lazy' src={data.user.image!} alt="User Avatar" width={40} height={40} className=' max-md:w-8  rounded-full' />
                    {<button onClick={() => signOut()} className=" bg-gradient-to-br from-red-400/90 to-red-500/80  rounded-full  px-5 py-2 max-md:px-3 max-md:text-sm max-md:py-1.5">Logout</button>}
                    {<div className='relative group '>
                        <label className=' cursor-pointer' htmlFor='is'>
                            <AlignRight className='' size={22} />
                        </label>
                        <input type="checkbox" hidden id="is" />
                        <div className='group-has-checked:flex hidden appear absolute  py-3.5 w- z-30 flex-col gap-2  text-white p-2  rounded-3xl bg-[#ffffff21] !backdrop-blur-[25px] -left-[155px] '>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/dashbord`}> Dashbord </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/profile`}>Profile</Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] px-[40px] center' href={`/attendance`}> Attendance </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center  ' href={`/`}> Queue </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] center' href={`/barber/history`}> History </Link>
                            <Link className='text-sm hover:bg-[#5d5fef] bg-[#7a94f4d1] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ffffff] whitespace-nowrap center text-center px-2 ' href={`/barber/canalytics`}>Customer Analytics</Link>
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