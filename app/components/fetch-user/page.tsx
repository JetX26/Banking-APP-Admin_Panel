'use client'
import React from 'react'
import axios, { AxiosError } from 'axios'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const FetchUser = () => {

    const [userData, setUserData] = useState('')
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

    const fetchUser = async (email: string) => {
        try {
            const response = await axios.get('/api/getUser', { params: { email } })
            console.log(response)
            return response.data.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const { data, isLoading, refetch, isSuccess, isError } = useQuery({
        queryKey: ['fetchUser', userData],
        queryFn: () => fetchUser(userData),
        enabled: false,
        retry: (failureCount, error: AxiosError) => {
            if (error.response?.status === 404) {
                return false;
            }

            return failureCount < 3;
        }
    })

    useEffect(() => {
        if (isError) {
            showPopup('error', 'User not found')
        }
    }, [isError])

    console.log(data)

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
                    <h1 className='text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Fetch User By Email</h1>
                </div>

                <div className='w-full flex flex-col items-center gap-4'>
                    <input
                        type='email'
                        onChange={(e) => {
                            setUserData(e.currentTarget.value)
                            console.log(userData)
                        }}
                        className='w-full text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 hover:bg-white'
                        required
                        placeholder='Email'
                    />

                    <button
                        onClick={() => {
                            if (typeof userData === 'string' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData)) {
                                refetch()
                            } else {
                                showPopup('error', 'Please enter a valid email address')
                            }
                        }}
                        className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700  text-white font-semibold px-4 py-3 sm:py-3 text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 transform'
                    >
                        Submit
                    </button>
                </div>

                <div className='w-full max-w-3xl text-black'>
                    {isSuccess && (
                        <h2 className='text-2xl sm:text-3xl font-semibold mb-4 text-center text-gray-900'>User Data</h2>
                    )}

                    {isLoading && (
                        <div className='flex justify-center'>
                            <p className='text-base text-gray-600'>Fetching...</p>
                        </div>
                    )}

                    {data && isSuccess && (
                        <div className=' rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[60vh] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            {Object.entries(data).map(([key, value]) => {
                                if (key === 'accounts' && Array.isArray(value)) {
                                    return (
                                        <div key={key} className='space-y-3'>
                                            <h3 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3'>Accounts</h3>
                                            {value.map((account, index: number) => (
                                                <div key={index} className='bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-2'>
                                                    <div className='grid grid-cols-1 gap-2'>
                                                        <div>
                                                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Account Number</span>
                                                            <p className='text-sm font-mono text-gray-900 mt-0.5'>{account.accountNumber}</p>
                                                        </div>
                                                        <div>
                                                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Balance</span>
                                                            <p className='text-base font-bold text-green-600 mt-0.5'>${account.balance}</p>
                                                        </div>
                                                        <div>
                                                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Account Type</span>
                                                            <p className='text-sm text-gray-900 mt-0.5 capitalize'>{account.accountType}</p>
                                                        </div>
                                                        {account.createdAt && (
                                                            <div>
                                                                <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Created</span>
                                                                <p className='text-xs text-gray-600 mt-0.5'>{new Date(account.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }

                                // Regular fields
                                return (
                                    <div key={key} className='bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200'>
                                        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1'>{key}</span>
                                        {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                                            <pre className='bg-white p-3 rounded-lg text-xs sm:text-sm overflow-x-auto border border-gray-200 text-gray-700 mt-2'>
                                                {JSON.stringify(value, null, 2)}
                                            </pre>
                                        ) : (
                                            <p className='text-sm sm:text-base text-gray-900 font-medium'>{String(value)}</p>
                                        )}
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

export default FetchUser