import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'



export async function POST(req: NextRequest) {


    let prevTimeStamp: string;

    function generateAccountNumber() {
        const timestamp = Date.now().toString()

        if (prevTimeStamp !== timestamp) {
            prevTimeStamp = timestamp
        }

        return prevTimeStamp;
    }


    try {
        console.log('Running')

        const { firstName, lastName, email, phone, password, accountType, balance } = await req.json()
        if (!firstName || !lastName || !email || !phone || !password || !accountType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }


        const hashedPassword = await bcrypt.hash(password, 10)


        const customer = await prisma.customer.findFirst({
            where: {
                firstName,
                lastName,
                email,
                phone,
            },
            include: {
                accounts: true
            }
        })




        const customerAccType = await prisma.account.findFirst({
            where: {
                accountType,
                customerId: customer?.id
            }
        })

        const customerEmail = await prisma.customer.findFirst({
            where: { email }
        })
        if (customerEmail?.email) {
            return NextResponse.json({ error: 'Customer with that email already exists' }, { status: 400 })
        }

        const customerPhone = await prisma.customer.findFirst({
            where: { phone }
        })
        if (customerPhone?.phone) {
            return NextResponse.json({ error: 'Customer with that phone already exists' }, { status: 400 })
        }



        if (customer) {


            if (customerAccType?.accountType) {
                return NextResponse.json({ error: 'Account already exists' }, { status: 400 })
            } else {
                const createAccount = await prisma.account.create({
                    data: {
                        accountNumber: generateAccountNumber(),
                        accountType,
                        balance,
                        customerId: customer.id
                    }
                })



                return NextResponse.json({ success: 'Account created under the existing user.', createAccount }, { status: 200 })
            }



        } else {

            const createUser = await prisma.customer.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hashedPassword,
                    accounts: {
                        create: {
                            accountNumber: generateAccountNumber(),
                            accountType,
                            balance,
                        }
                    }
                }
            })



            return NextResponse.json({ success: true, createUser }, { status: 200 })
        }



    } catch (error) {
        console.error('Account creation error', error)
        return NextResponse.json({ error: 'Failed to create account' }, { status: 400 })
    }

}