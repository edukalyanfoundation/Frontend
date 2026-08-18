import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, BookOpenCheck, CalendarCheck, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CertificationDocuments: React.FC = () => {
  const documents = [
    {
      icon: <Award className="h-8 w-8 text-amber-400" />,
      badgeBg: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
      title: "Verified Certificate",
      desc: "Official certificate recognized nationwide by universities & employers.",
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-400" />,
      badgeBg: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
      title: "Detailed Marksheet",
      desc: "Comprehensive performance evaluation with domain skill grading.",
    },
    {
      icon: <BookOpenCheck className="h-8 w-8 text-purple-400" />,
      badgeBg: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
      title: "Internship Report",
      desc: "Structured project documentation format ready for academic submission.",
    },
    {
      icon: <CalendarCheck className="h-8 w-8 text-emerald-400" />,
      badgeBg: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      title: "Attendance Record",
      desc: "Official verified log of live session participation & active hours.",
    },
  ];

  return (
    <section className="w-full py-10 md:py-16 container mx-auto px-4 md:px-6 space-y-10 relative">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Title Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Official Accreditation Credentials</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Complete <span className="bg-gradient-to-r from-amber-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">Certification Documents</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Every student receives comprehensive, verified documentation to validate their practical training and career achievements.
        </p>
      </div>

      {/* Grid Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {documents.map((doc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between items-center text-center space-y-5 overflow-hidden"
          >
            {/* Top Card Gradient Highlight */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${doc.badgeBg} border backdrop-blur-md group-hover:scale-110 transition-transform duration-300 shadow-md`}>
              {doc.icon}
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-300 transition-colors duration-300">{doc.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{doc.desc}</p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Provided to All Students
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

