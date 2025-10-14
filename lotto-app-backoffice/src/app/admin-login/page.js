"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from 'react';
import LoginComponent from "../../components/login-component"
import '../../styles/login-page-style.css'; // Import the CSS file

export default function LoginPage() {
const router = useRouter();

  // This function is passed down to the LoginPage component
  const handleLoginSuccess = () => {
    // 👈 Redirect the user to the /calendar route
    router.push('/th-calendar');
  };

  return (
    <LoginComponent onLoginSuccess={handleLoginSuccess} />
  );
}
