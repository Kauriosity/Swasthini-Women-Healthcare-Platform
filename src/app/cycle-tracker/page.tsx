'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Calendar as CalendarIcon, Droplets } from 'lucide-react';

export default function CycleTrackerPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cycle' | 'symptom'>('cycle');

  // Forms states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const [sympDate, setSympDate] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('1');

  const fetchCycles = async () => {
    try {
      const res = await axiosInstance.get('/cycles');
      setCycles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleLogCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/cycles', { startDate, endDate, notes });
      setStartDate(''); setEndDate(''); setNotes('');
      fetchCycles();
      alert('Cycle logged successfully!');
    } catch (err) {
      alert('Failed to log cycle');
    }
  };

  const handleLogSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSymptoms = symptoms.split(',').map(s => s.trim()).filter(s => s);
      await axiosInstance.post('/cycles/symptoms', { 
        date: sympDate, 
        symptoms: parsedSymptoms, 
        severity: parseInt(severity) 
      });
      setSympDate(''); setSymptoms(''); setSeverity('1');
      alert('Symptoms logged successfully!');
    } catch (err) {
      alert('Failed to log symptoms');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-secondary w-full max-w-xs mb-6">
        <button 
          onClick={() => setActiveTab('cycle')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cycle' ? 'bg-primary text-white shadow' : 'text-foreground hover:bg-secondary'}`}
        >
          Cycles
        </button>
        <button 
          onClick={() => setActiveTab('symptom')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'symptom' ? 'bg-primary text-white shadow' : 'text-foreground hover:bg-secondary'}`}
        >
          Symptoms
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="md:col-span-1">
          {activeTab === 'cycle' ? (
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-primary" /> Log Cycle</h2>
              <form onSubmit={handleLogCycle} className="space-y-4">
                <Input label="Start Date" type="date" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} required />
                <Input label="End Date" type="date" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground ml-1">Notes (Optional)</label>
                  <textarea 
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none h-24"
                    placeholder="Flow intensity, feeling fine..."
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Save Cycle</Button>
              </form>
            </Card>
          ) : (
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-primary" /> Log Symptoms</h2>
              <form onSubmit={handleLogSymptoms} className="space-y-4">
                <Input label="Date" type="date" value={sympDate} onChange={(e: any) => setSympDate(e.target.value)} required />
                <Input label="Symptoms (comma separated)" type="text" value={symptoms} onChange={(e: any) => setSymptoms(e.target.value)} placeholder="Cramps, Fatigue, Headache" required />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground ml-1">Overall Severity (1-5)</label>
                  <select 
                    value={severity} onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-2 border border-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <Button type="submit" className="w-full">Log Symptoms</Button>
              </form>
            </Card>
          )}
        </div>

        {/* History Section */}
        <div className="md:col-span-2 space-y-4">
           <h2 className="text-2xl font-bold text-foreground mb-4">Cycle History</h2>
           {loading ? <p>Loading...</p> : cycles.length === 0 ? (
             <Card className="text-center py-12 bg-secondary/30"><p className="text-foreground/60">No cycles logged yet. Start tracking today!</p></Card>
           ) : (
             <div className="space-y-4">
               {cycles.map((c) => (
                 <Card key={c.id} className="flex justify-between items-center transition-all hover:shadow-md">
                   <div>
                     <p className="font-bold text-lg text-foreground">
                       {new Date(c.startDate).toLocaleDateString()} {c.endDate && ` - ${new Date(c.endDate).toLocaleDateString()}`}
                     </p>
                     <p className="text-sm text-foreground/70">{c.notes || 'No notes added.'}</p>
                   </div>
                   <div className="bg-secondary rounded-full p-3 text-primary font-medium text-sm">
                     {c.endDate ? `${Math.round((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 3600 * 24))} Days` : 'Ongoing'}
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
