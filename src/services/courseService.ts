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
    id: 'c1',
    title: 'Teacher Training & Pedagogy Masterclass',
    category: 'Teacher Training',
    profession: 'Educators, School Teachers & Instructors',
    duration: '3 Months',
    mode: 'Live Workshop & Practical Teaching',
    certificate_type: 'Certified Professional Educator',
    description: 'Comprehensive pedagogical training, modern classroom management, digital teaching tools, lesson planning, and student engagement techniques.',
    skills: ['Classroom Management', 'Lesson Planning', 'Digital Tools', 'Child Psychology'],
    rating: 5.0,
    enrolled_students: 1450,
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    title: 'Artificial Intelligence & Machine Learning Certificate',
    category: 'Artificial Intelligence',
    profession: 'AI Developers, Data Analysts & Tech Engineers',
    duration: '4 Months',
    mode: 'Hands-On Coding & Project Build',
    certificate_type: 'Certified AI Practitioner Badge',
    description: 'Master Artificial Intelligence concepts, Python machine learning algorithms, Neural Networks, Computer Vision, and Generative AI applications.',
    skills: ['Python', 'Machine Learning', 'Neural Networks', 'Prompt Engineering'],
    rating: 4.9,
    enrolled_students: 2100,
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    title: 'Full-Stack Web Development Bootcamp',
    category: 'Web Development',
    profession: 'Software Engineers & Web Developers',
    duration: '6 Months',
    mode: 'Online Interactive & Project Portfolio',
    certificate_type: 'Full-Stack Developer Credential',
    description: 'Learn modern Web Development from HTML, CSS, JavaScript, React, Node.js, and Supabase PostgreSQL to cloud deployment.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    rating: 5.0,
    enrolled_students: 3200,
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
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
