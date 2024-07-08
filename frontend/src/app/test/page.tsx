"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookie from 'universal-cookie';

const cookies = new Cookie();

const Test: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      console.log('Registering user:', { username, email, password });
      const response = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log('Register response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        await handleLogin(username, password);
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('Logging in with:', { username, password });
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        cookies.set('token', data.token, { path: '/' });
        router.push('/');
      } else {
        console.error('Failed to login user');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(username, password);
    } else {
      handleRegister();
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isLogin && (
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Go to Register' : 'Go to Login'}
      </Button>
    </div>
  );
};

export default Test;
