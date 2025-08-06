import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/kontakt - Kontaktmeldung speichern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Einfache Validierung
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // E-Mail-Formatprüfung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Nachricht in der Datenbank speichern
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    })

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'Message sent successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Holen dich die Kontaktmeldungen (für Admin).
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread')
    const limit = searchParams.get('limit')

    const messages = await db.contactMessage.findMany({
      where: {
        ...(unreadOnly === 'true' && { read: false })
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
