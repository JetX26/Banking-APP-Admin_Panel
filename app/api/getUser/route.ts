import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const emailSearch = req.nextUrl.searchParams.get('email')

        const fetchUserByEmail = await prisma.customer.findFirst({
            where: {
                email: emailSearch
            },
            include: {
                accounts: true,
            },
            omit: {
                password: true
            }
        })
        if (!fetchUserByEmail) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: fetchUserByEmail }, { status: 200 })


    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 400 })
    }
}