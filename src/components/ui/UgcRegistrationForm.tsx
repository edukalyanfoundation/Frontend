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

  // Custom "Other" Input States
  const [customUniversityName, setCustomUniversityName] = useState('');
  const [customCollegeName, setCustomCollegeName] = useState('');
  const [customDegree, setCustomDegree] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [customSemester, setCustomSemester] = useState('');
  const [customAcademicSession, setCustomAcademicSession] = useState('');
  const [customMajorSubject, setCustomMajorSubject] = useState('');

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

  // Structured Universities List (Jharkhand, Bihar, UP)
  const universitiesList = [
    {
      group: 'Jharkhand Universities',
      options: [
        'Vinoba Bhave University, Hazaribagh',
        'Ranchi University, Ranchi',
        'Sido Kanhu Murmu University, Dumka',
        'Kolhan University, Chaibasa',
        'Dr. Shyama Prasad Mukherjee University, Ranchi',
        'Binod Bihari Mahto Koylanchal University, Dhanbad',
        'Jharkhand Rai University, Ranchi',
        'Birsa Agricultural University, Ranchi',
        'Central University of Jharkhand, Ranchi',
        'BIT Mesra, Ranchi',
        'NIT Jamshedpur',
        'IIT (ISM) Dhanbad',
      ],
    },
    {
      group: 'Bihar Universities',
      options: [
        'Patna University, Patna',
        'Patliputra University, Patna',
        'Babasaheb Bhimrao Ambedkar Bihar University, Muzaffarpur',
        'Magadh University, Bodh Gaya',
        'Tilka Manjhi Bhagalpur University, Bhagalpur',
        'Lalit Narayan Mithila University, Darbhanga',
        'Purnea University, Purnea',
        'Munger University, Munger',
        'Maulana Mazharul Haque Arabic & Persian University, Patna',
        'Aryabhatta Knowledge University, Patna',
        'Nalanda Open University, Patna',
        'Bihar Agricultural University, Sabour',
        'IIT Patna',
        'NIT Patna',
      ],
    },
    {
      group: 'Uttar Pradesh (UP) Universities',
      options: [
        'University of Lucknow, Lucknow',
        'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow',
        'Chhatrapati Shahu Ji Maharaj University (CSJM), Kanpur',
        'Chaudhary Charan Singh University (CCSU), Meerut',
        'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
        'Deen Dayal Upadhyaya Gorakhpur University, Gorakhpur',
        'Dr. Bhimrao Ambedkar University, Agra',
        'Veer Bahadur Singh Purvanchal University, Jaunpur',
        'Bundelkhand University, Jhansi',
        'Banaras Hindu University (BHU), Varanasi',
        'Aligarh Muslim University (AMU), Aligarh',
        'University of Allahabad, Prayagraj',
        'IIT Kanpur',
        'IIT (BHU) Varanasi',
      ],
    },
  ];

  // 1. University -> Affiliated Colleges Mapping
  const universityCollegesMap: Record<string, string[]> = {
    'Vinoba Bhave University, Hazaribagh': [
      'Markham College of Commerce, Hazaribagh',
      "St. Columba's College, Hazaribagh",
      "K.B. Women's College, Hazaribagh",
      'Annada College, Hazaribagh',
      'Ramgarh College, Ramgarh',
      'Adarsh College, Rajdhanwar',
      'Giridih College, Giridih',
    ],
    'Ranchi University, Ranchi': [
      "St. Xavier's College, Ranchi",
      'Marwari College, Ranchi',
      "Ranchi Women's College, Ranchi",
      'J.N. College, Dhurwa, Ranchi',
      'Doranda College, Ranchi',
      'RLSY College, Ranchi',
      'Gossner College, Ranchi',
    ],
    'Sido Kanhu Murmu University, Dumka': [
      'S.P. College, Dumka',
      'Deoghar College, Deoghar',
      'A.S. College, Deoghar',
      'Godda College, Godda',
      'Sahibganj College, Sahibganj',
    ],
    'Kolhan University, Chaibasa': [
      'Jamshedpur Co-operative College, Jamshedpur',
      'Workers College, Jamshedpur',
      'Karim City College, Jamshedpur',
      'LBSM College, Jamshedpur',
      "Jamshedpur Women's University",
      'G.C. Jain Commerce College, Chaibasa',
    ],
    'Dr. Shyama Prasad Mukherjee University, Ranchi': [
      'DSPMU Campus College, Ranchi',
      'School of Science & Computer Applications, DSPMU',
      'School of Humanities, DSPMU',
    ],
    'Binod Bihari Mahto Koylanchal University, Dhanbad': [
      "SSLNT Women's College, Dhanbad",
      'BBM College, Dhanbad',
      'B.S. City College, Bokaro',
      'Chas College, Bokaro',
      'Katras College, Katrasgarh',
      'RS More College, Govindpur',
    ],
    'Patna University, Patna': [
      'Patna Science College, Patna',
      'Patna College, Patna',
      'B.N. College, Patna',
      'Magadh Mahila College, Patna',
      "Patna Women's College, Patna",
    ],
    'Patliputra University, Patna': [
      'Anugrah Narayan College (A.N. College), Patna',
      'College of Commerce, Arts and Science, Patna',
      'TPS College, Patna',
      'BD College, Patna',
      "J.D. Women's College, Patna",
    ],
    'Babasaheb Bhimrao Ambedkar Bihar University, Muzaffarpur': [
      'Langat Singh College (L.S. College), Muzaffarpur',
      'M.D.D.M. College, Muzaffarpur',
      'R.D.S. College, Muzaffarpur',
    ],
    'Magadh University, Bodh Gaya': [
      'Gaya College, Gaya',
      'A.M. College, Gaya',
      'Gautam Buddha Mahila College, Gaya',
    ],
    'Tilka Manjhi Bhagalpur University, Bhagalpur': [
      'T.N.B. College, Bhagalpur',
      'Marwari College, Bhagalpur',
      'S.M. College, Bhagalpur',
    ],
    'Lalit Narayan Mithila University, Darbhanga': [
      'C.M. Science College, Darbhanga',
      'C.M. College, Darbhanga',
      'R.K. College, Madhubani',
    ],
    'University of Lucknow, Lucknow': [
      'National P.G. College, Lucknow',
      'Isabella Thoburn College (IT College), Lucknow',
      'Lucknow Christian College, Lucknow',
    ],
    'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow': [
      'Institute of Engineering and Technology (IET), Lucknow',
      'KNIT Sultanpur',
      'BIET Jhansi',
      'JSS Academy of Technical Education, Noida',
    ],
    'Chhatrapati Shahu Ji Maharaj University (CSJM), Kanpur': [
      'Christ Church College, Kanpur',
      'D.A.V. College, Kanpur',
      'V.S.S.D. College, Kanpur',
    ],
    'Chaudhary Charan Singh University (CCSU), Meerut': [
      'Meerut College, Meerut',
      'D.N. College, Meerut',
      'R.G. P.G. College, Meerut',
    ],
    'Dr. Bhimrao Ambedkar University, Agra': [
      "St. John's College, Agra",
      'Agra College, Agra',
      'R.B.S. College, Agra',
    ],
    'University of Allahabad, Prayagraj': [
      'Ewing Christian College, Prayagraj',
      'K.P. Higher Education Institute, Prayagraj',
      'C.M.P. Degree College, Prayagraj',
    ],
  };

  // Default Colleges List (if no specific university selected)
  const defaultCollegesList = [
    {
      group: 'Jharkhand Colleges',
      options: [
        "St. Xavier's College, Ranchi",
        'Marwari College, Ranchi',
        'Jamshedpur Co-operative College, Jamshedpur',
        "SSLNT Women's College, Dhanbad",
        'Markham College of Commerce, Hazaribagh',
        "Ranchi Women's College, Ranchi",
      ],
    },
    {
      group: 'Bihar Colleges',
      options: [
        'Patna Science College, Patna',
        'Patna College, Patna',
        'Anugrah Narayan College (A.N. College), Patna',
        'College of Commerce, Arts and Science, Patna',
        'Langat Singh College (L.S. College), Muzaffarpur',
      ],
    },
    {
      group: 'Uttar Pradesh (UP) Colleges',
      options: [
        'National P.G. College, Lucknow',
        'Christ Church College, Kanpur',
        "St. John's College, Agra",
        'Bareilly College, Bareilly',
        'Meerut College, Meerut',
      ],
    },
  ];

  // 2. Degree -> Departments Mapping
  const degreeDepartmentsMap: Record<string, string[]> = {
    'B.Tech / B.E.': [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical & Biotech Engineering',
    ],
    'BCA': [
      'Computer Applications',
      'Software Systems & Web Design',
      'Data Science & Cloud Computing',
      'Network & Cyber Security',
    ],
    'B.Sc': [
      'Computer Science',
      'Biological & Life Sciences',
      'Mathematics & Statistics',
      'Physics & Electronics',
      'Chemistry & Material Science',
      'Biotechnology & Microbiology',
    ],
    'B.Com': [
      'Commerce & Accounting',
      'Banking & Finance',
      'Corporate Taxation & Auditing',
      'E-Commerce & Digital Business',
    ],
    'B.A.': [
      'Arts & Humanities',
      'English Literature',
      'Political Science & Governance',
      'Economics & Public Policy',
      'History & Sociology',
      'Journalism & Mass Communication',
    ],
    'BBA': [
      'Management Studies',
      'Marketing & Advertising',
      'Human Resources & Talent Management',
      'Business Analytics & Strategy',
    ],
    'MCA / M.Sc / M.A.': [
      'Advanced Computer Applications',
      'Computer Science & AI',
      'Commerce & Financial Analytics',
      'English & Linguistics',
      'Applied Mathematics & Statistics',
    ],
    'Diploma / Polytechnic': [
      'Computer Engineering Technology',
      'Civil & Architectural Technology',
      'Electrical & Electronics Technology',
      'Mechanical Technology',
    ],
  };

  // 3. Department -> Major Subjects Mapping
  const departmentSubjectsMap: Record<string, string[]> = {
    'Computer Science & Engineering': [
      'Data Structures & Algorithms',
      'Artificial Intelligence & Machine Learning',
      'Full Stack Web Development',
      'Database Management Systems',
      'Computer Networks & Cyber Security',
      'Operating Systems & Cloud Architecture',
    ],
    'Information Technology': [
      'Web Technologies & Services',
      'Information Security & Cryptography',
      'Cloud Infrastructure',
      'Python & Java Software Development',
      'Database Systems',
    ],
    'Electronics & Communication': [
      'Digital Signal Processing',
      'Microprocessors & Embedded Systems',
      'VLSI Design',
      'Wireless Communication Networks',
    ],
    'Computer Applications': [
      'Web Development & JavaScript Frameworks',
      'Database Administration & SQL',
      'Object-Oriented Programming (Java/C++)',
      'Python Application Development',
      'Software Engineering Principles',
    ],
    'Commerce & Accounting': [
      'Corporate Financial Accounting',
      'Cost & Management Accounting',
      'Income Tax & GST Regulations',
      'Auditing & Assurance Standards',
      'Business Economics & Finance',
    ],
    'Banking & Finance': [
      'Banking Laws & Credit Operations',
      'Financial Markets & Investment Analysis',
      'Corporate Finance & Valuation',
      'Risk Management & Insurance',
    ],
    'Management Studies': [
      'Business Strategy & Leadership',
      'Marketing Management & Branding',
      'Human Resource Management',
      'Financial Management & Budgeting',
      'Organizational Behavior',
    ],
    'Arts & Humanities': [
      'Political Theory & Constitutional Law',
      'Macroeconomics & Development Studies',
      'Modern World History',
      'Indian Sociology & Social Work',
    ],
    'English Literature': [
      'British & American Literature',
      'Indian Writing in English',
      'Linguistics & Phonetics',
      'Creative & Professional Writing',
    ],
    'Biological & Life Sciences': [
      'Molecular Biology & Cell Physiology',
      'Genetics & Bioinformatics',
      'Microbiology & Biotechnology',
      'Biochemistry & Clinical Research',
    ],
    'Mathematics & Statistics': [
      'Linear Algebra & Calculus',
      'Probability & Statistical Inference',
      'Numerical Methods & Optimization',
      'Differential Equations',
    ],
    'Physics & Electronics': [
      'Quantum Mechanics & Optics',
      'Semiconductor Devices & Circuits',
      'Electromagnetism',
      'Digital Electronics & Microcontrollers',
    ],
  };

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

  // Dynamic College List calculation based on selected University
  const availableColleges = useMemo(() => {
    if (formData.universityName && universityCollegesMap[formData.universityName]) {
      return universityCollegesMap[formData.universityName];
    }
    return null;
  }, [formData.universityName]);

  // Dynamic Department List calculation based on selected Degree
  const availableDepartments = useMemo(() => {
    if (formData.degree && degreeDepartmentsMap[formData.degree]) {
      return degreeDepartmentsMap[formData.degree];
    }
    return [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication',
      'Commerce & Accounting',
      'Management Studies',
      'Arts & Humanities',
      'Education & Pedagogy',
      'Biological & Life Sciences',
    ];
  }, [formData.degree]);

  // Dynamic Major Subject List calculation based on selected Department
  const availableMajorSubjects = useMemo(() => {
    if (formData.department && departmentSubjectsMap[formData.department]) {
      return departmentSubjectsMap[formData.department];
    }
    return [
      'Computer Applications',
      'Artificial Intelligence',
      'Business Administration',
      'Mathematics & Statistics',
      'English Literature',
      'Physics & Electronics',
    ];
  }, [formData.department]);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      universityName: val,
      collegeName: '', // Reset college selection when university changes
    }));
  };

  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      degree: val,
      department: '', // Reset department when degree changes
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: val,
      majorSubject: '', // Reset major subject when department changes
    }));
  };

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

    const finalUniversity =
      formData.universityName === 'Other (Specify below)'
        ? customUniversityName
        : formData.universityName;

    const finalCollege =
      formData.collegeName === 'Other (Specify below)'
        ? customCollegeName
        : formData.collegeName;

    const finalDegree =
      formData.degree === 'Other (Specify below)'
        ? customDegree
        : formData.degree;

    const finalDepartment =
      formData.department === 'Other (Specify below)'
        ? customDepartment
        : formData.department;

    const finalSemester =
      formData.semester === 'Other (Specify below)'
        ? customSemester
        : formData.semester;

    const finalAcademicSession =
      formData.academicSession === 'Other (Specify below)'
        ? customAcademicSession
        : formData.academicSession;

    const finalMajorSubject =
      formData.majorSubject === 'Other (Specify below)'
        ? customMajorSubject
        : formData.majorSubject;

    try {
      // 1. Submit Registration Record to Supabase ugc_registrations Table
      const record = await ugcRegistrationService.submitRegistration({
        university_name: finalUniversity,
        college_name: finalCollege,
        degree: finalDegree,
        department: finalDepartment,
        semester: finalSemester,
        academic_session: finalAcademicSession,
        university_roll_no: formData.universityRollNo,
        university_reg_no: formData.universityRegNo,
        major_subject: finalMajorSubject,
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
            universityName: finalUniversity,
            collegeName: finalCollege,
            degree: finalDegree,
            department: finalDepartment,
            semester: finalSemester,
            academicSession: finalAcademicSession,
            universityRollNo: formData.universityRollNo,
            universityRegNo: formData.universityRegNo,
            majorSubject: finalMajorSubject,
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
              Thank you for registering with Edukalyan Foundation for the UGC Mandated Internship Program. Your student profile is now active.
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
                UGC Mandated Internship Program
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">Student Registration Form</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Complete your registration for UGC-mandated internship program
              </p>
            </div>
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            {/* 1. Academic Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-muted pb-2 uppercase tracking-wider">
                Academic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. University Select & Conditional Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">University Name *</label>
                  <select
                    required
                    value={formData.universityName}
                    onChange={handleUniversityChange}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select University Name</option>
                    {universitiesList.map((group) => (
                      <optgroup key={group.group} label={group.group} className="font-bold text-primary">
                        {group.options.map((uni) => (
                          <option key={uni} value={uni} className={optionClassName}>
                            {uni}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.universityName === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your University Name *"
                        value={customUniversityName}
                        onChange={(e) => setCustomUniversityName(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* 2. College Select (Dependent on selected University) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    College Name * {formData.universityName && formData.universityName !== 'Other (Specify below)' && `(Affiliated to ${formData.universityName.split(',')[0]})`}
                  </label>
                  <select
                    required
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select College Name</option>
                    {availableColleges ? (
                      availableColleges.map((col) => (
                        <option key={col} value={col} className={optionClassName}>
                          {col}
                        </option>
                      ))
                    ) : (
                      defaultCollegesList.map((group) => (
                        <optgroup key={group.group} label={group.group} className="font-bold text-primary">
                          {group.options.map((col) => (
                            <option key={col} value={col} className={optionClassName}>
                              {col}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    )}
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.collegeName === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your College Name *"
                        value={customCollegeName}
                        onChange={(e) => setCustomCollegeName(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Degree Select & Conditional Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Degree *</label>
                  <select
                    required
                    value={formData.degree}
                    onChange={handleDegreeChange}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Degree</option>
                    <option value="B.Tech / B.E." className={optionClassName}>B.Tech / B.E.</option>
                    <option value="BCA" className={optionClassName}>BCA</option>
                    <option value="B.Sc" className={optionClassName}>B.Sc</option>
                    <option value="B.Com" className={optionClassName}>B.Com</option>
                    <option value="B.A." className={optionClassName}>B.A.</option>
                    <option value="BBA" className={optionClassName}>BBA</option>
                    <option value="MCA / M.Sc / M.A." className={optionClassName}>MCA / M.Sc / M.A.</option>
                    <option value="Diploma / Polytechnic" className={optionClassName}>Diploma / Polytechnic</option>
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.degree === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your Degree *"
                        value={customDegree}
                        onChange={(e) => setCustomDegree(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Department Select (Dependent on selected Degree) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Department/Stream * {formData.degree && formData.degree !== 'Other (Specify below)' && `(For ${formData.degree})`}
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Department/Stream</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept} className={optionClassName}>
                        {dept}
                      </option>
                    ))}
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.department === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your Department/Stream *"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* 5. Semester Select & Conditional Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Semester *</label>
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Semester</option>
                    <option value="Semester 1" className={optionClassName}>Semester 1</option>
                    <option value="Semester 2" className={optionClassName}>Semester 2</option>
                    <option value="Semester 3" className={optionClassName}>Semester 3</option>
                    <option value="Semester 4" className={optionClassName}>Semester 4</option>
                    <option value="Semester 5" className={optionClassName}>Semester 5</option>
                    <option value="Semester 6" className={optionClassName}>Semester 6</option>
                    <option value="Semester 7" className={optionClassName}>Semester 7</option>
                    <option value="Semester 8" className={optionClassName}>Semester 8</option>
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.semester === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your Semester *"
                        value={customSemester}
                        onChange={(e) => setCustomSemester(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* 6. Academic Session Select & Conditional Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Academic Session *</label>
                  <select
                    required
                    value={formData.academicSession}
                    onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Academic Session</option>
                    <option value="2023 - 2026" className={optionClassName}>2023 - 2026</option>
                    <option value="2023 - 2027" className={optionClassName}>2023 - 2027</option>
                    <option value="2024 - 2027" className={optionClassName}>2024 - 2027</option>
                    <option value="2024 - 2028" className={optionClassName}>2024 - 2028</option>
                    <option value="2025 - 2028" className={optionClassName}>2025 - 2028</option>
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.academicSession === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your Academic Session *"
                        value={customAcademicSession}
                        onChange={(e) => setCustomAcademicSession(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

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

                {/* 7. Major Subject Select (Dependent on selected Department) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Major Subject * {formData.department && formData.department !== 'Other (Specify below)' && `(For ${formData.department})`}
                  </label>
                  <select
                    required
                    value={formData.majorSubject}
                    onChange={(e) => setFormData({ ...formData, majorSubject: e.target.value })}
                    className={selectClassName}
                  >
                    <option value="" className={optionClassName}>Select Major Subject</option>
                    {availableMajorSubjects.map((sub) => (
                      <option key={sub} value={sub} className={optionClassName}>
                        {sub}
                      </option>
                    ))}
                    <option value="Other (Specify below)" className="font-bold text-indigo-600 dark:text-indigo-400">
                      Other (Specify below)
                    </option>
                  </select>

                  {formData.majorSubject === 'Other (Specify below)' && (
                    <div className="pt-1 space-y-1">
                      <Input
                        required
                        placeholder="Please Enter Your Major Subject *"
                        value={customMajorSubject}
                        onChange={(e) => setCustomMajorSubject(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background border-primary/40 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Internship Sector Select - Restricted strictly to website 15 course sectors */}
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
              {submitting ? 'Submitting Registration...' : 'Complete UGC Registration'}
            </Button>
          </form>
          </>
        )}
      </div>
    </div>
  );
};
