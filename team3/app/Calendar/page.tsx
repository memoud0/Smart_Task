"use client";
// import Image from "next/image";
import DemoApp from "./demoApp";
// import Calendar from "./components/calendar";
import { SessionProvider} from "next-auth/react";

export default function Home() {
  
  return (
    <SessionProvider>
      <DemoApp />
      {/* <Calendar /> */}
    </SessionProvider>
      
  );
}
