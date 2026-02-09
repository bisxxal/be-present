'use client'
import { getHistoryData } from '@/action/profile.action'
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
                <div className='center my-10'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900'></div>
                </div>
            ) : (
                <div className='my-10'>
                    {
                        data?.data.length === 0 ? (     
                            <div className='center my-10 text-gray-500'>
                                No history data found.
                            </div>
                        ) : (
                            data?.data.map((history: any) => (
                                <div key={history.id} className='mb-8 p-4  border border-gray-300 rounded-2xl'>
                                    <h2 className='text-3xl text-center  font-semibold mb-4'>{history.semester}</h2>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        {
                                            history.subjects.map((subject: any) => (
                                                <div key={subject.id} className='p-4 border border-gray-200 rounded-2xl'>
                                                    <h3 className='text-lg center capitalize font-medium mb-2'>{subject.subjectName}</h3>
                                                    <p>Total Classes: {subject.totalClasses}</p>
                                                    <p>Present Classes: {subject.presentClasses}</p>
                                                    <p>Toatal percentages {(subject.presentClasses / subject.totalClasses *100).toFixed(2)}</p>
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