import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Users,
  GraduationCap,
  CheckCircle2,
  Video,
  FileText,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  Download,
  ExternalLink,
  Code2,
  User,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { courseService, CourseRow } from '@/services/courseService';
import { INTERNSHIP_SECTORS } from '@/admin/AdminCoursesPage';
import { useAuthStore } from '@/stores/authStore';

// Rich sector-specific curriculum, weekly roadmap, and capstone project details for all 7 sectors
interface SectorDetails {
  title: string;
  tagline: string;
  badge: string;
  description: string;
  duration: string;
  mode: string;
  certificateType: string;
  instructor: string;
  skills: string[];
  roadmap: { week: string; title: string; desc: string }[];
  projects: { title: string; desc: string; deliverables: string[] }[];
  tools: string[];
  pdfUrl?: string;
  liveClassUrl?: string;
}

const SECTOR_DATA: Record<string, SectorDetails> = {
  'Artificial Intelligence (AI)': {
    title: 'Artificial Intelligence (AI) Internship Portal',
    tagline: 'Practical Machine Learning, Neural Networks & Generative AI Engineering',
    badge: 'High Demand Tech Track',
    description:
      'Gain hands-on industry experience building intelligent AI systems. Work with Python, TensorFlow, PyTorch, Scikit-learn, OpenAI API, and prompt engineering to develop real-world predictive models and generative AI assistants.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Online Live Interactive & Hands-On AI Lab',
    certificateType: 'Certified AI Practitioner Credential',
    instructor: 'Edukalyan AI & Data Science Faculty Desk',
    skills: ['Python 3', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Prompt Engineering', 'LangChain', 'OpenAI APIs', 'Data Visualization'],
    tools: ['Jupyter Notebook', 'Google Colab', 'TensorFlow', 'Hugging Face', 'FastAPI', 'Git/GitHub'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/ai-ml.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Python for AI & Mathematical Foundations', desc: 'Data structures, NumPy, Pandas, linear algebra, calculus, and exploratory data analysis.' },
      { week: 'Weeks 3-4', title: 'Supervised & Unsupervised Machine Learning', desc: 'Linear regression, decision trees, random forests, clustering algorithms, and model evaluation.' },
      { week: 'Weeks 5-6', title: 'Deep Learning & Computer Vision Basics', desc: 'Neural network architectures, backpropagation, CNNs, image recognition, and transfer learning.' },
      { week: 'Weeks 7-8', title: 'Generative AI, LLMs & Capstone Project', desc: 'Prompt engineering, RAG pipelines, API integration, deployment, and final viva evaluation.' },
    ],
    projects: [
      {
        title: 'Intelligent Conversational Customer Support Bot',
        desc: 'Build an AI assistant utilizing OpenAI APIs and custom vector search over knowledge base documents.',
        deliverables: ['GitHub Repository with Clean Code', 'Architecture Diagram & Report', 'Live Working Demo Link'],
      },
      {
        title: 'Predictive Student Academic Performance Model',
        desc: 'Train and evaluate machine learning regression models on real student attendance and assessment datasets.',
        deliverables: ['Jupyter Notebook (.ipynb)', 'Model Accuracy Evaluation Charts', '5-Page Project Summary Document'],
      },
    ],
  },
  'Cyber Security': {
    title: 'Cyber Security & Ethical Defense Portal',
    tagline: 'Network Penetration Testing, Threat Intelligence & Vulnerability Assessment',
    badge: 'Industry Essential Track',
    description:
      'Develop real-world defensive and offensive cyber security capabilities. Learn penetration testing frameworks, network traffic analysis, cryptography, malware analysis, incident response, and web application security auditing.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Live Virtual Labs & Threat Analysis Sprints',
    certificateType: 'Certified Cyber Defense Specialist',
    instructor: 'Edukalyan Information Security Desk',
    skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Wireshark', 'Cryptography', 'Linux OS', 'OWASP Top 10', 'SIEM Analytics'],
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Nmap', 'Metasploit', 'OWASP ZAP'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/cyber-security.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Network Protocols & Linux Fundamentals', desc: 'TCP/IP networking, OSI model, packet routing, Wireshark packet capture, and Bash scripting.' },
      { week: 'Weeks 3-4', title: 'Reconnaissance & Vulnerability Assessment', desc: 'Port scanning, service discovery, Nmap vulnerability scanning, and threat intelligence basics.' },
      { week: 'Weeks 5-6', title: 'Web Application Security & OWASP Top 10', desc: 'SQL injection, XSS, CSRF, authentication bypass, and securing RESTful APIs.' },
      { week: 'Weeks 7-8', title: 'Cryptography, Incident Response & Capstone', desc: 'Public key infrastructure, TLS, digital forensics basics, and security audit report compilation.' },
    ],
    projects: [
      {
        title: 'Enterprise Web Application Vulnerability Audit',
        desc: 'Perform a full penetration testing audit on a sandbox application and prepare a formal remediation audit report.',
        deliverables: ['Executive Vulnerability Audit Report (PDF)', 'Remediation Action Plan', 'Proof of Concept Log'],
      },
    ],
  },
  Healthcare: {
    title: 'Healthcare Informatics & Operations Portal',
    tagline: 'Digital Health Records, Patient Data Privacy & Medical Workflow Management',
    badge: 'Healthcare Tech Track',
    description:
      'Learn modern healthcare documentation, electronic medical record (EMR/EHR) management, clinical data informatics, health analytics, patient communication protocols, and compliance standards.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Interactive Clinical Case Studies & Hospital Systems',
    certificateType: 'Healthcare Operations & Analytics Certificate',
    instructor: 'Edukalyan Health Science Faculty Desk',
    skills: ['EHR/EMR Systems', 'Healthcare Analytics', 'Patient Privacy (HIPAA)', 'Medical Documentation', 'Clinical Workflows', 'Healthcare Ethics'],
    tools: ['OpenEMR', 'Health Analytics Dashboard', 'MS Excel for Medical Data', 'Telehealth Systems'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/healthcare.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Foundations of Modern Healthcare Informatics', desc: 'Hospital organization structure, digital transformation in medicine, and health records overview.' },
      { week: 'Weeks 3-4', title: 'Electronic Health Record (EHR/EMR) Systems', desc: 'Patient onboarding, medical coding basics, data entry, prescription workflows, and audit trails.' },
      { week: 'Weeks 5-6', title: 'Patient Data Confidentiality & Health Regulations', desc: 'HIPAA/DISHA data protection rules, patient consent protocols, and medical cybersecurity.' },
      { week: 'Weeks 7-8', title: 'Clinical Data Analytics & Final Project', desc: 'Hospital occupancy forecasting, patient feedback analytics, and capstone presentation.' },
    ],
    projects: [
      {
        title: 'Digital Outpatient Management & EHR Workflow Design',
        desc: 'Model a complete patient flow system from appointment scheduling to electronic prescription delivery.',
        deliverables: ['Workflow Process Blueprint', 'Electronic Health Record Dataset Summary', 'Final Case Study Documentation'],
      },
    ],
  },
  'Graphics and Content': {
    title: 'Graphics Design & Digital Content Portal',
    tagline: 'Visual UI/UX Design, Brand Identity & Multimedia Content Production',
    badge: 'Creative Media Track',
    description:
      'Master industry-standard visual design, digital branding, storytelling, copywriting, UI/UX prototyping, video editing, and social media campaign asset generation.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Live Design Sprints & Portfolio Projects',
    certificateType: 'Certified Visual & Media Designer',
    instructor: 'Edukalyan Creative Media Council',
    skills: ['Figma UI/UX', 'Adobe Photoshop', 'Illustrator', 'Content Strategy', 'Video Editing', 'Brand Identity', 'Typography', 'Color Theory'],
    tools: ['Figma', 'Adobe Photoshop', 'Illustrator', 'Canva Pro', 'Premiere Pro', 'Notion'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/graphics-content.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Visual Design Fundamentals & Color Theory', desc: 'Typography, grid layouts, visual hierarchy, branding psychology, and color palettes.' },
      { week: 'Weeks 3-4', title: 'Vector Illustration & Brand Identity in Figma', desc: 'Logo design, vector illustrations, style guides, and digital UI asset generation.' },
      { week: 'Weeks 5-6', title: 'Copywriting, SEO Blogging & Content Strategy', desc: 'Audience targeting, engaging storytelling, headline writing, and social media carousels.' },
      { week: 'Weeks 7-8', title: 'Motion Graphics, Video Editing & Portfolio Capstone', desc: 'Reels and promo video creation, case study documentation, and Behance portfolio publish.' },
    ],
    projects: [
      {
        title: 'Comprehensive Brand Identity & Digital Campaign Kit',
        desc: 'Create an end-to-end brand style guide, social media visual kit, and landing page wireframe for a startup.',
        deliverables: ['Figma Project File Link', 'Brand Style Guide PDF', 'High-Resolution Export Assets'],
      },
    ],
  },
  Finance: {
    title: 'Finance & Corporate Accounting Portal',
    tagline: 'Financial Modeling, GST Taxation, Tally Prime & Investment Valuation',
    badge: 'Corporate Finance Track',
    description:
      'Gain real-world competency in corporate finance, financial statements analysis, advanced MS Excel financial modeling, Tally Prime accounting, GST/Income Tax compliance, and budget forecasting.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Practical Case Studies & Financial Modeling',
    certificateType: 'Certified Corporate Financial Analyst',
    instructor: 'Edukalyan Commerce & Finance Council',
    skills: ['Financial Modeling', 'Tally Prime', 'Corporate Taxation & GST', 'Advanced Excel', 'Auditing & Valuation', 'Cash Flow Analysis'],
    tools: ['MS Excel (Advanced)', 'Tally Prime', 'Google Sheets', 'Power BI for Finance', 'GST Portal Simulator'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/finance.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Corporate Financial Accounting Principles', desc: 'Double-entry bookkeeping, P&L accounts, balance sheets, and cash flow statement construction.' },
      { week: 'Weeks 3-4', title: 'Advanced Excel for Financial Modeling', desc: 'VLOOKUP, INDEX-MATCH, Pivot Tables, conditional formatting, DCF valuation, and scenario analysis.' },
      { week: 'Weeks 5-6', title: 'Tally Prime Operations & GST Compliance', desc: 'Voucher creation, ledger reconciliation, GST return calculation, and inventory bookkeeping.' },
      { week: 'Weeks 7-8', title: 'Investment Analysis, Ratio Audit & Capstone', desc: 'Working capital management, liquidity ratio evaluation, and final financial presentation.' },
    ],
    projects: [
      {
        title: 'Three-Statement Financial Model & Valuation Forecast',
        desc: 'Build an interconnected financial projection model with sensitivity analysis for a growth business.',
        deliverables: ['Dynamic Excel Financial Model (.xlsx)', 'Executive Summary & Valuation Report (PDF)', 'Ratio Analysis Chart'],
      },
    ],
  },
  'Web Development': {
    title: 'Full-Stack Web Development Portal',
    tagline: 'Modern Frontend, Backend APIs, PostgreSQL Databases & Cloud Deployments',
    badge: 'Flagship Tech Track',
    description:
      'Master modern Web Development from HTML5, CSS3, Tailwind CSS, TypeScript, and React 19 to Node.js backend services, Supabase PostgreSQL, and scalable cloud deployments.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Live Coding, Code Reviews & Production Deployment',
    certificateType: 'Full-Stack Web Development Credential',
    instructor: 'Edukalyan Software Engineering Desk',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Git & GitHub', 'Cloud Hosting'],
    tools: ['VS Code', 'Git / GitHub', 'Supabase', 'Vite', 'Postman', 'Vercel / Netlify'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/web-development.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Semantic HTML5, CSS3 & Responsive Tailwind UI', desc: 'Flexbox, CSS Grid, mobile-first responsive design systems, and glassmorphism styling.' },
      { week: 'Weeks 3-4', title: 'Modern JavaScript (ES6+) & TypeScript Foundations', desc: 'Async/await, promises, DOM manipulation, TypeScript types, interfaces, and clean code.' },
      { week: 'Weeks 5-6', title: 'React 19 Framework & State Architecture', desc: 'Components, hooks, state stores (Zustand), client-side routing, and external API consumption.' },
      { week: 'Weeks 7-8', title: 'Backend APIs, Supabase Database & Capstone', desc: 'Relational database schema, authentication, Row Level Security, and live production deployment.' },
    ],
    projects: [
      {
        title: 'Full-Stack SaaS Web Application with Authentication',
        desc: 'Develop and deploy a complete web application with student dashboards, database persistence, and responsive UI.',
        deliverables: ['Public GitHub Repo with README', 'Live Deployed URL on Netlify/Vercel', 'Database Schema Diagram'],
      },
    ],
  },
  'App Development': {
    title: 'Mobile App Development Portal',
    tagline: 'Cross-Platform Mobile Apps with React Native, Flutter & Native APIs',
    badge: 'Mobile Engineering Track',
    description:
      'Build performant mobile applications for Android and iOS. Learn component layouts, navigation, global state management, local database caching, push notifications, camera/GPS hardware APIs, and app store deployment.',
    duration: '8 Weeks (Mandatory Practical Internship)',
    mode: 'Live App Architecture & App Store Readiness',
    certificateType: 'Certified Mobile App Developer',
    instructor: 'Edukalyan Mobile Engineering Desk',
    skills: ['React Native', 'Flutter / Dart', 'Mobile UI/UX', 'State Management', 'REST APIs', 'App Store Publishing', 'Local Storage'],
    tools: ['Android Studio', 'Xcode', 'Expo CLI', 'Flutter SDK', 'Firebase', 'Git / GitHub'],
    pdfUrl: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/app-development.pdf',
    liveClassUrl: 'https://meet.google.com',
    roadmap: [
      { week: 'Weeks 1-2', title: 'Mobile UI Fundamentals & Framework Setup', desc: 'Expo/Flutter setup, native component layout, styling, and navigation architecture.' },
      { week: 'Weeks 3-4', title: 'State Management & Hardware API Integration', desc: 'Async storage, camera access, geolocation, and responsive touch interactions.' },
      { week: 'Weeks 5-6', title: 'Backend API Connectivity & Offline Sync', desc: 'Connecting mobile app with REST APIs, authentication tokens, and caching.' },
      { week: 'Weeks 7-8', title: 'Testing, Build Optimization & App Publishing', desc: 'APK generation, performance profiling, Play Store readiness checklist, and final viva.' },
    ],
    projects: [
      {
        title: 'Feature-Rich Cross-Platform Mobile Application',
        desc: 'Build an Android/iOS mobile application featuring live data feed, user profiles, and offline capability.',
        deliverables: ['GitHub Code Repository', 'Demo Video Walkthrough', 'Installable APK / Build File'],
      },
    ],
  },
};

