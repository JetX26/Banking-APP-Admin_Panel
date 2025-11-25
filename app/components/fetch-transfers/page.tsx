/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const FetchTransferHistory = () => {

    const [emailInput, setEmailInput] = useState('')
    const [popup, setPopup] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
        show: false,
        type: 'success',
        message: ''
    })

    const showPopup = (type: 'success' | 'error', message: string) => {
        setPopup({ show: true, type, message })
    }

    const closePopup = () => {
        setPopup({ ...popup, show: false })
    }

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

    useEffect(() => {
        if (error) {
            showPopup('error', 'User not found')
        }
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:px-6 md:px-8">
            {/* Custom Popup */}
            {popup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={closePopup}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            {popup.type === 'success' ? (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2} />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={2} />
                                </div>
                            )}

                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${popup.type === 'success'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}>
                                    {popup.type === 'success' ? 'Success!' : 'Error'}
                                </h3>
                                <p className="text-gray-600 text-sm">{popup.message}</p>
                            </div>

                            <button
                                onClick={closePopup}
                                className={`w-full mt-2 rounded-xl font-semibold px-6 py-3 text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] transform ${popup.type === 'success'
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
                                    }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        placeholder='Enter email'
                    />

                    <button
                        onClick={() => {
                            console.log('Submit clicked')

                            if (!emailInput) {
                                showPopup('error', 'Please enter a valid email')
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


                    {data && isSuccess && (
                        <div className='w-full max-w-3xl rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[60vh] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='mb-6 pb-4 border-b border-gray-200'>
                                <p className='text-base mb-1 text-gray-900'><strong className='font-semibold'>First Name:</strong> {data.user.firstName}</p>
                                <p className='text-base text-gray-900'><strong className='font-semibold'>Last Name:</strong> {data.user.lastName}</p>
                            </div>

                            {data.user.accounts.map((account: any, index: any) => {
                                return (
                                    <div key={index} className='mb-8'>
                                        <h3 className='font-bold text-xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Sent Transfers</h3>

                                        <div className='space-y-3 mb-8'>
                                            {account.sentTransfers.length > 0 ? (
                                                account.sentTransfers.map((transfer: any, id: any) => {
                                                    return (
                                                        <div key={`${id}-sent`} className='bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200'>
                                                            <p className='text-sm mb-2 text-gray-700'><strong className='font-semibold'>Transfer ID:</strong> <span className='break-all text-gray-600'>{transfer.id}</span></p>
                                                            <p className='text-sm mb-2'><strong className='font-semibold text-gray-700'>Amount:</strong> <span className='font-bold text-green-600 text-base'>${transfer.amount}</span></p>
                                                            <p className='text-sm text-gray-700'><strong className='font-semibold'>To Account:</strong> <span className='font-mono text-gray-600'>{transfer.toAccount.accountNumber}</span></p>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p className='text-sm text-gray-500 italic py-2'>No sent transfers</p>
                                            )}
                                        </div>

                                        <h3 className='font-bold text-xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Received Transfers</h3>

                                        <div className='space-y-3'>
                                            {account.receivedTransfers.length > 0 ? (
                                                account.receivedTransfers.map((transfer: any, id: any) => (
                                                    <div key={`${id}-received`} className='bg-gradient-to-br from-gray-50 to-purple-50/30 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200'>
                                                        <p className='text-sm mb-2 text-gray-700'><strong className='font-semibold'>Transfer ID:</strong> <span className='break-all text-gray-600'>{transfer.id}</span></p>
                                                        <p className='text-sm mb-2'><strong className='font-semibold text-gray-700'>Amount:</strong> <span className='font-bold text-green-600 text-base'>${transfer.amount}</span></p>
                                                        <p className='text-sm text-gray-700'><strong className='font-semibold'>From Account:</strong> <span className='font-mono text-gray-600'>{transfer.fromAccount.accountNumber}</span></p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className='text-sm text-gray-500 italic py-2'>No received transfers</p>
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