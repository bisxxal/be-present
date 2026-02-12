'use client'
import { getHistoryData } from '@/action/profile.action'
import Loading from '@/components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const HistoryPage = () => {

    const {data, isLoading} = useQuery({
        queryKey: ['historyData'],
        queryFn: getHistoryData,
    })

  return (
    <div className=' w-full px-20 max-md:px-4 max-md:py-2 py-10 '>
        {
            isLoading ? (
                <Loading boxes={12} child=' h-[130px] max-md:w-full w-[400px] rounded-2xl' parent=' pt-16 pb-4   mt-10 grid border border-[#ffffff2e]  grid-cols-2 md:grid-cols-3 gap-4 max-md:gap-2 rounded-3xl px-5' />
            ) : (
                <div className='my-10'>
                    {
                        data?.data.length === 0 ? (     
                            <div className='center my-10 text-gray-500'>
                                No history data found.
                            </div>
                        ) : (
                            data?.data.map((history: any) => (
                                <div key={history.id} className='mb-8 p-4   border border-[#ffffff2e] rounded-3xl'>
                                    <h2 className='text-3xl text-center  font-semibold mb-4'>{history.semester}</h2>
                                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 max-md:gap-2'>
                                        {
                                            history.subjects.map((subject: any) => (
                                                <div key={subject.id} className='p-4 border card border-gray-200 rounded-2xl flex justify-between flex-col'>
                                                    <h3 className='text-lg max-md:text-base text-center center capitalize font-medium mb-2'>{subject.subjectName}</h3>
                                                    <p className='text-center max-md:text-3xl text-4xl font-bold'>  {(subject.presentClasses / subject.totalClasses *100).toFixed(2)} %</p>
                                                    <p className=' text-center' > {subject.presentClasses} / {subject.totalClasses}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            )

        }
    </div>
  )
}

export default HistoryPage