// Normalizer to map any variant string (e.g. 'Artificial Intelligence', 'AI', 'Health Care', etc.) to the canonical 7 sectors
export const normalizeSectorName = (sector: string | null | undefined): string | null => {
  if (!sector) return null;
  const s = sector.trim().toLowerCase();
  if (s.includes('ai') || s.includes('artificial intelligence') || s.includes('machine learning')) {
    return 'Artificial Intelligence (AI)';
  }
  if (s.includes('cyber') || s.includes('security') || s.includes('ethical')) {
    return 'Cyber Security';
  }
  if (s.includes('health') || s.includes('medical') || s.includes('clinical')) {
    return 'Healthcare';
  }
  if (s.includes('graphic') || s.includes('design') || s.includes('content') || s.includes('media')) {
    return 'Graphics and Content';
  }
  if (s.includes('finance') || s.includes('accounting') || s.includes('financial') || s.includes('tax')) {
    return 'Finance';
  }
  if (s.includes('web') || s.includes('full stack') || s.includes('frontend') || s.includes('backend')) {
    return 'Web Development';
  }
  if (s.includes('app') || s.includes('mobile') || s.includes('android') || s.includes('flutter') || s.includes('react native')) {
    return 'App Development';
  }
  // If exact match in key
  if (SECTOR_DATA[sector]) {
    return sector;
  }
  return null;
};

