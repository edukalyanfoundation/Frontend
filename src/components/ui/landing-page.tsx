"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Mail,
  Code,
  Users,
  CheckCircle2,
  BookOpen,
  Building2,
  Rocket,
  Shield,
  HeartPulse,
  Brain,
  Globe,
  Sparkles,
  PenTool,
  DollarSign,
  Clock,
  X,
  GraduationCap,
} from "lucide-react"
import { PublicNavbar } from "@/components/layout/PublicNavbar"
import { PublicFooter } from "@/components/layout/PublicFooter"
import { UgcRegistrationForm } from "@/components/ui/UgcRegistrationForm"
import { CertificationDocuments } from "@/components/ui/CertificationDocuments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import logoImg from "@/assets/logo.png"
import { inquiryService } from "@/services/inquiryService"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

interface Course {
  id: string
  title: string
  category: string
  profession: string
  duration: string
  description: string
  skills: string[]
  image: string
}

export function DesignAgency() {
  const [selectedSector, setSelectedSector] = useState<string>("All")
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (isRegistrationModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isRegistrationModalOpen])

  const [contactFullName, setContactFullName] = useState<string>("")
  const [contactEmail, setContactEmail] = useState<string>("")
  const [contactMessage, setContactMessage] = useState<string>("")
  const [contactSubmitting, setContactSubmitting] = useState<boolean>(false)
  const [contactSuccess, setContactSuccess] = useState<boolean>(false)
  const [contactError, setContactError] = useState<string>("")

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactFullName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError("Please fill out all required fields.")
      return
    }

    setContactSubmitting(true)
    setContactError("")
    setContactSuccess(false)

    const result = await inquiryService.createInquiry({
      full_name: contactFullName,
      email: contactEmail,
      message: contactMessage,
    })

    setContactSubmitting(false)
    if (result.success) {
      setContactSuccess(true)
      setContactFullName("")
      setContactEmail("")
      setContactMessage("")
    } else {
      setContactError(result.error || "Failed to send inquiry. Please try again.")
    }
  }

  const professionDomains = [
    { title: "Teacher Training", category: "Teacher Training", icon: <BookOpen className="h-7 w-7 text-primary" />, desc: "Pedagogy, modern classroom management & digital tools." },
    { title: "Artificial Intelligence", category: "Artificial Intelligence", icon: <Brain className="h-7 w-7 text-indigo-600" />, desc: "Machine Learning, Python AI algorithms & Generative AI." },
    { title: "Cyber Security", category: "Cyber Security", icon: <Shield className="h-7 w-7 text-purple-600" />, desc: "Ethical hacking, network defense & vulnerability testing." },
    { title: "Health Care", category: "Health Care", icon: <HeartPulse className="h-7 w-7 text-rose-600" />, desc: "Patient care, hospital hygiene & medical support skills." },
    { title: "Disaster Management", category: "Disaster Management", icon: <Building2 className="h-7 w-7 text-amber-600" />, desc: "Crisis response, emergency planning & relief logistics." },
    { title: "Entrepreneurship", category: "Entrepreneurship", icon: <Rocket className="h-7 w-7 text-emerald-600" />, desc: "Startup incubation, business model canvas & pitch decks." },
    { title: "Agriculture Tech", category: "Agriculture", icon: <Globe className="h-7 w-7 text-green-600" />, desc: "Smart farming, organic techniques & supply chain management." },
    { title: "Skill & Personality", category: "Skill & Personality", icon: <Users className="h-7 w-7 text-blue-600" />, desc: "Public speaking, interview preparation & soft skills." },
    { title: "JavaScript & Web Dev", category: "JavaScript / Web Dev", icon: <Code className="h-7 w-7 text-cyan-600" />, desc: "Full-Stack Web Apps in React 19, Node.js & Supabase." },
    { title: "Politics & Governance", category: "Politics & Governance", icon: <Building2 className="h-7 w-7 text-slate-700" />, desc: "Public policy analysis, civil governance & NGO leadership." },
    { title: "Graphics & Content", category: "Graphics & Content", icon: <PenTool className="h-7 w-7 text-pink-600" />, desc: "Photoshop, Illustrator, logo design & social creative posts." },
    { title: "Tourism & Hospitality", category: "Tourism", icon: <Globe className="h-7 w-7 text-amber-700" />, desc: "Itinerary planning, hotel front desk & tour packaging." },
    { title: "Digital Literacy", category: "Digital Literacy", icon: <Sparkles className="h-7 w-7 text-teal-600" />, desc: "Computer basics, MS Office Suite & safe digital banking." },
    { title: "Financial Literacy", category: "Financial Literacy", icon: <DollarSign className="h-7 w-7 text-emerald-700" />, desc: "GST tax filing, Tally Prime accounting & bookkeeping." },
    { title: "Creative Writing", category: "Creative Writing", icon: <PenTool className="h-7 w-7 text-violet-600" />, desc: "SEO blogging, storytelling, ad copywriting & editing." },
  ]

  const services = [
    { title: 'Internship Programs', icon: '🎓', desc: 'Hands-on practical industry project experience.' },
    { title: 'Verified Certificates', icon: '📜', desc: 'Government & UGC compliant digital credentials.' },
    { title: 'Career Guidance', icon: '💼', desc: 'One-on-one expert counseling and career roadmap.' },
    { title: 'Mentorship Programs', icon: '👨‍🏫', desc: 'Direct mentorship from senior corporate professionals.' },
    { title: 'Skill Development Courses', icon: '💻', desc: 'Practical tech, management, and soft skill workshops.' },
    { title: 'Industry Collaborations', icon: '🤝', desc: 'Direct corporate ties for practical project exposure.' },
    { title: 'Workshops & Training', icon: '📚', desc: 'Interactive skill enhancement bootcamps.' },
    { title: 'Community Development', icon: '🌍', desc: 'Social impact and youth empowerment projects.' },
    { title: 'Leadership Development', icon: '🏆', desc: 'Fostering teamwork, management, and leadership skills.' },
    { title: 'Placement Assistance', icon: '🎯', desc: 'Connecting trained candidates with hiring partners.' },
  ];

  const allCourses: Course[] = [
    {
      id: "c1",
      title: "Teacher Training & Pedagogy Masterclass",
      category: "Teacher Training",
      profession: "Educators & School Teachers",
      duration: "3 Months",
      description: "Comprehensive pedagogical training, classroom management, lesson planning, and digital teaching tools.",
      skills: ["Classroom Management", "Digital Tools", "Child Psychology"],
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "c2",
      title: "Artificial Intelligence & Python ML Engineering",
      category: "Artificial Intelligence",
      profession: "Software Engineers & AI Aspirants",
      duration: "4 Months",
      description: "Learn Python, TensorFlow, Neural Networks, Generative AI models, and real-world ML deployment.",
      skills: ["Python", "TensorFlow", "Generative AI"],
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "c3",
      title: "Ethical Hacking & Cyber Security Defense",
      category: "Cyber Security",
      profession: "Security Analysts & IT Professionals",
      duration: "3 Months",
      description: "Master network penetration testing, vulnerability assessment, cryptography, and SIEM security analytics.",
      skills: ["Penetration Testing", "Network Security", "Wireshark"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "c4",
      title: "Health Care Administration & Patient Support",
      category: "Health Care",
      profession: "Hospital Support Staff & Medics",
      duration: "2 Months",
      description: "Healthcare logistics, patient communication, first-aid protocols, and medical record management.",
      skills: ["Patient Care", "Hospital Operations", "First Aid"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "c5",
      title: "Disaster Preparedness & Crisis Response",
      category: "Disaster Management",
      profession: "NGO Volunteers & Emergency Teams",
      duration: "2 Months",
      description: "Strategic disaster preparedness, emergency relief distribution, flood/earthquake response logistics.",
      skills: ["Crisis Management", "Relief Logistics", "First Response"],
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "c6",
      title: "Startup Incubation & Business Leadership",
      category: "Entrepreneurship",
      profession: "Founders & Business Leaders",
      duration: "3 Months",
      description: "Turn ideas into scalable businesses with pitch deck preparation, legal compliance, and venture funding tactics.",
      skills: ["Business Canvas", "Pitch Deck", "Financial Modeling"],
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    },
  ]

  const filteredCourses =
    selectedSector === "All"
      ? allCourses
      : allCourses.filter(
        (c) =>
          c.category.toLowerCase().includes(selectedSector.toLowerCase()) ||
          selectedSector.toLowerCase().includes(c.category.toLowerCase())
      )

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground relative z-10">
      <PublicNavbar onOpenRegistration={() => setIsRegistrationModalOpen(true)} />

      <main className="flex-1 space-y-12">
        {/* 1. Hero Section */}
        <section className="w-full mt-10 sm:mt-12 md:mt-10 lg:mt-10 pb-8 md:pb-12 lg:pb-16 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 border border-indigo-500/30 rounded-[32px] bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 backdrop-blur-2xl shadow-2xl p-5 sm:p-10 lg:p-12 relative overflow-hidden text-white">
            
            {/* Ambient Background Glow Effects */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center relative z-10">
              <div className="flex flex-col justify-center space-y-5 lg:col-span-7">
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2.5 flex-wrap"
                  >
                    <img src={logoImg} alt="Edukalyan Foundation Logo" className="h-9 sm:h-12 w-auto object-contain drop-shadow-md" />
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                      <span>Empowering Students. Transforming Futures.</span>
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white"
                  >
                    Empowering Students to{" "}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent font-black block sm:inline">
                      Learn, Grow & Succeed
                    </span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-[620px] text-slate-300 text-xs sm:text-base md:text-lg leading-relaxed font-normal"
                  >
                    At Edukalyan Foundation, we connect students with internships, certifications, mentorship, and skill development programs that prepare them for successful careers and lifelong learning.
                  </motion.p>
                </div>

                {/* Quick Action Badges (Compact & Responsive on Mobile) */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-2.5 sm:grid sm:grid-cols-3 pt-1"
                >
                  <div className="flex-1 min-w-[130px] flex items-center gap-2 p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 backdrop-blur-md hover:border-indigo-500/40 hover:bg-indigo-950/30 transition-all shadow-xs">
                    <div className="p-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    </div>
                    <span className="font-bold text-[11px] sm:text-xs">UGC Internship Focus</span>
                  </div>
                  <div className="flex-1 min-w-[130px] flex items-center gap-2 p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 backdrop-blur-md hover:border-indigo-500/40 hover:bg-indigo-950/30 transition-all shadow-xs">
                    <div className="p-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    </div>
                    <span className="font-bold text-[11px] sm:text-xs">Verified Certification</span>
                  </div>
                  <div className="flex-1 min-w-[130px] flex items-center gap-2 p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 backdrop-blur-md hover:border-indigo-500/40 hover:bg-indigo-950/30 transition-all shadow-xs">
                    <div className="p-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    </div>
                    <span className="font-bold text-[11px] sm:text-xs">Expert Mentorship</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col gap-3 sm:flex-row pt-2"
                >
                  <Button
                    size="lg"
                    className="rounded-2xl group shadow-xl shadow-indigo-500/30 w-full sm:w-auto font-extrabold px-6 py-5 sm:py-6 text-xs sm:text-base bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setIsRegistrationModalOpen(true)}
                  >
                    Complete Student Registration
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="rounded-2xl border-slate-700/80 bg-slate-800/40 backdrop-blur-md hover:bg-slate-800 hover:border-indigo-500/40 text-white w-full px-6 py-5 sm:py-6 text-xs sm:text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                      Explore All 15 Professions
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* 3D Lottie Illustration (completely hidden on mobile devices) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden md:flex lg:col-span-5 items-center justify-center relative mt-2 lg:mt-0"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="w-full h-[220px] sm:h-[340px] md:h-[400px] lg:h-[480px] flex items-center justify-center relative z-10 drop-shadow-[0_20px_35px_rgba(99,102,241,0.25)]">
                  <DotLottieReact
                    src="https://lottie.host/188380a2-f467-481e-b10f-94c0e24074c5/mOXjHjihjk.json"
                    loop
                    autoplay
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Complete Certification Documents Section VISIBLE JUST AFTER HERO */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
        >
          <CertificationDocuments />
        </motion.section>

        {/* 3. 🚀 Our Core Services Bento Grid with Entrance Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="w-full py-10 md:py-14 container mx-auto px-4 md:px-6 space-y-10 relative"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

          {/* Section Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-400 backdrop-blur-md">
              <Rocket className="h-4 w-4 text-indigo-400" />
              <span>Edukalyan Key Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Our <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Core Services</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Discover how Edukalyan Foundation helps students transform potential into real-world achievement.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10"
          >
            {services.map((srv, idx) => (
              <motion.div
                key={idx}
                variants={itemFadeIn}
                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                className="group relative rounded-3xl border border-slate-800/80 p-5 sm:p-6 bg-slate-900/60 backdrop-blur-xl text-center space-y-3.5 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-between"
              >
                {/* Accent top border */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/25 text-3xl group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all duration-300 shadow-md">
                  {srv.icon}
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors duration-300 leading-snug">{srv.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 4. Explore Courses By Sector with Entrance Animation & Main Title */}
        <motion.section
          id="courses-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="w-full py-10 md:py-16 container mx-auto px-4 md:px-6 space-y-8 relative"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-400 backdrop-blur-md">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>Sector Course Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {selectedSector === "All" ? (
                <>Explore Courses <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">By Sector</span></>
              ) : (
                <>Courses in <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{selectedSector}</span></>
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Showing tailored courses based on your selected internship sector.
            </p>
            {selectedSector !== "All" && (
              <button
                onClick={() => setSelectedSector("All")}
                className="text-xs text-indigo-400 font-bold hover:underline pt-1 transition-colors"
              >
                ← Show All Sectors
              </button>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative z-10 max-w-lg mx-auto p-8 shadow-xl">
              <BookOpen className="h-10 w-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
              <h4 className="font-extrabold text-base text-white">No Listed Courses for "{selectedSector}"</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Our academic counselors will guide you through customized syllabus options upon registration.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                  className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top accent highlight */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                  
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <img 
                        src={course.image} 
                        alt="" 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
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
                      <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors duration-300 leading-snug">{course.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">{course.description}</p>
                      
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" /> {course.duration}
                        </span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified Cert
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Button
                      className="w-full rounded-2xl text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => setIsRegistrationModalOpen(true)}
                    >
                      Enroll In This Sector <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* 5. Courses Tailored For Diverse Careers (15 Profession Domains) with Entrance Animation */}
        <section id="programs" className="w-full py-10 md:py-16 relative">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 space-y-8 relative z-10"
          >
            {/* Section Header */}
            <div className="flex flex-col items-center justify-center space-y-3 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-400 backdrop-blur-md">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>15 Specialized Profession Domains</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Courses Tailored For <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Diverse Careers</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Discover hands-on internships, certified programs, and practical training structured specifically for your professional field.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-6xl items-stretch gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {professionDomains.map((domain, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                  onClick={() => {
                    setSelectedSector(domain.category)
                    const el = document.getElementById("courses-grid")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-800/80 p-6 bg-slate-900/60 backdrop-blur-xl shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Top accent highlight */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/25 w-fit group-hover:scale-110 transition-transform duration-300 shadow-md">
                      {domain.icon}
                    </div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors duration-300">{domain.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{domain.desc}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-xs font-extrabold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      Filter Sector Courses
                    </span>
                    <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* 6. Why Choose Edukalyan Foundation Section with Entrance Animation */}
        <section id="about" className="w-full py-12 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 space-y-6"
          >
            <div className="grid gap-8 lg:grid-cols-2 items-center py-6">
              <div className="space-y-4">
                <div className="inline-block rounded-3xl bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  Why Choose Edukalyan Foundation?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Empowering Futures Through Quality Education & Real-World Experience
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Edukalyan Foundation is committed to providing students with practical skills, verified credentials, and career development support that bridge academia and industry.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-card border border-muted">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs">Verified Certifications</h4>
                      <p className="text-[10px] text-muted-foreground">UGC compliant credentials online.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-card border border-muted">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs">Expert Mentorship</h4>
                      <p className="text-[10px] text-muted-foreground">Corporate leader guidance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[300px] sm:h-[360px] rounded-3xl overflow-hidden border border-muted shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="Students Learning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="w-full py-12 md:py-20 relative overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 space-y-10 relative z-10"
          >
            <div className="flex flex-col items-center justify-center space-y-3 text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-bold text-indigo-400 backdrop-blur-md">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Connect With <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Edukalyan Foundation</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Have questions about internship registrations or verification? Reach out to our NGO academic team.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
              <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 space-y-6 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6">
                  <h3 className="text-xl font-extrabold text-white pb-3 border-b border-slate-800/80">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-slate-300">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 shadow-xs">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Email Us</div>
                        <div className="text-sm sm:text-base text-white font-bold">edukalyanfoundation@gmail.com</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 text-slate-300">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 shadow-xs">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Official Portal</div>
                        <div className="text-sm sm:text-base text-white font-bold">www.edukalyan.org</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 text-slate-300">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 shadow-xs">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">NGO Headquarters</div>
                        <div className="text-sm sm:text-base text-white font-bold leading-relaxed">Edukalyan Foundation Headquarters, Hazaribagh & Ranchi, Jharkhand</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Official Government & UGC Compliant Organization
                </div>
              </div>

              <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 space-y-5 shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <h3 className="text-xl font-extrabold text-white pb-3 border-b border-slate-800/80">Send Us A Message</h3>
                
                {contactSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 text-center my-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                    <h4 className="font-extrabold text-lg text-white">Inquiry Received!</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Thank you for contacting Edukalyan Foundation. Your message has been securely recorded in our database. Our academic desk will reach out soon.
                    </p>
                    <button
                      onClick={() => setContactSuccess(false)}
                      className="text-xs font-bold text-emerald-400 underline hover:text-emerald-300 pt-2"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    {contactError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                        {contactError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Full Name <span className="text-rose-400">*</span></label>
                      <Input
                        value={contactFullName}
                        onChange={(e) => setContactFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="rounded-2xl bg-slate-800/50 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-3 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Email Address <span className="text-rose-400">*</span></label>
                      <Input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="rounded-2xl bg-slate-800/50 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-3 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Message / Inquiry <span className="text-rose-400">*</span></label>
                      <textarea
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Write your questions regarding internship registrations, verification, or courses..."
                        className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-3.5 text-sm outline-hidden transition-all resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full rounded-2xl font-bold py-6 text-sm sm:text-base bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2"
                    >
                      {contactSubmitting ? "Sending Inquiry..." : "Send Inquiry Message"} <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Registration Modal Popup */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isRegistrationModalOpen && (
              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto overscroll-contain"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl max-h-[90vh] my-auto bg-card rounded-3xl shadow-2xl overflow-hidden border border-muted flex flex-col z-[10000] overscroll-contain"
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shrink-0">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-5 w-5 text-indigo-400" />
                      <span className="font-extrabold text-sm sm:text-base tracking-tight">
                        UGC Student Internship Registration
                      </span>
                    </div>
                    <button
                      onClick={() => setIsRegistrationModalOpen(false)}
                      className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 shadow-xs cursor-pointer"
                      aria-label="Close registration modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Scrollable Form Content */}
                  <div
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    className="overflow-y-auto flex-1 p-2 sm:p-4 overscroll-contain"
                  >
                    <UgcRegistrationForm
                      onSubmitSuccess={() => {
                        // Keep open to show success state
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <PublicFooter />
    </div>
  )
}
