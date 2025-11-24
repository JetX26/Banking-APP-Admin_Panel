/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useRef, useEffect } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Users, Loader } from 'lucide-react'



const FetchAllUsers = () => {


    const fetchAllUsers = async () => {
        const response = await axios.get('/api/getAllUsers')

        console.log(response.data.data);
        return response.data.data;
    }

    const { data, isLoading, error, refetch, isSuccess } = useQuery({
        queryKey: ['fetchAllUsers'],
        queryFn: fetchAllUsers,
        enabled: false
    })

    const sentinelRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                console.log('Element is visible')
            }
        })
    })

    return (
        <div className=" flex flex-col items-center gap-4 p-5">


            <div className={`flex items-center flex-shrink-0 transition-all duration-500 ${isSuccess ? 'justify-start' : 'justify-center'}`}>
                <button
                    onClick={async () => {
                        await refetch()
                    }}
                    disabled={isLoading}
                    className={`rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 flex-shrink-0 duration-500 ${isSuccess ? 'absolute top-5 right-5 px-5 py-1.5 text-xs' : 'px-6 py-2 text-sm'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <Loader className='w-4 h-4 animate-spin' />
                            <span>Loading...</span>
                        </>
                    ) : (
                        'Fetch'
                    )}
                </button>
            </div>


            {isSuccess && (
                <div className='flex-1 min-h-0 w-full max-w-4xl bg-gradient-to-br  rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700' style={{ animationDelay: '100ms' }}>
                    {data && data.length > 0 ? (
                        <div className='w-full h-full flex flex-col overflow-hidden'>

                            <div className='flex flex-col flex-shrink-0'>
                                <div className='flex justify-between gap-3 px-5 py-3'>
                                    <div>
                                        <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>All Users</h1>
                                        {data && isSuccess && (<p className='text-gray-500 text-xs mt-0.5'>{data?.length} registered users </p>)}
                                    </div>
                                </div>
                                <div className='flex justify-between gap-3 px-5 py-3 border-b border-gray-200'>
                                    <div className='col-span-5'>
                                        <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>First Name</p>
                                    </div>
                                    <div className='col-span-4'>
                                        <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>Last Name</p>
                                    </div>
                                    <div className='col-span-3'>
                                        <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>Accounts</p>
                                    </div>
                                </div>
                            </div>


                            <div className='flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
                                {data.map((item: any, id: any) => (
                                    <div
                                        key={id}
                                        className='flex justify-between gap-3 px-5 py-2.5 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors items-center animate-in fade-in slide-in-from-left duration-300'
                                        style={{ animationDelay: `${200 + id * 30}ms` }}
                                    >
                                        <div className='col-span-5'>
                                            <p className='text-sm font-medium text-gray-900'>
                                                {item.firstName}
                                            </p>
                                        </div>
                                        <div className='col-span-4'>
                                            <p className='text-sm font-medium text-gray-900'>
                                                {item.lastName}
                                            </p>
                                        </div>
                                        <div className='col-span-3 flex flex-wrap gap-1.5'>
                                            {item.accounts && item.accounts.length > 0 ? (
                                                item.accounts.map((account: any, accountId: any) => (
                                                    <span key={accountId} className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold whitespace-nowrap'>
                                                        ...{account.accountNumber.slice(-4)}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className='text-xs text-gray-400 italic'>—</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='w-full h-full flex items-center justify-center animate-in fade-in duration-500'>
                            <div className='flex flex-col items-center gap-3 text-center'>
                                <Users className='w-12 h-12 text-gray-300' strokeWidth={1.5} />
                                <div>
                                    <p className='text-sm font-semibold text-gray-700'>No users found</p>
                                    <p className='text-xs text-gray-500 mt-1'>Check back later</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}




        </div>
    )
}

export default FetchAllUsers