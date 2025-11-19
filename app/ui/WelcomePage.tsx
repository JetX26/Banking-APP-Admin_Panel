'use client'
import React from 'react'
import { useRouter } from 'next/navigation'


const WelcomePage = () => {

    const router = useRouter()

    const handleLoginRouting = () => {
        router.push('/components/login')
    }

    const handleRegisterRouting = () => {
        router.push('/components/create-account')
    }

    return (
        <div className='w-full h-screen bg-white flex items-center justify-center px-4 py-8'>
            <div className='flex flex-col gap-4 sm:gap-5 text-center max-w-sm'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800'>Welcome!</h1>

                <button
                    onClick={handleLoginRouting}
                    className='rounded-sm bg-blue-400 hover:bg-blue-500 text-white font-medium px-6 py-3 text-base sm:text-lg active:scale-95 active:transition-all active:duration-200 transition-all'
                >
                    Login
                </button>

                <button
                    onClick={handleRegisterRouting}
                    className='rounded-sm bg-blue-400 hover:bg-blue-500 text-white font-medium px-6 py-3 text-base sm:text-lg active:scale-95 active:transition-all active:duration-200 transition-all'
                >
                    Register
                </button>
            </div>
        </div>
    )
}

export default WelcomePage