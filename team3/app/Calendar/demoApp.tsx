"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'
import EventDialog from './Dialog'

// Type for Google Calendar Event
interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
}

export default function CalendarComponent() {
  const { data: session } = useSession();
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);

  // Fetch Google Calendar events
  useEffect(() => {
    async function fetchGoogleCalendarEvents() {
      if (!session?.accessToken) {
        console.log('No access token available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get current time range (this month)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${firstDay.toISOString()}&timeMax=${lastDay.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch events: ${errorText}`);
        }

        const data = await response.json();
        
        // Transform Google Calendar events to FullCalendar format
        const formattedEvents = data.items.map((event: GoogleCalendarEvent) => ({
          id: event.id,
          title: event.summary || 'Untitled Event',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          extendedProps: {
            description: event.description,
            location: event.location
          },
          allDay: !event.start?.dateTime // If no time is specified, it's an all-day event
        }));

        setCurrentEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        alert('Failed to fetch events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.accessToken) {
      fetchGoogleCalendarEvents();
    }
  }, [session?.accessToken]);

  // Create a new event on Google Calendar
  async function createGoogleCalendarEvent(eventData: {
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location?: string;
    attendees?: string[];
    recurrence?: string;
  }) {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventBody)
      });
  
      // More comprehensive error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Detailed event creation error:', error);
      throw error;
    }
  }

  // Update an existing event on Google Calendar
  async function updateGoogleCalendarEvent(eventData: {
    eventId?: string;
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location?: string;
    attendees?: string[];
    recurrence?: string;
  }) {
    if (!session?.accessToken || !eventData.eventId) {
      console.error('No access token or event ID available');
      return null;
    }

    try {
      // Ensure correct date-time formatting
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}:00`);
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}:00`);

      const eventBody = {
        summary: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start: { 
          dateTime: startDateTime.toISOString()
        },
        end: { 
          dateTime: endDateTime.toISOString()
        },
        recurrence: eventData.recurrence ? [`RRULE:FREQ=${eventData.recurrence}`] : undefined,
        attendees: eventData.attendees?.map(email => ({ email }))
      };

      console.log('Updating event with body:', JSON.stringify(eventBody, null, 2));

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventData.eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventBody)
      });

      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Full response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to update event: ${responseText}`);
      }

      const updatedEvent = JSON.parse(responseText);
      return updatedEvent;
    } catch (error) {
      console.error('Detailed error updating Google Calendar event:', error);
      alert('Failed to update event. Please check your details and try again.');
      return null;
    }
  }

  // Delete event from Google Calendar
  async function deleteGoogleCalendarEvent(eventId: string) {
    if (!session?.accessToken) {
      console.error('No access token available');
      return false;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete event: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      alert('Failed to delete event. Please try again.');
      return false;
    }
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    setSelectedStart(selectInfo.start);
    setSelectedEnd(selectInfo.end);
    setEditingEvent(null);
    setIsDialogOpen(true); 
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    setEditingEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.extendedProps.description,
      location: event.extendedProps.location
    });
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    setSelectedStart(null);
    setSelectedEnd(null);
    setEditingEvent(null);
  }

  async function handleDialogSave(formData: FormData) {
    try {
 
      const startDate = formData.get('startDate') as string;
      const startTime = formData.get('startTime') as string;
      const endDate = formData.get('endDate') as string;
      const endTime = formData.get('endTime') as string;
      
 
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      const newEvent = {
        id: createEventId(),
        title: 'New Event', 
        start,
        end,
        allDay: false,
      };

      let calendarApi = calendarRef.current?.getApi(); 
 

      if (calendarApi) {
        calendarApi.addEvent(newEvent);
      } else {
        console.error('Failed to save event');
        alert('Failed to save event. Please try again.');
      }

      handleDialogClose();
    } catch (error) {
      console.error('Comprehensive error saving event:', error);
      alert('An error occurred while saving the event');
    }
  }

  function handleEventClick(clickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events)
  }

   const calendarRef = React.useRef<FullCalendar>(null);

  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>

      <EventDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
      />
    </div>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
