"use client";
// import Image from "next/image";
import DemoApp from "./demoApp";
// import Calendar from "./components/calendar";
import { SessionProvider} from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import AssignmentView from "./AssignmentView";
import { SetStateAction, useState } from "react";
import CalendarPage from "./AssignmentView";

export default function Home() {
  const [currentView, setCurrentView] = useState('Calendar');

  const handleViewChange = (value: SetStateAction<string>) => {
    setCurrentView(value);
  };

  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex justify-end">
          <Select onValueChange={handleViewChange} value={currentView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assignment">Assignment View</SelectItem>
              <SelectItem value="Calendar">Calendar View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <main className="flex-1">
          {currentView === 'Calendar' && (
            <div style={{ width: '60%', margin: 'auto' }}>
              <DemoApp />
            </div>
          )}
          
          {currentView === 'Assignment' && (
            <CalendarPage/>
          )}
        </main>
      </div>
    </SessionProvider>
  );
}