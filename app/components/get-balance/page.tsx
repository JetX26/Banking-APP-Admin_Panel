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
        <div className="bg-white w-full flex flex-col items-center gap-6 px-4 py-8 sm:px-6 md:p-12">
            <h1 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-gray-900'>Get Balance</h1>

            <div className='w-full max-w-md flex flex-col items-center gap-3'>
                <input
                    onChange={(e) => {
                        setAccountNumberInput(e.currentTarget.value)
                    }}
                    className='w-full rounded-lg border border-gray-300 text-black px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
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
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
                >
                    Submit
                </button>

                {isLoading && (
                    <div className='flex justify-center'>
                        <p className='text-base text-gray-600'>Loading...</p>
                    </div>
                )}

                {data && isSuccess && (
                    <div className='w-full bg-gray-50 rounded-lg p-6 border border-gray-200'>
                        <div className='space-y-4'>
                            <div>
                                <p className='text-sm text-gray-600 mb-1'><strong>First Name:</strong></p>
                                <p className='text-base text-gray-900'>{data.response.customer.firstName}</p>
                            </div>

                            <div>
                                <p className='text-sm text-gray-600 mb-1'><strong>Last Name:</strong></p>
                                <p className='text-base text-gray-900'>{data.response.customer.lastName}</p>
                            </div>

                            <div>
                                <p className='text-sm text-gray-600 mb-1'><strong>Account Number:</strong></p>
                                <p className='text-base text-gray-900 break-all'>{data.response.accountNumber}</p>
                            </div>

                            <div>
                                <p className='text-sm text-gray-600 mb-1'><strong>Balance:</strong></p>
                                <p className='text-base font-semibold text-green-600'>${data.response.balance}</p>
                            </div>

                            <div>
                                <p className='text-sm text-gray-600 mb-1'><strong>Account Type:</strong></p>
                                <p className='text-base text-gray-900'>{data.response.accountType}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GetBalance