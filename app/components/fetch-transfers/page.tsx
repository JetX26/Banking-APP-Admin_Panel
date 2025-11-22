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
        <div className="bg-white w-full flex flex-col items-center gap-6 px-4 py-8 sm:px-6 md:p-12">
            <h1 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-gray-900'>Fetch Transfers</h1>

            <div className='w-full max-w-md flex flex-col items-center gap-3'>
                <input
                    onChange={(e) => {
                        setEmailInput(e.currentTarget.value)
                    }}
                    className='w-full rounded-lg border border-gray-300 text-black px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
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
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
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
    )
}

export default FetchTransferHistory