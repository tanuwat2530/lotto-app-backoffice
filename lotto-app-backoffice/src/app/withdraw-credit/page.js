"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import WithdrawCredit from "../../components/withdraw-credit-component"
import '../../styles/withdraw-credit-style.css'; // Import the CSS file
export default function WithdrawCreditPage() {
  const router = useRouter();
  return (
    
      <div>
    
      <main>
          <WithdrawCredit/>
         
      </main>

     
      </div>
  );
}
