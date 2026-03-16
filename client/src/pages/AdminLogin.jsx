import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, Lock, User, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminLogin } from '../utils/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminLogin(form)
      localStorage.setItem('admin_token', res.data.token)
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-premium flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-glow" />
      <div className="glass-card p-10 w-full max-w-sm relative z-10 shadow-2xl">
        {/* Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 mb-6 shadow-xl">
            <Cpu size={32} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-zinc-500 text-sm mt-2">HACKATHON-26 Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="input-premium w-full pl-12 pr-4 py-3.5 text-sm"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-premium w-full pl-12 pr-4 py-3.5 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60 font-medium">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Logging in…</> : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-8 font-medium">
          Default: admin / hackathon2026
        </p>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center z-10">
        <div className="bg-black/30 backdrop-blur-md inline-block px-6 py-4 rounded-2xl border border-white/5 shadow-2xl">
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
  )
}
