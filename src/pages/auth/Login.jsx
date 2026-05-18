import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/authAPI'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      const role = res.data.role || 'Staff'
      localStorage.setItem('token',      res.data.token)
      localStorage.setItem('userName',   res.data.fullName || res.data.email)
      localStorage.setItem('role',       role)
      localStorage.setItem('customerId', res.data.customerId || '')

      if (role === 'Admin')         navigate('/admin/financial')
      else if (role === 'Staff')    navigate('/staff/customer-view')
      else                          navigate('/customer/appointments')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-end p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 opacity-90" />
        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-3">Precision Auto</h1>
          <p className="text-slate-300 text-lg mb-8">Vehicle Parts Management System</p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-blue-400">99.9%</p>
              <p className="text-slate-400 text-sm">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">2.4M</p>
              <p className="text-slate-400 text-sm">SKUs Managed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Access your automotive inventory dashboard</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email" required placeholder="admin@autopartpro.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>

          <footer className="mt-12 text-center text-xs text-slate-400">
            <p className="mb-2">© 2026 AutoPart Management Systems.</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Contact Support</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}