'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Stethoscope, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [docRes, appRes] = await Promise.all([
        axiosInstance.get('/appointments/doctors'),
        axiosInstance.get('/appointments')
      ]);
      setDoctors(docRes.data);
      setAppointments(appRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (doctorId: number, date: string, timeSlotId: number) => {
    try {
      await axiosInstance.post('/appointments', { doctorId, date, timeSlotId });
      alert('Appointment booked successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Doctor Appointments</h1>
        <p className="text-foreground/70">Consult with specialists from the comfort of your home.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Stethoscope className="text-primary w-5 h-5"/> Available Doctors</h2>
          {loading ? <p>Loading...</p> : doctors.length === 0 ? (
             <p className="text-foreground/60">No doctors available right now.</p>
          ) : (
             <div className="grid sm:grid-cols-2 gap-4">
               {doctors.map(doc => (
                 <Card key={doc.id} className="flex flex-col">
                   <h3 className="text-lg font-bold">{doc.name}</h3>
                   <p className="text-primary text-sm font-medium">{doc.specialization}</p>
                   <p className="text-foreground/60 text-sm mt-2 flex-grow">{doc.bio || `${doc.experience} years experience`}</p>
                   <div className="mt-4 pt-4 border-t border-secondary flex justify-between items-center">
                     <span className="font-bold">${doc.fees}</span>
                     {doc.timeSlots && doc.timeSlots.length > 0 ? (
                       <Button onClick={() => handleBook(doc.id, doc.timeSlots[0].startTime, doc.timeSlots[0].id)} className="text-sm px-3 py-1.5">
                         Book Slot
                       </Button>
                     ) : (
                       <span className="text-sm text-red-400">No Slots</span>
                     )}
                   </div>
                 </Card>
               ))}
             </div>
          )}
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-primary w-5 h-5"/> Your Appointments</h2>
           {loading ? <p>Loading...</p> : appointments.length === 0 ? (
             <Card className="text-center py-8"><p className="text-foreground/50">No upcoming appointments</p></Card>
           ) : (
             <div className="space-y-4">
               {appointments.map(app => (
                 <Card key={app.id} className="hover:shadow-md transition-shadow border-l-4 border-primary">
                    <p className="font-bold">{app.doctor?.name || 'Doctor'}</p>
                    <p className="text-sm text-foreground/70">{new Date(app.date).toLocaleString()}</p>
                    <div className="mt-2 inline-block px-2 py-1 bg-secondary text-primary text-xs font-bold rounded-full">
                      {app.status}
                    </div>
                 </Card>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
