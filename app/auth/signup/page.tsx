'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signup as apiSignup } from '@/lib/api';
import { GraduationCap, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const perks = ['Free to create account', 'Apply to 500+ universities', 'Track all applications', 'Compare courses & fees'];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await apiSignup(form);
      login(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left panel */}
        <div className="hidden md:block">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">LEARNRR.IN</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Start your admission journey today</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">Join thousands of students discovering their dream universities and courses across India.</p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div className="text-center md:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">LEARNRR.IN</span>
            </Link>
          </div>

          <div className="glass rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create free account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', field: 'name', type: 'text', icon: User, placeholder: 'Ravi Kumar' },
                { label: 'Email Address', field: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
                { label: 'Phone Number', field: 'phone', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
              ].map(({ label, field, type, icon: Icon, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={type} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder} required={field !== 'phone'}
                      className="w-full bg-white/5 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 text-sm outline-none border border-white/8 focus:border-indigo-500/60 transition-colors" />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters" required
                    className="w-full bg-white/5 rounded-xl pl-11 pr-12 py-3 text-white placeholder-slate-600 text-sm outline-none border border-white/8 focus:border-indigo-500/60 transition-colors" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full gradient-bg py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity glow disabled:opacity-60 text-sm mt-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
