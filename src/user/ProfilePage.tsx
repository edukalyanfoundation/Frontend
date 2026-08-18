import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  User,
  Save,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  FileCheck,
  Download,
  ExternalLink,
  Clock,
  Sparkles,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { isAuthenticated, profile, updateProfileState, logout } = useAuthStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile');

  const metadata = (profile?.metadata as Record<string, any>) || {};

  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        phone,
      };

      updateProfileState(updatedData);
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your student details have been saved.' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || profile?.email || 'Student Candidate';
  const sectorStream = metadata.internshipSector || 'Web Development';

  // Candidate's Enrolled Courses & Certificates Sub-page Data
  const enrolledCourses = [
    {
      id: 'crs-1',
      title: `${sectorStream} & Mandatory Internship`,
      sector: sectorStream,
      duration: '8 Weeks',
      completionDate: 'August 25, 2026',
      status: 'Active / In Progress',
      certificateNo: `EDK-2026-${Math.floor(Math.random() * 89999 + 10000)}`,
      instructor: 'Edukalyan Academic Council',
      progress: 65,
    },
    {
      id: 'crs-2',
      title: 'Skill Development & Professional Ethics',
      sector: 'Skill & Personality',
      duration: '4 Weeks',
      completionDate: 'July 10, 2026',
      status: 'Completed',
      certificateNo: `EDK-2026-${Math.floor(Math.random() * 89999 + 10000)}`,
      instructor: 'Edukalyan Foundation Faculty',
      progress: 100,
    },
  ];

  const handleDownloadCertificate = (certNo: string, courseTitle: string) => {
    addToast({
      type: 'success',
      title: 'Downloading Certificate',
      message: `Generating verified PDF certificate #${certNo} for ${courseTitle}`,
    });

    const certText = `
============================================================
              EDUKALYAN FOUNDATION (NGO)
         PRACTICAL INTERNSHIP CERTIFICATE
============================================================

Certificate Number: ${certNo}
Student Name:       ${displayName}
University Roll No: ${metadata.universityRollNo || 'N/A'}
University Reg No:  ${metadata.universityRegNo || 'N/A'}
University:         ${metadata.universityName || 'Recognized University'}
College:            ${metadata.collegeName || 'Affiliated College'}

Course Title:       ${courseTitle}
Internship Sector:  ${sectorStream}
Issue Date:         ${new Date().toLocaleDateString()}
Verification Status: VERIFIED & VALID

This is to certify that ${displayName} has successfully completed
the mandatory internship program organized by Edukalyan Foundation.

Verified online at: https://edukalyan.org/verify-certificate
============================================================
    `;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Edukalyan_Certificate_${certNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col justify-between relative z-10 overflow-hidden">
      <div>
        {/* Main Website Navbar */}
        <PublicNavbar />

        {/* Hero Section Banner */}
        <div className="relative py-10 sm:py-14 border-b border-slate-800/80">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="group relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl space-y-6 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl border-2 border-indigo-400/40 shadow-xl shadow-indigo-500/30 shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-extrabold text-emerald-400 shadow-xs">
                      <CheckCircle2 className="h-4 w-4" /> Verified Student Candidate
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                      {displayName}
                    </h1>
                    <p className="text-xs sm:text-sm text-indigo-300 font-semibold flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span>{profile?.email || 'Student Email'}</span>
                      <span>•</span>
                      <span className="text-slate-300">{metadata.universityName || 'Registered University'}</span>
                    </p>
                  </div>
                </div>

                {/* Sub-page Navigation Tabs & Header Sign Out */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800/80 shadow-inner">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                        activeTab === 'profile'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      Application Details
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'courses'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" /> Courses & Certificates
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/', { replace: true });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 font-extrabold text-xs sm:text-sm border border-rose-500/30 transition-all duration-200 shadow-md hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <main className="container mx-auto px-4 py-10 max-w-5xl relative z-10 pb-16">
          {activeTab === 'profile' ? (
            /* Tab 1: Form Application Details */
            <div className="space-y-8">
              {/* Academic Credentials */}
              <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5 uppercase tracking-wider">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    Academic Credentials
                  </h3>
                  <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-xs">
                    Form Submitted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> University Name
                    </span>
                    <p className="font-extrabold text-white text-sm sm:text-base leading-snug">{metadata.universityName || 'Not Specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> College Name
                    </span>
                    <p className="font-extrabold text-white text-sm sm:text-base leading-snug">{metadata.collegeName || 'Not Specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" /> Degree & Department
                    </span>
                    <p className="font-extrabold text-white text-sm sm:text-base leading-snug">
                      {metadata.degree ? `${metadata.degree} (${metadata.department || ''})` : 'Not Specified'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                    <span className="text-indigo-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-indigo-400" /> Internship Sector Stream
                    </span>
                    <p className="font-black text-indigo-300 text-sm sm:text-base leading-snug">{metadata.internshipSector || 'Not Specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px]">Semester & Session</span>
                    <p className="font-bold text-white text-sm">{metadata.semester || 'N/A'} • {metadata.academicSession || 'N/A'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px]">Major Subject</span>
                    <p className="font-bold text-white text-sm">{metadata.majorSubject || 'Not Specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px]">University Roll Number</span>
                    <p className="font-mono font-extrabold text-white text-base">{metadata.universityRollNo || 'Not Specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                    <span className="text-indigo-400 font-bold uppercase text-[11px]">University Registration Number</span>
                    <p className="font-mono font-extrabold text-white text-base">{metadata.universityRegNo || 'Not Specified'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <form onSubmit={handleSave}>
                <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="border-b border-slate-800/80 pb-4">
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5 uppercase tracking-wider">
                      <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <User className="h-5 w-5" />
                      </div>
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">First Name</label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="rounded-2xl bg-slate-800/50 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-3 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Last Name</label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="rounded-2xl bg-slate-800/50 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Father's Name</span>
                      <p className="font-bold text-white text-sm">{metadata.fatherName || 'Not Specified'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Mother's Name</span>
                      <p className="font-bold text-white text-sm">{metadata.motherName || 'Not Specified'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Date of Birth & Gender</span>
                      <p className="font-bold text-white text-sm">{metadata.dob || 'N/A'} • {metadata.gender || 'Male'}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Mobile Number</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-2xl bg-slate-800/50 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Email Address (Registered)</label>
                    <Input
                      value={profile?.email || ''}
                      disabled
                      className="rounded-2xl bg-slate-900/80 border-slate-800 text-slate-400 py-3 text-sm font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl font-extrabold px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Profile Details'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Tab 2: Enrolled Courses & Certificates Sub-page */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                    <BookOpen className="h-7 w-7 text-indigo-400" /> My Courses & Verified Certificates
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
                    Track your course progress and view or download your verified certificates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl hover:border-indigo-500/40 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-extrabold text-indigo-300 shadow-xs">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> {course.sector}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">{course.title}</h3>
                        <p className="text-xs text-slate-300 flex items-center gap-3 font-semibold">
                          <span>Instructor: {course.instructor}</span>
                          <span>•</span>
                          <span>Duration: {course.duration}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs ${
                            course.status === 'Completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                    </div>

                    {/* Course Progress & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                        <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Completion Date
                        </span>
                        <p className="font-bold text-white text-sm">{course.completionDate}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                        <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                          <FileCheck className="h-3.5 w-3.5" /> Certificate Number
                        </span>
                        <p className="font-mono font-bold text-white text-sm">{course.certificateNo}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                        <span className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Course Progress
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-white">{course.progress}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                      <a
                        href="/verify-certificate"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Online Certificate Verification Portal
                      </a>

                      <Button
                        onClick={() => handleDownloadCertificate(course.certificateNo, course.title)}
                        className="rounded-2xl font-extrabold text-xs sm:text-sm gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 border-0 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Download className="h-4 w-4" /> View & Download Certificate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Main Website Footer */}
      <PublicFooter />
    </div>
  );
};
