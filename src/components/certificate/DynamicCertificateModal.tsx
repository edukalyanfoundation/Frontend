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

      // 2. Generate and Draw QR Code into Bottom Left Box
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
          width: 146,
          margin: 1,
          color: {
            dark: '#064e3b', // Rich dark green
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });

        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise<void>((res) => {
          qrImg.onload = () => res();
        });

        // Exact QR Box location on 1536x1024: X=126, Y=746, W=148, H=148
        ctx.drawImage(qrImg, 126, 746, 148, 148);
      } catch (qrErr) {
        console.warn('QR Code generation notice:', qrErr);
      }

      // 3. Draw Dynamic Student Name (Centered above "has Successfully completed")
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 42px "Playfair Display", "Times New Roman", Georgia, serif';
      ctx.fillStyle = '#064e3b'; // Deep emerald green matching header
      // Line is at Y=370, text sits right above at Y=364
      ctx.fillText(data.studentName.toUpperCase(), CANVAS_WIDTH / 2, 364);
      ctx.restore();

      // 4. Draw Dynamic Course / Internship Title (Centered above "undertaken by a student with")
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 26px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a'; // Deep slate navy
      // Line is at Y=485, text sits right above at Y=480
      ctx.fillText(data.courseName, CANVAS_WIDTH / 2, 480);
      ctx.restore();

      // 5. Draw University Roll Number (To the right of "University Roll No.:")
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 20px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      // Label "University Roll No.:" ends around X=495, Y=588
      ctx.fillText(data.universityRollNo, 500, 588);
      ctx.restore();

      // 6. Draw Registration Number (To the right of "Registration Number:")
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 20px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      // Label "Registration Number:" ends around X=1055, Y=588
      ctx.fillText(data.registrationNumber, 1060, 588);
      ctx.restore();

      // 7. Draw Certificate ID (To the right of "Certificate ID:")
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px "Consolas", monospace, sans-serif';
      ctx.fillStyle = '#064e3b';
      // Label "Certificate ID:" ends around X=1240, Y=956
      ctx.fillText(data.certificateId, 1250, 956);
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Official Verified Certificate <Sparkles className="h-4 w-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">
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

        {/* Certificate Display Area (Scrollable if screen is small) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/40">
          {/* Hidden Master Full-Res Canvas (1536 x 1024) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Rendered Visual Certificate Container */}
          <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/70 bg-white">
            {renderedDataUrl ? (
              <img
                src={renderedDataUrl}
                alt="Edukalyan Verified Certificate"
                className="w-full h-auto object-contain block"
              />
            ) : (
              <div className="w-full aspect-[1536/1024] flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-3">
                <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold">Rendering Dynamic Certificate & QR Code...</p>
              </div>
            )}
          </div>

          {/* Quick Notice */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 max-w-2xl text-center">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Google Lens Verified: Scanning the QR code displays the candidate's name, sector, completion date, and official verification badge.
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
