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
        <div className='min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8 sm:px-6 md:px-8'>
            <form
                onSubmit={submit}
                className="w-full max-w-md bg-white rounded-lg p-6 sm:p-8 md:p-12 flex flex-col items-center gap-4">

                <h1 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-center text-gray-900'>Create An Account</h1>

                <div className='w-full flex flex-col items-center gap-3'>
                    {inputs.map((item, id) => {
                        return (
                            <div key={id} className='w-full'>
                                {item === 'Amount' ? (
                                    <input
                                        value={amount}
                                        onChange={handleAmount}
                                        placeholder='$0.00'
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
                                    />
                                ) : (
                                    <input
                                        name={item}
                                        type='text'
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
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
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
                    >
                        {accountTypes.map((item, id) => {
                            return <option key={id}>{item}</option>
                        })}
                    </select>

                    <button
                        type='submit'
                        className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
                    >
                        Create Account
                    </button>
                </div>
            </form>

            <div className='w-full max-w-md flex flex-col justify-center items-center gap-3 mt-6 sm:mt-8'>
                <p className='text-base text-center'>Already have an account?</p>
                <button
                    onClick={() => {
                        router.push('/components/login')
                    }}
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default CreateAccount