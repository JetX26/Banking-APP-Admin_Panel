'use client'
import React from 'react'
import { Users, CreditCard, DollarSign, Eye, TrendingUp, Send } from 'lucide-react';

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

const HomePage = ({ activeItem, setActiveItem }: NavigationMenuProps) => {
    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-slate-900 mb-2'>Home</h1>
                    <div className='bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-8'>
                        <h2 className='text-2xl font-bold text-slate-900 mb-2'>Welcome to Bank Admin Dashboard</h2>
                        <p className='text-slate-600'>Filter customers, view balances and process transfers</p>
                    </div>
                </div>

                {/* Key Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <div className='bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-slate-600 font-semibold'>Total Accounts</h3>
                            <div className='bg-blue-100 p-3 rounded-lg'>
                                <CreditCard className='text-blue-600' size={24} />
                            </div>
                        </div>
                        <p className='text-3xl font-bold text-slate-900'>1,234</p>
                        <p className='text-sm text-green-600 mt-2'>↑ 12% from last month</p>
                    </div>

                    <div className='bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-slate-600 font-semibold'>Total Customers</h3>
                            <div className='bg-purple-100 p-3 rounded-lg'>
                                <Users className='text-purple-600' size={24} />
                            </div>
                        </div>
                        <p className='text-3xl font-bold text-slate-900'>567</p>
                        <p className='text-sm text-green-600 mt-2'>↑ 8% from last month</p>
                    </div>

                    <div className='bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-slate-600 font-semibold'>Total Balance</h3>
                            <div className='bg-emerald-100 p-3 rounded-lg'>
                                <DollarSign className='text-emerald-600' size={24} />
                            </div>
                        </div>
                        <p className='text-3xl font-bold text-slate-900'>$2.4M</p>
                        <p className='text-sm text-green-600 mt-2'>↑ 5% from last month</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>

                    <h2 className='text-2xl font-bold text-slate-900 mb-4'>Quick Actions</h2>



                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

                        <button className='bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-all hover:shadow-md group'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors'>
                                    <Eye className='text-blue-600' size={24} />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-slate-900'>Get Balance</h3>
                                    <p className='text-sm text-slate-600'>Check account balance</p>
                                </div>
                            </div>
                        </button>

                        <button className='bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-all hover:shadow-md group'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors'>
                                    <TrendingUp className='text-emerald-600' size={24} />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-slate-900'>Transfer History</h3>
                                    <p className='text-sm text-slate-600'>View all transactions</p>
                                </div>
                            </div>
                        </button>

                        <button className='bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-all hover:shadow-md group'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors'>
                                    <Users className='text-purple-600' size={24} />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-slate-900'>All Users</h3>
                                    <p className='text-sm text-slate-600'>View all customers</p>
                                </div>
                            </div>
                        </button>

                        <button className='bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-all hover:shadow-md group'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors'>
                                    <CreditCard className='text-orange-600' size={24} />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-slate-900'>Fetch User</h3>
                                    <p className='text-sm text-slate-600'>Search user details</p>
                                </div>
                            </div>
                        </button>

                        <button className='bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-all hover:shadow-md group'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors'>
                                    <Send className='text-pink-600' size={24} />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-slate-900'>Transfer Funds</h3>
                                    <p className='text-sm text-slate-600'>Send money to account</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage