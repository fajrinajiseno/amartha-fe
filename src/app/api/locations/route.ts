import { NextResponse } from 'next/server'

const SERVER2_INTERNAL_BASE_URL =
  process.env.SERVER2_INTERNAL_BASE_URL ?? 'http://localhost:4002'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.toString()

    const upstreamUrl = `${SERVER2_INTERNAL_BASE_URL}/locations${
      search ? `?${search}` : ''
    }`

    const upstream = await fetch(upstreamUrl, { cache: 'no-store' })

    if (!upstream.ok) {
      const text = await upstream.text()
      return NextResponse.json(
        { message: text || 'Failed to fetch locations' },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
