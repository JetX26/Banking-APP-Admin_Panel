import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";




export async function GET(req: NextRequest) {
    try {
        const accountNumber = req.nextUrl.searchParams.get('accountNumber')

        if (!accountNumber) {
            return NextResponse.json({ error: 'Account number required' }, { status: 400 })
        }

        const response = await prisma.account.findUnique({
            where: {
                accountNumber: accountNumber
            },
            include: {
                customer: true
            }
        })



        if (!response?.accountNumber) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }



        return NextResponse.json({ success: true, response }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch user by account number' }, { status: 400 })
    }
}