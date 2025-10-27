'use client'
import HeroPage from '@/components/Heropage';
import ShinyText from '@/components/ui/Shinetext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

const Home =   () => {
  const { data, status } = useSession();
  if (status === 'loading') {
    return(
       <div className=' w-full h-screen center '>
      <ShinyText
        text="Be Present"
        disabled={false}
        speed={2}
        className='font-extrabold  text-5xl'
        />
    </div>
  )
  }

  if( data?.user || status === 'authenticated'){
    redirect('/dashboard')
  }

  return (
    <HeroPage />
  )
}

export default Home