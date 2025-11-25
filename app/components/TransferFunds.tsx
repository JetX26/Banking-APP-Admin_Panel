/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const TransferFunds = () => {

    const [fromAccValue, setFromAccValue] = useState('')
    const [toAccValue, setToAccValue] = useState('')
    const [amount, setAmount] = useState<number>(0)
    const [amountDisplay, setAmountDisplay] = useState('')
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

    const { data, mutateAsync } = useMutation({

        mutationFn: async (formValues: any) => {
            const { data } = await axios.post('/api/transferFunds', formValues)
            return data;
        }
    })

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numeric = e.target.value.replace(/[^0-9.]/g, "");

        const parts = numeric.split(".");
        if (parts.length > 2) numeric = parts[0] + "." + parts[1];

        const [intPart, decPart] = numeric.split(".");
        const formattedInt = intPart ? Number(intPart).toLocaleString() : "";
        const formatted = decPart !== undefined ? `${formattedInt}.${decPart}` : `${formattedInt}`;

        setAmountDisplay(formatted);
        setAmount(numeric ? parseFloat(numeric) : 0);
    }

    const submit = async (e: any) => {
        e.preventDefault()

        if (!fromAccValue || !toAccValue || !amount) {
            showPopup('error', 'Please fill in all fields')
            return;
        }

        try {

            const result = await mutateAsync({
                senderEmail: fromAccValue,
                receiverEmail: toAccValue,
                amount
            })

            if (result) {
                showPopup('success', 'Transfer complete!')
                setFromAccValue('')
                setToAccValue('')
                setAmount(0)
                setAmountDisplay('')
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Transfer failed. Please try again.'
            showPopup('error', errorMessage)
        }

    }

    return (
        <div className="min-h-screen w-full flex justify-center p-4 sm:p-6 lg:p-8">
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

            <div className="w-full max-w-md">
                <div className="backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6 sm:mb-8'>
                        Transfer Funds
                    </h1>

                    <form onSubmit={submit} className='w-full flex flex-col gap-4 sm:gap-5'>
                        <div className="space-y-2">
                            <input
                                value={fromAccValue}
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
                                value={toAccValue}
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
                                value={amountDisplay}
                                onChange={handleAmountChange}
                                placeholder='$0.00'
                                type="text"
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