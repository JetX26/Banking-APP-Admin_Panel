import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {


    try {

        const nameSearch = req.nextUrl.searchParams.get('firstName')
        if (!nameSearch) {
            return NextResponse.json({ message: 'User required' }, { status: 400 })
        }


        const findUserByName = await prisma.customer.findMany({
            where: {
                firstName: nameSearch
            }
        })
        if (findUserByName.length < 1) {
            return NextResponse.json({ success: false, message: 'No users found' }, { status: 404 })
        }


        return NextResponse.json({ success: true, message: 'Users fetched', findUserByName }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 400 })
    }
}