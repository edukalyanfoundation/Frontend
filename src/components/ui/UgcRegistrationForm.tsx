import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Lock, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ugcRegistrationService } from '@/services/ugcRegistrationService';
import { sendWelcomeEmail } from '@/services/emailService';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

interface UgcRegistrationFormProps {
  onSectorSelect?: (sector: string) => void;
  onSubmitSuccess?: () => void;
}

export const UgcRegistrationForm: React.FC<UgcRegistrationFormProps> = ({
  onSectorSelect,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState({
    universityName: '',
    collegeName: '',
    degree: '',
    department: '',
    semester: '',
    academicSession: '',
    universityRollNo: '',
    universityRegNo: '',
    majorSubject: '',
    internshipSector: '',
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    mobileNumber: '',
    mobileIsWhatsapp: true,
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live Password Criteria & Strength Evaluation
  const passwordCriteria = useMemo(() => {
    const pwd = formData.password || '';
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return (
      passwordCriteria.length &&
      passwordCriteria.uppercase &&
      passwordCriteria.lowercase &&
      passwordCriteria.number &&
      passwordCriteria.special
    );
  }, [passwordCriteria]);

  const metCount = useMemo(() => {
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [passwordCriteria]);

  // Restricted strictly to the website's 15 course sectors
  const internshipSectors = [
    'Teacher Training',
    'Artificial Intelligence',
    'Cyber Security',
    'Health Care',
    'Disaster Management',
    'Entrepreneurship',
    'Agriculture',
    'Skill & Personality',
    'Politics & Governance',
    'Graphics & Content',
    'Tourism',
    'Digital Literacy',
    'Financial Literacy',
    'Creative Writing',
    'Web Development',
  ];

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, internshipSector: val }));
    if (onSectorSelect && val) {
      onSectorSelect(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert('Password Security Notice: Please satisfy all 5 password instructions (at least 8 characters, uppercase, lowercase, number, and special character) before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit Registration Record to Supabase ugc_registrations Table
      const record = await ugcRegistrationService.submitRegistration({
        university_name: formData.universityName,
        college_name: formData.collegeName,
        degree: formData.degree,
        department: formData.department,
        semester: formData.semester,
        academic_session: formData.academicSession,
        university_roll_no: formData.universityRollNo,
        university_reg_no: formData.universityRegNo,
        major_subject: formData.majorSubject,
        internship_sector: formData.internshipSector,
        full_name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        dob: formData.dob,
        gender: formData.gender,
        mobile_number: formData.mobileNumber,
        mobile_is_whatsapp: formData.mobileIsWhatsapp,
        email: formData.email || null,
        status: 'pending',
        password: formData.password,
      });

      // 2. Encrypt & Register User Auth Credentials in Supabase (Password Hashing via Bcrypt)
      if (formData.email && formData.password) {
        try {
          const [firstName, ...rest] = formData.fullName.split(' ');
          const lastName = rest.join(' ') || 'Student';
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password, // Password is automatically encrypted using bcrypt by Supabase Auth
            options: {
              data: {
                full_name: formData.fullName,
                first_name: firstName,
                last_name: lastName,
                registration_id: record?.id,
              },
            },
          });
        } catch (authErr) {
          console.warn('[Supabase Auth Note]:', authErr);
        }
      }

      // 3. Set Logged-in User Session in AuthStore
      const [firstName, ...rest] = formData.fullName.split(' ');
      const lastName = rest.join(' ') || 'Student';

      useAuthStore.setState({
        user: { id: record?.id || 'usr-' + Date.now(), email: formData.email },
        profile: {
          id: record?.id || 'usr-' + Date.now(),
          email: formData.email,
          first_name: firstName,
          last_name: lastName,
          phone: formData.mobileNumber,
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          status: 'active',
          role_id: 'user-role',
          timezone: 'Asia/Kolkata',
          locale: 'en-IN',
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          metadata: {
            universityName: formData.universityName,
            collegeName: formData.collegeName,
            degree: formData.degree,
            department: formData.department,
            semester: formData.semester,
            academicSession: formData.academicSession,
            universityRollNo: formData.universityRollNo,
            universityRegNo: formData.universityRegNo,
            majorSubject: formData.majorSubject,
            internshipSector: formData.internshipSector,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            dob: formData.dob,
            gender: formData.gender,
          },
          role: {
            id: 'user-role',
            name: 'user',
            description: 'Student Candidate',
            is_system: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        role: 'user',
        isAuthenticated: true,
      });

      // 4. Send Welcome Email via Resend API
      if (formData.email) {
        sendWelcomeEmail(formData.fullName, formData.email);
      }
    } catch (err) {
      console.warn('Registration flow note:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    }
  };

  const selectClassName =
    "w-full rounded-2xl border border-input bg-background text-foreground dark:bg-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary shadow-xs";
  
  const optionClassName =
    "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-medium py-1.5 text-xs";

  return (
    <div className="w-full">
      {/* Registration Card */}
      <div className="rounded-3xl border border-muted bg-card shadow-lg p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center py-8 sm:py-12 space-y-6 flex flex-col items-center justify-center"
          >
            {/* Animated Icon at Tick Mark Position */}
            <div className="relative inline-flex items-center justify-center mb-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-lg"
              />
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/30 border-2 border-emerald-300/40"
              >
                <svg className="h-10 w-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
            >
              Registration Submitted Successfully!
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Thank you for registering with Edukalyan Foundation for the Practical Internship Program. Your student profile is now active.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="rounded-2xl px-8 py-3 font-extrabold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl border border-primary/30"
                onClick={() => (window.location.href = '/dashboard/profile')}
              >
                Go to Student Profile
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <div className="text-center space-y-2 border-b border-muted pb-6">
              <div className="inline-flex items-center gap-2 rounded-3xl bg-primary/10 border border-primary/20 px-4 py-1 text-xs font-bold text-primary">
                <GraduationCap className="h-4 w-4" />
                Practical Internship Program
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">Student Registration Form</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Complete your registration for practical internship program
              </p>
            </div>
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            {/* 1. Academic Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-muted pb-2 uppercase tracking-wider">
                Academic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. University Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">University Name *</label>
                  <Input
                    required
                    placeholder="Enter University Name"
                    value={formData.universityName}
                    onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 2. College Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">College Name *</label>
                  <Input
                    required
                    placeholder="Enter College Name"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 3. Degree */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Degree *</label>
                  <Input
                    required
                    placeholder="Enter Degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 4. Department/Stream */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Department/Stream *</label>
                  <Input
                    required
                    placeholder="Enter Department/Stream"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 5. Semester */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Semester *</label>
                  <Input
                    required
                    placeholder="Enter Semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 6. Academic Session */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Academic Session *</label>
                  <Input
                    required
                    placeholder="Enter Academic Session"
                    value={formData.academicSession}
                    onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 7. University Roll Number */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">University Roll Number *</label>
                  <Input
                    required
                    placeholder="Enter University Roll Number"
                    value={formData.universityRollNo}
                    onChange={(e) => setFormData({ ...formData, universityRollNo: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 8. University Registration Number */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">University Registration Number *</label>
                  <Input
                    required
                    placeholder="Enter University Registration Number"
                    value={formData.universityRegNo}
                    onChange={(e) => setFormData({ ...formData, universityRegNo: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 9. Major Subject */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Major Subject *</label>
                  <Input
                    required
                    placeholder="Enter Major Subject"
                    value={formData.majorSubject}
                    onChange={(e) => setFormData({ ...formData, majorSubject: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* 10. Internship Sector Select - Kept as dropdown options */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Internship Sector *</label>
                  <select
                    required
                    value={formData.internshipSector}
                    onChange={handleSectorChange}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Internship Sector</option>
                    {internshipSectors.map((sector) => (
                      <option key={sector} value={sector} className={optionClassName}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Student Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-muted pb-2 uppercase tracking-wider">
                Student Personal Details & Security
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Full Name *</label>
                  <Input
                    required
                    placeholder="Enter Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Father Name *</label>
                  <Input
                    required
                    placeholder="Enter Father Name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Mother Name *</label>
                  <Input
                    required
                    placeholder="Enter Mother Name"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Date of Birth (DD/MM/YYYY) *
                  </label>
                  <div className="relative flex items-center">
                    <Input
                      required
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={
                        formData.dob && formData.dob.includes('-')
                          ? `${formData.dob.split('-')[2]}/${formData.dob.split('-')[1]}/${formData.dob.split('-')[0]}`
                          : formData.dob
                      }
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      onClick={() => {
                        const hiddenPicker = document.getElementById('ugc-dob-hidden-picker') as HTMLInputElement;
                        if (hiddenPicker) {
                          try {
                            hiddenPicker.showPicker ? hiddenPicker.showPicker() : hiddenPicker.focus();
                          } catch {}
                        }
                      }}
                      className="rounded-2xl text-xs py-2.5 pr-11 font-semibold text-foreground bg-background cursor-pointer"
                    />
                    <input
                      id="ugc-dob-hidden-picker"
                      type="date"
                      value={formData.dob && formData.dob.includes('-') ? formData.dob : ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const hiddenPicker = document.getElementById('ugc-dob-hidden-picker') as HTMLInputElement;
                        if (hiddenPicker) {
                          try {
                            hiddenPicker.showPicker ? hiddenPicker.showPicker() : hiddenPicker.focus();
                          } catch {}
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 hover:text-indigo-200 transition-all z-10 cursor-pointer flex items-center justify-center"
                      title="Open Calendar Picker"
                    >
                      <Calendar className="h-4 w-4 shrink-0 text-indigo-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Format: DD/MM/YYYY — click field or calendar icon to select
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Gender *</label>
                  <div className="flex items-center space-x-6 py-2">
                    <label className="flex items-center space-x-2 font-semibold text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="accent-primary h-4 w-4"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2 font-semibold text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="accent-primary h-4 w-4"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-foreground">Mobile Number *</label>
                    <label className="flex items-center space-x-1.5 text-[11px] text-muted-foreground font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.mobileIsWhatsapp}
                        onChange={(e) => setFormData({ ...formData, mobileIsWhatsapp: e.target.checked })}
                        className="rounded accent-primary h-3.5 w-3.5"
                      />
                      <span>Is Whatsapp</span>
                    </label>
                  </div>
                  <Input
                    required
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Email ID *</label>
                  <Input
                    required
                    type="email"
                    placeholder="Enter Email ID"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                  />
                </div>

                {/* Password Input with Eye Toggle Button & Live Instructions Checklist */}
                <div className="space-y-3 sm:col-span-2 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                      <Lock className="h-4 w-4 text-indigo-400" /> Create Account Password *
                    </label>
                    {metCount > 0 && (
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        metCount === 5
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : metCount >= 3
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {metCount === 5 ? '🟢 Strong Password' : metCount >= 3 ? '🟡 Medium Strength' : '🔴 Weak Password'} ({metCount}/5)
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password following instructions below..."
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="rounded-2xl text-xs sm:text-sm py-3 pr-11 font-semibold text-foreground bg-background focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 hover:text-indigo-200 transition-all z-20 cursor-pointer flex items-center justify-center"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 shrink-0 text-indigo-400" /> : <Eye className="h-4 w-4 shrink-0 text-indigo-400" />}
                    </button>
                  </div>

                  {/* Password Strength Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full transition-all duration-500 ${
                        metCount === 5
                          ? 'bg-emerald-500'
                          : metCount >= 3
                          ? 'bg-amber-500'
                          : metCount >= 1
                          ? 'bg-rose-500'
                          : 'bg-slate-700'
                      }`}
                      animate={{ width: `${(metCount / 5) * 100}%` }}
                    />
                  </div>

                  {/* Interactive Live Validation Checklist with Cut/Strikethrough & Green Tick */}
                  <div className="pt-2 space-y-2 border-t border-slate-800/80">
                    <p className="text-[11px] font-bold text-slate-400">Password Security Instructions:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      
                      {/* Rule 1: Length */}
                      <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                        passwordCriteria.length ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/40 border border-slate-800'
                      }`}>
                        {passwordCriteria.length ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={passwordCriteria.length ? 'line-through text-emerald-400 font-semibold opacity-80' : 'text-slate-300 font-medium'}>
                          At least 8 characters long
                        </span>
                      </div>

                      {/* Rule 2: Uppercase Letter */}
                      <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                        passwordCriteria.uppercase ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/40 border border-slate-800'
                      }`}>
                        {passwordCriteria.uppercase ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={passwordCriteria.uppercase ? 'line-through text-emerald-400 font-semibold opacity-80' : 'text-slate-300 font-medium'}>
                          Contains Uppercase letter (A-Z)
                        </span>
                      </div>

                      {/* Rule 3: Lowercase Letter */}
                      <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                        passwordCriteria.lowercase ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/40 border border-slate-800'
                      }`}>
                        {passwordCriteria.lowercase ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={passwordCriteria.lowercase ? 'line-through text-emerald-400 font-semibold opacity-80' : 'text-slate-300 font-medium'}>
                          Contains Lowercase letter (a-z)
                        </span>
                      </div>

                      {/* Rule 4: Number */}
                      <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                        passwordCriteria.number ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/40 border border-slate-800'
                      }`}>
                        {passwordCriteria.number ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={passwordCriteria.number ? 'line-through text-emerald-400 font-semibold opacity-80' : 'text-slate-300 font-medium'}>
                          Contains Number (0-9)
                        </span>
                      </div>

                      {/* Rule 5: Special Character */}
                      <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 col-span-1 sm:col-span-2 ${
                        passwordCriteria.special ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/40 border border-slate-800'
                      }`}>
                        {passwordCriteria.special ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className={passwordCriteria.special ? 'line-through text-emerald-400 font-semibold opacity-80' : 'text-slate-300 font-medium'}>
                          Contains Special character (!@#$%^&*...)
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full rounded-2xl font-extrabold text-sm py-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl border border-primary/30"
            >
              {submitting ? 'Submitting Registration...' : 'Complete Student Registration'}
            </Button>
          </form>
          </>
        )}
      </div>
    </div>
  );
};
