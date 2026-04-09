'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses, getUniversities } from '@/lib/api';
import { Search, ArrowRight, GraduationCap, Building2, BookOpen, TrendingUp, Star, MapPin, ChevronRight, Sparkles, Users, Award } from 'lucide-react';

const CATEGORIES = ['Engineering', 'Management', 'Medical', 'Science', 'Law', 'Commerce', 'Design'];

const stats = [
  { label: 'Universities', value: '500+', icon: Building2 },
  { label: 'Courses', value: '2000+', icon: BookOpen },
  { label: 'Students', value: '50K+', icon: Users },
  { label: 'Success Rate', value: '96%', icon: Award },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [topUniversities, setTopUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCourses({ limit: '6', sort: 'rating' }),
      getUniversities({ limit: '4', sort: 'ranking' }),
    ]).then(([cRes, uRes]) => {
      setFeaturedCourses(cRes.data.data || []);
      setTopUniversities(uRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm mb-8 glow-sm">
            <Sparkles className="w-4 h-4" />
            India&apos;s Futuristic Admission Portal · Hyderabad
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Improve</span>
            <br />
            <span className="text-white">Your Admissions</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Discover top universities across India, explore thousands of courses, compare fees &amp; syllabus, and apply — all in one place.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative glass rounded-2xl border border-white/10 p-2 flex gap-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search courses, universities, cities..."
                className="flex-1 bg-transparent pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none text-[15px]"
              />
              <button type="submit" className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity glow-sm shrink-0">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/courses?category=${cat}`}
                className="px-4 py-1.5 rounded-full glass border border-white/10 text-sm text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-all">
                {cat}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-5 border border-white/8 text-center card-hover">
                <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Top Courses</h2>
            <p className="text-slate-500">Highest rated programs across India</p>
          </div>
          <Link href="/courses" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl shimmer" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCourses.map((course: any) => (
              <Link key={course._id} href={`/courses/${course._id}`}
                className="glass rounded-2xl p-5 border border-white/8 card-hover block group">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs">{course.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-white text-[15px] mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">{course.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{course.universityName}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <div className="text-lg font-bold text-white">₹{((course.fees?.total || 0) / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-slate-500">Total Fees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-400">{course.duration}</div>
                    <div className="text-xs text-slate-500">{course.level}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Top Universities ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Top Universities</h2>
            <p className="text-slate-500">Leading institutions in Hyderabad & India</p>
          </div>
          <Link href="/universities" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl shimmer" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {topUniversities.map((uni: any) => (
              <Link key={uni._id} href={`/universities/${uni._id}`}
                className="glass rounded-2xl p-5 border border-white/8 card-hover flex gap-4 group">
                <img src={uni.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=200`}
                  alt={uni.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-[15px] group-hover:text-indigo-300 transition-colors line-clamp-1">{uni.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 shrink-0">#{uni.ranking}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3 h-3" />{uni.location}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs"><Star className="w-3 h-3 fill-current" />{uni.rating}</div>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{uni.accreditation}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-emerald-400">{uni.placementRate}% placed</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl border border-indigo-500/20 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10" />
          <div className="relative z-10">
            <GraduationCap className="w-14 h-14 text-indigo-400 mx-auto mb-5 animate-float" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-slate-400 mb-8">Join 50,000+ students who found their dream course through LEARNRR.IN</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/signup" className="gradient-bg px-8 py-3 rounded-2xl text-white font-semibold glow hover:opacity-90 transition-opacity">
                Create Free Account
              </Link>
              <Link href="/courses" className="glass px-8 py-3 rounded-2xl text-white font-semibold border border-white/10 hover:border-indigo-500/40 transition-all">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-slate-600 text-sm">
        <p>© 2024 LEARNRR.IN · Hyderabad, Telangana, India · Built to improve admissions 🎓</p>
      </footer>
    </div>
  );
}
