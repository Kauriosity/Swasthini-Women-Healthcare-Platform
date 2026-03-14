'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Phone, AlertCircle } from 'lucide-react';

export default function EmergencyPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
         const res = await axiosInstance.get('/emergency');
         if (res.data && res.data.phone) {
           setName(res.data.name);
           setPhone(res.data.phone);
           setRelationship(res.data.relationship || '');
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/emergency', { name, phone, relationship });
      alert('Emergency contact saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save contact');
    }
  };

  const triggerSOS = () => {
    if (!phone) {
      alert('Please save an emergency contact first!');
      return;
    }
    // Dummy SOS trigger
    alert(`SOS ALERT SENT to ${name} (${phone})! They have been notified of your location.`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 flex justify-center items-center gap-2 mb-2">
           <AlertCircle className="w-8 h-8" /> Emergency SOS
        </h1>
        <p className="text-foreground/70">Save your trusted contact and press the SOS button to alert them immediately.</p>
      </div>

      <div className="flex justify-center p-8">
         <button 
           onClick={triggerSOS}
           className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center justify-center gap-2"
         >
           <AlertCircle className="w-12 h-12" />
           SOS
         </button>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           <Phone className="w-5 h-5 text-primary" /> Emergency Contact Details
        </h2>
        
        {loading ? <p>Loading...</p> : (
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Contact Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required placeholder="John Doe" />
            <Input label="Phone Number" type="tel" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} required placeholder="+1 234 567 8900" />
            <Input label="Relationship" value={relationship} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelationship(e.target.value)} placeholder="Brother, Friend..." />
            
            <Button type="submit" className="w-full">Save Contact</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
