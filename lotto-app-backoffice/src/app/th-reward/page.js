"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import ThRewardComponent from "../components/th-reward-component"
import '../../styles/th-reward-page.css'; // 1. Import the CSS file


export default function ThCalendarPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <ThRewardComponent/>
         
      </main>

     
      </div>
  );
}
