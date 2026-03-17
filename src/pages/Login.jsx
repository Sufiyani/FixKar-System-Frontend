import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Wrench, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Validate route type
    if (type !== 'admin' && type !== 'vendor') {
      navigate('/');
      return;
    }

    // Check if already logged in as the same type
    const currentUserType = localStorage.getItem('userType');
    const hasToken = localStorage.getItem('accessToken');

    if (hasToken && currentUserType) {
      if (currentUserType === type) {
        // Already logged in as this type, redirect to dashboard
        if (type === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/vendor-dashboard', { replace: true });
        }
      } else {
        // Wrong user type logged in, clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('adminName');
        localStorage.removeItem('vendorId');
        localStorage.removeItem('vendorName');
        localStorage.removeItem('vendorEmail');
        window.dispatchEvent(new Event('authChange'));
      }
    }
  }, [type, navigate]);

  const isAdmin = type === 'admin';
  const isVendor = type === 'vendor';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isAdmin 
        ? `${API_BASE_URL}/admin/login`
        : `${API_BASE_URL}/vendors/login`;

      const bodyData = isAdmin 
        ? { name: formData.name, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear any existing auth data before setting new one
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('adminName');
        localStorage.removeItem('vendorId');
        localStorage.removeItem('vendorName');
        localStorage.removeItem('vendorEmail');

        // Set new auth data
        localStorage.setItem('accessToken', data.accessToken);
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Wait for animation then navigate
        setTimeout(() => {
          if (isAdmin) {
            localStorage.setItem('adminName', data.admin?.name || data.name);
            localStorage.setItem('userType', 'admin');
            
            // Trigger storage event for Navbar
            window.dispatchEvent(new Event('authChange'));
            
            navigate('/admin-dashboard', { replace: true });
          } else {
            localStorage.setItem('vendorName', data.vendor?.name || data.name);
            localStorage.setItem('vendorId', data.vendor?._id || data._id);
            localStorage.setItem('userType', 'vendor');
            
            // Trigger storage event for Navbar
            window.dispatchEvent(new Event('authChange'));
            
            navigate('/vendor-dashboard', { replace: true });
          }
        }, 2000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes confetti1 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }

        @keyframes confetti2 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(450px) rotate(-360deg); opacity: 0; }
        }

        @keyframes confetti3 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(360deg); opacity: 0; }
        }

        @keyframes confetti4 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(380px) rotate(-360deg); opacity: 0; }
        }

        @keyframes confetti5 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(440px) rotate(360deg); opacity: 0; }
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-bounceOnce { animation: bounceOnce 0.8s ease-out; }
        .animate-progressBar { animation: progressBar 2s ease-out forwards; }
        .animate-confetti1 { animation: confetti1 1.5s ease-out forwards; }
        .animate-confetti2 { animation: confetti2 1.6s ease-out forwards; }
        .animate-confetti3 { animation: confetti3 1.4s ease-out forwards; }
        .animate-confetti4 { animation: confetti4 1.7s ease-out forwards; }
        .animate-confetti5 { animation: confetti5 1.55s ease-out forwards; }
        .animate-pulseRing { animation: pulseRing 1.5s ease-out infinite; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            
            {/* Success Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scaleIn border-2 border-emerald-100">
              {/* Confetti */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-confetti1"></div>
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-confetti2"></div>
                <div className="absolute top-0 left-3/4 w-3 h-3 bg-purple-400 rounded-full animate-confetti3"></div>
                <div className="absolute top-0 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-confetti4"></div>
                <div className="absolute top-0 left-2/3 w-2 h-2 bg-pink-400 rounded-full animate-confetti5"></div>
              </div>

              {/* Success Icon */}
              <div className="relative mb-6">
                <div className={`w-24 h-24 mx-auto rounded-full ${
                  isAdmin ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                } flex items-center justify-center shadow-xl animate-bounceOnce relative z-10`}>
                  <CheckCircle className="text-white" size={48} strokeWidth={2.5} />
                </div>
                {/* Pulse Rings */}
                <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-full ${
                  isAdmin ? 'bg-slate-900/30' : 'bg-emerald-500/30'
                } animate-pulseRing`}></div>
                <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-full ${
                  isAdmin ? 'bg-slate-900/20' : 'bg-emerald-500/20'
                } animate-pulseRing delay-200`}></div>
              </div>

              {/* Success Message */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3 animate-slideUp">
                  Login Successful! 🎉
                </h3>
                <p className="text-gray-600 text-base mb-5 animate-slideUp delay-100">
                  Welcome back, {isAdmin ? 'Admin' : 'Vendor'}!
                </p>
                <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${
                  isAdmin ? 'bg-slate-100 text-slate-900' : 'bg-emerald-100 text-emerald-700'
                } text-sm font-semibold animate-slideUp delay-200`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></div>
                  Redirecting to dashboard...
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className={`h-full ${
                  isAdmin ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                } animate-progressBar`}></div>
              </div>
            </div>
          </div>
        )}

        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 -left-20 w-72 h-72 ${isAdmin ? 'bg-slate-900/5' : 'bg-emerald-500/5'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 -right-20 w-96 h-96 ${isAdmin ? 'bg-slate-900/5' : 'bg-emerald-500/5'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className={`${
              isAdmin 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
            } w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3`}>
              {isAdmin ? (
                <Shield className="text-white" size={32} />
              ) : (
                <Wrench className="text-white" size={32} />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {isAdmin ? 'Admin Portal' : 'Vendor Portal'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isAdmin 
                ? 'Secure access to platform management' 
                : 'Manage your services with ease'}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:shadow-3xl">
            {error && (
              <div className="mb-5 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-shake">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-red-600 hover:text-red-800 transition-colors text-xl font-bold"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isAdmin ? (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-slate-900">
                    Admin Username
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                        focusedField === 'name' ? 'text-slate-900 scale-110' : 'text-gray-400'
                      }`}
                      size={20}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-300 text-sm font-medium placeholder-gray-400 hover:border-gray-300 bg-white/50"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-emerald-600">
                    Email Address
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                        focusedField === 'email' ? 'text-emerald-600 scale-110' : 'text-gray-400'
                      }`}
                      size={20}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all duration-300 text-sm font-medium placeholder-gray-400 hover:border-gray-300 bg-white/50"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'password' ? (isAdmin ? 'text-slate-900' : 'text-emerald-600') + ' scale-110' : 'text-gray-400'
                    }`}
                    size={20}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 ${
                      isAdmin 
                        ? 'focus:ring-slate-900/10 focus:border-slate-900' 
                        : 'focus:ring-emerald-600/10 focus:border-emerald-600'
                    } transition-all duration-300 text-sm font-medium placeholder-gray-400 hover:border-gray-300 bg-white/50`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                      isAdmin ? 'text-slate-900' : 'text-emerald-600'
                    } hover:scale-110 transition-all duration-300`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full ${
                  isAdmin
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                } text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm mt-6 overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    {isAdmin ? <Shield size={20} /> : <Wrench size={20} />}
                    <span>Sign In as {isAdmin ? 'Admin' : 'Vendor'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              {isVendor && (
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                  <p className="text-gray-700 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300 hover:underline"
                    >
                      Register as Vendor
                    </button>
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className={`${
                  isAdmin 
                    ? 'text-slate-900 hover:text-slate-700' 
                    : 'text-emerald-600 hover:text-emerald-700'
                } font-medium text-sm transition-all duration-300 hover:underline flex items-center gap-2 mx-auto group`}
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-default">
              <Shield size={14} />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-default">
              <CheckCircle size={14} />
              <span>Verified Platform</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;