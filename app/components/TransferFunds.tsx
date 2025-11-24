/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const TransferFunds = () => {

    const [fromAccValue, setFromAccValue] = useState('')
    const [toAccValue, setToAccValue] = useState('')
    const [amount, setAmount] = useState<number>(0)

    const { data, mutateAsync } = useMutation({

        mutationFn: async (formValues: any) => {
            const { data } = await axios.post('/api/transferFunds', formValues)
            return data;
        }
    })

    const submit = async (e: any) => {
        e.preventDefault()

        if (!fromAccValue || !toAccValue || !amount) {
            alert('Please fill in all fields')
            return;
        }

        try {

            const result = await mutateAsync({
                senderEmail: fromAccValue,
                receiverEmail: toAccValue,
                amount
            })

            if (result) {
                alert('Transfer complete!')
                setFromAccValue('')
                setToAccValue('')
                setAmount(0)
            }

        } catch (error: any) {
            alert(error.response.data.error)
        }

    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6 sm:mb-8'>
                        Transfer Funds
                    </h1>

                    <form onSubmit={submit} className='w-full flex flex-col gap-4 sm:gap-5'>
                        <div className="space-y-2">
                            <input
                                onChange={(e) => {
                                    setFromAccValue(e.currentTarget.value)
                                    console.log(fromAccValue)
                                }}
                                className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                                type="email"
                                placeholder='Sender Email'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <input
                                onChange={(e) => {
                                    setToAccValue(e.currentTarget.value)
                                    console.log(toAccValue)
                                }}
                                className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                                type="email"
                                placeholder='Receiver Email'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <input
                                onChange={(e) => {
                                    setAmount(Number(e.currentTarget.value))
                                    console.log(amount)
                                }}
                                placeholder='Amount'
                                type="number"
                                className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            onClick={() => console.log(data)}
                            className='w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] transform'
                        >
                            Transfer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TransferFunds