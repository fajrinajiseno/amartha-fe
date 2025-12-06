import { NextResponse } from 'next/server'

const SERVER2_INTERNAL_BASE_URL =
  process.env.SERVER2_INTERNAL_BASE_URL ?? 'http://localhost:4002'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.toString()

    const upstreamUrl = `${SERVER2_INTERNAL_BASE_URL}/details${
      search ? `?${search}` : ''
    }`

    const upstream = await fetch(upstreamUrl, { cache: 'no-store' })

    if (!upstream.ok) {
      const text = await upstream.text()
      return NextResponse.json(
        { message: text || 'Failed to fetch details' },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()
    const totalHeader = upstream.headers.get('X-Total-Count')

    return NextResponse.json({
      data,
      total: totalHeader ? Number(totalHeader) : undefined
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const upstream = await fetch(`${SERVER2_INTERNAL_BASE_URL}/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!upstream.ok) {
      const text = await upstream.text()
      return NextResponse.json(
        { message: text || 'Failed to create details' },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
