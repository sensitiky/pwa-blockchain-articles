"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/pages/api/createsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User logged in:', data.user);
        setUser(data.user);
      } else {
        console.error('Failed to login user');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  return (
    <div>
      <nav>
        <ul>{user ? `Logged in as ${user.username}` : 'Not logged in'}</ul>
        <Link href='/test'><Button onClick={handleLogin}className="rounded-full">Start new campaing</Button></Link>
      </nav>
    </div>
  );
}