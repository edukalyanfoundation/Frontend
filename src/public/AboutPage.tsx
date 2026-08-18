import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  HeartHandshake,
  ArrowRight,
  Eye,
  Rocket,
  Heart,
  Sparkles,
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '@/components/ui/button';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const AboutPage: React.FC = () => {
  const coreValues = [
    { name: 'Student First', desc: 'Putting student growth, learning, and success at the center of every initiative.' },
    { name: 'Integrity & Transparency', desc: 'Upholding high ethical standards, open communication, and honest guidance.' },
    { name: 'Equal Opportunities', desc: 'Ensuring accessible quality training and internships for candidates across all backgrounds.' },
    { name: 'Innovation & Learning', desc: 'Continuously evolving our practical curriculum to match modern industry demands.' },
    { name: 'Community Impact', desc: 'Creating meaningful positive changes in society through education and skill empowerment.' },
    { name: 'Excellence', desc: 'Striving for highest quality standards in mentorship, certification, and project execution.' },
    { name: 'Collaboration', desc: 'Partnering with educational institutions, industry experts, and organizations.' },
    { name: 'Lifelong Growth', desc: 'Instilling habits of continuous learning, self-improvement, and professional adaptability.' },
  ];

  const services = [
    { title: 'Internship Programs', icon: '🎓', desc: 'Hands-on practical industry project experience.' },
    { title: 'Verified Certificates', icon: '📜', desc: 'Government compliant verified digital credentials.' },
    { title: 'Career Guidance', icon: '💼', desc: 'One-on-one expert counseling and career roadmap.' },
    { title: 'Mentorship Programs', icon: '👨‍🏫', desc: 'Direct mentorship from senior corporate professionals.' },
    { title: 'Skill Development Courses', icon: '💻', desc: 'Practical tech, management, and soft skill workshops.' },
    { title: 'Industry Collaborations', icon: '🤝', desc: 'Direct corporate ties for practical project exposure.' },
    { title: 'Workshops & Training', icon: '📚', desc: 'Interactive skill enhancement bootcamps.' },
    { title: 'Community Development', icon: '🌍', desc: 'Social impact and youth empowerment projects.' },
    { title: 'Leadership Development', icon: '🏆', desc: 'Fostering teamwork, management, and leadership skills.' },
    { title: 'Placement Assistance', icon: '🎯', desc: 'Connecting trained candidates with hiring partners.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 py-10 space-y-16 sm:space-y-20">
        {/* 1. About Hero Section */}
        <section className="w-full py-8 md:py-14 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 text-center space-y-5 max-w-4xl relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-xs">
              <HeartHandshake className="h-4 w-4 text-indigo-400" />
              <span>Empowering Students. Transforming Futures.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              About <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Edukalyan Foundation</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
              A student-focused non-profit organization dedicated to empowering young minds through education, internships, skill development, verified certifications, mentorship, and career opportunities.
            </p>
          </motion.div>
        </section>

        {/* 2. Detailed Narrative Card Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10"
        >
          <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-12 space-y-5 leading-relaxed text-sm sm:text-base text-slate-300 shadow-2xl overflow-hidden">
            {/* Top Card Gradient Highlight */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Who We Are
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white pb-3 border-b border-slate-800/80">
              Bridging Academics and Real-World Industry Exposure
            </h2>

            <p>
              Edukalyan Foundation is a non-profit organization dedicated to empowering students by providing opportunities that extend beyond traditional classroom education. We believe that every student deserves access to quality learning, practical industry exposure, and the right guidance to build a successful future.
            </p>

            <p>
              Our mission is to bridge the gap between academic knowledge and real-world experience by offering internship opportunities, professional certification programs, skill development workshops, career counseling, mentorship, and industry-focused learning initiatives.
            </p>

            <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-4 sm:p-5 rounded-r-2xl text-indigo-200 font-semibold text-sm sm:text-base my-4">
              "We believe education is not only about earning degrees—it is about developing confidence, practical expertise, ethical values, and lifelong learning habits."
            </div>

            <p>
              We collaborate with educational institutions, corporate professionals, industry experts, and organizations to create meaningful opportunities that help students develop technical, professional, and leadership skills. Through these initiatives, we prepare learners to confidently enter the workforce and contribute positively to society.
            </p>

            <p className="font-extrabold text-white text-base sm:text-lg pt-3 border-t border-slate-800/80">
              Together, we are building a future where every student has the knowledge, skills, and opportunities needed to succeed.
            </p>
          </div>
        </motion.section>

        {/* 3. Mission & Vision Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl relative z-10"
        >
          <div className="group relative rounded-3xl border border-slate-800/80 p-8 bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <Target className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              🎯 Our Mission
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              To empower students through quality education, practical internships, skill development, certifications, mentorship, and career opportunities that prepare them for successful and meaningful futures.
            </p>
          </div>

          <div className="group relative rounded-3xl border border-slate-800/80 p-8 bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-xl hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <Eye className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              👁️ Our Vision
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              To become a trusted educational foundation that transforms the lives of students by making career-oriented learning, internships, and professional development opportunities accessible to everyone.
            </p>
          </div>
        </motion.section>

        {/* 4. Core Values Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="container mx-auto px-4 md:px-6 max-w-5xl space-y-8 relative z-10"
        >
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1 text-xs font-bold text-rose-400 backdrop-blur-md">
              <Heart className="h-4 w-4 text-rose-400" />
              <span>Foundation Principles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Our <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">The foundational pillars that guide Edukalyan Foundation's mission.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                variants={itemFadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl border border-slate-800/80 p-6 bg-slate-900/60 backdrop-blur-xl space-y-3 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-3">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-extrabold text-xs shadow-md">
                    0{idx + 1}
                  </div>
                  <h4 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">{val.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 5. Our Services Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="container mx-auto px-4 md:px-6 max-w-5xl space-y-8 relative z-10"
        >
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-400 backdrop-blur-md">
              <Rocket className="h-4 w-4 text-indigo-400" />
              <span>Comprehensive NGO Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Our <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Transforming potential into achievement across 10 key domains.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {services.map((srv, idx) => (
              <motion.div
                key={idx}
                variants={itemFadeIn}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative rounded-3xl border border-slate-800/80 p-5 bg-slate-900/60 backdrop-blur-xl text-center space-y-3 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-between"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/25 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                  {srv.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors leading-snug">{srv.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 6. Call to Action Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10"
        >
          <div className="group relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-8 sm:p-14 text-center space-y-5 shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Start Your Journey Today with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Edukalyan</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Empowering Students. Transforming Futures. Complete your registration for internship programs and verified certifications.
              </p>
              <div className="pt-4">
                <a href="/#register-form">
                  <Button size="lg" className="rounded-2xl font-bold px-8 py-6 text-base bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Start Your Journey Today <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <PublicFooter />
    </div>
  );
};
