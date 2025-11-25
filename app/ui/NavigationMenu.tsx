'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Wallet, ArrowRightLeft, Users, User, Send, PlusCircle, ArrowLeft, SearchIcon } from 'lucide-react'


import GetBalance from "../components/get-balance/page";
import FetchTransferHistory from "../components/fetch-transfers/page";
import FetchAllUsers from "../components/fetch-users/page";
import FetchUser from "../components/fetch-user/page";
import TransferFunds from '../components/TransferFunds';
import CreateAccount from '../components/create-account/page';
import SearchPage from '../components/search/page';


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
    { name: 'Create Account', component: CreateAccount },
    { name: 'Search Page', component: SearchPage }
]

export const menuIcons = [
    { name: 'Get Balance', icon: Wallet },
    { name: 'Fetch Transfer History', icon: ArrowRightLeft },
    { name: 'Fetch All Users', icon: Users },
    { name: 'Fetch User', icon: User },
    { name: 'Transfer Funds', icon: Send },
    { name: 'Create Account', icon: PlusCircle },
    { name: 'Search Page', icon: SearchIcon }
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

            <div className="hidden place-self-end m-4 lg:block top-2 right-2 sm:top-4 sm:right-4 z-20">
                <button
                    onClick={() => { logoutButton() }}
                    className="px-3 md:px-4 lg:px-5 xl:px-6 py-2 md:py-2.5 lg:py-3 
                   bg-gradient-to-r from-blue-600 to-purple-600 
                   hover:from-blue-700 hover:to-purple-700 
                   text-white rounded-lg font-semibold 
                   transition-all shadow-lg hover:shadow-xl 
                   active:scale-95 text-xs md:text-sm lg:text-base"
                >
                    Logout
                </button>
            </div>

            <div className='hidden lg:flex flex-col items-center justify-center flex-1 py-4 md:py-6 lg:py-8 xl:py-10 px-2 md:px-3 lg:px-4'>

                <div className='px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 mb-4 md:mb-6 lg:mb-8 xl:mb-10 text-center'>
                    <h2 className='text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Admin Dashboard</h2>
                </div>

                <nav className='flex flex-wrap gap-3 md:gap-4 lg:gap-5 xl:gap-6 px-2 md:px-3 lg:px-4 max-w-full justify-center'>
                    {menuIcons.map((item, id) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                onClick={() => setActiveItem(item.name)}
                                key={id}
                                className={`flex flex-col items-center justify-center gap-2 md:gap-2.5 lg:gap-3 p-3 md:p-4 lg:p-5 xl:p-6 rounded-xl md:rounded-2xl shadow-md transition-all duration-200 border w-[120px] h-[120px] md:w-[135px] md:h-[135px] lg:w-[150px] lg:h-[150px] xl:w-[160px] xl:h-[160px] ${activeItem === item.name
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-105 border-transparent'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-100 hover:shadow-lg hover:scale-102'
                                    }`}
                            >
                                <IconComponent size={26} strokeWidth={1.5} className='md:w-[28px] md:h-[28px] lg:w-[32px] lg:h-[32px] xl:w-[35px] xl:h-[35px]' />
                                <span className='text-xs md:text-sm lg:text-sm xl:text-base font-semibold text-center line-clamp-2 leading-tight px-1'>{item.name}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className='w-full lg:flex flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 xl:p-8 mt-3 md:mt-4 lg:mt-6 xl:mt-8'>
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
                    <div className='flex items-center justify-between border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 bg-white shadow-sm top-0 z-50 animate-in slide-in-from-top duration-300 gap-2 sm:gap-3'>
                        <button
                            onClick={() => {
                                setShowNavByDefault(true)
                                setActiveItem('')
                            }}
                            className='p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all active:scale-95 flex-shrink-0'
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className='text-base sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex-1 min-w-0 line-clamp-1 sm:line-clamp-2 text-center'>{activeItem}</h1>
                        <button
                            onClick={() => { logoutButton() }}
                            className='px-2 sm:px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold hover:shadow-md transition-all active:scale-95 flex-shrink-0'
                        >
                            Logout
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
                        <div className='px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6 mt-2 sm:mt-4 border-b border-gray-100'>
                            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center'>Admin Dashboard</h2>
                        </div>

                        <nav className='flex flex-wrap gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 flex-1 overflow-y-auto pb-4 justify-center content-start'>
                            {menuIcons.map((item, id) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        onClick={() => {
                                            setActiveItem(item.name)
                                            setShowNavByDefault(false)
                                        }}
                                        key={id}
                                        className='flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 border border-gray-200 transition-all active:scale-95 animate-in slide-in-from-bottom duration-300 hover:shadow-md w-[90px] h-[100px] sm:w-[110px] sm:h-[120px] md:w-[130px] md:h-[140px]'
                                        style={{ animationDelay: `${id * 50}ms` }}
                                    >
                                        <IconComponent size={28} strokeWidth={1.5} className='sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]' />
                                        <span className='text-xs sm:text-sm md:text-base font-semibold text-center mt-2 leading-tight line-clamp-2 px-1'>{item.name}</span>
                                    </button>
                                )
                            })}
                        </nav>

                        <div className='px-3 sm:px-4 py-4 flex justify-end sm:py-6 border-t border-gray-100'>
                            <button
                                onClick={() => { logoutButton() }}
                                className='w-full sm:w-auto min-w-[120px] px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base'
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