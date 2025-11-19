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
        <div className="bg-white w-full flex flex-col items-center gap-6 px-4 py-8 sm:px-6 md:p-12">
            <h1 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-gray-900'>Transfer Funds</h1>

            <form onSubmit={submit} className='w-full max-w-md flex flex-col items-center gap-4'>
                <input
                    onChange={(e) => {
                        setFromAccValue(e.currentTarget.value)
                        console.log(fromAccValue)
                    }}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
                    type="email"
                    placeholder='Sender Email'
                    required
                />

                <input
                    onChange={(e) => {
                        setToAccValue(e.currentTarget.value)
                        console.log(toAccValue)
                    }}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
                    type="email"
                    placeholder='Receiver Email'
                    required
                />

                <input
                    onChange={(e) => {
                        setAmount(Number(e.currentTarget.value))
                        console.log(amount)
                    }}
                    placeholder='Amount'
                    type="number"
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
                    required
                />

                <button
                    type='submit'
                    onClick={() => console.log(data)}
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 text-base transition-colors active:scale-95'
                >
                    Transfer
                </button>
            </form>
        </div>
    )
}

export default TransferFunds