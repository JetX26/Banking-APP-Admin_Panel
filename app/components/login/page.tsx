/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login = () => {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { mutateAsync } = useMutation({
        mutationFn: async (formValues: LoginFormValues) => {
            try {
                const response = await axios.post('/api/loginSession', formValues)

                return {
                    data: response.data,
                    status: response.status,
                    message: response.data.message
                }
            } catch (error: any) {
                console.error(error)
                return {
                    data: error.response?.data,
                    status: error.response?.status,
                    message: error.response?.data.message
                }
            }
        }
    })

    const submit = async (e: any) => {
        e.preventDefault()

        if (!email || !password) {
            alert('Please fill in all required fields...')
            return;
        }

        try {

            const result = await mutateAsync({ email, password })

            if (result.message === 'Invalid Password') {
                alert(result.message)
            } else if (result.message === 'Invalid Credentials') {
                alert(result.message)
            } else {
                router.push('/components/dashboard')
            }

        } catch (error: any) {
            alert(error.response?.data?.error || 'Something went wrong')
        }

    }

    return (
        <form onSubmit={submit} className='w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6'>
            <div className='w-full max-w-md flex flex-col justify-center items-center gap-6 sm:gap-6'>
                <h3 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-center text-gray-900'>Sign in</h3>

                <input
                    onChange={(e) => {
                        setEmail(e.currentTarget.value)
                    }}
                    className='w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none'
                    type="email"
                    placeholder='Email'
                />

                <input
                    onChange={(e) => {
                        setPassword(e.currentTarget.value)
                    }}
                    className='w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none'
                    type="password"
                    placeholder='Password'
                />

                <button
                    type='submit'
                    className='w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 text-base transition-colors active:scale-95'
                >
                    Login
                </button>

                <div className='text-center'>
                    <p className='text-base text-gray-900 mb-3'>{`Don't have an account?`}</p>
                    <a
                        className='text-blue-600 hover:text-blue-700 hover:underline text-base font-medium transition-colors'
                        href='/components/create-account'
                    >
                        Create An Account
                    </a>
                </div>
            </div>
        </form>
    );
}

export default Login