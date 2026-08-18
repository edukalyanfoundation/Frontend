import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-white relative z-10">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logoImg} alt="Edukalyan Foundation Logo" className="h-12 sm:h-14 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight leading-none text-white">Edukalyan</span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">Foundation</span>
            </div>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Edukalyan Foundation is a student-focused non-profit organization dedicated to empowering young minds through education, internships, skill development, certifications, mentorship, and career opportunities. Our mission is to bridge the gap between academic learning and real-world experience, enabling every student to build a brighter future.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Empowering Students. Transforming Futures.</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Our Services</h4>
          <nav className="flex flex-col space-y-2.5 text-xs text-slate-400">
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">🎓 Internship Programs</Link>
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">📜 Verified Certificates</Link>
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">💼 Career Guidance</Link>
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">👨‍🏫 Mentorship Programs</Link>
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">💻 Skill Development Courses</Link>
            <Link to="/courses" className="hover:text-indigo-400 transition-colors">🤝 Industry Collaborations</Link>
          </nav>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4">Student Zone</h4>
          <nav className="flex flex-col space-y-2.5 text-xs text-slate-400">
            <a href="/#register-form" className="hover:text-indigo-400 transition-colors">Student Registration Form</a>
            <Link to="/login" className="hover:text-indigo-400 transition-colors">Student Portal Login</Link>
            <Link to="/verify-certificate" className="hover:text-indigo-400 transition-colors">Verify Certificate Online</Link>
            <Link to="/about" className="hover:text-indigo-400 transition-colors">About Edukalyan Foundation</Link>
            <Link to="/blog" className="hover:text-indigo-400 transition-colors">Career Insights & Articles</Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white mb-4">Contact Information</h4>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>edukalyanfoundation@gmail.com</span>
          </div>
          <div className="pt-2 text-xs text-slate-400">
            <p className="font-semibold text-white">Edukalyan Foundation NGO</p>
            <p className="mt-1">Empowering Futures • Non-Profit Educational Organization</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 border-t border-slate-800/60 py-6 text-center md:flex md:items-center md:justify-between">
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Edukalyan Foundation. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-xs text-slate-400">
          <Link to="/about" className="hover:text-indigo-400 transition-colors">About NGO</Link>
          <Link to="/verify-certificate" className="hover:text-indigo-400 transition-colors">Verify Certificate</Link>
          <Link to="/courses" className="hover:text-indigo-400 transition-colors">Services & Courses</Link>
        </div>
      </div>
    </footer>
  );
};
