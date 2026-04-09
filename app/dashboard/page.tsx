'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMyApplications } from '@/lib/api';
import Link from 'next/link';
import { LayoutDashboard, FileText, BookOpen, Building2, Clock, CheckCircle, XCircle, AlertCircle, Star, GraduationCap, TrendingUp, LogOut } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: any; bg: string }> = {
  'Draft': { color: 'text-slate-400', icon: Clock, bg: 'bg-slate-500/20 border-slate-500/30' },
  'Submitted': { color: 'text-blue-400', icon: FileText, bg: 'bg-blue-500/20 border-blue-500/30' },
  'Under Review': { color: 'text-yellow-400', icon: AlertCircle, bg: 'bg-yellow-500/20 border-yellow-500/30' },
  'Shortlisted': { color: 'text-purple-400', icon: Star, bg: 'bg-purple-500/20 border-purple-500/30' },
  'Accepted': { color: 'text-emerald-400', icon: CheckCircle, bg: 'bg-emerald-500/20 border-emerald-500/30' },
  'Rejected': { color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/20 border-red-500/30' },
  'Waitlisted': { color: 'text-orange-400', icon: AlertCircle, bg: 'bg-orange-500/20 border-orange-500/30' },
};

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    getMyApplications().then(res => setApplications(res.data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const stats = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'text-indigo-400' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review' || a.status === 'Shortlisted').length, icon: AlertCircle, color: 'text-yellow-400' },
    { label: 'Submitted', value: applications.filter(a => a.status === 'Submitted').length, icon: Clock, color: 'text-blue-400' },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-indigo-300 text-xs mb-3">
            <LayoutDashboard className="w-3.5 h-3.5" /> Student Dashboard
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
          <p className="text-slate-500 mt-1">{user?.email}</p>
        </div>
        <button onClick={() => { logout(); router.push('/'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-red-400 hover:bg-red-500/10 transition-all text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5 border border-white/8 text-center card-hover">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link href="/courses" className="glass rounded-2xl border border-white/8 p-5 card-hover group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">Browse Courses</p>
            <p className="text-xs text-slate-500">Find new programs</p>
          </div>
        </Link>
        <Link href="/universities" className="glass rounded-2xl border border-white/8 p-5 card-hover group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">Explore Universities</p>
            <p className="text-xs text-slate-500">Discover institutions</p>
          </div>
        </Link>
        <div className="glass rounded-2xl border border-white/8 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Profile Complete</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full gradient-bg" style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-slate-500">60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> My Applications
        </h2>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}</div>
        ) : applications.length === 0 ? (
          <div className="glass rounded-3xl border border-white/8 p-12 text-center">
            <GraduationCap className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Applications Yet</h3>
            <p className="text-slate-600 text-sm mb-6">Start your journey by exploring courses and applying.</p>
            <Link href="/courses" className="inline-flex gradient-bg px-6 py-3 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity">
              Explore Courses →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const cfg = statusConfig[app.status] || statusConfig['Draft'];
              const StatusIcon = cfg.icon;
              return (
                <div key={app._id} className="glass rounded-2xl border border-white/8 p-5 flex items-center gap-5 card-hover">
                  <img src={app.university?.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'}
                    alt={app.university?.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-[15px] line-clamp-1">{app.course?.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{app.university?.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-600">
                        Applied: {new Date(app.submittedAt || app.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="font-mono text-xs text-slate-600">{app.applicationId}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color} shrink-0`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {app.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
