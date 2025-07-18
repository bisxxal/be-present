'use client'
import { useSession } from 'next-auth/react';
import React  from 'react'

const DashBoardMainaPage = () => {
  const {data} = useSession();
  console.log(data)
  return (
    <div className=' w-full p-20'>
        {
          (JSON.stringify(data?.user))
        }
    </div>
  )
}

export default DashBoardMainaPage