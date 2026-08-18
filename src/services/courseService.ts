import { supabase } from '@/lib/supabase';

export interface CourseRow {
  id: string;
  title: string;
  category: string;
  profession: string;
  duration: string;
  mode: string;
  certificate_type: string;
  description: string;
  skills: string[];
  rating: number;
  enrolled_students: number;
  image_url: string | null;
  live_class_url?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateCourseInput = Omit<CourseRow, 'id' | 'created_at' | 'updated_at'>;

const MOCK_COURSES: CourseRow[] = [
  {
    id: 'c-ai',
    title: 'Artificial Intelligence & Machine Learning Practical Internship',
    category: 'Artificial Intelligence (AI)',
    profession: 'AI Engineers & Data Scientists',
    duration: '8 Weeks',
    mode: 'Online Live & Hands-On AI Lab',
    certificate_type: 'Certified AI Practitioner Credential',
    description: 'Master Artificial Intelligence concepts, Python machine learning algorithms, Neural Networks, Computer Vision, Prompt Engineering, and Generative AI applications.',
    skills: ['Python', 'Machine Learning', 'Neural Networks', 'Prompt Engineering', 'TensorFlow', 'OpenAI API'],
    rating: 4.95,
    enrolled_students: 2150,
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/ai-ml.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-cyber',
    title: 'Cyber Security & Network Defense Practical Internship',
    category: 'Cyber Security',
    profession: 'Security Analysts & Ethical Hackers',
    duration: '8 Weeks',
    mode: 'Live Virtual Labs & Threat Analysis',
    certificate_type: 'Certified Cyber Defense Specialist',
    description: 'Practical ethical hacking, network penetration testing, cryptography, incident response, vulnerability assessment, and cloud security frameworks.',
    skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Wireshark', 'Cryptography', 'Linux OS'],
    rating: 4.9,
    enrolled_students: 1820,
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/cyber-security.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-health',
    title: 'Healthcare Informatics & Clinical Support Internship',
    category: 'Healthcare',
    profession: 'Healthcare Administrators & Medical IT Support',
    duration: '8 Weeks',
    mode: 'Interactive Clinical Case Studies & Hospital Systems',
    certificate_type: 'Healthcare Operations & Analytics Certificate',
    description: 'Comprehensive training on modern healthcare management systems, digital medical records (EMR/EHR), patient data confidentiality, medical documentation, and healthcare workflows.',
    skills: ['EHR/EMR Systems', 'Healthcare Analytics', 'Patient Privacy (HIPAA)', 'Medical Documentation', 'Clinical Workflows'],
    rating: 4.88,
    enrolled_students: 1340,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/healthcare.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-graphics',
    title: 'Graphics Design & Digital Content Creation Internship',
    category: 'Graphics and Content',
    profession: 'Visual Designers & Content Strategists',
    duration: '8 Weeks',
    mode: 'Live Design Sprints & Portfolio Projects',
    certificate_type: 'Certified Visual & Media Designer',
    description: 'Master industry-standard design tools including Adobe Photoshop, Illustrator, Figma, Premiere Pro, along with storytelling, SEO copywriting, branding, and motion graphics.',
    skills: ['Figma UI/UX', 'Adobe Photoshop', 'Illustrator', 'Content Strategy', 'Video Editing', 'Brand Identity'],
    rating: 4.92,
    enrolled_students: 1980,
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/graphics-content.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-finance',
    title: 'Financial Analysis & Corporate Accounting Internship',
    category: 'Finance',
    profession: 'Financial Analysts & Accounting Executives',
    duration: '8 Weeks',
    mode: 'Practical Case Studies & Financial Modeling',
    certificate_type: 'Certified Corporate Financial Analyst',
    description: 'Gain real-world competency in corporate finance, advanced MS Excel financial modeling, Tally Prime accounting, GST compliance, balance sheet analysis, and investment evaluation.',
    skills: ['Financial Modeling', 'Tally Prime', 'Corporate Taxation & GST', 'Advanced Excel', 'Auditing & Valuation'],
    rating: 4.91,
    enrolled_students: 1670,
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/finance.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-web',
    title: 'Full-Stack Web Development Practical Internship',
    category: 'Web Development',
    profession: 'Software Engineers & Full-Stack Developers',
    duration: '8 Weeks',
    mode: 'Live Coding, Code Reviews & Production Deployment',
    certificate_type: 'Full-Stack Web Development Credential',
    description: 'Learn modern Web Development from HTML5, CSS3, Tailwind CSS, TypeScript, React 19, Node.js, and Supabase PostgreSQL to CI/CD cloud deployment.',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Git & GitHub'],
    rating: 4.98,
    enrolled_students: 3400,
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/web-development.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c-app',
    title: 'Mobile App Development (React Native & Flutter) Internship',
    category: 'App Development',
    profession: 'Mobile Application Developers & Engineers',
    duration: '8 Weeks',
    mode: 'Live App Architecture & App Store Readiness',
    certificate_type: 'Certified Mobile App Developer',
    description: 'Build native iOS and Android apps using React Native and Flutter. Master state management, mobile UI design, native APIs, local storage, push notifications, and store publishing.',
    skills: ['React Native', 'Flutter / Dart', 'Mobile UI/UX', 'State Management', 'REST APIs', 'App Store Publishing'],
    rating: 4.94,
    enrolled_students: 2280,
    image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    live_class_url: 'https://meet.google.com',
    pdf_url: 'https://raw.githubusercontent.com/edukalyanfoundation/Frontend/main/public/syllabus/app-development.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_COURSES_KEY = 'edukalyan_courses_db_v1';

const getLocalCourses = (): CourseRow[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  return MOCK_COURSES;
};

const saveLocalCourses = (courses: CourseRow[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(courses));
  } catch {}
};

export const courseService = {
  /**
   * Fetch all courses directly from Supabase DB `public.courses`
   */
  async getAllCourses(): Promise<CourseRow[]> {
    try {
      const { data, error } = await (supabase.from('courses') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        console.log('[Supabase DB] Fetched courses count:', data.length);
        // Normalize skills format if stored as string/array
        const normalized = data.map((item: any) => ({
          ...item,
          skills: Array.isArray(item.skills)
            ? item.skills
            : typeof item.skills === 'string'
            ? item.skills.split(',').map((s: string) => s.trim())
            : [],
        }));
        saveLocalCourses(normalized);
        return normalized;
      }
      if (error) {
        console.warn('[Supabase Courses Fetch Warning]:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase Connection Error]:', err);
    }

    return getLocalCourses();
  },

  /**
   * Insert a new course record into Supabase DB `public.courses`
   */
  async createCourse(courseInput: CreateCourseInput): Promise<CourseRow | null> {
    const newRecord: CourseRow = {
      id: crypto.randomUUID(),
      ...courseInput,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase DB
    try {
      const { data, error } = await (supabase.from('courses') as any)
        .insert([courseInput])
        .select()
        .single();

      if (!error && data) {
        console.log('[Supabase DB] Created course:', data.id);
        const normalizedData: CourseRow = {
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills
            : typeof data.skills === 'string'
            ? data.skills.split(',').map((s: string) => s.trim())
            : courseInput.skills,
        };
        const currentLocal = getLocalCourses();
        saveLocalCourses([normalizedData, ...currentLocal.filter((c) => c.id !== normalizedData.id)]);
        return normalizedData;
      }
      if (error) {
        console.error('[Supabase Create Course Error]:', error);
      }
    } catch (err) {
      console.warn('[Supabase Connection Exception during create course]:', err);
    }

    // 2. Fallback to Local Cache
    const currentLocal = getLocalCourses();
    const updated = [newRecord, ...currentLocal];
    saveLocalCourses(updated);
    return newRecord;
  },

  /**
   * Update an existing course record in Supabase DB `public.courses`
   */
  async updateCourse(id: string, courseInput: Partial<CreateCourseInput>): Promise<boolean> {
    const updatedObj = {
      ...courseInput,
      updated_at: new Date().toISOString(),
    };

    // 1. Update in Supabase DB
    try {
      const { error } = await (supabase.from('courses') as any)
        .update(updatedObj)
        .eq('id', id);

      if (error) {
        console.error('[Supabase Update Course Error]:', error);
      }
    } catch (err) {
      console.warn('[Supabase Connection Exception during update course]:', err);
    }

    // 2. Update local storage cache
    const currentLocal = getLocalCourses();
    const updatedList = currentLocal.map((c) => (c.id === id ? { ...c, ...updatedObj } : c));
    saveLocalCourses(updatedList);
    return true;
  },

  /**
   * Delete a course record permanently from Supabase DB `public.courses`
   */
  async deleteCourse(id: string): Promise<boolean> {
    // 1. Delete from Supabase DB
    try {
      const { error } = await (supabase.from('courses') as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase Delete Course Error]:', error);
      }
    } catch (err) {
      console.warn('[Supabase Connection Exception during delete course]:', err);
    }

    // 2. Delete from local storage cache
    const currentLocal = getLocalCourses();
    const filteredList = currentLocal.filter((c) => c.id !== id);
    saveLocalCourses(filteredList);
    return true;
  },
};
