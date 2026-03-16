import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Calendar, Clock, MapPin, Users, ChevronRight, BookOpen, Award } from 'lucide-react'
import { getTeamCount } from '../utils/api'

// ─── Live Team Counter ─────────────────────────────────────────────────────────
function LiveCounter() {
  const [data, setData] = useState({ registered: 0, max: 25, remaining: 25 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getTeamCount()
        setData(res.data)
      } catch {
        // ignore errors
      } finally {
        setLoading(false)
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const percent = Math.round((data.registered / data.max) * 100)
  const isFull = data.registered >= data.max

  return (
    <div className="glass-card p-8 w-full max-w-lg mx-auto mt-12">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Live Registration</span>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isFull ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
          {isFull ? 'CLOSED' : 'OPEN'}
        </span>
      </div>
      <div className="flex items-end gap-2 mb-4">
        <span className="font-heading text-5xl font-bold text-white">{loading ? '—' : data.registered}</span>
        <span className="text-xl text-zinc-500 mb-1">/ {data.max}</span>
        <span className="text-zinc-500 text-sm mb-2 ml-1">teams</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div className="progress-gradient h-full transition-all duration-1000" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-zinc-400 text-sm">{loading ? '...' : `${data.remaining} slots remaining`}</p>
    </div>
  )
}

// ─── Person Card ──────────────────────────────────────────────────────────────
function PersonCard({ title, icon: Icon, persons }) {
  return (
    <div className="glass-card p-8 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-heading text-xl font-semibold text-white tracking-tight">{title}</h3>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <Icon size={20} className="text-blue-400" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {persons.map((p, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-white font-medium text-base mb-1">{p.name}</span>
            {p.role && <span className="text-zinc-400 text-sm">{p.role}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Rule Item ────────────────────────────────────────────────────────────────
function RuleItem({ text }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      <span className="text-zinc-300 text-base">{text}</span>
    </li>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-premium relative overflow-hidden">
      
      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="font-heading font-bold text-lg text-white tracking-tight hidden sm:block">
            HACKATHON-26
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Admin</Link>
          <Link to="/register" className="btn-primary px-6 py-2.5 text-sm">Register Team</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 text-center pt-24 pb-32 px-6">
        <div className="bg-glow" />
        <div className="max-w-4xl mx-auto">
          {/* Chip Graphic */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <Cpu size={48} className="text-white" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-300 backdrop-blur-md">
              NAAN MUDHALVAN
            </span>
            <span className="px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-400 backdrop-blur-md">
              INGAGE TECHNOLOGIES
            </span>
          </div>

          <h1 className="font-heading text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
            Code The Core
          </h1>
          
          <h2 className="text-2xl sm:text-3xl text-zinc-300 font-light mb-4">
            <span className="text-gradient-primary font-medium">Embedded C</span> & Microcontroller Programming
          </h2>
          <p className="text-zinc-500 text-base mb-12">Hackathon Welcome by 3rd Year ECE</p>

          <div className="flex items-center justify-center gap-2 mb-12 text-zinc-400 bg-white/5 inline-flex mx-auto px-6 py-3 rounded-full border border-white/5">
            <MapPin size={16} />
            <span className="text-sm font-medium">SACS MAVMM Engineering College, Madurai – 625301</span>
          </div>

          <div className="flex justify-center mb-16">
            <Link to="/register"
              className="btn-primary px-10 py-5 text-lg flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg shadow-white/10">
              Register Your Team
              <ChevronRight size={20} />
            </Link>
          </div>

          <LiveCounter />
        </div>
      </section>

      {/* ── EVENT INFO CARDS ── */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">Event Details</h2>
            <p className="text-zinc-400 text-lg">Everything you need to know about the hackathon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Calendar, label: 'Date', value: '17 March 2026', sub: 'Tuesday' },
              { icon: Clock, label: 'Time', value: '10:00 AM – 1:00 PM', sub: '3 Hours Duration' },
              { icon: MapPin, label: 'Venue', value: 'Auditorium', sub: 'SACS MAVMM College' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="glass-card p-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-zinc-300" />
                </div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
                <p className="font-heading text-2xl font-bold text-white mb-2">{value}</p>
                <p className="text-zinc-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="glass-card p-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <BookOpen size={24} className="text-blue-400" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">Guidelines & Rules</h3>
            </div>
            <ul className="flex flex-col gap-2">
              <RuleItem text="Limited to exactly 25 participating teams" />
              <RuleItem text="Each team must consist of exactly 3 members" />
              <RuleItem text="All teams must submit a PPT presentation during registration" />
              <RuleItem text="Registration automatically closes once 25 teams are registered" />
            </ul>
          </div>
        </div>
      </section>

      {/* ── GUESTS SECTION ── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">Dignitaries</h2>
            <p className="text-zinc-400 text-lg">Honorable guests and resource persons</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PersonCard
              title="Chief Guest"
              icon={Award}
              persons={[{ name: 'Thiru. G. Ganesan', role: 'General Secretary & Correspondent' }]}
            />
            <PersonCard
              title="Resource Persons"
              icon={Users}
              persons={[
                { name: 'Mr. M. Silambarasan', role: 'Senior Technical Trainer, Ingage Tech Pvt Ltd' },
                { name: 'Mr. J. Jeyaram', role: 'Senior Technical Trainer, Ingage Tech Pvt Ltd' },
              ]}
            />
            <PersonCard
              title="Guests of Honour"
              icon={Award}
              persons={[
                { name: 'Dr. S. Navaneetha Krishnan', role: 'Principal' },
                { name: 'Dr. R. Prasanna Venkatesh', role: 'Vice Principal' },
                { name: 'Dr. G. Emily Manoranjitham', role: 'Vice Principal' },
                { name: 'Dr. D. Siva Sundhara Raja', role: 'Dean & HOD ECE' },
                { name: 'Mrs. M. Sivabalasundari', role: 'SPOC & HOD CSE' },
                { name: 'Mr. M. Vignesh Babu', role: 'NM Faculty AP ECE' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="relative z-10 py-24 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-heading text-3xl font-bold text-white mb-4">Secure your spot today</h3>
          <p className="text-zinc-400 text-lg mb-10">Don't miss out on the coding event of the year.</p>
          <Link to="/register" className="btn-primary px-10 py-5 text-lg inline-flex shadow-lg shadow-white/10">
            Register Now
          </Link>
          <div className="mt-16 border-t border-white/5 pt-8">
            <p className="text-zinc-500 text-sm font-medium mb-3">
              © 2026 HACKATHON-26 • SACS MAVMM Engineering College
            </p>
            <div className="bg-white/5 inline-block px-6 py-4 rounded-2xl border border-white/5">
              <p className="text-zinc-300 text-sm font-medium mb-1">
                Developed by <span className="text-blue-400 font-bold tracking-wide">JESRON</span> <span className="text-zinc-500 text-xs uppercase tracking-widest">(ECE)</span>
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 mt-2">
                <a href="mailto:Jesronstark@gmail.com" className="hover:text-blue-400 transition-colors">Jesronstark@gmail.com</a>
                <span>•</span>
                <a href="tel:9629199741" className="hover:text-blue-400 transition-colors">9629199741</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
