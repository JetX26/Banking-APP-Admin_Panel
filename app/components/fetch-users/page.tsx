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
        <div className="bg-white w-full flex flex-col items-center gap-6 px-4 py-8 sm:px-6 md:p-12">
            <h1 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-gray-900'>Fetch All Users</h1>

            <div className='w-full max-w-md flex flex-col items-center gap-3'>
                <button
                    onClick={async () => {
                        await refetch()
                    }}
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
                >
                    Fetch
                </button>
            </div>

            <div className='w-full max-w-3xl'>
                {isLoading && (
                    <div className='flex justify-center'>
                        <p className='text-base text-gray-600'>Loading...</p>
                    </div>
                )}

                {data && isSuccess && (
                    <div className='bg-gray-50 rounded-lg p-6 space-y-3 overflow-y-auto max-h-[70vh] border border-gray-200'>
                        {data.map((item: any, id: any) => (
                            <div key={id} className='bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                                <p className='text-base font-semibold mb-4 text-gray-900'>
                                    {item.firstName} {item.lastName}
                                </p>

                                {item.accounts && item.accounts.length > 0 ? (
                                    <div className='space-y-2 ml-4'>
                                        {item.accounts.map((account: any, accountId: any) => (
                                            <p key={accountId} className='text-sm text-gray-700'>
                                                <strong>Account:</strong> {account.accountNumber}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-sm text-gray-500'>No accounts</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className='flex justify-center'>
                        <p className='text-base text-red-600'>Error loading users</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FetchAllUsers