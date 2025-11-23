import prisma from "@/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const users = await prisma.customer.findMany({
            select: {
                firstName: true,
                lastName: true,
                accounts: true,
            },

        })

        return NextResponse.json({ success: true, data: users }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch all users' }, { status: 400 })
    }

}