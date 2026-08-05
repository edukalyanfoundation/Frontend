import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  Inbox,
  Filter,
} from 'lucide-react';
import { inquiryService, Inquiry } from '@/services/inquiryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    const data = await inquiryService.getInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'replied') => {
    await inquiryService.updateStatus(id, status);
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    await inquiryService.deleteInquiry(id);
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInquiries = inquiries.length;
  const unreadCount = inquiries.filter((i) => i.status === 'unread').length;
  const repliedCount = inquiries.filter((i) => i.status === 'replied').length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Student Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View, manage, and respond to messages submitted via the public portal contact form.
          </p>
        </div>

        <Button
          onClick={fetchInquiries}
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 text-xs font-bold shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Messages
        </Button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Inquiries</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalInquiries}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Inbox className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Unread Messages</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{unreadCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Replied Inquiries</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{repliedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs rounded-xl h-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 font-semibold text-slate-700 dark:text-slate-200 outline-hidden w-full sm:w-auto"
          >
            <option value="all">All Statuses ({totalInquiries})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
            <option value="replied">Replied ({repliedCount})</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading inquiries from database...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
            <div className="font-bold">No Messages Found</div>
            <p className="text-[11px] text-slate-400">Submitted contact messages will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Sender Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Message Snippet</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {item.full_name}
                    </td>
                    <td className="p-4 font-mono text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      {item.message}
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {item.status === 'unread' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                          Unread
                        </span>
                      )}
                      {item.status === 'read' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                          Read
                        </span>
                      )}
                      {item.status === 'replied' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                          Replied
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedInquiry(item);
                          if (item.status === 'unread') handleStatusChange(item.id, 'read');
                        }}
                        className="rounded-lg text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Inquiry Message Detail</h3>
                <p className="text-[11px] text-slate-400">ID: {selectedInquiry.id}</p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sender Name</div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedInquiry.full_name}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Email Address</div>
                <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{selectedInquiry.email}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Message Content</div>
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Received: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedInquiry.status === 'replied' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange(selectedInquiry.id, 'replied')}
                  className="rounded-lg text-xs"
                >
                  Mark as Replied
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedInquiry.id, 'unread')}
                  className="rounded-lg text-xs"
                >
                  Mark Unread
                </Button>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=RE: Edukalyan Foundation Inquiry&body=Dear ${encodeURIComponent(selectedInquiry.full_name)},\n\nThank you for reaching out to Edukalyan Foundation.`}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm" className="rounded-lg text-xs font-bold bg-indigo-600 text-white">
                  Reply via Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
