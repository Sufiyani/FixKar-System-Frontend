import React, { useState, useEffect } from "react";
import { PlusCircle, MapPin, Wrench, Phone, Calendar, Star, DollarSign, Clock, TrendingUp, Award, Users, CheckCircle, Edit2, Trash2, Save, AlertCircle, XCircle, Power, Wifi, WifiOff, User, Mail, Home, Sparkles, BadgeCheck, Zap, TrendingDown, ArrowUpRight, Target, ChevronRight, MessageSquare } from "lucide-react";
import { vendorAPI } from "../utils/api";

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slideIn">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-sm`}>
        <CheckCircle size={20} />
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-all">
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
};

const VendorDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    rating: 4.8,
    earnings: 0,
    activeServices: 0
  });
  const [vendorStatus, setVendorStatus] = useState('available');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    category: "",
    location: "",
    contact: "",
    availability: "",
    price: "",
    experience: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchVendorData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchVendorData = async () => {
    try {
      setLoading(true);

      const profileRes = await fetch(`${API_BASE_URL}/vendors/profile`, {
        headers: getAuthHeaders()
      });
      const profileData = await profileRes.json();
      setVendorStatus(profileData.availabilityStatus || 'available');

      const servicesRes = await fetch(`${API_BASE_URL}/vendors/services`, {
        headers: getAuthHeaders()
      });
      const servicesData = await servicesRes.json();

      const statsRes = await fetch(`${API_BASE_URL}/vendors/stats`, {
        headers: getAuthHeaders()
      });
      const statsData = await statsRes.json();

      const bookingsData = await vendorAPI.getMyBookings();

      setServices(servicesData);
      setStats(statsData);
      setBookings(bookingsData);
      setLoading(false);
      showToast('Dashboard loaded successfully!', 'success');
    } catch (err) {
      setError('Failed to fetch data');
      showToast('Failed to fetch data', 'error');
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = vendorStatus === 'available' ? 'busy' : 'available';
      const response = await fetch(`${API_BASE_URL}/vendors/availability`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ availabilityStatus: newStatus })
      });

      if (response.ok) {
        setVendorStatus(newStatus);
        setSuccess(`You are now ${newStatus === 'available' ? 'Available' : 'Busy'}`);
        showToast(`Status updated: ${newStatus === 'available' ? 'Available' : 'Busy'}`, 'success');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update availability');
        showToast('Failed to update availability', 'error');
      }
    } catch (err) {
      setError('Failed to update availability');
      showToast('Failed to update availability', 'error');
    }
  };

  const handleAddService = async () => {
    // Basic required fields check
    if (!newService.category || !newService.location || !newService.contact || !newService.availability) {
      setError('Please fill in all required fields');
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Contact number validation - must be exactly 11 digits starting with 03
    const contactRegex = /^03\d{9}$/;
    const cleanContact = newService.contact.replace(/[-\s]/g, ''); // Remove dashes and spaces
    
    if (!contactRegex.test(cleanContact)) {
      setError('Contact number must be 11 digits starting with 03 (e.g., 03001234567)');
      showToast('Invalid contact number format', 'error');
      return;
    }

    // Price validation - must be numbers only or range format like "500-1500"
    const priceRegex = /^\d+(-\d+)?$/;
    if (newService.price && !priceRegex.test(newService.price.replace(/\s/g, ''))) {
      setError('Price must be a number or range (e.g., 500 or 500-1500)');
      showToast('Invalid price format', 'error');
      return;
    }

    // Experience validation - should contain at least one number
    if (newService.experience && !/\d/.test(newService.experience)) {
      setError('Experience should include years (e.g., 5 years)');
      showToast('Invalid experience format', 'error');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Clean the contact number before submitting
      const cleanedService = {
        ...newService,
        contact: cleanContact
      };

      const response = await fetch(`${API_BASE_URL}/vendors/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanedService)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Service submitted successfully! Waiting for admin approval.');
        showToast('Service submitted successfully!', 'success');
        setServices([...services, data.service]);
        setNewService({
          category: "",
          location: "",
          contact: "",
          availability: "",
          price: "",
          experience: "",
          description: ""
        });
        setShowAddForm(false);
        setTimeout(() => {
          fetchVendorData();
          setSuccess('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create service');
        showToast(data.message || 'Failed to create service', 'error');
      }
    } catch (err) {
      setError('Failed to create service');
      showToast('Failed to create service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');

      const response = await fetch(`${API_BASE_URL}/vendors/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Service deleted successfully');
        showToast('Service deleted successfully', 'success');
        setServices(services.filter(s => s._id !== id));
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.message || 'Failed to delete service');
        showToast(data.message || 'Failed to delete service', 'error');
      }
    } catch (err) {
      setError('Failed to delete service');
      showToast('Failed to delete service', 'error');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      setError('');
      setSuccess('');

      const response = await fetch(`${API_BASE_URL}/bookings/vendor/${bookingId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update booking status');
      }

      setSuccess(`Booking ${newStatus.toLowerCase()} successfully!`);
      showToast(`Booking ${newStatus.toLowerCase()} successfully!`, 'success');
      setTimeout(() => setSuccess(''), 3000);
      fetchVendorData();
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
      showToast(err.message || 'Failed to update booking status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-200 shadow-sm">
          <CheckCircle size={14} />
          Approved
        </span>;
      case 'Pending':
        return <span className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200 shadow-sm">
          <Clock size={14} />
          Pending
        </span>;
      case 'Disapproved':
        return <span className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-red-200 shadow-sm">
          <XCircle size={14} />
          Rejected
        </span>;
      default:
        return <span className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
          {status}
        </span>;
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-slate-900 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Wrench className="text-slate-900 animate-pulse" size={28} />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
          <div className="flex gap-1 justify-center mt-4">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-lg animate-fadeIn">
            <AlertCircle size={20} />
            <span className="flex-1 font-medium">{error}</span>
            <button onClick={() => setError('')} className="hover:bg-red-200 p-1 rounded-lg transition-all">
              <XCircle size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-lg animate-fadeIn">
            <CheckCircle size={20} />
            <span className="flex-1 font-medium">{success}</span>
            <button onClick={() => setSuccess('')} className="hover:bg-emerald-200 p-1 rounded-lg transition-all">
              <XCircle size={18} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                  <Wrench className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                  <p className="text-gray-600 text-sm mt-1">Manage your services and track performance</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-lg ${
                  vendorStatus === 'available'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                {vendorStatus === 'available' ? (
                  <>
                    <Wifi size={18} />
                    Available
                  </>
                ) : (
                  <>
                    <WifiOff size={18} />
                    Busy
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-lg"
              >
                <PlusCircle size={18} />
                Add Service
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="text-white" size={24} />
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg">
                <TrendingUp className="text-emerald-600" size={18} />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{bookings.length}</p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <span className="bg-emerald-50 px-2 py-1 rounded-full">
                {bookings.filter(b => b.status === 'Pending').length} pending
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Star className="text-white fill-white" size={24} />
              </div>
              <div className="bg-amber-50 p-2 rounded-lg">
                <Award className="text-amber-600" size={18} />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Rating</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.rating}</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Star className="text-amber-400 fill-amber-400" size={14} />
              <span>{stats.reviews || 0} reviews</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="text-white" size={24} />
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg">
                <TrendingUp className="text-emerald-600" size={18} />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">Rs. {stats.earnings?.toLocaleString() || 0}</p>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <ArrowUpRight size={14} />
              <span>↑ 8% increase</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Users className="text-white" size={24} />
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <CheckCircle className="text-purple-600" size={18} />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Active Services</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeServices}</p>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
              <span className="bg-purple-50 px-2 py-1 rounded-full">Approved</span>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                  <PlusCircle className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
                  <p className="text-gray-600 text-sm">Fill in the details to create a new service</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Service Category *</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Plumbing">🚰 Plumbing</option>
                  <option value="Electrical">💡 Electrical</option>
                  <option value="Car Mechanic">🔧 Car Mechanic</option>
                  <option value="Carpentry">🪵 Carpentry</option>
                  <option value="Painting">🎨 Painting</option>
                  <option value="AC Repair">❄️ AC Repair</option>
                  <option value="Mobile Repair">📱 Mobile Repair</option>
                  <option value="Home Cleaning">🧹 Home Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  placeholder="e.g., Karachi, Clifton"
                  value={newService.location}
                  onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={newService.contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                    if (value.length <= 11) {
                      setNewService({ ...newService, contact: value });
                    }
                  }}
                  maxLength={11}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Must be 11 digits starting with 03</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Experience *</label>
                <input
                  type="text"
                  placeholder="e.g., 5 years"
                  value={newService.experience}
                  onChange={(e) => setNewService({ ...newService, experience: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Availability *</label>
                <input
                  type="text"
                  placeholder="e.g., 9am - 6pm"
                  value={newService.availability}
                  onChange={(e) => setNewService({ ...newService, availability: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price Range (Rs.) *</label>
                <input
                  type="text"
                  placeholder="500-1500 or 500"
                  value={newService.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9-]/g, ''); // Only numbers and dash
                    setNewService({ ...newService, price: value });
                  }}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Numbers only (e.g., 500 or 500-1500)</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Service Description</label>
                <textarea
                  placeholder="Describe your service and expertise..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows="4"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleAddService}
              disabled={submitting}
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Service
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl">
                  <Wrench className="text-white" size={22} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
              </div>
              <span className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm border border-emerald-200 shadow-sm">
                {services.length} Total
              </span>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-16 text-center border-2 border-dashed border-gray-200 animate-fadeIn">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wrench className="text-gray-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Added Yet</h3>
                <p className="text-gray-600 mb-8 text-sm">Start by adding your first service to get bookings</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2 text-sm shadow-lg"
                >
                  <PlusCircle size={18} />
                  Add Your First Service
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {services.map((srv, index) => (
                  <div
                    key={srv._id}
                    className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
                          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                            <Wrench className="text-white" size={28} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{srv.category}</h3>
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <Award size={14} className="text-orange-500" />
                            {srv.experience} experience
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        {getStatusBadge(srv.status)}
                        <button
                          onClick={() => handleDeleteService(srv._id)}
                          className="p-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition-all border border-red-200 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                        <MapPin className="text-blue-600" size={18} />
                        <span className="text-sm font-medium text-gray-700">{srv.location}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                        <Phone className="text-green-600" size={18} />
                        <span className="text-sm font-medium text-gray-700">{srv.contact}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-xl border border-purple-100">
                        <Clock className="text-purple-600" size={18} />
                        <span className="text-sm font-medium text-gray-700">{srv.availability}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100">
                        <DollarSign className="text-orange-600" size={18} />
                        <span className="text-sm font-medium text-gray-700">Rs. {srv.price}</span>
                      </div>
                    </div>

                    {srv.description && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">{srv.description}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Calendar size={14} />
                          Submitted: {new Date(srv.createdAt).toLocaleDateString()}
                        </p>
                        <ChevronRight className="text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl">
                <Calendar className="text-white" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Bookings ({bookings.length})
              </h2>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200 animate-fadeIn">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-gray-400" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-600 text-sm">Your bookings will appear here</p>
                </div>
              ) : (
                bookings.slice(0, 5).map((booking, index) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-lg">
                          <User size={16} className="text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">{booking.userName}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getBookingStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
                        <Wrench size={14} className="text-slate-600" />
                        <span className="font-medium">{booking.serviceCategory || booking.serviceId?.category || 'Service'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 px-3 py-2 rounded-lg">
                        <Phone size={14} className="text-green-600" />
                        <span className="font-medium">{booking.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-red-50 px-3 py-2 rounded-lg">
                        <MapPin size={14} className="text-red-600" />
                        <span className="font-medium">{booking.userAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                        <Calendar size={14} className="text-purple-600" />
                        <span className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <MessageSquare size={14} className="text-blue-600 mt-0.5" />
                          <span className="font-medium">{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    {booking.status === 'Pending' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleBookingStatusUpdate(booking._id, 'Confirmed')}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md"
                        >
                          <CheckCircle size={14} />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleBookingStatusUpdate(booking._id, 'Cancelled')}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleBookingStatusUpdate(booking._id, 'Completed')}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 mt-3 shadow-md"
                      >
                        <CheckCircle size={14} />
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))
              )}

              {bookings.length > 5 && (
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-all text-sm shadow-md">
                  View All Bookings ({bookings.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;