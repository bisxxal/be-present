'use client'
import { ArrowLeft } from 'lucide-react'
import React from 'react'

const NotFound = () => {
  return (
    <div className=' center h-screen flex-col  w-full'>
      <button
            className="flex absolute top-10 left-10 bg-[#ffffff1a] rounded-full p-3   group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft fill='white' size={25} className=" group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
      <p className=' text-6xl font-bold'>Ohh!! F?:k </p>
      <p className=' text-xl font-medium'>Page Not Found</p>
    </div>
  )
}

export default NotFound