/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const FetchTransferHistory = () => {

    const [emailInput, setEmailInput] = useState('')

    const fetchTransfers = async (email: string) => {
        const response = await axios.get('/api/getTransferHistory', { params: { email } })

        if (!response) {
            console.log('No response received')
            return;
        }

        return response.data;
    }

    const { data, isLoading, isSuccess, refetch, error } = useQuery({
        queryKey: ['fetchTransfers', emailInput],
        queryFn: () => fetchTransfers(emailInput),
        enabled: false,
        retry: (failures, error: AxiosError) => {
            if (error.response?.status === 404) {
                return false;
            }

            return failures < 3
        }
    })

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:px-6 md:px-8">
            <div className='w-full max-w-md rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-6 shadow-xl border border-gray-100'>
                <div className='text-center'>
                    <h1 className='text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Fetch Transfers</h1>
                </div>

                <div className='w-full flex flex-col items-center gap-4'>
                    <input
                        onChange={(e) => {
                            setEmailInput(e.currentTarget.value)
                        }}
                        className='w-full text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 hover:bg-white'
                        type="email"
                        placeholder='Email or phone number'
                    />

                    <button
                        onClick={() => {
                            console.log('Submit clicked')

                            if (!emailInput) {
                                alert('Please enter a valid email')
                            } else if (typeof emailInput === 'string' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput)) {
                                refetch()
                                return;
                            }
                        }}
                        className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-3 sm:py-3 text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 transform'
                    >
                        Submit
                    </button>


                    {isLoading && (
                        <p className='text-center text-base text-gray-600'>Loading...</p>
                    )}


                    {error && (
                        <p>User not found</p>
                    )}


                    {data && isSuccess && (
                        <div className='w-full max-w-3xl bg-gray-50 rounded-lg p-6 overflow-y-auto max-h-[60vh] border border-gray-200'>
                            <p className='text-base mb-2 text-gray-900'><strong>First Name: </strong>{data.user.firstName}</p>
                            <p className='text-base mb-6 text-gray-900'><strong>Last Name: </strong>{data.user.lastName}</p>

                            {data.user.accounts.map((account: any, index: any) => {
                                return (
                                    <div key={index} className='mb-8'>
                                        <h3 className='font-semibold text-xl mb-4 text-gray-900'>Sent Transfers</h3>

                                        <div className='space-y-3 mb-8'>
                                            {account.sentTransfers.length > 0 ? (
                                                account.sentTransfers.map((transfer: any, id: any) => {
                                                    return (
                                                        <div key={`${id}-sent`} className='bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                                                            <p className='text-sm mb-2 text-gray-900'><strong>Transfer ID: </strong><span className='break-all'>{transfer.id}</span></p>
                                                            <p className='text-sm mb-2'><strong>Amount: </strong><span className='font-semibold text-green-600'>${transfer.amount}</span></p>
                                                            <p className='text-sm text-gray-900'><strong>To Account: </strong>{transfer.toAccount.accountNumber}</p>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p className='text-sm text-gray-500'>No sent transfers</p>
                                            )}
                                        </div>

                                        <h3 className='font-semibold text-xl mb-4 text-gray-900'>Received Transfers</h3>

                                        <div className='space-y-3'>
                                            {account.receivedTransfers.length > 0 ? (
                                                account.receivedTransfers.map((transfer: any, id: any) => (
                                                    <div key={`${id}-received`} className='bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                                                        <p className='text-sm mb-2 text-gray-900'><strong>Transfer ID: </strong><span className='break-all'>{transfer.id}</span></p>
                                                        <p className='text-sm mb-2'><strong>Amount: </strong><span className='font-semibold text-green-600'>${transfer.amount}</span></p>
                                                        <p className='text-sm text-gray-900'><strong>From Account: </strong>{transfer.fromAccount.accountNumber}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className='text-sm text-gray-500'>No received transfers</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FetchTransferHistory