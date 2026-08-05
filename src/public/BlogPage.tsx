import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  readTime: string;
  image: string;
}

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const posts: BlogPost[] = [
    {
      id: 'b1',
      title: 'Why Practical Internship Experience is Essential for Every Student',
      category: 'Career Guidance',
      date: 'Aug 02, 2026',
      author: 'Edukalyan Advisory Board',
      excerpt: 'The job market has evolved. 87% of employers prefer candidates with real project exposure. Learn how Edukalyan Foundation internships give you a competitive edge.',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'b2',
      title: 'How to Verify Your Edukalyan Foundation Digital Certificate Online',
      category: 'Student Portal',
      date: 'Jul 28, 2026',
      author: 'Edukalyan Credential Desk',
      excerpt: 'Step-by-step guide for candidates and employers to instantly verify digital certificates, marksheets, and grades on our official verification portal.',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'b3',
      title: 'UGC-Mandated Internship Guidelines: A Complete Student Roadmap',
      category: 'Academic Compliance',
      date: 'Jul 15, 2026',
      author: 'Edukalyan Academic Team',
      excerpt: 'Understanding university requirements for UGC-compliant internship credits, project documentation, attendance logs, and marksheet generation.',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'b4',
      title: 'Top 5 Skills Employers Look For in 2026 Fresh Graduates',
      category: 'Skill Enhancement',
      date: 'Jul 10, 2026',
      author: 'Career Guidance Team',
      excerpt: 'From React 19 web development and Python data analytics to effective corporate communication—discover key competencies for career success.',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative z-10 overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 py-10 space-y-12">
        {/* Blog Hero */}
        <section className="container mx-auto px-4 md:px-6 text-center space-y-5 max-w-3xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-xs">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Empowering Students. Transforming Futures.</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Edukalyan <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Blog & Career Insights</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Stay updated with internship guides, UGC compliance roadmaps, and career development articles from Edukalyan Foundation.
            </p>

            {/* Search Box */}
            <div className="relative max-w-md mx-auto pt-4">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-indigo-400" />
              <Input
                type="text"
                placeholder="Search articles by topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 rounded-2xl h-12 bg-slate-900/60 border-slate-800/80 backdrop-blur-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="container mx-auto px-4 md:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                    <img 
                      src={post.image} 
                      alt="" 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                    <div className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-indigo-300 border border-indigo-500/30 shadow-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-indigo-400" /> {post.author}
                      </span>
                      <span>•</span>
                      <span className="text-indigo-300 font-bold">{post.readTime}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a href="/#register-form">
                    <Button className="w-full rounded-2xl text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02]">
                      Read Full Article <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
