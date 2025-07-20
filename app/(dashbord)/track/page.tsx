import TrackComponent from '@/components/trackPage'
import React, { Suspense } from 'react'

const TrakPage = () => {
  return (
   <Suspense fallback={<div> </div>}>
      <TrackComponent />
    </Suspense>
  )
}

export default TrakPage