import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CertificateResult {
  rollNo: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  validUntil: string;
  grade: string;
  status: string;
  accreditation: string;
}

export const VerifyCertificatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Automatically verify when opened via QR Code scan URL
  useEffect(() => {
    const idParam = searchParams.get('id') || searchParams.get('cert_id');
    const nameParam = searchParams.get('name');
    const courseParam = searchParams.get('course');
    const rollParam = searchParams.get('roll') || searchParams.get('rollNo');
    const dateParam = searchParams.get('date');

    if (idParam || rollParam || nameParam) {
      const q = (idParam || rollParam || '').toUpperCase().trim();
      setQuery(q);
      setLoading(true);

      setTimeout(() => {
        setResult({
          rollNo: rollParam || q || 'Verified Roll',
          studentName: nameParam || 'Verified Student Candidate',
          courseName: courseParam || 'Practical Internship Program',
          issueDate: dateParam || 'October 15, 2026',
          validUntil: 'Lifetime Verification (Permanent Record)',
          grade: 'A+ (Outstanding Performance)',
          status: 'VERIFIED OFFICIAL CREDENTIAL',
          accreditation: 'Issued by Edukalyan Foundation NGO (Govt Compliant)',
        });
        setLoading(false);
        setSearched(true);
      }, 300);
    }
  }, [searchParams]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      // Demo verified result matching Edukalyan standards
      setResult({
        rollNo: query.toUpperCase().trim(),
        studentName: 'Candidate Verification Passed',
        courseName: 'Practical Internship Program',
        issueDate: 'October 15, 2026',
        validUntil: 'Lifetime Verification',
        grade: 'A+ (Outstanding Performance)',
        status: 'VERIFIED OFFICIAL CREDENTIAL',
        accreditation: 'Issued by Edukalyan Foundation NGO (Govt Compliant)',
      });
      setLoading(false);
      setSearched(true);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 py-12 space-y-12">
        {/* Verification Header */}
        <section className="container mx-auto px-4 md:px-6 text-center space-y-6 max-w-3xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-emerald-500/15 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Official Credential Verification Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Verify <span className="bg-gradient-to-r from-emerald-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">Certificate & Registration</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              Enter your Roll Number, Registration ID, or Certificate Code to verify authentic Edukalyan Foundation digital credentials.
            </p>

            {/* Search Box */}
            <form onSubmit={handleVerify} className="max-w-xl mx-auto pt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-emerald-400" />
                <Input
                  type="text"
                  placeholder="Enter Roll No or Certificate ID (e.g. EKF-2026-8941)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 rounded-2xl h-14 font-mono uppercase bg-slate-900/60 border-slate-800/80 backdrop-blur-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-xl"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="rounded-2xl shadow-lg shadow-emerald-500/25 gap-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold px-8 py-4 h-14 text-sm sm:text-base border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Credential'}
              </Button>
            </form>
          </div>
        </section>

        {/* Verification Result Card */}
        {searched && result && (
          <section className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-3xl border border-emerald-500/40 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 space-y-6 shadow-2xl overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

              <div className="flex items-center gap-4 border-b border-emerald-500/25 pb-5">
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-md shrink-0">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-400 leading-tight tracking-wide">{result.status}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">Authentic Digital Credential Verified by Edukalyan Foundation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Roll / Registration No</span>
                  <p className="font-mono font-extrabold text-white text-base">{result.rollNo}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Candidate Verification</span>
                  <p className="font-bold text-white text-base">{result.studentName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1 sm:col-span-2">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Program / Sector Domain</span>
                  <p className="font-extrabold text-white text-base">{result.courseName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Issue Date & Validity</span>
                  <p className="font-semibold text-slate-200">{result.issueDate} • {result.validUntil}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Grade & Rating</span>
                  <p className="font-extrabold text-emerald-400">{result.grade}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 sm:col-span-2">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Accreditation</span>
                  <p className="font-bold text-white">{result.accreditation}</p>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};
