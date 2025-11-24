'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery, } from '@tanstack/react-query'

const GetBalance = () => {

    const [accountNumberInput, setAccountNumberInput] = useState('')

    const getUserBalance = async (accountNumber: string) => {
        try {

            const response = await axios.get('/api/getBalance', { params: { accountNumber } })

            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch user')
        }
    }

    const { data, refetch, isSuccess, isLoading } = useQuery({
        queryKey: ['getUserBalance', accountNumberInput],
        queryFn: () => getUserBalance(accountNumberInput),
        enabled: false
    })



    useEffect(() => {
        console.log(accountNumberInput)
    }, [accountNumberInput])

    return (
        <div className="min-h-screen w-full flex justify-center pt-20 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md flex flex-col">
                <div className="backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6 sm:mb-8'>
                        Get Balance
                    </h1>

                    <div className='w-full flex flex-col gap-4 sm:gap-5'>
                        <input
                            onChange={(e) => {
                                setAccountNumberInput(e.currentTarget.value)
                            }}
                            className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                            placeholder='Account number'
                        />

                        <button
                            onClick={() => {
                                if (!accountNumberInput) {
                                    alert('Please type in an account number...')
                                    return;
                                }
                                refetch()
                                console.log(data)
                            }}
                            className='w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] transform'
                        >
                            Submit
                        </button>

                        {isLoading && (
                            <div className='flex justify-center py-2'>
                                <p className='text-sm sm:text-base text-gray-600'>Loading...</p>
                            </div>
                        )}

                        {data && isSuccess && (
                            <div className='w-full bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-200 shadow-md mt-2'>
                                <div className='space-y-3 sm:space-y-4'>
                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-600 mb-1'><strong>First Name:</strong></p>
                                        <p className='text-sm sm:text-base text-gray-900'>{data.response.customer.firstName}</p>
                                    </div>

                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-600 mb-1'><strong>Last Name:</strong></p>
                                        <p className='text-sm sm:text-base text-gray-900'>{data.response.customer.lastName}</p>
                                    </div>

                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-600 mb-1'><strong>Account Number:</strong></p>
                                        <p className='text-sm sm:text-base text-gray-900 break-all'>{data.response.accountNumber}</p>
                                    </div>

                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-600 mb-1'><strong>Balance:</strong></p>
                                        <p className='text-base sm:text-lg font-semibold text-green-600'>${data.response.balance}</p>
                                    </div>

                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-600 mb-1'><strong>Account Type:</strong></p>
                                        <p className='text-sm sm:text-base text-gray-900'>{data.response.accountType}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetBalance