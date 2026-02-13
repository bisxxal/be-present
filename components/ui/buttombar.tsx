'use client'
import { ChartLine, Hand, LayoutGrid, TableProperties, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const BottomBar = () => {
    const path = usePathname()
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

    const navItems = [
        { href: '/dashboard', icon: LayoutGrid  },
        { href: '/attendance', icon: Hand },
        { href: '/track', icon: ChartLine },
        { href: '/timetable', icon: TableProperties },
        { href: '/profile', icon: User },
    ]

    useEffect(() => {
        const activeIndex = navItems.findIndex((item) => item.href === path)
        const currentElement = itemRefs.current[activeIndex]

        if (currentElement) {
            setPillStyle({
                left: currentElement.offsetLeft,
                width: currentElement.offsetWidth,
                opacity: 1,  
            })
        }
    }, [path])

    return (
        <div className='fixed buttombar bottom-0 z-[100] w-full flex justify-center h-[80px] pointer-events-none'>

            <div className='pointer-events-auto backdrop-blur-[10px] bg-[#ffffff08] relative flex items-center gap-0 p-2 border border-[#d3d3d346]  mb-6 ackdrop-blur-md rounded-full '>
                
                <div
                    className="absolute h-[calc(100%-10px)] top-1 rounded-full bg-[#8d65f8a3] transition-all duration-500 ease-in-out -z-10"
                    style={{
                        left: `${pillStyle.left}px`,
                        width: `${pillStyle.width}px`,
                        opacity: pillStyle.opacity,
                    }}
                />

                {navItems.map((item, index) => {
                    const isActive = path === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={(el) => { itemRefs.current[index] = el }}
                            className={`
                                relative px-6 py-2 rounded-full transition-colors duration-300 hover:-translate-y-1 hover:scale-110${isActive ? 'text-white' : 'text-[#d3d3d3b4] hover:text-white'}`}>
                            <Icon size={24} />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default BottomBar