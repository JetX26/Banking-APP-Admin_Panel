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
        <form onSubmit={submit} className='bg-white w-full min-h-screen flex items-center justify-center px-4 py-8 sm:px-6'>
            <div className='w-full max-w-md flex flex-col justify-center items-center gap-4 sm:gap-5'>
                <h3 className='text-2xl sm:text-3xl md:text-3xl font-semibold text-center'>Sign in</h3>

                <input
                    onChange={(e) => {
                        setEmail(e.currentTarget.value)
                    }}
                    className='w-full border-[1px] border-gray-200 text-black rounded-sm px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type="text"
                    placeholder='Email'
                />

                <input
                    onChange={(e) => {
                        setPassword(e.currentTarget.value)
                    }}
                    className='w-full border-[1px] border-gray-200 text-black rounded-sm px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type="password"
                    placeholder='Password'
                />

                <button
                    type='submit'
                    className='w-full rounded-sm bg-blue-400 hover:bg-blue-500 text-white font-medium px-4 py-2 text-sm sm:text-base transition-colors'
                >
                    Login
                </button>

                <div className='text-center'>
                    <p className='text-sm sm:text-base mb-2'>{`Don't have an account?`}</p>
                    <a
                        className='text-blue-400 hover:text-blue-500 hover:underline text-sm sm:text-base font-medium transition-colors'
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