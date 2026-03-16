import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cpu, ArrowLeft, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerTeam } from '../utils/api'

const INITIAL = {
  teamName: '', leaderName: '', member1: '', member2: '', member3: '',
  email: '', phone: '', college: '', department: '',
}

function InputField({ label, name, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-premium w-full px-5 py-4 text-sm"
        autoComplete="off"
      />
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const fileRef = useRef()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFile = (e) => {
    const chosen = e.target.files[0]
    if (!chosen) return
    const allowed = ['application/pdf', 'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if (!allowed.includes(chosen.type) && !chosen.name.match(/\.(ppt|pptx|pdf)$/i)) {
      toast.error('Only PPT, PPTX, or PDF files are allowed')
      return
    }
    if (chosen.size > 20 * 1024 * 1024) {
      toast.error('File size must be under 20MB')
      return
    }
    setFile(chosen)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please upload your PPT/PDF file'); return }

    setSubmitting(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('pptFile', file)

    try {
      const res = await registerTeam(fd)
      setSuccess(res.data.data)
      toast.success('Team registered successfully! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── SUCCESS SCREEN ──
  if (success) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center p-6">
        <div className="glass-card p-12 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-2 tracking-tight">Registration Complete</h2>
          <p className="text-zinc-400 text-base mb-10">Your slot is confirmed for HACKATHON-26</p>
          
          <div className="bg-black/40 rounded-2xl p-8 mb-10 border border-white/5 backdrop-blur-md">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2 font-medium">Team Name</p>
            <p className="font-heading text-2xl font-bold text-white mb-8 border-b border-white/5 pb-6">{success.teamName}</p>
            
            <div className="grid grid-cols-2 gap-8 divide-x divide-white/5">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2 font-medium">Table Number</p>
                <p className="font-heading text-4xl font-black text-blue-400">{success.tableNumber}</p>
              </div>
              <div className="pl-8">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2 font-medium">Team ID</p>
                <p className="font-mono text-sm text-zinc-300 break-all">{success.teamId}</p>
              </div>
            </div>
          </div>
          
          <p className="text-zinc-500 text-sm mb-8 font-medium">📅 17/03/2026 &nbsp;|&nbsp; 🏛️ Auditorium</p>
          <Link to="/" className="btn-primary w-full py-4 text-base inline-block">Return to Home</Link>
        </div>
      </div>
    )
  }

  // ── FORM ──
  return (
    <div className="min-h-screen bg-premium py-16 px-6 relative overflow-hidden">
      <div className="bg-glow" />
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link to="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Cpu size={20} className="text-white" />
            <span className="font-heading font-medium text-sm text-zinc-300 tracking-wide">HACKATHON-26</span>
          </div>
        </div>

        <div className="glass-card p-8 sm:p-12 shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Register <span className="text-zinc-500">Team</span>
            </h1>
            <p className="text-zinc-400 text-base">Fill in your team details to secure your hackathon slot</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>

            {/* Team Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                <p className="font-heading text-lg font-semibold text-white">Team Details</p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <InputField label="Team Name" name="teamName" value={form.teamName} onChange={handleChange}
                  placeholder="Enter your team name" />
              </div>
            </div>

            {/* Team Leader */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">2</span>
                </div>
                <p className="font-heading text-lg font-semibold text-white">Team Leader</p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <InputField label="Leader Name" name="leaderName" value={form.leaderName} onChange={handleChange}
                    placeholder="Full name" />
                </div>
                <InputField label="Leader Email" name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="email@example.com" />
                <InputField label="Leader Phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="10-digit mobile number" />
              </div>
            </div>

            {/* Members */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">3</span>
                </div>
                <p className="font-heading text-lg font-semibold text-white">Team Members</p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
                <InputField label="Member 1 Name" name="member1" value={form.member1} onChange={handleChange}
                  placeholder="Full name" />
                <InputField label="Member 2 Name" name="member2" value={form.member2} onChange={handleChange}
                  placeholder="Full name" />
                <InputField label="Member 3 Name" name="member3" value={form.member3} onChange={handleChange}
                  placeholder="Full name" />
              </div>
            </div>

            {/* College Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">4</span>
                </div>
                <p className="font-heading text-lg font-semibold text-white">College Affiliation</p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField label="College" name="college" value={form.college} onChange={handleChange}
                  placeholder="Your college name" />
                <InputField label="Department" name="department" value={form.department} onChange={handleChange}
                  placeholder="E.g. ECE, CSE, IT" />
              </div>
            </div>

            {/* PPT Upload */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">5</span>
                </div>
                <p className="font-heading text-lg font-semibold text-white">Presentation Upload</p>
              </div>
              
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-10 text-center
                  hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
              >
                <input ref={fileRef} type="file" accept=".ppt,.pptx,.pdf" className="hidden" onChange={handleFile} />
                {file ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-white text-base font-semibold mb-1">{file.name}</p>
                      <p className="text-zinc-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); fileRef.current.value = '' }}
                      className="mt-2 text-zinc-400 hover:text-red-400 font-medium text-sm transition-colors px-4 py-2 border border-white/10 rounded-full bg-white/5">
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-zinc-300 text-base font-medium mb-2">Click to browse or drag and drop</p>
                    <p className="text-zinc-500 text-sm">Accepted formats: PPT, PPTX, PDF (Max 20MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-white/5">
              <button type="submit" disabled={submitting}
                className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (
                  <><Loader2 size={20} className="animate-spin" /> Processing Registration…</>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
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
    </div>
  )
}
