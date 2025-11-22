'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import GetBalance from "../components/get-balance/page";
import FetchTransferHistory from "../components/fetch-transfers/page";
import FetchAllUsers from "../components/fetch-users/page";
import FetchUser from "../components/fetch-user/page";
import TransferFunds from '../components/TransferFunds';

import walletIcon from "../../public/assets/icons/wallet.png"
import transferIcon from "../../public/assets/icons/transfer.png"
import allUsers from "../../public/assets/icons/all-users.png"
import fetchUser from '../../public/assets/icons/fetch-user.png'
import transferFunds from "../../public/assets/icons/transfer-funds.png"

interface NavigationMenuProps {
    activeItem: string,
    setActiveItem: (item: string) => void,
}

const components = [
    { name: 'Get Balance', component: GetBalance },
    { name: 'Fetch Transfer History', component: FetchTransferHistory },
    { name: 'Fetch All Users', component: FetchAllUsers },
    { name: 'Fetch User', component: FetchUser },
    { name: 'Transfer Funds', component: TransferFunds }
]

export const menuIcons = [
    { name: 'Get Balance', icon: walletIcon },
    { name: 'Fetch Transfer History', icon: transferIcon },
    { name: 'Fetch All Users', icon: allUsers },
    { name: 'Fetch User', icon: fetchUser },
    { name: 'Transfer Funds', icon: transferFunds }
]

const NavigationMenu = ({ activeItem, setActiveItem }: NavigationMenuProps) => {

    const router = useRouter()
    const [showNavByDefault, setShowNavByDefault] = useState(true)

    const logoutButton = async () => {
        const response = await axios.post('/api/logoutSession')
        if (response.status === 200) router.push('/')
        return response;
    }

    useEffect(() => {
        console.log(activeItem)
    }, [activeItem])

    return (
        <div className='flex flex-col h-screen bg-white'>

            <div className='hidden lg:flex flex-col items-center justify-center flex-1 py-10'>

                <div className='px-6 py-4 mb-10'>
                    <h2 className='text-4xl font-semibold text-gray-900 text-center'>Dashboard</h2>
                </div>

                <button onClick={() => {
                    setActiveItem('')
                }}>Back</button>

                {!activeItem && (
                    <nav className='grid grid-cols-2 gap-6 px-4'>
                        {menuIcons.map((item, id) => {
                            return (
                                <button
                                    onClick={() => setActiveItem(item.name)}
                                    key={id}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow transition-all duration-200 ${activeItem === item.name
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Image src={item.icon} width={35} height={35} alt={item.name} />
                                    <span className='text-base font-medium text-center'>{item.name}</span>
                                </button>
                            )
                        })}
                    </nav>
                )}

                <div className='px-4 mt-10'>
                    <button
                        onClick={() => { logoutButton() }}
                        className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className='hidden lg:flex flex-1 overflow-y-auto p-8'>
                {components.map((item, id) => {
                    if (item.name === activeItem) {
                        const Component = item.component;
                        return (
                            <div key={id} className='w-full'>
                                <Component />
                            </div>
                        )
                    }
                })}
            </div>

            <div className='lg:hidden flex flex-col w-full h-screen overflow-hidden'>

                {!showNavByDefault && (
                    <div className='flex items-center justify-between border-b border-gray-200 px-4 py-4 bg-white sticky top-0 z-50 animate-in slide-in-from-top duration-300 gap-3'>
                        <button
                            onClick={() => setShowNavByDefault(true)}
                            className='p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95 flex-shrink-0'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                        </button>
                        <h1 className='text-xl font-semibold text-gray-900 flex-1 min-w-0 line-clamp-2 text-center'>{activeItem}</h1>
                    </div>
                )}

                {!showNavByDefault && (
                    <div className='flex-1 overflow-y-auto w-full animate-in fade-in duration-500'>
                        {components.map((item, id) => {
                            if (item.name === activeItem) {
                                const Component = item.component;
                                return (
                                    <div key={id} className='w-full'>
                                        <Component />
                                    </div>
                                )
                            }
                        })}
                    </div>
                )}

                {showNavByDefault && (
                    <div className='flex flex-col h-full bg-white animate-in fade-in duration-500'>
                        <div className='px-6 py-6 mb-6 mt-4'>
                            <h2 className='text-3xl font-bold text-gray-900 text-center'>Dashboard</h2>
                        </div>

                        <nav className='grid grid-cols-2 gap-4 px-4 flex-1 overflow-y-auto'>
                            {menuIcons.map((item, id) => {
                                return (
                                    <button
                                        onClick={() => {
                                            setActiveItem(item.name)
                                            setShowNavByDefault(false)
                                        }}
                                        key={id}
                                        className='flex flex-col items-center p-6 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95 animate-in slide-in-from-bottom duration-300'
                                        style={{ animationDelay: `${id * 50}ms` }}
                                    >
                                        <Image src={item.icon} width={35} height={35} alt={item.name} />
                                        <span className='text-base font-medium text-center'>{item.name}</span>
                                    </button>
                                )
                            })}
                        </nav>

                        <div className='px-4 py-6 border-t border-gray-200'>
                            <button
                                onClick={() => { logoutButton() }}
                                className='w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default NavigationMenu
