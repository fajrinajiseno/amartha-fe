import { NextResponse } from 'next/server'

const SERVER1_INTERNAL_BASE_URL =
  process.env.SERVER1_INTERNAL_BASE_URL ?? 'http://localhost:4001'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.toString()

    const upstreamUrl = `${SERVER1_INTERNAL_BASE_URL}/departments${
      search ? `?${search}` : ''
    }`

    const upstream = await fetch(upstreamUrl, { cache: 'no-store' })

    if (!upstream.ok) {
      const text = await upstream.text()
      return NextResponse.json(
        { message: text || 'Failed to fetch departments' },
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
