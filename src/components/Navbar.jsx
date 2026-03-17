import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Bell, LogOut, User, Shield, Wrench, Sparkles } from 'lucide-react';

const Navbar = ({ notifications = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render counter
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get auth state FRESH on every render
  const accessToken = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');
  const isLoggedIn = !!(accessToken && userType);

  // Force update on location change
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [location.pathname]);

  // Listen for storage changes (cross-tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  // const handleLogout = () => {
  //   // Clear all auth data
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('userType');
  //   localStorage.removeItem('adminName');
  //   localStorage.removeItem('vendorId');
  //   localStorage.removeItem('vendorName');
  //   localStorage.removeItem('vendorEmail');
    
  //   setMobileMenuOpen(false);
  //   setForceUpdate(prev => prev + 1); // Force re-render
  //   navigate('/');
  // };
const handleLogout = () => {
  // Clear all auth data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('adminName');
  localStorage.removeItem('vendorId');
  localStorage.removeItem('vendorName');
  localStorage.removeItem('vendorEmail');
  
  // Trigger auth change event
  window.dispatchEvent(new Event('authChange'));
  
  setMobileMenuOpen(false);
  setForceUpdate(prev => prev + 1); // Force re-render
  
  navigate('/', { replace: true });
};
  const recentNotifications = [
    { id: 1, text: "New booking request from Ali Raza", time: "2 mins ago", unread: true },
    { id: 2, text: "Payment received - Rs. 1500", time: "1 hour ago", unread: true },
    { id: 3, text: "Service completed successfully", time: "3 hours ago", unread: false },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Wrench className="text-white" size={24} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FixKar
              </div>
              <div className="text-xs font-semibold text-gray-500 tracking-wide flex items-center gap-1">
                <Sparkles size={9} className="text-indigo-500" />
                Professional Services
              </div>
            </div>
          </Link>

          {/* Desktop Menu - Not Logged In */}
          {!isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                    isActive('/')
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home size={18} className="group-hover:scale-110 transition-transform" />
                  Home
                </Link>

                <Link
                  to="/login/vendor"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                    isActive('/login/vendor')
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <User size={18} className="group-hover:rotate-12 transition-transform" />
                  Vendor Login
                </Link>

                <Link
                  to="/login/admin"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                    isActive('/login/admin')
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Shield size={18} className="group-hover:scale-110 transition-transform" />
                  Admin Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-105"
                >
                  Register
                </Link>
              </div>

              <button
                className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            /* Authenticated User Menu */
            <div className="flex items-center gap-3">
              <Link
                to={userType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard'}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              >
                <Home size={18} />
                Dashboard
              </Link>

              <div className="hidden md:flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-200">
                {userType === 'vendor' ? (
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Vendor Panel</span>
                  </>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-1.5 rounded-lg">
                      <Shield size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Admin Panel</span>
                  </>
                )}
              </div>

              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                >
                  <Bell size={22} className="text-gray-700 group-hover:rotate-12 transition-transform" />
                  {notifications > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                        {notifications}
                      </span>
                      <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-6 w-6 animate-ping opacity-75"></span>
                    </>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <p className="text-sm text-blue-100">{notifications} unread messages</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {recentNotifications.map(notif => (
                        <div key={notif.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${notif.unread ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex items-start gap-3">
                            {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                            <div className="flex-1">
                              <p className={`text-sm ${notif.unread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                {notif.text}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-3 bg-gray-50 text-center border-t border-gray-100">
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 rounded-xl font-bold transition-all duration-300 shadow-md shadow-red-500/20 hover:shadow-lg hover:scale-105"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all ${
                    isActive('/')
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home size={22} />
                  <span className="text-lg">Home</span>
                </Link>
                <Link
                  to="/login/vendor"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all ${
                    isActive('/login/vendor')
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={22} />
                  <span className="text-lg">Vendor Login</span>
                </Link>
                <Link
                  to="/login/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all ${
                    isActive('/login/admin')
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield size={22} />
                  <span className="text-lg">Admin Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                >
                  <User size={22} />
                  <span className="text-lg">Register</span>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-blue-50 border border-blue-200">
                  {userType === 'vendor' ? (
                    <>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                        <User size={20} className="text-white" />
                      </div>
                      <span className="font-bold text-lg text-gray-800">Vendor Panel</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                        <Shield size={20} className="text-white" />
                      </div>
                      <span className="font-bold text-lg text-gray-800">Admin Panel</span>
                    </>
                  )}
                </div>

                <Link
                  to={userType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all text-gray-700 hover:bg-gray-50"
                >
                  <Home size={22} />
                  <span className="text-lg">Dashboard</span>
                </Link>

                <button className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all text-gray-700 hover:bg-gray-50 w-full">
                  <div className="relative">
                    <Bell size={22} />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </div>
                  <span className="text-lg">Notifications</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 w-full shadow-md"
                >
                  <LogOut size={22} />
                  <span className="text-lg">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
