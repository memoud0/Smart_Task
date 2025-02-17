import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { auth } from '../../auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: session.accessToken })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const tasks = response.data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      dueDate: event.end?.dateTime || event.end?.date,
      status: event.status,
      priority: event.description?.includes('Priority:') 
        ? event.description.split('Priority:')[1].trim().split('\n')[0]
        : 'Normal',
      description: event.description || '',
      location: event.location || '',
      startTime: event.start?.dateTime || event.start?.date,
    })) || []

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}