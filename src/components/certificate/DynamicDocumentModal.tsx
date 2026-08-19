import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  FileCheck,
  FileSignature,
  CalendarCheck,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CertificateData, DynamicCertificateModal } from './DynamicCertificateModal';

export type DocumentType =
  | 'certificate'
  | 'acceptance_letter'
  | 'consent_letter'
  | 'completion_certificate'
  | 'attendance_certificate'
  | 'internship_report';

export interface DocumentMeta {
  id: DocumentType;
  title: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  description: string;
}

export const fontDocTypes: DocumentMeta[] = [
  {
    id: 'certificate',
    title: 'Verified Official Certificate',
    shortName: '1. Certificate',
    icon: Award,
    color: 'from-emerald-500 to-teal-600',
    badge: 'Official Credential',
    description: 'Master verified digital certificate with high-resolution QR verification.',
  },
  {
    id: 'acceptance_letter',
    title: 'Internship Acceptance Letter',
    shortName: '2. Acceptance Letter',
    icon: FileCheck,
    color: 'from-blue-500 to-indigo-600',
    badge: 'Enrollment Confirmation',
    description: 'Official confirmation letter granting admission to practical training program.',
  },
  {
    id: 'consent_letter',
    title: 'Internship Consent & Undertaking Letter',
    shortName: '3. Consent Letter',
    icon: FileSignature,
    color: 'from-purple-500 to-pink-600',
    badge: 'NOC & Student Consent',
    description: 'NOC guidelines and student agreement record signed for university records.',
  },
  {
    id: 'completion_certificate',
    title: 'Internship Completion Certificate',
    shortName: '4. Completion Certificate',
    icon: CheckCircle2,
    color: 'from-teal-500 to-emerald-700',
    badge: 'Practical Training Completed',
    description: 'Certifies 8-week capstone internship completion and project milestone achievements.',
  },
  {
    id: 'attendance_certificate',
    title: 'Internship Attendance Certificate',
    shortName: '5. Attendance Certificate',
    icon: CalendarCheck,
    color: 'from-amber-500 to-orange-600',
    badge: '100% Attendance Verified',
    description: 'Official record validating candidate presence across lab sessions and mentorship.',
  },
  {
    id: 'internship_report',
    title: 'Comprehensive Internship Report',
    shortName: '6. Internship Report',
    icon: FileText,
    color: 'from-indigo-500 to-cyan-600',
    badge: 'Academic Evaluation',
    description: 'Comprehensive project evaluation report with grade breakdown ready for submission.',
  },
];

interface DynamicDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType;
  data: CertificateData;
}

