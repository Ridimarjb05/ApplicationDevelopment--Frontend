import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/authAPI'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm]                 = useState({ email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register({ email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <img src="/signup_warehouse_bg.png" alt="warehouse"
          className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-3">Join Precision Auto</h1>
          <p className="text-slate-300 text-lg">Create your staff account to get started</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create account</h2>
          <p className="text-slate-500 text-sm mb-8">Fill in the details below to register</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" required placeholder="you@autopartpro.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
