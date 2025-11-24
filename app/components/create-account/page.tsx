/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const CreateAccount = () => {

    const inputs = ['First Name', 'Last Name', 'Email', 'Phone', 'Password', 'Amount']
    const accountTypes = ['Select Account Type', 'Checking', 'Savings']

    const [accountType, setAccountType] = useState('')
    const [balance, setBalance] = useState<number>(0)
    const [amount, setAmount] = useState('')

    const { mutateAsync } = useMutation({
        mutationFn: async (formValues: any) => {
            const response = await axios.post('/api/createAccount', formValues)
            return { data: response.data, status: response.status, message: response.data.message }
        }
    })

    const router = useRouter()

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
            alert('Please fill in all required fields...')
        }

        console.log(e.currentTarget.value)



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
            alert('Account created successfully!')
            router.push('/components/login')
            console.log(result)
        }


    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <form
                    onSubmit={submit}
                    className="bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">

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