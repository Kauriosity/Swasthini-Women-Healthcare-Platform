'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Plus, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/health');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="p-8 text-center text-foreground/60">Loading your health data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
          <p className="text-foreground/70 mt-1">Overview of your cycle patterns and symptom trends.</p>
        </div>
        <Link href="/cycle-tracker">
          <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Log Cycle / Symptoms</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Length Analytics */}
        <Card className="flex flex-col h-96">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Cycle Length Trends
          </h2>
          {data?.cycleChartData && data.cycleChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.cycleChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="length" stroke="#ffb6c1" strokeWidth={3} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#fce4ec" strokeDasharray="5 5" />
                <XAxis dataKey="startMonth" stroke="#8884d8" />
                <YAxis stroke="#8884d8" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex-1 flex items-center justify-center text-foreground/50 text-sm">Not enough cycle data. Log your cycles to see trends.</div>
          )}
        </Card>

        {/* Symptoms Analytics */}
        <Card className="flex flex-col h-96">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <FileText className="w-5 h-5 text-primary" /> Most Expected Symptoms
          </h2>
          {data?.symptomChartData?.symptoms && data.symptomChartData.symptoms.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.symptomChartData.symptoms} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fce4ec"/>
                <XAxis type="number" stroke="#8884d8"/>
                <YAxis dataKey="name" type="category" stroke="#8884d8" width={80}/>
                <Tooltip cursor={{fill: 'transparent'}}/>
                <Bar dataKey="count" fill="#f0a0ac" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/50 text-sm">No symptoms logged recently.</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <h2 className="text-xl font-bold mb-4">AI Symptom Checker</h2>
           <p className="text-sm text-foreground/80 mb-4">Experiencing unusual symptoms? Get a quick AI analysis with our secure checker interface.</p>
           <Link href="/ai-checker">
             <Button variant="outline" className="w-full flex justify-center items-center gap-2">Start Assessment <ArrowRight className="w-4 h-4"/></Button>
           </Link>
        </Card>
        <Card>
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">Emergency Contacts</h2>
           <p className="text-sm text-foreground/80 mb-4">Need immediate help? Ensure your emergency contacts are up to date and can be reached from anywhere.</p>
           <Link href="/emergency">
             <Button variant="secondary" className="w-full">Manage Contacts</Button>
           </Link>
        </Card>
      </div>
    </div>
  );
}
