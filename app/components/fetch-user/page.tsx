'use client'
import React from 'react'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const FetchUser = () => {

    const [userData, setUserData] = useState('')

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
        retry: (failureCount, error: AxiosError) => { // First parameter is the retry count, second is the error

            if (error.response?.status === 404) {
                return false;
            }

            return failureCount < 3;
        }
    })

    console.log(data)

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:px-6 md:px-8">
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
                                alert('Please enter a valid email address')
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

                    {isLoading ? (
                        <div className='flex justify-center'>
                            <p className='text-base text-gray-600'>Fetching...</p>
                        </div>
                    ) : isError && (
                        <div className='flex justify-center'>
                            <p className='text-base text-gray-500'>User not found</p>
                        </div>
                    )}

                    {data && isSuccess && (
                        <div className='bg-gray-50 rounded-lg p-6 space-y-3 overflow-y-auto max-h-[60vh] border border-gray-200'>
                            {Object.entries(data).map(([key, value]) => (
                                <div key={key} className='bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                                    <strong className='text-base block mb-2 capitalize text-gray-900'>{key}: </strong>
                                    {typeof value === 'object' && value !== null ? (
                                        <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    ) : (
                                        <span className='text-base text-gray-700'>{String(value)}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FetchUser