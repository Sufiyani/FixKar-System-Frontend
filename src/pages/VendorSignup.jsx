import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Briefcase, AlertCircle, CheckCircle, X } from "lucide-react";
import { vendorAPI } from "../utils/api";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-emerald-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md backdrop-blur-sm bg-opacity-95`}>
        <Icon size={22} className="flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scaleIn">
        <div className="text-center">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="text-emerald-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Registration Successful! 🎉
          </h3>
          <p className="text-gray-600 mb-8">
            Your vendor account has been created successfully. You can now login to start managing your services.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, category, location, password } = formData;

    if (!name || !email || !phone || !category || !location || !password) {
      setError("Please fill all fields!");
      showToast("Please fill in all required fields", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      showToast("Invalid email address format", "error");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      showToast("Password is too short", "error");
      return;
    }

    setLoading(true);

    try {
      await vendorAPI.register(formData);
      showToast("Registration successful!", "success");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login/vendor");
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .input-group:hover .input-icon {
          color: #059669;
        }
        
        .input-focus {
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
      `}</style>

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                <Briefcase className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Vendor Registration
              </h2>
              <p className="text-gray-500 text-sm">
                Join our platform and grow your business
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-scaleIn">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Full Name
                </label>
                <div className="relative group">
                  <User 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'name' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'name' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Email
                </label>
                <div className="relative group">
                  <Mail 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'email' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'phone' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'phone' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Service Category
                </label>
                <div className="relative group">
                  <Briefcase 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'category' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Plumber, Electrician, Mechanic"
                    value={formData.category}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('category')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'category' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Location
                </label>
                <div className="relative group">
                  <MapPin 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'location' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter your service area"
                    value={formData.location}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'location' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative group">
                  <Lock 
                    className={`input-icon absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-emerald-600' : 'text-gray-400'
                    }`} 
                    size={18} 
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-white text-gray-900 hover:border-emerald-300 ${
                      focusedField === 'password' ? 'input-focus' : ''
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 p-1 rounded-lg hover:bg-emerald-50"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login/vendor")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors hover:underline"
                >
                  Login Here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={handleModalClose} />
      )}
    </>
  );
};

export default VendorSignup;