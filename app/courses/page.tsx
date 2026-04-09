'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses } from '@/lib/api';
import { Search, Star, Filter, BookOpen, IndianRupee, Clock, GraduationCap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const CATEGORIES = ['All', 'Engineering', 'Management', 'Medical', 'Science', 'Law', 'Commerce', 'Design'];
const LEVELS = ['All', 'Undergraduate', 'Postgraduate', 'Diploma', 'PhD'];

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('rating');
  const [maxFees, setMaxFees] = useState('');
  const [total, setTotal] = useState(0);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, limit: '18' };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (level && level !== 'All') params.level = level;
      if (maxFees) params.maxFees = maxFees;
      const res = await getCourses(params);
      setCourses(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, [search, category, level, sort, maxFees]);

  const feeRanges = [
    { label: 'Any', value: '' },
    { label: '< ₹2L', value: '200000' },
    { label: '< ₹5L', value: '500000' },
    { label: '< ₹10L', value: '1000000' },
    { label: '< ₹25L', value: '2500000' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-indigo-300 text-xs mb-4">
          <BookOpen className="w-3.5 h-3.5" /> {total} Courses Available
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Explore Courses</h1>
        <p className="text-slate-500">Find the perfect program for your career goals</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl border border-white/8 p-5 mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses, universities..."
            className="w-full bg-white/5 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${(cat === 'All' && !category) || cat === category ? 'gradient-bg text-white font-medium' : 'glass border border-white/10 text-slate-400 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l === 'All' ? '' : l)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${(l === 'All' && !level) || l === level ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'glass border border-white/8 text-slate-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">Max Fees:</span>
            {feeRanges.map(r => (
              <button key={r.label} onClick={() => setMaxFees(r.value)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${maxFees === r.value ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'glass border border-white/8 text-slate-400 hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="ml-2 bg-white/5 rounded-xl px-3 py-1 text-slate-300 text-xs outline-none border border-white/8 cursor-pointer">
            <option value="rating" className="bg-gray-900">Top Rated</option>
            <option value="fees_asc" className="bg-gray-900">Fees: Low to High</option>
            <option value="fees_desc" className="bg-gray-900">Fees: High to Low</option>
            <option value="name" className="bg-gray-900">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => <div key={i} className="h-52 rounded-2xl shimmer" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No courses found. Try adjusting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course: any) => (
            <Link key={course._id} href={`/courses/${course._id}`}
              className="glass rounded-2xl p-5 border border-white/8 card-hover block group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">{course.category}</span>
                <div className="flex items-center gap-1 text-yellow-400 text-xs"><Star className="w-3 h-3 fill-current" />{course.rating}</div>
              </div>
              <h2 className="font-semibold text-white text-[15px] mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">{course.name}</h2>
              <p className="text-xs text-slate-500 mb-4 line-clamp-1">{course.universityName}</p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-indigo-400" />{course.duration} · {course.mode}</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-3 h-3 text-purple-400" />{course.level}</div>
                <div className="flex items-center gap-2"><IndianRupee className="w-3 h-3 text-emerald-400" />
                  ₹{((course.fees?.total || 0) / 100000).toFixed(1)}L total · ₹{((course.fees?.perSemester || 0) / 1000).toFixed(0)}K/sem
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-medium">Avg: ₹{course.avgPlacementPackage}LPA</span>
                <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-1 transition-transform inline-block">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
