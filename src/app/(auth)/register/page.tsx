'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      if (res.data.token) {
        Cookies.set('token', res.data.token, { expires: 7 }); // 7 days
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Create an Account</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            type="text" 
            value={name} 
            onChange={(e: any) => setName(e.target.value)} 
            required 
            placeholder="Jane Doe"
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            required 
            placeholder="you@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/70 mt-4">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
