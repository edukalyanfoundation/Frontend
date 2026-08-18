import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, Button } from '@edukalyan/ui';
import {
  GraduationCap,
  Search,
  Eye,
  Download,
  X,
  User,
  Building2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ugcRegistrationService } from '@/services/ugcRegistrationService';
import { Database } from '@edukalyan/types';

type UgcRow = Database['public']['Tables']['ugc_registrations']['Row'];

export const AdminUgcRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<UgcRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<UgcRow | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    const data = await ugcRegistrationService.getAllRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (candidate: UgcRow) => {
    if (window.confirm(`Are you sure you want to permanently delete registration for "${candidate.full_name}" from database?`)) {
      setDeletingId(candidate.id);
      await ugcRegistrationService.deleteRegistration(candidate.id);
      setRegistrations((prev) => prev.filter((r) => r.id !== candidate.id));
      if (selectedCandidate?.id === candidate.id) {
        setSelectedCandidate(null);
      }
      setDeletingId(null);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filter registrations by search term and Date Range
  const filteredRegistrations = registrations.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.mobile_number.includes(searchTerm);

    let matchesDate = true;
    if (startDate || endDate) {
      const itemMs = new Date(item.created_at).getTime();
      if (startDate) {
        const startMs = new Date(startDate).setHours(0, 0, 0, 0);
        if (itemMs < startMs) matchesDate = false;
      }
      if (endDate) {
        const endMs = new Date(endDate).setHours(23, 59, 59, 999);
        if (itemMs > endMs) matchesDate = false;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Calculate Total Registration Metric
  const totalCount = registrations.length;

  // Export filtered date-range registrations to CSV spreadsheet file
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;

    const headers = [
      'Full Name',
      'Father Name',
      'Mother Name',
      'DOB',
      'Gender',
      'Mobile Number',
      'Email ID',
      'University Name',
      'College Name',
      'Degree',
      'Department',
      'Semester',
      'Academic Session',
      'University Roll No',
      'University Reg No',
      'Major Subject',
      'Internship Sector',
      'Registration Date',
    ];

    const rows = filteredRegistrations.map((item) => [
      `"${item.full_name || ''}"`,
      `"${item.father_name || ''}"`,
      `"${item.mother_name || ''}"`,
      `"${item.dob || ''}"`,
      `"${item.gender || ''}"`,
      `"${item.mobile_number || ''}"`,
      `"${item.email || ''}"`,
      `"${item.university_name || ''}"`,
      `"${item.college_name || ''}"`,
      `"${item.degree || ''}"`,
      `"${item.department || ''}"`,
      `"${item.semester || ''}"`,
      `"${item.academic_session || ''}"`,
      `"${item.university_roll_no || ''}"`,
      `"${item.university_reg_no || ''}"`,
      `"${item.major_subject || ''}"`,
      `"${item.internship_sector || ''}"`,
      `"${new Date(item.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const rangeLabel = startDate && endDate ? `${startDate}_to_${endDate}` : 'All_Dates';
    link.setAttribute('download', `Edukalyan_Registrations_${rangeLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Student Registration <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-xs text-slate-300">
                  Inspect student details, filter by date range, and export CSV reports
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleExportCSV}
            className="rounded-2xl text-xs font-extrabold gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 py-2.5 px-4"
          >
            <Download className="h-4 w-4" /> Download CSV ({filteredRegistrations.length})
          </Button>
        </div>
      </div>

      {/* Metrics Summary Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-indigo-950/30 p-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Registered Students in Database</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400 font-mono">
          Showing: <span className="text-indigo-400 font-bold">{filteredRegistrations.length}</span> records
        </div>
      </div>

      {/* Date Range & Search Toolbar */}
      <Card glass className="p-4 border-slate-800 bg-slate-900/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, email, or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 pl-9 pr-8 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Date Range Pickers */}
          <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" /> From:
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
              <span className="text-xs font-bold text-slate-400 shrink-0">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-2.5 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-500/25 shrink-0"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Clean User Registrations Table */}
      <Card glass className="p-0 overflow-hidden border-slate-800 bg-slate-900/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-extrabold text-slate-300 uppercase tracking-wider">
                <th className="p-4">Student Name</th>
                <th className="p-4">Email ID</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading student registration records...
                    </div>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-500" />
                      No student registrations found for selected search or date range.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div className="text-sm font-extrabold text-slate-100">{item.full_name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{item.university_name}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-200">
                        {item.email || <span className="text-slate-500">N/A</span>}
                      </td>
                      <td className="p-4 font-semibold text-slate-200">{item.mobile_number}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-300">
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-[11px] font-bold gap-1.5 border-slate-700 bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30"
                            onClick={() => setSelectedCandidate(item)}
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingId === item.id}
                            className="rounded-xl text-[11px] font-bold gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> {deletingId === item.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Candidate Details Modal (Rendered via React Portal with high z-index to overlay Navbar and Footer) */}
      {selectedCandidate &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] relative z-[100000]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-extrabold text-lg flex items-center justify-center">
                    {selectedCandidate.full_name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedCandidate.full_name}</h3>
                    <p className="text-xs text-slate-400">Student Registration Application Details</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Personal Information */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <div>
                      <span className="text-slate-400">Full Name:</span> <strong className="text-white block">{selectedCandidate.full_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Father Name:</span> <strong className="text-white block">{selectedCandidate.father_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Mother Name:</span> <strong className="text-white block">{selectedCandidate.mother_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Date of Birth:</span> <strong className="text-white block">{selectedCandidate.dob}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Gender:</span> <strong className="text-white block">{selectedCandidate.gender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Mobile Number:</span>
                      <strong className="text-white flex items-center gap-1 mt-0.5">
                        {selectedCandidate.mobile_number}
                        <button
                          onClick={() => handleCopyText(selectedCandidate.mobile_number, 'mobile')}
                          className="text-indigo-400 hover:text-indigo-300 ml-1"
                        >
                          {copiedField === 'mobile' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Email Address:</span>
                      <strong className="text-white flex items-center gap-1 mt-0.5">
                        {selectedCandidate.email || 'N/A'}
                        {selectedCandidate.email && (
                          <button
                            onClick={() => handleCopyText(selectedCandidate.email!, 'email')}
                            className="text-indigo-400 hover:text-indigo-300 ml-1"
                          >
                            {copiedField === 'email' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Academic Credentials */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> Academic & Course Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <div className="col-span-2">
                      <span className="text-slate-400">University:</span> <strong className="text-white block">{selectedCandidate.university_name}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">College Name:</span> <strong className="text-white block">{selectedCandidate.college_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Degree Course:</span> <strong className="text-white block">{selectedCandidate.degree}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Department:</span> <strong className="text-white block">{selectedCandidate.department}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Semester:</span> <strong className="text-white block">{selectedCandidate.semester}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Academic Session:</span> <strong className="text-white block">{selectedCandidate.academic_session}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Roll No:</span>
                      <strong className="font-mono text-indigo-300 flex items-center gap-1 mt-0.5">
                        {selectedCandidate.university_roll_no}
                        <button
                          onClick={() => handleCopyText(selectedCandidate.university_roll_no, 'roll')}
                          className="text-indigo-400 hover:text-indigo-300 ml-1"
                        >
                          {copiedField === 'roll' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Reg No:</span> <strong className="font-mono text-white block">{selectedCandidate.university_reg_no}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Major Subject:</span> <strong className="text-white block">{selectedCandidate.major_subject}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Internship Sector:</span> <strong className="text-indigo-400 block font-bold">{selectedCandidate.internship_sector}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  disabled={deletingId === selectedCandidate.id}
                  onClick={() => handleDelete(selectedCandidate)}
                  className="rounded-2xl text-xs font-bold gap-1.5 border-rose-500/40 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                >
                  <Trash2 className="h-4 w-4" /> {deletingId === selectedCandidate.id ? 'Deleting...' : 'Delete Student Record'}
                </Button>
                <Button onClick={() => setSelectedCandidate(null)} className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white">
                  Close Details
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
