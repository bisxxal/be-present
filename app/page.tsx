import HeroPage from '@/components/Heropage'; 
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async() => { 
  const session =await getServerSession(authOptions)
  if(session){
    redirect('/dashboard')
  }
  return (
    <HeroPage />
  )
}

export default Home