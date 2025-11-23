'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Wallet, ArrowRightLeft, Users, User, Send, PlusCircle, Menu } from 'lucide-react'


import GetBalance from "../components/get-balance/page";
import FetchTransferHistory from "../components/fetch-transfers/page";
import FetchAllUsers from "../components/fetch-users/page";
import FetchUser from "../components/fetch-user/page";
import TransferFunds from '../components/TransferFunds';
import CreateAccount from '../components/create-account/page';


interface NavigationMenuProps {
    activeItem: string,
    setActiveItem: (item: string) => void,
}

const components = [
    { name: 'Get Balance', component: GetBalance },
    { name: 'Fetch Transfer History', component: FetchTransferHistory },
    { name: 'Fetch All Users', component: FetchAllUsers },
    { name: 'Fetch User', component: FetchUser },
    { name: 'Transfer Funds', component: TransferFunds },
    { name: 'Create Account', component: CreateAccount }
]

export const menuIcons = [
    { name: 'Get Balance', icon: Wallet },
    { name: 'Fetch Transfer History', icon: ArrowRightLeft },
    { name: 'Fetch All Users', icon: Users },
    { name: 'Fetch User', icon: User },
    { name: 'Transfer Funds', icon: Send },
    { name: 'Create Account', icon: PlusCircle }
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
        <div className='flex flex-col h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden'>

            <div className='hidden lg:flex flex-col items-center justify-center flex-1 py-10 px-4'>

                {!activeItem && (
                    <div className='px-6 py-4 mb-10 text-center'>
                        <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Dashboard</h2>
                        <p className='text-gray-500 text-sm mt-2'>Select an option to get started</p>
                    </div>
                )}



                <nav className='grid grid-cols-2 gap-6 px-4'>
                    {menuIcons.map((item, id) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                onClick={() => setActiveItem(item.name)}
                                key={id}
                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-md transition-all duration-200 border ${activeItem === item.name
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-105 border-transparent'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-100 hover:shadow-lg hover:scale-102'
                                    }`}
                            >
                                <IconComponent size={35} strokeWidth={1.5} />
                                <span className='text-base font-semibold text-center'>{item.name}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className='w-full lg:flex flex-1 overflow-y-auto p-8 mt-8'>
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

            </div>



            <div className='lg:hidden flex flex-col w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>



                {!showNavByDefault && (
                    <div className='flex items-center justify-between border-b border-gray-200 px-4 py-4 bg-white shadow-sm sticky top-0 z-50 animate-in slide-in-from-top duration-300 gap-3'>
                        <button
                            onClick={() => setShowNavByDefault(true)}
                            className='p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all active:scale-95 flex-shrink-0'
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className='text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex-1 min-w-0 line-clamp-2 text-center'>{activeItem}</h1>
                        <button
                            onClick={() => { logoutButton() }}
                            className='px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all active:scale-95 flex-shrink-0'
                        >
                            Exit
                        </button>
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
                    <div className='flex flex-col h-full bg-white animate-in fade-in duration-500 rounded-t-3xl shadow-2xl'>
                        <div className='px-6 py-6 mb-6 mt-4 border-b border-gray-100'>
                            <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center'>Dashboard</h2>
                            <p className='text-gray-500 text-sm text-center mt-2'>Select a feature</p>
                        </div>

                        <nav className='grid grid-cols-2 gap-4 px-4 flex-1 overflow-y-auto pb-4'>
                            {menuIcons.map((item, id) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        onClick={() => {
                                            setActiveItem(item.name)
                                            setShowNavByDefault(false)
                                        }}
                                        key={id}
                                        className='flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 border border-gray-200 transition-all active:scale-95 animate-in slide-in-from-bottom duration-300 hover:shadow-md'
                                        style={{ animationDelay: `${id * 50}ms` }}
                                    >
                                        <IconComponent size={35} strokeWidth={1.5} />
                                        <span className='text-base font-semibold text-center mt-2'>{item.name}</span>
                                    </button>
                                )
                            })}
                        </nav>

                        <div className='px-4 py-6 border-t border-gray-100'>
                            <button
                                onClick={() => { logoutButton() }}
                                className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95'
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='absolute right-4 top-4'>
                <button
                    onClick={() => { logoutButton() }}
                    className='px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95'
                >
                    Logout
                </button>
            </div>

        </div>
    )
}

export default NavigationMenu