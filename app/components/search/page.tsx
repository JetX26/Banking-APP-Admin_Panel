'use client'

import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'

import { Loader } from 'lucide-react'

interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    accounts: Array<{ accountNumber: string }>
}



const SearchPage = () => {

    const [firstName, setFirstName] = useState('')



    const searchUser = async (firstName: string) => {
        try {
            const response = await axios.get('/api/searchUser', { params: { firstName } })

            if (!response) {
                console.log('Failed to fetch users')
            }

            return response.data.findUserByName;
        } catch (error) {
            console.error(error)
            throw error
        }
    }


    const { data, refetch, isSuccess, isLoading, error } = useQuery<User[]>({
        queryKey: ['searchUser', firstName],
        queryFn: () => searchUser(firstName),
        enabled: false,
        retry: (retryFails, error: Error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400 || error.response?.status === 404) {
                    return false;
                }
            }

            return retryFails < 3;
        },
    })

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0)


    const itemsToShow = data?.slice(0, (currentPage + 1) * itemsPerPage)

    const sentinelRef = useRef(null)





    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && data && itemsToShow && itemsToShow.length < data.length) {
                console.log('Element is visible')
                setCurrentPage(prev => prev + 1)
            }
        })

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }


        return () => observer.disconnect()

    }, [data, itemsToShow])

    useEffect(() => {
        console.log(firstName)
        console.log(itemsToShow)
    }, [data, itemsToShow])



    return (
        <div className="flex flex-col items-center gap-8">

            <div className="flex flex-col items-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search</h1>
            </div>

            <div className="w-full max-w-2xl rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-3 block">Search by name</label>
                        <input
                            onChange={(e) => {
                                setFirstName(e.currentTarget.value)
                            }}
                            type="text"
                            placeholder="Enter your search..."
                            className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        />
                    </div>
                    <button onClick={() => {
                        refetch()
                    }} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95">
                        Search
                    </button>
                </div>
            </div>


            {isSuccess && data ? (
                <div className='w-full max-w-4xl h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
                    <div className='flex flex-col flex-shrink-0'>
                        <div className='flex justify-between gap-3 px-5 py-4'>
                            <div>
                                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Search Results</h1>
                                {data && isSuccess && (
                                    <p className='text-gray-500 text-xs mt-0.5'>{data?.length} user{data.length !== 1 ? 's' : ''} found</p>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-3 px-5 py-3 border-b border-gray-200'>
                            <div className='flex-1'>
                                <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>First Name</p>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>Last Name</p>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>Email</p>
                            </div>
                        </div>
                    </div>

                    <div className='overflow-y-auto max-h-96'>


                        {itemsToShow?.map((item, id) => {
                            return <div key={id}>
                                <div
                                    key={id}
                                    className='flex justify-between gap-3 px-5 py-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors items-center animate-in fade-in slide-in-from-left duration-300'
                                    style={{ animationDelay: `${200 + id * 30}ms` }}
                                >
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-900'>{item.firstName}</p>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-900'>{item.lastName}</p>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-600'>{item.email}</p>
                                    </div>
                                </div>
                            </div>
                        })}


                        <div ref={sentinelRef}></div>
                    </div>
                </div>
            ) : (
                <>
                    {isLoading && (
                        <>
                            <Loader className='w-4 h-4 animate-spin' />
                            <span>Loading...</span>
                        </>
                    )}
                </>
            )}

            {error && (
                <p>No users found</p>
            )}


        </div>
    )
}

export default SearchPage