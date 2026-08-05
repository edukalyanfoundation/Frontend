import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { courseService, CourseRow } from '@/services/courseService';
import { INTERNSHIP_SECTORS } from '@/admin/AdminCoursesPage';

export const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAllCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...INTERNSHIP_SECTORS];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || course.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 py-10 space-y-12">
        {/* Header Hero */}
        <section className="container mx-auto px-4 md:px-6 text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-xs">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>ISO Certified & MSME Recognized Profession Courses</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Courses Tailored for <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Every Profession</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Select your professional field to discover certified internships, skill workshops, and practical learning programs designed to boost your career.
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-indigo-400" />
                <Input
                  type="text"
                  placeholder="Search by profession or keyword (e.g. Teacher, AI, Cyber Security)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-2xl h-14 bg-slate-900/60 border-slate-800/80 backdrop-blur-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-xl"
                />
              </div>
            </div>

            {/* Profession Category Tabs */}
            <div className="pt-4 flex items-center justify-center gap-2 flex-wrap max-w-5xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                    selectedCategory === cat
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
              Showing <strong className="text-white font-extrabold">{filteredCourses.length}</strong> Profession Courses
            </span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-indigo-400 font-extrabold hover:underline transition-colors"
              >
                ← Clear Category Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl max-w-lg mx-auto p-8 shadow-xl">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Loading Courses Catalog...</h3>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl max-w-lg mx-auto p-8 shadow-xl">
              <BookOpen className="h-12 w-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-extrabold text-white">No Profession Courses Found</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">Try searching for a different keyword or select "All" categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, idx) => (
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
                        src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"} 
                        alt={course.title} 
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
                      
                      <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">{course.title}</h3>
                      
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">{course.description}</p>

                      {Array.isArray(course.skills) && course.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {course.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Live Class & PDF Buttons for Students */}
                      {(course.live_class_url || course.pdf_url) && (
                        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                          {course.live_class_url && (
                            <a
                              href={course.live_class_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-500/25 transition-colors"
                            >
                              <Video className="h-3.5 w-3.5" /> Join Live Class
                            </a>
                          )}
                          {course.pdf_url && (
                            <a
                              href={course.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-500/25 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5" /> Course PDF
                            </a>
                          )}
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
                      <Button className="w-full rounded-2xl text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02]">
                        Apply & Enroll Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
