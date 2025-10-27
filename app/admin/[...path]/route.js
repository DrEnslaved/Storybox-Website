import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { path } = params
  const pathStr = Array.isArray(path) ? path.join('/') : path
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `http://localhost:9000/app/${pathStr}${searchParams ? `?${searchParams}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...Object.fromEntries(request.headers),
        host: 'localhost:9000',
      },
    })

    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }
    
    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': contentType || 'text/html',
      },
    })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  const { path } = params
  const pathStr = Array.isArray(path) ? path.join('/') : path
  const body = await request.text()
  const url = `http://localhost:9000/app/${pathStr}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...Object.fromEntries(request.headers),
        host: 'localhost:9000',
      },
      body,
    })

    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }
    
    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': contentType || 'text/html',
      },
    })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { path } = params
  const pathStr = Array.isArray(path) ? path.join('/') : path
  const body = await request.text()
  const url = `http://localhost:9000/app/${pathStr}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...Object.fromEntries(request.headers),
        host: 'localhost:9000',
      },
      body,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { path } = params
  const pathStr = Array.isArray(path) ? path.join('/') : path
  const url = `http://localhost:9000/app/${pathStr}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...Object.fromEntries(request.headers),
        host: 'localhost:9000',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
  }
}
