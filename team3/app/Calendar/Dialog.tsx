import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { EventCreationFormInput } from '../types/FormTypes';
import { EventCreationFormSchema } from '../schema';
import { useForm } from "react-hook-form";

interface eventObject{
    title: string;
    description: string | null;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    attendees: string[];
    file: File | null;
    eventId: string | undefined;
    recurrence: string;
};


// Extend the interface to support editing existing events
interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: {
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location?: string;
    attendees?: string[];
    file?: File | null;
    eventId?: string; // Optional for editing existing events
    recurrence?: string;
  }) => void;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  existingEvent?: {
    id?: string;
    title?: string;
    description?: string;
    location?: string;
    start?: Date;
    end?: Date;
  } | null;
  onPlanForMe: (eventData: eventObject) => eventObject | null;
}

export default function EventDialog({
  open,
  onClose,
  onSave,
  onPlanForMe,
  selectedStart,
  selectedEnd,
  existingEvent
}: EventDialogProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [recurrence, setRecurrence] = React.useState('');

  const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
    } = useForm<EventCreationFormInput>({
      resolver: zodResolver(EventCreationFormSchema),
    });
    
  // Helper function to format date to local time string
  const formatTimeString = (date: Date | null): string => {
    if (!date) return '';
    return date.toTimeString().slice(0, 5);
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDateString = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().slice(0, 10);
  };

  // Reset form when dialog opens or changes
  React.useEffect(() => {
    // If editing an existing event
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDescription(existingEvent.description || '');
      setLocation(existingEvent.location || '');
      
      // Set start and end dates/times
      if (existingEvent.start) {
        const startDate = existingEvent.start instanceof Date 
          ? existingEvent.start 
          : new Date(existingEvent.start);
        setStartDate(formatDateString(startDate));
        setStartTime(formatTimeString(startDate));
      }
      if (existingEvent.end) {
        const endDate = existingEvent.end instanceof Date 
          ? existingEvent.end 
          : new Date(existingEvent.end);
        setEndDate(formatDateString(endDate));
        setEndTime(formatTimeString(endDate));
      }
    } 
    // If creating a new event from selected dates
    else if (selectedStart) {
      setStartDate(formatDateString(selectedStart));
      setStartTime(formatTimeString(selectedStart));
      
      if (selectedEnd) {
        setEndDate(formatDateString(selectedEnd));
        setEndTime(formatTimeString(selectedEnd));
      }
    }
  }, [selectedStart, selectedEnd, existingEvent, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

// In EventDialog.tsx
const handlePlanForMe = async () => {
  // Validate required fields
  if (!title) {
    alert('Please enter a title for your event');
    return;
  }

  if (!file) {
    alert('Please upload a file to use the "AI Event Planner" feature');
    return;
  }

  try {
    // Prepare the data to send
    const eventData = {
      title,
      description,
      location,
      file
    };

    // Call the parent component's onPlanForMe function and await its response
    const scheduledEvent = onPlanForMe(eventData);
    
    // If we got a valid response back, update all the form fields
    if (scheduledEvent) {
      setTitle(scheduledEvent.title);
      setDescription(scheduledEvent.description || description);
      setStartDate(scheduledEvent.startDate);
      setStartTime(scheduledEvent.startTime);
      setEndDate(scheduledEvent.endDate);
      setEndTime(scheduledEvent.endTime);
      setLocation(scheduledEvent.location || location);
      
      // Optionally show a success message
      alert('Event has been scheduled by AI!');
    }
  } catch (error) {
    console.error('Error in AI planning:', error);
    alert('Failed to plan your event. Please try again.');
  }
};


  const handleSave = () => {
    // Validate required fields
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate date and time
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (start >= end) {
      alert('End time must be after start time');
      return;
    }

    // Prepare the data to send back
    const eventData = {
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      attendees: attendees ? attendees.split(',').map(a => a.trim()) : [],
      file,
      eventId: existingEvent?.id, // Pass existing event ID for updates
      recurrence
    };

    // Log the event data for debugging
    console.log('Saving event:', eventData);

    onSave(eventData);
    
    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setLocation('');
    setAttendees('');
    setFile(null);
    setRecurrence('');
  };

  // const handlePlanForMe = () => {
  //   // TODO: Implement AI-powered event planning
  //   // This could open a modal or trigger an API call to suggest event details
  //   alert("AI Event Planner coming soon!");
  // };

  const recurrenceOptions = [
    { value: '', label: 'No Repeat' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {existingEvent ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {/* Title */}
        <TextField
          fullWidth
          label="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          error={errors.title}
          helperText={errors.title ? errors.title.message : ''}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Start Date and Time */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!startDate}
          />
          <TextField
            fullWidth
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!startTime}
          />
        </div>

        {/* End Date and Time */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!endDate}
          />
          <TextField
            fullWidth
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!endTime}
          />
        </div>

        {/* Location */}
        <TextField
          fullWidth
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />



        {/* Recurrence */}
        <FormControl fullWidth>
          <InputLabel>Recurrence</InputLabel>
          <Select
            value={recurrence}
            label="Recurrence"
            onChange={(e) => setRecurrence(e.target.value)}
          >
            {recurrenceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* File Upload */}
        <Button 
          fullWidth 
          variant="outlined" 
          component="label"
        >
          {file ? `${file.name} (Change)` : 'Upload Attachment'}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {/* Plan for me Button */}
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          onClick={() => onPlanForMe()}
        >
          AI Event Planner
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          color="primary"
        >
          {existingEvent ? 'Update Event' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
}