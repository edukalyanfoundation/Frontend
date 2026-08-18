import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import {
  X,
  Download,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import certificateTemplateImg from '@/assets/Edukalyan_certificate.png';

export interface CertificateData {
  studentName: string;
  courseName: string;
  universityRollNo: string;
  registrationNumber: string;
  certificateId: string;
  completionDate: string;
  sectorName: string;
  universityName?: string;
  collegeName?: string;
}

interface DynamicCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
}

export const DynamicCertificateModal: React.FC<DynamicCertificateModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [renderedDataUrl, setRenderedDataUrl] = useState<string | null>(null);

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

  // Render certificate dynamically onto 1536 x 1024 Canvas
  useEffect(() => {
    if (!isOpen) return;

    const renderCertificate = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Base Canvas resolution: 1536 x 1024
      const CANVAS_WIDTH = 1536;
      const CANVAS_HEIGHT = 1024;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // 1. Load Background Template Image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = certificateTemplateImg;

      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = (e) => reject(e);
      });

      // Draw background image
      ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Generate and Draw QR Code into Bottom Left Box (Sized neatly inside gold frame)
      const qrPayload = [
        `EDUKALYAN FOUNDATION - VERIFIED CERTIFICATE`,
        `Candidate Name: ${data.studentName}`,
        `Course: ${data.courseName}`,
        `Roll No: ${data.universityRollNo}`,
        `Reg No: ${data.registrationNumber}`,
        `Certificate ID: ${data.certificateId}`,
        `Completion Date: ${data.completionDate}`,
        `Verification URL: https://www.edukalyan.org/verify-certificate?id=${encodeURIComponent(data.certificateId)}`,
      ].join('\n');

      try {
        const qrDataUrl = await QRCode.toDataURL(qrPayload, {
          width: 126,
          margin: 1,
          color: {
            dark: '#064e3b', // Rich dark green matching branding
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });

        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise<void>((res) => {
          qrImg.onload = () => res();
        });

        // Centered perfectly inside the gold box (Box: X=120..280, Y=740..898)
        ctx.drawImage(qrImg, 137, 756, 126, 126);
      } catch (qrErr) {
        console.warn('QR Code generation notice:', qrErr);
      }

      // Format Student Name to Normal / Title Case so it doesn't collide
      const cleanStudentName = data.studentName
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      // 3. Draw Dynamic Student Name (Centered between "This is to certify that" and the upper golden line)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 32px "Playfair Display", "Times New Roman", Georgia, serif';
      ctx.fillStyle = '#064e3b'; // Deep emerald green
      // Upper golden line is at Y=370. Text baseline at Y=362 sits cleanly on the line without touching "This is to certify that"
      ctx.fillText(cleanStudentName, CANVAS_WIDTH / 2, 362);
      ctx.restore();

      // 4. Draw Dynamic Course / Internship Title (Centered above "undertaken by a student with")
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 24px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a'; // Deep slate navy
      // Lower golden line is at Y=485. Text baseline at Y=478
      ctx.fillText(data.courseName, CANVAS_WIDTH / 2, 478);
      ctx.restore();

      // 5. Draw University Roll Number (Shifted slightly upward to align cleanly with label)
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 19px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      // Label "University Roll No.:" is at Y=574
      ctx.fillText(data.universityRollNo, 500, 574);
      ctx.restore();

      // 6. Draw Registration Number (Shifted slightly upward to align cleanly with label)
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 19px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      // Label "Registration Number:" is at Y=574
      ctx.fillText(data.registrationNumber, 1060, 574);
      ctx.restore();

      // 7. Draw Certificate ID (Shifted slightly upward to align cleanly with "Certificate ID:")
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px "Consolas", monospace, sans-serif';
      ctx.fillStyle = '#064e3b';
      // Label "Certificate ID:" is at Y=940
      ctx.fillText(data.certificateId, 1245, 940);
      ctx.restore();

      // Generate Data URL for direct image preview
      const fullQualityUrl = canvas.toDataURL('image/png', 1.0);
      setRenderedDataUrl(fullQualityUrl);
      setIsRendered(true);
    };

    renderCertificate();
  }, [isOpen, data]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filenameClean = data.studentName.replace(/\s+/g, '_');
      link.download = `Edukalyan_Certificate_${filenameClean}_${data.certificateId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `https://www.edukalyan.org/verify-certificate?id=${encodeURIComponent(data.certificateId)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                Official Verified Certificate <Sparkles className="h-4 w-4 text-amber-400" />
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Candidate: <strong className="text-white">{data.studentName}</strong> • ID: <strong className="text-emerald-400 font-mono">{data.certificateId}</strong>
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

        {/* Certificate Display Area (Fits 100% in viewport without vertical cutting) */}
        <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-950/50 space-y-3">
          {/* Hidden Master Full-Res Canvas (1536 x 1024) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Rendered Visual Certificate Container */}
          <div className="w-full flex items-center justify-center">
            {renderedDataUrl ? (
              <img
                src={renderedDataUrl}
                alt="Edukalyan Verified Certificate"
                className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-700/60 block"
              />
            ) : (
              <div className="w-full aspect-[1536/1024] max-h-[60vh] flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-3 rounded-xl">
                <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold">Rendering Dynamic Certificate & QR Code...</p>
              </div>
            )}
          </div>

          {/* Quick Notice */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2 max-w-xl text-center">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              Google Lens Scannable: Shows candidate name, sector, and official verification badge.
            </span>
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
              {copied ? 'Verification Link Copied!' : 'Copy Verification URL'}
            </button>
            <a
              href={`/verify-certificate?id=${encodeURIComponent(data.certificateId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Verify Portal
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
              onClick={handleDownload}
              disabled={!isRendered || downloading}
              className="flex-1 sm:flex-none rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-2.5 px-6 shadow-xl shadow-emerald-500/20 border-0 cursor-pointer gap-2"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download Certificate (High-Res PNG)'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
