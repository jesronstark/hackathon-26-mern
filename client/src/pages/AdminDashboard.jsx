import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu, Users, Hash, Trash2, Download, FileSpreadsheet,
  LogOut, Eye, RefreshCw, Search, ChevronDown, ChevronUp, Loader2, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getTeams, deleteTeam, getDashboard, getExcelExportUrl } from '../utils/api'

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, colorClass = 'text-blue-400', bgClass = 'bg-blue-500/10', borderClass = 'border-blue-500/20', sub }) {
  return (
    <div className="glass-card p-6 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{label}</p>
        <div className={`p-2.5 rounded-xl ${bgClass} border ${borderClass}`}>
          <Icon size={20} className={colorClass} />
        </div>
      </div>
      <div>
        <p className="font-heading text-4xl font-bold text-white mb-1">{value}</p>
        {sub && <p className="text-zinc-500 text-sm font-medium">{sub}</p>}
      </div>
    </div>
  )
}

// ── Team Detail Modal ──────────────────────────────────────────────────────────
function TeamModal({ team, onClose }) {
  if (!team) return null
  const rows = [
    ['Team Name', team.teamName],
    ['Leader Name', team.leaderName],
    ['Member 1', team.member1],
    ['Member 2', team.member2],
    ['Member 3', team.member3],
    ['Email', team.email],
    ['Phone', team.phone],
    ['College', team.college],
    ['Department', team.department],
    ['Table Number', `Table ${team.tableNumber}`],
    ['Registered At', new Date(team.createdAt).toLocaleString()],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h3 className="font-heading text-2xl font-bold text-white tracking-tight">
            Team Details
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium shrink-0">{k}</span>
              <span className="text-white text-sm font-medium sm:text-right">{v}</span>
            </div>
          ))}
          {team.pptFileUrl && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <a href={team.pptFileUrl} download target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Download size={18} /> Download Presentation File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState({ total: 25, registered: 0, remaining: 25 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [sortField, setSortField] = useState('tableNumber')
  const [sortDir, setSortDir] = useState('asc')

  const token = localStorage.getItem('admin_token')

  const fetchData = useCallback(async () => {
    if (!token) { navigate('/admin'); return }
    setLoading(true)
    try {
      const [teamsRes, statsRes] = await Promise.all([getTeams(), getDashboard()])
      setTeams(teamsRes.data.teams)
      setStats(statsRes.data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('admin_token')
        navigate('/admin')
      } else {
        toast.error('Failed to fetch data')
      }
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (team) => {
    if (!window.confirm(`Delete "${team.teamName}"? This cannot be undone.`)) return
    setDeletingId(team._id)
    try {
      await deleteTeam(team._id)
      toast.success('Team deleted')
      fetchData()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  const handleExcel = () => {
    const url = getExcelExportUrl()
    const a = document.createElement('a')
    a.href = url
    a.click()
  }

  // Sort
  const sortedTeams = [...teams].sort((a, b) => {
    let va = a[sortField], vb = b[sortField]
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
  })

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} className="opacity-30 ml-1 inline" />
    return sortDir === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-blue-400" /> : <ChevronDown size={14} className="ml-1 inline text-blue-400" />
  }

  // Filter
  const filtered = sortedTeams.filter(t =>
    !search || [t.teamName, t.leaderName, t.college, t.department]
      .some(v => v.toLowerCase().includes(search.toLowerCase()))
  )

  const percent = Math.round((stats.registered / stats.total) * 100)

  return (
    <div className="min-h-screen bg-premium relative">
      <div className="bg-glow opacity-50" />
      
      {/* Header */}
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-white tracking-tight leading-tight">HACKATHON-26</h1>
            <p className="text-zinc-500 text-xs font-medium">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all" title="Refresh">
            <RefreshCw size={18} className={loading ? 'animate-spin text-blue-400' : ''} />
          </button>
          
          <button onClick={handleExcel}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-xl transition-all shadow-lg shadow-green-500/5">
            <FileSpreadsheet size={18} /> Export Excel
          </button>
          
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all shadow-lg shadow-red-500/5">
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="p-6 sm:p-8 max-w-7xl mx-auto relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Hash} label="Total Slots" value={stats.total} />
          <StatCard icon={Users} label="Registered Teams" value={stats.registered}
            colorClass="text-purple-400" bgClass="bg-purple-500/10" borderClass="border-purple-500/20" />
          <StatCard icon={Users} label="Remaining Slots" value={stats.remaining}
            colorClass={stats.remaining === 0 ? 'text-red-400' : 'text-green-400'}
            bgClass={stats.remaining === 0 ? 'bg-red-500/10' : 'bg-green-500/10'}
            borderClass={stats.remaining === 0 ? 'border-red-500/20' : 'border-green-500/20'}
            sub={stats.remaining === 0 ? 'REGISTRATION CLOSED' : 'Available'} />
        </div>

        {/* Progress */}
        <div className="glass-card p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Registration Fullness</span>
            <span className="font-heading font-bold text-lg text-white">{stats.registered} <span className="text-zinc-500 text-sm font-normal">/ {stats.total}</span></span>
          </div>
          <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div className="progress-gradient h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-zinc-500 text-sm mt-3 font-medium">{percent}% capacity filled</p>
        </div>

        {/* Team Table */}
        <div className="glass-card overflow-hidden shadow-2xl">
          {/* Table header */}
          <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-white tracking-tight">
                Team Directory
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search teams..."
                  className="input-premium w-full pl-11 pr-4 py-2.5 text-sm"
                />
              </div>
              <button onClick={handleExcel}
                className="sm:hidden flex items-center justify-center w-11 h-11 border border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10 rounded-xl">
                <FileSpreadsheet size={18} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                <Loader2 size={32} className="animate-spin text-blue-400" />
                <span className="text-sm font-medium">Loading teams…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Users size={28} className="text-zinc-600" />
                </div>
                <p className="text-base font-medium text-zinc-400">{search ? 'No teams match your search criteria' : 'No teams have registered yet'}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5">
                    {[
                      { key: 'tableNumber', label: 'Table #' },
                      { key: 'teamName', label: 'Team Info' },
                      { key: 'leaderName', label: 'Leader Contacts' },
                      { key: null, label: 'Members' },
                      { key: 'college', label: 'College Info' },
                      { key: null, label: 'Files' },
                      { key: null, label: 'Manage' },
                    ].map(({ key, label }) => (
                      <th key={label} onClick={() => key && toggleSort(key)}
                        className={`py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap ${key ? 'cursor-pointer hover:text-zinc-300 hover:bg-white/5 transition-colors' : ''}`}>
                        {label} {key && <SortIcon field={key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((team) => (
                    <tr key={team._id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 align-top">
                        <div className="inline-flex w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 items-center justify-center font-heading font-black text-blue-400 text-lg shadow-inner">
                          {team.tableNumber}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-base mb-1">{team.teamName}</span>
                          <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded w-fit border border-white/5">ID: {team._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-300 text-sm mb-0.5">{team.leaderName}</span>
                          <span className="text-zinc-500 text-xs mb-0.5">{team.email}</span>
                          <span className="text-zinc-500 text-xs">{team.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-col gap-1.5 border-l border-white/10 pl-3">
                          <span className="text-xs text-zinc-400 font-medium before:content-['•'] before:mr-1.5 before:text-zinc-600">{team.member1}</span>
                          <span className="text-xs text-zinc-400 font-medium before:content-['•'] before:mr-1.5 before:text-zinc-600">{team.member2}</span>
                          <span className="text-xs text-zinc-400 font-medium before:content-['•'] before:mr-1.5 before:text-zinc-600">{team.member3}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top max-w-[200px]">
                        <div className="flex flex-col">
                          <span className="text-zinc-300 text-sm font-medium truncate" title={team.college}>{team.college}</span>
                          <span className="text-zinc-500 text-xs mt-1 truncate">{team.department}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        {team.pptFileUrl ? (
                          <a href={team.pptFileUrl} download target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 text-zinc-300 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 rounded-xl transition-all" title="Download PPT">
                            <Download size={18} />
                          </a>
                        ) : <span className="text-zinc-700 text-sm font-medium">—</span>}
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedTeam(team)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="View Details">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(team)} disabled={deletingId === team._id}
                            className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" title="Delete Team">
                            {deletingId === team._id
                              ? <Loader2 size={16} className="animate-spin" />
                              : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl text-center mt-20">
        <div className="max-w-2xl mx-auto">
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
      </footer>
    </div>
  )
}