export const CoursesPage: React.FC = () => {
  const { profile, user } = useAuthStore();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Subpage Tab for the Sector View
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'curriculum' | 'classes' | 'projects' | 'downloads'>('overview');

  // Visitor Mode Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitorCategory, setSelectedVisitorCategory] = useState<string>('All');

  const metadata = (profile?.metadata || (user as any)?.metadata || {}) as Record<string, any>;

  // Determine if student has a registered internship sector
  const registeredRawSector = metadata.internshipSector || null;
  
  const studentRegisteredSector = useMemo(() => {
    return normalizeSectorName(registeredRawSector);
  }, [registeredRawSector]);

  useEffect(() => {
    courseService.getAllCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  // When student is registered, they get their exact sector details
  const currentSectorDetails = studentRegisteredSector ? SECTOR_DATA[studentRegisteredSector] : null;

  // Filter courses for student sector (or visitor filter)
  const sectorCourses = useMemo(() => {
    if (studentRegisteredSector) {
      return courses.filter((c) => normalizeSectorName(c.category) === studentRegisteredSector);
    }
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedVisitorCategory === 'All' || normalizeSectorName(c.category) === selectedVisitorCategory;

      return matchesSearch && matchesCat;
    });
  }, [courses, studentRegisteredSector, searchQuery, selectedVisitorCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 py-10 space-y-12">
        {/* ========================================================================= */}
        {/* SCENARIO 1: REGISTERED STUDENT LOGGED IN (ONLY THEIR SECTOR SUBPAGE IS SHOWN) */}
        {/* ========================================================================= */}
        {studentRegisteredSector && currentSectorDetails ? (
          <div className="container mx-auto px-4 md:px-6 space-y-10 max-w-6xl">
            {/* Student Sector Banner */}
            <section className="relative rounded-3xl overflow-hidden border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-black text-emerald-400 shadow-xs">
                      <ShieldCheck className="h-4 w-4" /> Registered Candidate Access
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold text-indigo-300 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5" /> {currentSectorDetails.badge}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {studentRegisteredSector} <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Course Sub-Page</span>
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {currentSectorDetails.description}
                  </p>
                </div>

                {/* Candidate Quick Badge */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs space-y-2 shrink-0 min-w-[240px] shadow-lg">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-[11px]">
                    <User className="h-3.5 w-3.5" /> Enrolled Student
                  </div>
                  <div className="font-extrabold text-white text-sm">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Verified Student'}
                  </div>
                  <div className="text-slate-300 text-[11px] font-mono">
                    Roll: <strong className="text-indigo-300">{metadata.universityRollNo || 'Registered'}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate">
                    {metadata.universityName || 'Partner University'}
                  </div>
                </div>
              </div>

              {/* Sub-page Navigation Tabs */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'overview', label: 'Sector Overview', icon: BookOpen },
                  { id: 'curriculum', label: '8-Week Curriculum', icon: Layers },
                  { id: 'classes', label: 'Live Classes & Labs', icon: Video },
                  { id: 'projects', label: 'Industry Capstone Projects', icon: Code2 },
                  { id: 'downloads', label: 'Syllabus & Documents', icon: Download },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/80'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Sub-page Content Panels */}
            <AnimatePresence mode="wait">
              {/* Tab 1: Overview */}
              {activeSubTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {/* Left Column: Key Highlights */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-xl">
                      <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wider">
                        <GraduationCap className="h-5 w-5 text-indigo-400" /> Practical Internship Specifications
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                          <span className="text-indigo-400 font-bold uppercase text-[11px]">Program Duration</span>
                          <p className="font-extrabold text-white text-sm">{currentSectorDetails.duration}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                          <span className="text-indigo-400 font-bold uppercase text-[11px]">Learning Mode</span>
                          <p className="font-extrabold text-white text-sm">{currentSectorDetails.mode}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                          <span className="text-indigo-400 font-bold uppercase text-[11px]">Certification Awarded</span>
                          <p className="font-extrabold text-white text-sm">{currentSectorDetails.certificateType}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                          <span className="text-indigo-400 font-bold uppercase text-[11px]">Faculty & Mentorship Desk</span>
                          <p className="font-extrabold text-white text-sm">{currentSectorDetails.instructor}</p>
                        </div>
                      </div>
                    </div>

                    {/* Sector Courses List */}
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-xl">
                      <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wider">
                        <BookOpen className="h-5 w-5 text-indigo-400" /> Sector Enrolled Modules & Course
                      </h3>

                      {sectorCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {sectorCourses.map((course) => (
                            <div
                              key={course.id}
                              className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/70 space-y-3 hover:border-indigo-500/40 transition-all shadow-md"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h4 className="text-base font-extrabold text-white">{course.title}</h4>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shrink-0">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled & Verified
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{course.description}</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {Array.isArray(course.skills) &&
                                  course.skills.map((s, idx) => (
                                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[11px] font-semibold border border-indigo-500/20">
                                      {s}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-800/30 text-center text-xs text-slate-400">
                          Curriculum modules loaded for {studentRegisteredSector}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Skills & Tech Tools */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl">
                      <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wider">
                        <Award className="h-4 w-4 text-indigo-400" /> Sector Core Competencies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentSectorDetails.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl">
                      <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wider">
                        <Code2 className="h-4 w-4 text-indigo-400" /> Industry Tools & Software
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentSectorDetails.tools.map((tool, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 text-xs font-semibold">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Curriculum Roadmap */}
              {activeSubTab === 'curriculum' && (
                <motion.div
                  key="curriculum"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 space-y-8 shadow-xl"
                >
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                      <Layers className="h-6 w-6 text-indigo-400" /> 8-Week Practical Training Roadmap
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Structured milestone progression designed for college academic credit fulfillment and industry readiness.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentSectorDetails.roadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all"
                      >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black">
                          <Calendar className="h-3.5 w-3.5" /> {item.week}
                        </div>
                        <h4 className="text-base font-extrabold text-white leading-snug">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Live Classes & Sessions */}
              {activeSubTab === 'classes' && (
                <motion.div
                  key="classes"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 space-y-8 shadow-xl"
                >
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                        <Video className="h-6 w-6 text-rose-400" /> Live Interactive Masterclasses & Labs
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Join scheduled live video lectures, practical coding sessions, and Q&A with industry mentors.
                      </p>
                    </div>

                    <a
                      href={currentSectorDetails.liveClassUrl || 'https://meet.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition-all hover:scale-105 shrink-0"
                    >
                      <Video className="h-4 w-4" /> Join Live Classroom <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Class Frequency</span>
                      <p className="font-extrabold text-white text-sm">3 Live Sessions / Week</p>
                      <p className="text-[11px] text-slate-400">Recordings uploaded within 24 hours</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Attendance Criteria</span>
                      <p className="font-extrabold text-white text-sm">Minimum 75% Required</p>
                      <p className="text-[11px] text-slate-400">Tracked automatically for marksheet</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                      <span className="text-indigo-400 font-bold uppercase text-[11px]">Mentor Support</span>
                      <p className="font-extrabold text-white text-sm">1-on-1 Doubt Clearing Desk</p>
                      <p className="text-[11px] text-slate-400">Direct academic counselor assistance</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Industry Capstone Projects */}
              {activeSubTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 space-y-8 shadow-xl"
                >
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                      <Code2 className="h-6 w-6 text-indigo-400" /> Sector Capstone Industry Projects
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Complete these practical assignments to earn your verified internship certificate and marksheet.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {currentSectorDetails.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/70 space-y-4 hover:border-indigo-500/40 transition-all shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-lg font-black text-white">{proj.title}</h4>
                          <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold shrink-0">
                            Required for Completion
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{proj.desc}</p>
                        
                        <div className="pt-2 space-y-2 border-t border-slate-700/60">
                          <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider">Required Submission Deliverables:</span>
                          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                            {proj.deliverables.map((del, dIdx) => (
                              <li key={dIdx} className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 5: Syllabus & Downloads */}
              {activeSubTab === 'downloads' && (
                <motion.div
                  key="downloads"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 space-y-8 shadow-xl"
                >
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                      <Download className="h-6 w-6 text-indigo-400" /> Official Sector Downloads & Syllabus
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Download your curriculum syllabus, internship report templates, and university credit documentation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                          <FileText className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-extrabold text-white">{studentRegisteredSector} Official Syllabus PDF</h4>
                        <p className="text-xs text-slate-400">Complete week-by-week syllabus modules and reference bibliography.</p>
                      </div>
                      <a
                        href={currentSectorDetails.pdfUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-colors"
                      >
                        <Download className="h-4 w-4" /> Download Syllabus PDF
                      </a>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                          <Award className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-extrabold text-white">Internship Project Report Template</h4>
                        <p className="text-xs text-slate-400">Pre-formatted academic project documentation layout for final marksheet.</p>
                      </div>
                      <a
                        href="/dashboard/profile"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors"
                      >
                        <FileText className="h-4 w-4" /> View Sample Report
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ========================================================================= */
          /* SCENARIO 2: PUBLIC VISITOR / UNREGISTERED USER BROWSING CATALOG           */
          /* ========================================================================= */
          <>
            {/* Header Hero */}
            <section className="container mx-auto px-4 md:px-6 text-center space-y-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-xs">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span>ISO Certified & MSME Recognized Profession Courses</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Courses Tailored for <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Every Sector</span>
                </h1>

                <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                  Select your internship sector or complete student registration to access your customized sector course sub-page.
                </p>

                {/* Search Box */}
                <div className="max-w-xl mx-auto pt-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-indigo-400" />
                    <Input
                      type="text"
                      placeholder="Search courses (e.g. AI, Cyber Security, Web Development, Finance)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 rounded-2xl h-14 bg-slate-900/60 border-slate-800/80 backdrop-blur-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-xl"
                    />
                  </div>
                </div>

                {/* 7 Clean Sector Filter Tabs for Visitors */}
                <div className="pt-4 flex items-center justify-center gap-2 flex-wrap max-w-5xl mx-auto">
                  {['All', ...INTERNSHIP_SECTORS].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedVisitorCategory(cat)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedVisitorCategory === cat
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-105'
                          : 'bg-slate-900/60 backdrop-blur-md border-slate-800/80 text-slate-300 hover:border-indigo-500/40 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Course Cards Grid */}
            <section className="container mx-auto px-4 md:px-6 pb-16">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-800/80">
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  Showing <strong className="text-white font-extrabold">{sectorCourses.length}</strong> Courses
                </span>
                {selectedVisitorCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedVisitorCategory('All')}
                    className="text-xs text-indigo-400 font-extrabold hover:underline transition-colors cursor-pointer"
                  >
                    ← Show All Sectors
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-16 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl max-w-lg mx-auto p-8 shadow-xl">
                  <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">Loading Courses Catalog...</h3>
                </div>
              ) : sectorCourses.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl max-w-lg mx-auto p-8 shadow-xl">
                  <BookOpen className="h-12 w-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-xl font-extrabold text-white">No Courses Found</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Try searching for a different sector or choose "All".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectorCourses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                      <div>
                        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                          <img
                            src={
                              course.image_url ||
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
                            }
                            alt={course.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                          <div className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-indigo-300 border border-indigo-500/30 shadow-md">
                            {course.category}
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">For: {course.profession}</span>
                          </div>

                          <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                            {course.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          {Array.isArray(course.skills) && course.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {course.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock className="h-3.5 w-3.5 text-indigo-400" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>ISO & MSME Cert</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <Link to="/#register-form">
                          <Button className="w-full rounded-2xl text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                            Select Sector & Register <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};
