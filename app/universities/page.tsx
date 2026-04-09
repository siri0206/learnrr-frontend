'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUniversities } from '@/lib/api';
import { Search, MapPin, Star, Users, TrendingUp, Filter, Building2 } from 'lucide-react';

const TYPES = ['All', 'Central University', 'State University', 'Technical University', 'Deemed University', 'Institute of National Importance'];

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('ranking');
  const [total, setTotal] = useState(0);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, limit: '20' };
      if (search) params.search = search;
      if (type && type !== 'All') params.type = type;
      const res = await getUniversities(params);
      setUniversities(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUniversities(); }, [search, type, sort]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-indigo-300 text-xs mb-4">
          <Building2 className="w-3.5 h-3.5" /> {total} Universities Found
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Discover Universities</h1>
        <p className="text-slate-500">Explore top institutions across Hyderabad and India</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl border border-white/8 p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full bg-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors" />
        </div>
        <select value={type} onChange={e => setType(e.target.value)}
          className="bg-white/5 rounded-xl px-4 py-2.5 text-slate-300 text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors cursor-pointer">
          {TYPES.map(t => <option key={t} value={t === 'All' ? '' : t} className="bg-gray-900">{t}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-white/5 rounded-xl px-4 py-2.5 text-slate-300 text-sm outline-none border border-white/8 focus:border-indigo-500/50 transition-colors cursor-pointer">
          <option value="ranking" className="bg-gray-900">Sort: Ranking</option>
          <option value="rating" className="bg-gray-900">Sort: Rating</option>
          <option value="name" className="bg-gray-900">Sort: A-Z</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
        </div>
      ) : universities.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No universities found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map((uni: any) => (
            <Link key={uni._id} href={`/universities/${uni._id}`}
              className="glass rounded-2xl border border-white/8 card-hover overflow-hidden block group">
              <div className="relative h-40 overflow-hidden">
                <img src={uni.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'}
                  alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="text-xs font-medium text-white/80 bg-black/40 px-2 py-0.5 rounded-full">Est. {uni.established}</span>
                  <span className="text-sm font-bold text-emerald-400">#{uni.ranking} NIRF</span>
                </div>
              </div>
              <div className="p-5">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 mb-2">{uni.type}</span>
                <h2 className="font-semibold text-white text-[15px] group-hover:text-indigo-300 transition-colors mb-1">{uni.name}</h2>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                  <MapPin className="w-3 h-3" />{uni.location}
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-yellow-400 text-xs"><Star className="w-3 h-3 fill-current" />{uni.rating}</div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs"><Users className="w-3 h-3" />{(uni.totalStudents || 0).toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs"><TrendingUp className="w-3 h-3" />{uni.placementRate}%</div>
                  <span className="ml-auto text-xs text-slate-600">{uni.accreditation}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
