'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Calendar, Stethoscope, MessageCircle, Activity, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { title: 'Period Tracker', icon: <Calendar className="w-8 h-8 text-primary" />, desc: 'Track your cycles and symptoms with precision.' },
    { title: 'Consult Doctors', icon: <Stethoscope className="w-8 h-8 text-primary" />, desc: 'Book appointments with top healthcare professionals.' },
    { title: 'Community Forum', icon: <MessageCircle className="w-8 h-8 text-primary" />, desc: 'Share your thoughts anonymously and get support.' },
    { title: 'Health Analytics', icon: <Activity className="w-8 h-8 text-primary" />, desc: 'Visualize your cycle and symptom patterns.' },
    { title: 'AI Symptom Checker', icon: <Activity className="w-8 h-8 text-primary" />, desc: 'Instant AI-driven symptom analysis.' },
    { title: 'Emergency SOS', icon: <ShieldAlert className="w-8 h-8 text-primary" />, desc: 'Quick access to emergency contacts.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 text-center bg-gradient-to-br from-white to-secondary/30">
      <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
        Welcome to <span className="text-primary">Swasthin</span>
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10">
        A comprehensive and caring health companion designed specifically for women. Manage health information, track menstrual cycles, consult doctors, and find community support.
      </p>
      
      <div className="flex gap-4 mb-16">
        <Link href="/register">
          <Button className="text-lg px-8 py-3">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="text-lg px-8 py-3 bg-white">Login</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((ft, idx) => (
          <Card key={idx} className="flex flex-col items-center hover:-translate-y-1 transition-transform duration-200 cursor-default">
            <div className="p-4 bg-secondary rounded-full mb-4">
              {ft.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{ft.title}</h3>
            <p className="text-sm text-foreground/70">{ft.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
