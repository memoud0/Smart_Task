import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  selectedStart: Date | null;
  selectedEnd: Date | null;
}

export default function EventDialog({
  open,
  onClose,
  onSave,
  selectedStart,
  selectedEnd
}: EventDialogProps) {
  const [startDate, setStartDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (selectedStart) {
      setStartDate(selectedStart.toISOString().slice(0, 10));
      setStartTime(selectedStart.toTimeString().slice(0, 5)); // HH:MM
    }
    if (selectedEnd) {
      setEndDate(selectedEnd.toISOString().slice(0, 10));
      setEndTime(selectedEnd.toTimeString().slice(0, 5));
    }
  }, [selectedStart, selectedEnd]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // You could validate fields here.
    // Prepare the data to send back
    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('startTime', startTime);
    formData.append('endDate', endDate);
    formData.append('endTime', endTime);
    if (file) {
      formData.append('file', file);
    }

    onSave(formData);
  };

  const handlePlanForMe = () => {
    alert("Plan for Me clicked!");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create or Edit Event</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {/* Start Date and Time */}
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* End Date and Time */}
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Upload File */}
        <Button variant="outlined" component="label">
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {/* Plan for me */}
        <Button variant="contained" color="primary" onClick={handlePlanForMe}>
          Plan for me
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
