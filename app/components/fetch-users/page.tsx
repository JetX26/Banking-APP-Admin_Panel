/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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

    return (
        <div className="bg-white w-full flex flex-col items-center gap-4 px-4 py-8 sm:px-6 md:p-12">
            <h1 className='text-xl sm:text-2xl md:text-2xl font-semibold'>Fetch All Users</h1>

            <div className='w-full max-w-md flex flex-col items-center gap-3'>
                <button
                    onClick={async () => {
                        await refetch()
                    }}
                    className='w-full rounded-sm bg-blue-400 hover:bg-blue-500 text-white font-medium px-4 py-2 text-sm sm:text-base transition-colors'
                >
                    Fetch
                </button>
            </div>

            <div className='w-full max-w-2xl'>
                {isLoading && (
                    <div className='flex justify-center'>
                        <p className='text-sm sm:text-base'>Loading...</p>
                    </div>
                )}

                {data && isSuccess && (
                    <div className='bg-gray-50 rounded-sm p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[70vh]'>
                        {data.map((item: any, id: any) => (
                            <div key={id} className='bg-white p-4 sm:p-5 rounded-sm border border-gray-200'>
                                <p className='text-sm sm:text-base font-semibold mb-3 text-gray-800'>
                                    {item.firstName} {item.lastName}
                                </p>

                                {item.accounts && item.accounts.length > 0 ? (
                                    <div className='space-y-2 ml-0 sm:ml-2'>
                                        {item.accounts.map((account: any, accountId: any) => (
                                            <p key={accountId} className='text-xs sm:text-sm text-gray-700'>
                                                <strong>Account:</strong> {account.accountNumber}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-xs sm:text-sm text-gray-500'>No accounts</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className='flex justify-center'>
                        <p className='text-sm sm:text-base text-red-600'>Error loading users</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FetchAllUsers