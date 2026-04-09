'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCourse, submitApplication } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ArrowRight, Check, GraduationCap, User, MapPin, BookOpen, Send } from 'lucide-react';
import Link from 'next/link';

const STEPS = ['Personal Info', 'Address', 'Academics', 'Entrance Exam', 'Statement', 'Review'];

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');

  const [form, setForm] = useState({
    personalInfo: { name: user?.name || '', email: user?.email || '', phone: '', dateOfBirth: '', gender: '', category: 'General' },
    address: { street: '', city: 'Hyderabad', state: 'Telangana', pincode: '', country: 'India' },
    academics: [{ level: '10th', institution: '', board: 'CBSE', year: '', percentage: '' }],
    entranceExam: { examName: '', rollNumber: '', score: '', rank: '', year: new Date().getFullYear() },
    statement: '',
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push(`/auth/login?redirect=/apply/${id}`); return; }
    getCourse(id as string).then(res => setCourse(res.data.data)).catch(() => router.push('/courses')).finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const update = (section: string, field: string, value: string) => {
    setForm(prev => ({ ...prev, [section]: { ...(prev as any)[section], [field]: value } }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        course: course._id,
        university: course.university._id || course.university,
        ...form,
        academics: form.academics.map(a => ({ ...a, year: Number(a.year), percentage: Number(a.percentage) })),
        entranceExam: { ...form.entranceExam, score: Number(form.entranceExam.score), rank: Number(form.entranceExam.rank) },
      };
      const res = await submitApplication(payload);
      setAppId(res.data.data.applicationId);
      setSubmitted(true);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="glass rounded-3xl border border-emerald-500/30 p-12 max-w-lg w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-cyan-600/10" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-400 mb-4">Your application for <span className="text-white font-medium">{course?.name}</span> has been received.</p>
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-6 border border-white/8">
            <p className="text-xs text-slate-500 mb-1">Application ID</p>
            <p className="text-lg font-bold text-indigo-300 font-mono">{appId}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="gradient-bg px-6 py-3 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity">Go to Dashboard</Link>
            <Link href="/courses" className="glass px-6 py-3 rounded-xl text-slate-300 text-sm border border-white/10 hover:border-indigo-500/40 transition-all">Browse More</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Course summary */}
      <div className="glass rounded-2xl border border-white/8 p-5 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white">{course?.name}</p>
          <p className="text-sm text-slate-500">{course?.universityName} · ₹{((course?.fees?.total || 0) / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${i === step ? 'gradient-bg text-white' : i < step ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'glass border border-white/8 text-slate-500'}`}>
              {i < step ? <Check className="w-3 h-3" /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < step ? 'bg-emerald-500/40' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass rounded-2xl border border-white/8 p-6 mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" />Personal Information</h2>
            {[
              { label: 'Full Name', field: 'name', type: 'text' },
              { label: 'Email Address', field: 'email', type: 'email' },
              { label: 'Phone Number', field: 'phone', type: 'tel' },
              { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
                <input type={type} value={(form.personalInfo as any)[field]} onChange={e => update('personalInfo', field, e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors placeholder-slate-600" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Gender</label>
                <select value={form.personalInfo.gender} onChange={e => update('personalInfo', 'gender', e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 cursor-pointer">
                  <option value="" className="bg-gray-900">Select</option>
                  {['Male', 'Female', 'Other'].map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Category</label>
                <select value={form.personalInfo.category} onChange={e => update('personalInfo', 'category', e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 cursor-pointer">
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-400" />Address Details</h2>
            {[
              { label: 'Street Address', field: 'street' },
              { label: 'City', field: 'city' },
              { label: 'State', field: 'state' },
              { label: 'Pincode', field: 'pincode' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
                <input type="text" value={(form.address as any)[field]} onChange={e => update('address', field, e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400" />Academic Details</h2>
            {form.academics.map((ac, i) => (
              <div key={i} className="glass rounded-xl border border-white/8 p-4 space-y-3">
                <p className="text-sm font-medium text-slate-300">{ac.level}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Institution</label>
                    <input type="text" value={ac.institution}
                      onChange={e => { const newAc = [...form.academics]; newAc[i].institution = e.target.value; setForm(p => ({ ...p, academics: newAc })); }}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Year</label>
                    <input type="number" value={ac.year}
                      onChange={e => { const newAc = [...form.academics]; newAc[i].year = e.target.value; setForm(p => ({ ...p, academics: newAc })); }}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Percentage / CGPA</label>
                    <input type="number" value={ac.percentage}
                      onChange={e => { const newAc = [...form.academics]; newAc[i].percentage = e.target.value; setForm(p => ({ ...p, academics: newAc })); }}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Board/University</label>
                    <input type="text" value={ac.board}
                      onChange={e => { const newAc = [...form.academics]; newAc[i].board = e.target.value; setForm(p => ({ ...p, academics: newAc })); }}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setForm(p => ({ ...p, academics: [...p.academics, { level: '12th', institution: '', board: 'CBSE', year: '', percentage: '' }] }))}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">+ Add qualification</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Entrance Exam Details</h2>
            {[
              { label: 'Exam Name (e.g. JEE Main, CAT, NEET)', field: 'examName' },
              { label: 'Roll Number / Registration', field: 'rollNumber' },
              { label: 'Score / Percentile', field: 'score' },
              { label: 'Rank (optional)', field: 'rank' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
                <input type="text" value={(form.entranceExam as any)[field]} onChange={e => update('entranceExam', field, e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Statement of Purpose</h2>
            <p className="text-sm text-slate-500 mb-3">Explain why you want to pursue this course and what you hope to achieve (min. 100 words).</p>
            <textarea value={form.statement} onChange={e => setForm(p => ({ ...p, statement: e.target.value }))} rows={8}
              placeholder="Write your statement here..."
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors resize-none placeholder-slate-600" />
            <p className="text-xs text-slate-600 mt-2 text-right">{form.statement.split(' ').filter(Boolean).length} words</p>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" />Review & Submit</h2>
            <div className="space-y-4">
              {[
                { label: 'Personal Info', data: form.personalInfo },
                { label: 'Address', data: form.address },
                { label: 'Entrance Exam', data: form.entranceExam },
              ].map(({ label, data }) => (
                <div key={label} className="glass rounded-xl border border-white/8 p-4">
                  <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(data).map(([k, v]) => v ? (
                      <div key={k} className="text-xs">
                        <span className="text-slate-500 capitalize">{k}: </span>
                        <span className="text-slate-300">{String(v)}</span>
                      </div>
                    ) : null)}
                  </div>
                </div>
              ))}
              <div className="glass rounded-xl border border-white/8 p-4">
                <p className="text-sm font-medium text-slate-300 mb-2">Statement Preview</p>
                <p className="text-xs text-slate-400 line-clamp-3">{form.statement || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-slate-400 disabled:opacity-30 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 gradient-bg px-6 py-2.5 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 gradient-bg px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity glow disabled:opacity-60">
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
}
