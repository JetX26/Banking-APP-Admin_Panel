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

        const verificationCode = async (length = 6) => {
            let code = ''
            for (let i = 0; i < length; i++) {
                code += Math.floor(Math.random() * 10)
            }
            console.log(code)
            return code;
        }

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
                alert('Account created successfully!')
                verificationCode()
                router.push('/components/login')
                console.log(result)
            }

        } catch (error: any) {
            console.error(error.response?.data?.error || 'Something went wrong')
        }

    }

    return (
        <div className='min-h-screen flex flex-col items-center px-4 py-8 sm:px-6 md:px-8'>
            <form
                onSubmit={submit}
                className="w-full max-w-md rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-6 shadow-xl border border-gray-100">

                <div className='text-center'>
                    <h1 className='text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Create Account</h1>

                </div>

                <div className='w-full flex flex-col items-center gap-4'>
                    {inputs.map((item, id) => {
                        return (
                            <div key={id} className='w-full'>
                                {item === 'Amount' ? (
                                    <input
                                        value={amount}
                                        onChange={handleAmount}
                                        placeholder='$0.00'
                                        className='w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all bg-gray-50 hover:bg-white'
                                    />
                                ) : (
                                    <input
                                        name={item}
                                        type={item === 'Password' ? 'password' : 'text'}
                                        className='w-full text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 hover:bg-white'
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
                        className='w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 hover:bg-white cursor-pointer'
                    >
                        {accountTypes.map((item, id) => {
                            return <option key={id}>{item}</option>
                        })}
                    </select>

                    <button
                        type='submit'
                        className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-3 sm:py-3 text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 transform'
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateAccount