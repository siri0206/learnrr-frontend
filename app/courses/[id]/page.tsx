'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourse } from '@/lib/api';
import { Star, Clock, GraduationCap, MapPin, Users, BookOpen, Briefcase, ChevronDown, ChevronUp, ArrowLeft, IndianRupee, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openSem, setOpenSem] = useState<number | null>(1);

  useEffect(() => {
    getCourse(id as string)
      .then(res => setCourse(res.data.data))
      .catch(() => router.push('/courses'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      <div className="h-10 w-48 rounded-xl shimmer mb-6" />
      <div className="h-64 rounded-2xl shimmer mb-6" />
      <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}</div>
    </div>
  );

  if (!course) return null;

  const uni = course.university;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Hero Card */}
      <div className="glass rounded-3xl border border-white/8 p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-5">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">{course.category}</span>
            <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/20">{course.level}</span>
            <span className="px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-300 border border-cyan-500/20">{course.mode}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{course.name}</h1>
          {uni && (
            <Link href={`/universities/${uni._id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-300 transition-colors mb-4">
              <MapPin className="w-4 h-4" />{uni.name} · {uni.location}
            </Link>
          )}
          <p className="text-slate-400 leading-relaxed mb-6 max-w-3xl">{course.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Duration', value: course.duration, icon: Clock },
              { label: 'Total Fees', value: `₹${((course.fees?.total || 0) / 100000).toFixed(1)}L`, icon: IndianRupee },
              { label: 'Avg Package', value: `₹${course.avgPlacementPackage}LPA`, icon: Briefcase },
              { label: 'Total Seats', value: course.seats, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-4 border border-white/8 text-center">
                <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link href={`/apply/${course._id}`}
                className="gradient-bg px-8 py-3 rounded-2xl text-white font-semibold glow hover:opacity-90 transition-opacity text-sm">
                Apply Now →
              </Link>
            ) : (
              <Link href={`/auth/login?redirect=/apply/${course._id}`}
                className="gradient-bg px-8 py-3 rounded-2xl text-white font-semibold glow hover:opacity-90 transition-opacity text-sm">
                Login to Apply
              </Link>
            )}
            <div className="flex items-center gap-1.5 text-yellow-400 glass px-4 py-3 rounded-2xl border border-white/8 text-sm">
              <Star className="w-4 h-4 fill-current" /><span className="font-bold">{course.rating}</span><span className="text-slate-500 text-xs">/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Highlights */}
          <div className="glass rounded-2xl border border-white/8 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-400" />Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(course.highlights || []).map((h: string) => (
                <div key={h} className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />{h}
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div className="glass rounded-2xl border border-white/8 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400" />Semester-wise Syllabus</h2>
            <div className="space-y-2">
              {(course.syllabus || []).map((sem: any) => (
                <div key={sem.semester} className="rounded-xl border border-white/8 overflow-hidden">
                  <button
                    onClick={() => setOpenSem(openSem === sem.semester ? null : sem.semester)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors">
                    <span>Semester {sem.semester}</span>
                    {openSem === sem.semester ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openSem === sem.semester && (
                    <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sem.subjects.map((sub: string) => (
                        <div key={sub} className="flex items-center gap-2 text-xs text-slate-400 bg-white/3 rounded-lg px-3 py-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />{sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Careers */}
          <div className="glass rounded-2xl border border-white/8 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-400" />Career Opportunities</h2>
            <div className="flex flex-wrap gap-2">
              {(course.careers || []).map((c: string) => (
                <span key={c} className="px-3 py-1.5 rounded-xl text-sm bg-white/5 border border-white/8 text-slate-300">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Eligibility */}
          <div className="glass rounded-2xl border border-white/8 p-5">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-400" />Eligibility</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{course.eligibility}</p>
          </div>

          {/* Fee Breakdown */}
          <div className="glass rounded-2xl border border-white/8 p-5">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2"><IndianRupee className="w-4 h-4 text-emerald-400" />Fee Structure</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400"><span>Per Semester</span><span className="text-white font-medium">₹{((course.fees?.perSemester || 0) / 1000).toFixed(0)}K</span></div>
              <div className="flex justify-between text-slate-400"><span>Total ({course.duration})</span><span className="text-emerald-400 font-bold">₹{((course.fees?.total || 0) / 100000).toFixed(1)}L</span></div>
            </div>
          </div>

          {/* Top Recruiters */}
          <div className="glass rounded-2xl border border-white/8 p-5">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-400" />Top Recruiters</h3>
            <div className="flex flex-wrap gap-2">
              {(course.topRecruiters || []).map((r: string) => (
                <span key={r} className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/15 border border-purple-500/20 text-purple-300">{r}</span>
              ))}
            </div>
          </div>

          {/* University Card */}
          {uni && (
            <div className="glass rounded-2xl border border-white/8 p-5">
              <h3 className="font-bold text-white mb-3 text-sm">About the University</h3>
              <img src={uni.imageUrl} alt={uni.name} className="w-full h-28 object-cover rounded-xl mb-3" />
              <p className="font-semibold text-white text-sm mb-1">{uni.name}</p>
              <p className="text-xs text-slate-500 mb-2">{uni.location}</p>
              <div className="flex items-center gap-3 text-xs mb-3">
                <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" />{uni.rating}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{uni.accreditation}</span>
              </div>
              <Link href={`/universities/${uni._id}`} className="block text-center text-xs py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all">
                View University →
              </Link>
            </div>
          )}

          {isAuthenticated ? (
            <Link href={`/apply/${course._id}`} className="block w-full text-center gradient-bg px-6 py-4 rounded-2xl text-white font-bold glow hover:opacity-90 transition-opacity">
              Apply Now →
            </Link>
          ) : (
            <Link href={`/auth/login?redirect=/apply/${course._id}`} className="block w-full text-center gradient-bg px-6 py-4 rounded-2xl text-white font-bold glow hover:opacity-90 transition-opacity">
              Login to Apply →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
