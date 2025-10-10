"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import ThCalendarComponent from "../../components/th-calendar-component"
import '../../styles/th-calendar-page-style.css'; // Import the dedicated CSS file


export default function ThCalendarPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <ThCalendarComponent/>
         
      </main>

     
      </div>
  );
}