export const DynamicDocumentModal: React.FC<DynamicDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType: initialDocumentType,
  data,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(initialDocumentType);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDocType(initialDocumentType);
  }, [initialDocumentType, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const generateQR = async () => {
      const qrText = `EDUKALYAN FOUNDATION\nOFFICIAL DOCUMENT VERIFICATION\nDoc: ${selectedDocType}\nCandidate: ${data.studentName}\nRoll: ${data.universityRollNo}\nID: ${data.certificateId}`;
      try {
        const url = await QRCode.toDataURL(qrText, {
          width: 200,
          margin: 2,
          color: { dark: '#064e3b', light: '#ffffff' },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR code generation failed:', err);
      }
    };

    generateQR();
  }, [isOpen, selectedDocType, data]);

  if (!isOpen) return null;

  // If user selected the graphic certificate, pass control to canvas certificate modal directly
  if (selectedDocType === 'certificate') {
    return (
      <DynamicCertificateModal
        isOpen={isOpen}
        onClose={onClose}
        data={data}
      />
    );
  }

  const currentMeta = fontDocTypes.find((d) => d.id === selectedDocType) || fontDocTypes[1];

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      alert('Please allow popups to download/print the official document PDF.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentMeta.title} - ${data.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            .document-container {
              max-width: 800px;
              margin: 0 auto;
              border: 3px double #064e3b;
              padding: 40px;
              position: relative;
              background: #fff;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #064e3b;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .org-title {
              font-family: 'Playfair Display', serif;
              font-size: 26px;
              font-weight: 800;
              color: #064e3b;
              margin: 0;
            }
            .org-subtitle {
              font-size: 11px;
              font-weight: 700;
              color: #475569;
              letter-spacing: 1px;
              margin-top: 4px;
            }
            .doc-heading {
              text-align: center;
              font-size: 20px;
              font-weight: 900;
              text-transform: uppercase;
              color: #0f172a;
              margin: 30px 0;
              letter-spacing: 1.5px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 10px;
            }
            .content-text {
              font-size: 14px;
              line-height: 1.8;
              color: #334155;
              text-align: justify;
            }
            .highlight {
              font-weight: 800;
              color: #0f172a;
            }
            .grid-table {
              width: 100%;
              margin: 25px 0;
              border-collapse: collapse;
            }
            .grid-table td {
              padding: 10px 14px;
              border: 1px solid #e2e8f0;
              font-size: 13px;
            }
            .grid-table td.label {
              font-weight: 700;
              background-color: #f8fafc;
              color: #064e3b;
              width: 35%;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .seal-box {
              text-align: center;
              border: 2px dashed #064e3b;
              padding: 12px 20px;
              border-radius: 12px;
              background-color: #f0fdf4;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyLink = () => {
    const url = `https://www.edukalyan.org/verify-certificate?id=${encodeURIComponent(data.certificateId)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <currentMeta.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                Official Credential Document <Sparkles className="h-4 w-4 text-amber-400" />
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Candidate: <strong className="text-white">{data.studentName}</strong> • Roll: <strong className="text-emerald-400 font-mono">{data.universityRollNo}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Document Switcher Selector Bar */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {fontDocTypes.map((doc) => {
            const Icon = doc.icon;
            const isSelected = selectedDocType === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocType(doc.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{doc.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Main Printable Document Display Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/40 flex flex-col items-center justify-start space-y-4">
          {/* Document Paper Page Container */}
          <div
            ref={printRef}
            className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-900/20 relative font-sans leading-relaxed text-xs sm:text-sm"
          >
            {/* Top Double Border Accent */}
            <div className="border-2 border-emerald-800/40 p-4 sm:p-8 rounded-xl bg-gradient-to-b from-emerald-50/20 via-white to-white">
              
              {/* Official Header Table */}
              <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-7 w-7 text-emerald-800 shrink-0" />
                    <div>
                      <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-emerald-950 leading-tight">
                        EDUKALYAN FOUNDATION
                      </h1>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-600 tracking-wider uppercase">
                        Govt. Registered Educational NGO & Skill Development Mission
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Reg. No: EKF/GOVT/2026/8941 • ISO 9001:2025 Certified Educational Body
                  </p>
                </div>

                {qrCodeUrl && (
                  <div className="text-center shrink-0 pl-2">
                    <img src={qrCodeUrl} alt="QR Verification" className="h-16 w-16 mx-auto border border-emerald-800/30 rounded-lg p-0.5 bg-white" />
                    <span className="text-[9px] font-mono font-bold text-emerald-800 block mt-1">SCAN TO VERIFY</span>
                  </div>
                )}
              </div>

              {/* Reference & Date Bar */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 border-b border-slate-200 pb-3 mb-6">
                <span>Ref No: <strong className="font-mono text-slate-900">EKF/{selectedDocType.toUpperCase()}/2026/{data.certificateId}</strong></span>
                <span>Date of Issue: <strong className="text-slate-900">{data.completionDate}</strong></span>
              </div>

              {/* Document Specific Title Banner */}
              <div className="text-center py-3 bg-emerald-900/5 rounded-xl border border-emerald-800/20 mb-6">
                <h2 className="text-base sm:text-xl font-black text-emerald-950 uppercase tracking-widest">
                  {currentMeta.title}
                </h2>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  {currentMeta.badge}
                </span>
              </div>

              {/* Candidate Info Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Candidate Name</span>
                    <strong className="text-slate-900 text-sm font-black">{data.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">University Roll Number</span>
                    <strong className="text-slate-900 font-mono font-bold">{data.universityRollNo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registration Number</span>
                    <strong className="text-slate-900 font-mono font-bold">{data.registrationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">University / Institution</span>
                    <strong className="text-slate-900 font-bold">{data.universityName || 'Recognized University'}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Internship Domain / Sector</span>
                    <strong className="text-emerald-900 font-black text-sm">{data.sectorName}</strong>
                  </div>
                </div>
              </div>

              {/* Document Body Content according to type */}
              <div className="space-y-4 text-slate-700 leading-relaxed text-xs sm:text-sm text-justify">
                {selectedDocType === 'acceptance_letter' && (
                  <>
                    <p>
                      <strong>To Whom It May Concern,</strong>
                    </p>
                    <p>
                      We are pleased to inform that <strong>{data.studentName}</strong> (University Roll No: <span className="font-mono">{data.universityRollNo}</span>) has been officially accepted into the <strong>Edukalyan Foundation Practical Internship & Industry Skill Program</strong> in the domain of <strong>{data.sectorName}</strong>.
                    </p>
                    <p>
                      The internship duration is scheduled for 8 Weeks, during which the candidate will undergo practical mentorship, live industry project assignments, and capstone evaluation under qualified faculty supervisors.
                    </p>
                    <p>
                      This acceptance letter is issued upon verification of candidate credentials and academic standing for university records and official NOC processing.
                    </p>
                  </>
                )}

                {selectedDocType === 'consent_letter' && (
                  <>
                    <p>
                      <strong>INTERNSHIP UNDERTAKING & NOC CONSENT RECORD</strong>
                    </p>
                    <p>
                      This document confirms that <strong>{data.studentName}</strong>, student of <strong>{data.universityName || 'Affiliated Institution'}</strong> holding Roll Number <span className="font-mono">{data.universityRollNo}</span>, has formally consented to participate in the Edukalyan Foundation Practical Internship.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                      <li>The candidate agrees to adhere strictly to all research guidelines, code of ethics, and project deadlines.</li>
                      <li>The host university/college acknowledges the candidate's participation for academic credit requirements.</li>
                      <li>All project deliverables, software models, and documentation created during training are verified by Edukalyan Foundation.</li>
                    </ul>
                  </>
                )}

                {selectedDocType === 'completion_certificate' && (
                  <>
                    <p>
                      This is to officially certify that <strong>{data.studentName}</strong> has successfully completed the 8-Week Practical Internship Program in <strong>{data.sectorName}</strong> conducted by Edukalyan Foundation, ending on <strong>{data.completionDate}</strong>.
                    </p>
                    <p>
                      During the tenure of this internship, the candidate demonstrated exceptional diligence, technical mastery, and collaborative teamwork across real-world capstone deliverables.
                    </p>
                    <p>
                      The candidate’s overall performance was rated as <strong className="text-emerald-800">Grade A+ (Outstanding)</strong> by the domain evaluation committee.
                    </p>
                  </>
                )}

                {selectedDocType === 'attendance_certificate' && (
                  <>
                    <p>
                      <strong>OFFICIAL ATTENDANCE & PARTICIPATION VERIFICATION</strong>
                    </p>
                    <p>
                      This certifies that candidate <strong>{data.studentName}</strong> (Registration No: <span className="font-mono">{data.registrationNumber}</span>) has recorded <strong>100% Verified Attendance</strong> during the practical training workshops, live interactive labs, and faculty reviews for <strong>{data.sectorName}</strong>.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 my-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Total Prescribed Hours: 120 Hours</span>
                        <span>Attended Hours: 120 Hours (100%)</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedDocType === 'internship_report' && (
                  <>
                    <p>
                      <strong>CAPSTONE PROJECT & ACADEMIC EVALUATION REPORT</strong>
                    </p>
                    <p>
                      <strong>Project Title:</strong> Practical Implementation & Domain Solutions in {data.sectorName}
                    </p>
                    <p>
                      <strong>Executive Summary:</strong> The candidate {data.studentName} completed comprehensive practical training, model development, testing, and capstone presentation under Edukalyan Foundation guidance.
                    </p>
                    <div className="border border-slate-200 rounded-lg overflow-hidden my-3 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 font-bold text-slate-800">
                          <tr>
                            <th className="p-2 border-b">Evaluation Parameter</th>
                            <th className="p-2 border-b">Score / Grade</th>
                            <th className="p-2 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Practical Lab Performance</td>
                            <td className="p-2 font-bold text-emerald-800">95 / 100</td>
                            <td className="p-2 font-bold text-slate-900">Verified</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Capstone Project Quality</td>
                            <td className="p-2 font-bold text-emerald-800">98 / 100</td>
                            <td className="p-2 font-bold text-slate-900">Passed</td>
                          </tr>
                          <tr>
                            <td className="p-2">Final Viva & Presentation</td>
                            <td className="p-2 font-bold text-emerald-800">Grade A+</td>
                            <td className="p-2 font-bold text-slate-900">Excellent</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Official Seal & Signature Section */}
              <div className="mt-10 pt-6 border-t-2 border-slate-200 flex items-end justify-between">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full border-2 border-emerald-800 text-emerald-800 flex items-center justify-center font-bold text-[9px] mx-auto p-1 leading-tight bg-emerald-50">
                    EDUKALYAN<br />OFFICIAL<br />SEAL
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 block mt-1">Official Foundation Stamp</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic font-extrabold text-emerald-950 text-lg sm:text-xl">
                    Praveer Kishore
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase">
                    Authorized Signatory & Academic Director
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    Edukalyan Foundation Skill Mission Desk
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Verification URL Copied!' : 'Copy Verification URL'}
            </button>
            <a
              href={`/verify-certificate?id=${encodeURIComponent(data.certificateId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Verify Portal
            </a>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 sm:flex-none rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold py-2.5"
            >
              Close
            </Button>

            <Button
              onClick={handlePrint}
              className="flex-1 sm:flex-none rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm py-2.5 px-6 shadow-xl shadow-emerald-500/20 border-0 cursor-pointer gap-2"
            >
              <Printer className="h-4 w-4" />
              Download / Print Official Document (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
