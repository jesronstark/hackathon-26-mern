import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: API_BASE })

// Attach admin token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getTeamCount = () => api.get('/team-count')
export const registerTeam = (formData) => api.post('/register-team', formData)
export const getTeams = () => api.get('/teams')
export const deleteTeam = (id) => api.delete(`/team/${id}`)
export const adminLogin = (credentials) => api.post('/admin/login', credentials)
export const getDashboard = () => api.get('/admin/dashboard')
export const getExcelExportUrl = () => `${API_BASE}/admin/export-excel`

export default api
