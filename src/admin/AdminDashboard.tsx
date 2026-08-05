import React, { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { AdminUgcRegistrationsPage } from './AdminUgcRegistrationsPage';
import { AdminCoursesPage } from './AdminCoursesPage';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registrations' | 'courses'>('registrations');

  return (
    <div className="space-y-6">
      {/* Top Admin Sub-Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Student Registrations
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Courses & Sectors (CRUD)
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'registrations' ? <AdminUgcRegistrationsPage /> : <AdminCoursesPage />}
    </div>
  );
};
