import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest) {
    try {


        const params = req.nextUrl.searchParams.get('email')
        if (!params) {
            return NextResponse.json({ error: 'Missing required field' }, { status: 400 })
        }

        const user = await prisma.customer.findFirst({
            where: { email: params },
            include: {
                accounts: {
                    include: {
                        receivedTransfers: {
                            include: {
                                fromAccount: true,
                            }
                        },
                        sentTransfers: {
                            include: {
                                toAccount: true
                            }
                        },
                        customer: {
                            select: {
                                email: true
                            }
                        }
                    },
                },
            }
        })


        return NextResponse.json({ success: true, user }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch transfer history' }, { status: 400 })
    }
}