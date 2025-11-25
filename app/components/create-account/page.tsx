/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const CreateAccount = () => {

    const inputs = ['First Name', 'Last Name', 'Email', 'Phone', 'Password', 'Amount']
    const accountTypes = ['Select Account Type', 'Checking', 'Savings']

    const [accountType, setAccountType] = useState('')
    const [balance, setBalance] = useState<number>(0)
    const [amount, setAmount] = useState('')
    const [popup, setPopup] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
        show: false,
        type: 'success',
        message: ''
    })

    const { mutateAsync } = useMutation({
        mutationFn: async (formValues: any) => {
            const response = await axios.post('/api/createAccount', formValues)
            return { data: response.data, status: response.status, message: response.data.message }
        }
    })

    const router = useRouter()

    const showPopup = (type: 'success' | 'error', message: string) => {
        setPopup({ show: true, type, message })
    }

    const closePopup = () => {
        setPopup({ ...popup, show: false })
    }

    const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numeric = e.target.value.replace(/[^0-9.]/g, "");

        const parts = numeric.split(".");
        if (parts.length > 2) numeric = parts[0] + "." + parts[1];

        const [intPart, decPart] = numeric.split(".");
        const formattedInt = intPart ? Number(intPart).toLocaleString() : "";
        const formatted = decPart !== undefined ? `$${formattedInt}.${decPart}` : `$${formattedInt}`;

        setAmount(formatted);
        setBalance(numeric ? parseFloat(numeric) : 0);
    };

    const submit = async (e: any) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const firstName = formData.get('First Name')
        const lastName = formData.get('Last Name')
        const email = formData.get('Email')
        const phone = formData.get('Phone')
        const password = formData.get('Password')

        if (!firstName || !lastName || !email || !phone || !password) {
            showPopup('error', 'Please fill in all required fields...')
            return
        }

        console.log(e.currentTarget.value)

        try {
            const result = await mutateAsync({
                firstName,
                lastName,
                email,
                phone,
                password,
                accountType,
                balance
            })

            if (result) {
                showPopup('success', 'Account created successfully!')
                setTimeout(() => {
                    router.push('/components/login')
                }, 2000)
                console.log(result)
            }
        } catch (error) {
            showPopup('error', 'Failed to create account. Please try again.')
        }
    }

    return (
        <div className="min-h-screen pt-8 w-full flex justify-center p-4 sm:p-6 lg:p-8">
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
                <form
                    onSubmit={submit}
                    className="via-blue-50/80 to-purple-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">

                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-6 sm:mb-8'>
                        Create Account
                    </h1>

                    <div className='w-full flex flex-col gap-4 sm:gap-5'>
                        {inputs.map((item, id) => {
                            return (
                                <div key={id} className='w-full'>
                                    {item === 'Amount' ? (
                                        <input
                                            value={amount}
                                            onChange={handleAmount}
                                            placeholder='$0.00'
                                            className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                                        />
                                    ) : (
                                        <input
                                            name={item}
                                            type={item === 'Password' ? 'password' : 'text'}
                                            className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300'
                                            placeholder={item}
                                        />
                                    )}
                                </div>
                            )
                        })}

                        <select
                            onChange={(e) => {
                                setAccountType(e.target.value)
                            }}
                            className='w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 px-4 py-3 sm:py-3.5 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 cursor-pointer'
                        >
                            {accountTypes.map((item, id) => {
                                return <option key={id}>{item}</option>
                            })}
                        </select>

                        <button
                            type='submit'
                            className='w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] transform'
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateAccount