"use client"
import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import EventDialog from './Dialog'; // The dialog we created above
import { DateSelectArg } from '@fullcalendar/core'
export default function DemoApp() {
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  function handleDateSelect(selectInfo: DateSelectArg) {
    setSelectedStart(selectInfo.start);
    setSelectedEnd(selectInfo.end);
    setIsDialogOpen(true); 
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    setSelectedStart(null);
    setSelectedEnd(null);
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
         setCurrentEvents((prev) => [...prev, newEvent]);
      }

       handleDialogClose();
    } catch (error) {
      console.error('Error saving event:', error);
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
          initialEvents={currentEvents}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>

      {}
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
