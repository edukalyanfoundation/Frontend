import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, Button } from '@edukalyan/ui';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Clock,
  GraduationCap,
  Users,
  Star,
  AlertCircle,
} from 'lucide-react';
import { courseService, CourseRow, CreateCourseInput } from '@/services/courseService';
import { uploadFileToCloudinary, deleteFileFromCloudinary } from '@/services/cloudinaryService';
import { Video, FileText, Upload } from 'lucide-react';

export const INTERNSHIP_SECTORS = [
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

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Form Field States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(INTERNSHIP_SECTORS[0]);
  const [profession, setProfession] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [mode, setMode] = useState('Online Live & Practical Project');
  const [certificateType, setCertificateType] = useState('Verified Certificate');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [rating, setRating] = useState(5.0);
  const [enrolledStudents, setEnrolledStudents] = useState(120);
  const [imageUrl, setImageUrl] = useState('');
  const [liveClassUrl, setLiveClassUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    const data = await courseService.getAllCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory(INTERNSHIP_SECTORS[0]);
    setProfession('');
    setDuration('3 Months');
    setMode('Online Live & Practical Project');
    setCertificateType('Verified Certificate');
    setDescription('');
    setSkillsStr('');
    setRating(5.0);
    setEnrolledStudents(120);
    setImageUrl('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80');
    setLiveClassUrl('');
    setPdfUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (course: CourseRow) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setProfession(course.profession);
    setDuration(course.duration);
    setMode(course.mode);
    setCertificateType(course.certificate_type);
    setDescription(course.description);
    setSkillsStr(Array.isArray(course.skills) ? course.skills.join(', ') : '');
    setRating(course.rating || 5.0);
    setEnrolledStudents(course.enrolled_students || 120);
    setImageUrl(course.image_url || '');
    setLiveClassUrl(course.live_class_url || '');
    setPdfUrl(course.pdf_url || '');
    setIsModalOpen(true);
  };

  const handlePdfFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If an existing PDF URL is present, clean up the old file on Cloudinary
    if (pdfUrl) {
      deleteFileFromCloudinary(pdfUrl);
    }

    setUploadingPdf(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setPdfUrl(url);
    } catch (err) {
      console.error('PDF upload error:', err);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleRemovePdf = async () => {
    if (pdfUrl) {
      await deleteFileFromCloudinary(pdfUrl);
      setPdfUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSaving(true);
    const parsedSkills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const inputData: CreateCourseInput = {
      title,
      category,
      profession: profession || 'Students & Beginners',
      duration: duration || '3 Months',
      mode: mode || 'Online',
      certificate_type: certificateType || 'Verified Certificate',
      description,
      skills: parsedSkills.length > 0 ? parsedSkills : ['Skill 1', 'Skill 2'],
      rating: Number(rating),
      enrolled_students: Number(enrolledStudents),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      live_class_url: liveClassUrl.trim() || null,
      pdf_url: pdfUrl.trim() || null,
    };

    if (editingCourse) {
      await courseService.updateCourse(editingCourse.id, inputData);
      setCourses((prev) =>
        prev.map((c) => (c.id === editingCourse.id ? { ...c, ...inputData, updated_at: new Date().toISOString() } : c))
      );
    } else {
      const created = await courseService.createCourse(inputData);
      if (created) {
        setCourses((prev) => [created, ...prev]);
      }
    }

    setSaving(false);
    setIsModalOpen(false);
  };

  const handleDeleteCourse = async (course: CourseRow) => {
    if (window.confirm(`Are you sure you want to delete course "${course.title}" from Supabase database?`)) {
      setDeletingId(course.id);

      // Clean up associated PDF file from Cloudinary storage if present
      if (course.pdf_url) {
        await deleteFileFromCloudinary(course.pdf_url);
      }

      await courseService.deleteCourse(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      selectedSector === 'All' || course.category.toLowerCase() === selectedSector.toLowerCase();

    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Courses & Sectors <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">Management</span>
                </h1>
                <p className="text-xs text-slate-300">
                  Manage internship sector courses synced directly with Supabase Database
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={openCreateModal}
            className="rounded-2xl text-xs font-extrabold gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white shadow-lg shadow-purple-500/20 py-2.5 px-5"
          >
            <Plus className="h-4 w-4" /> Add New Course
          </Button>
        </div>
      </div>

      {/* Toolbar & Sector Filter */}
      <Card glass className="p-4 border-slate-800 bg-slate-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search course title, sector, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 pl-9 pr-8 py-2.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sector Category Dropdown */}
          <div className="w-full sm:w-64">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
            >
              <option value="All">🌐 All Internship Sectors</option>
              {INTERNSHIP_SECTORS.map((sector) => (
                <option key={sector} value={sector} className="bg-slate-900">
                  {sector}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Courses Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-semibold">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading course catalog from Supabase DB...
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-semibold bg-slate-900/60 rounded-3xl border border-slate-800">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-10 w-10 text-slate-500" />
              No courses found for selected sector or search query.
            </div>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              glass
              className="group relative flex flex-col justify-between overflow-hidden border-slate-800 bg-slate-900/80 hover:border-purple-500/40 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Course Banner Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                    {course.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 text-[10px] font-extrabold text-amber-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400" /> {course.rating || 5.0}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
                      <Clock className="h-3 w-3 text-purple-400" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
                      <GraduationCap className="h-3 w-3 text-indigo-400" /> {course.mode}
                    </span>
                  </div>

                  {/* Live Class & PDF Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {course.live_class_url && (
                      <a
                        href={course.live_class_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-lg text-[10px] font-extrabold hover:bg-rose-500/25"
                      >
                        <Video className="h-3 w-3" /> Live Class Link
                      </a>
                    )}
                    {course.pdf_url && (
                      <a
                        href={course.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-lg text-[10px] font-extrabold hover:bg-indigo-500/25"
                      >
                        <FileText className="h-3 w-3" /> Study PDF Material
                      </a>
                    )}
                  </div>

                  {/* Skills tags */}
                  {Array.isArray(course.skills) && course.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-purple-950/40 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-500" /> {course.enrolled_students} Students
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(course)}
                    className="rounded-xl text-xs font-bold gap-1 border-slate-700 bg-slate-800/80 text-purple-300 hover:bg-purple-950/40"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingId === course.id}
                    onClick={() => handleDeleteCourse(course)}
                    className="rounded-xl text-xs font-bold gap-1 border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> {deletingId === course.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create / Edit Course Modal (Rendered via React Portal with high z-index to overlay Navbar and Footer) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] relative z-[100000]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {editingCourse ? 'Edit Course Record' : 'Create New Course Record'}
                    </h3>
                    <p className="text-xs text-slate-400">Save course details into Supabase database</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Title & Internship Sector Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Web Development Masterclass"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Internship Sector Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                    >
                      {INTERNSHIP_SECTORS.map((sector) => (
                        <option key={sector} value={sector} className="bg-slate-900">
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Profession & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Target Profession / Audience</label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="e.g. Software Engineers & Web Developers"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 Months, 6 Weeks"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                {/* Delivery Mode & Certificate Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Delivery Mode</label>
                    <input
                      type="text"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      placeholder="e.g. Online Live & Practical Project"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Certificate Type</label>
                    <input
                      type="text"
                      value={certificateType}
                      onChange={(e) => setCertificateType(e.target.value)}
                      placeholder="e.g. Verified Certificate"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Course Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief overview of course objectives and curriculum..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                {/* Skills learned */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Key Skills Learned (Comma-Separated)</label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="e.g. React, Node.js, PostgreSQL, Tailwind CSS"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                {/* Image URL & Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Cover Image URL</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Rating (1 to 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                {/* Live Class URL & PDF Material Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-rose-400" /> Live Class Link (Zoom/YouTube/Meet/Teams)
                    </label>
                    <input
                      type="url"
                      value={liveClassUrl}
                      onChange={(e) => setLiveClassUrl(e.target.value)}
                      placeholder="e.g. https://zoom.us/j/... or https://youtube.com/live/..."
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-indigo-400" /> Course Study Material PDF
                      </span>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePdf}
                          className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline"
                        >
                          Remove PDF
                        </button>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pdfUrl}
                        onChange={(e) => setPdfUrl(e.target.value)}
                        placeholder="PDF URL or Upload File..."
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <label className="px-3 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer text-xs shrink-0 flex items-center gap-1 shadow-md">
                        <Upload className="h-3.5 w-3.5" /> {uploadingPdf ? 'Uploading...' : pdfUrl ? 'Change PDF' : 'Upload PDF'}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfFileSelect}
                          className="hidden"
                          disabled={uploadingPdf}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-2xl font-bold border-slate-700 bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                  >
                    {saving ? 'Saving to Supabase...' : editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
