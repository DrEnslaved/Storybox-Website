import { NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'

export async function GET(request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Не сте влезли' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user: session })
  } catch (error) {
    return NextResponse.json(
      { error: 'Грешка при проверка на сесия' },
      { status: 500 }
    )
  }
}