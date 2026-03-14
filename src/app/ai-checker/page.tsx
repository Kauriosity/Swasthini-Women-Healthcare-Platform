'use client';

import React, { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Bot, User, AlertTriangle } from 'lucide-react';

export default function AICheckerPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI Symptom Checker. Please describe your symptoms and I will help evaluate the risk level. NOTE: I am not a substitute for professional medical advice.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Mocking an AI response for the assignment
    setTimeout(() => {
       const lowerInput = input.toLowerCase();
       let aiResponse = "Based on your symptoms, it's difficult to pinpoint an exact condition. Please ensure you stay hydrated and rest. If symptoms persist or worsen, consult a doctor immediately.";
       
       if (lowerInput.includes('cramp') || lowerInput.includes('period') || lowerInput.includes('bleeding')) {
         aiResponse = "These symptoms align with typical menstrual experiences. However, if the cramps are extremely severe and don't respond to standard pain relief, it might be a sign of endometriosis or fibroids. Consider logging these in your cycle tracker and consulting a gynecologist if they interfere with daily life.";
       } else if (lowerInput.includes('headache') && lowerInput.includes('nausea')) {
         aiResponse = "Headaches combined with nausea can be indicators of a migraine or tension, sometimes related to hormonal changes. If you experience aura or severe sensitivity to light, a doctor's evaluation is recommended.";
       }

       setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">AI Symptom Checker</h1>
        <p className="text-foreground/70 flex items-center gap-2 mt-1">
          <AlertTriangle className="w-4 h-4 text-orange-400" /> Always consult a real doctor for medical emergencies.
        </p>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden shadow-md border border-accent relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Bot className="w-5 h-5 text-primary" /></div>}
              
              <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-secondary/50 text-foreground rounded-tl-sm'}`}>
                {msg.content}
              </div>

              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-foreground/60" /></div>}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-secondary">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you're feeling..."
              className="flex-1 px-4 py-3 border border-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="px-6">Send</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
