import { NextRequest, NextResponse } from 'next/server'
import { Op } from 'sequelize'
import DB from '../../../models'

export async function GET(request: NextRequest) {
    const where = {} as {
        pickup_datetime?: any,
        fare_amount?: any,
        trip_distance?: string,
        payment_type?: string
    }

    if (request.nextUrl.searchParams.has('payment')) {
        where.payment_type = request.nextUrl.searchParams.get('payment')
    }

    if (request.nextUrl.searchParams.has('distance')) {
        where.trip_distance = request.nextUrl.searchParams.get('distance')
    }

    if (request.nextUrl.searchParams.has('min-fare') && request.nextUrl.searchParams.has('max-fare')) {
        where.fare_amount = {
            [Op.gte]: request.nextUrl.searchParams.get('min-fare'),
            [Op.lte]: request.nextUrl.searchParams.get('max-fare')
        }
    }

    if (request.nextUrl.searchParams.has('start-time') && request.nextUrl.searchParams.has('end-time')) {
        where.pickup_datetime = {
            [Op.gte]: new Date(request.nextUrl.searchParams.get('start-time')),
            [Op.lte]: new Date(request.nextUrl.searchParams.get('end-time'))
        }
    }

    const data = await DB.TripData.findAll({
        where: where
    })

    return NextResponse.json(data)
}