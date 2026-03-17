import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Eye, Users, TrendingUp, Clock, AlertCircle, LogOut, Calendar, Filter, Search, Wifi, WifiOff, Phone, Mail, MapPin, Award, Trash2, User, Home, MessageSquare, DollarSign, X } from 'lucide-react';

const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [pendingServices, setPendingServices] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingServices: 0,
    approvedServices: 0,
    totalServices: 0,
    totalBookings: 0,
    availableVendors: 0,
    busyVendors: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [vendorFilter, setVendorFilter] = useState({
    status: 'all',
    availability: 'all',
    search: ''
  });
  const [bookingFilter, setBookingFilter] = useState({
    service: 'all',
    status: 'all',
    search: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, vendorsRes, bookingsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/services/pending`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/vendors`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/bookings`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() })
      ]);

      const servicesData = await servicesRes.json();
      const vendorsData = await vendorsRes.json();
      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();

      setPendingServices(servicesData);
      setAllVendors(vendorsData);
      setAllBookings(bookingsData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleApprove = async (serviceId) => {
    try {
      setError('');
      setSuccess('');
      const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        addToast('Service approved successfully!', 'success');
        setPendingServices(pendingServices.filter(s => s._id !== serviceId));
        setStats({
          ...stats,
          pendingServices: stats.pendingServices - 1,
          approvedServices: stats.approvedServices + 1
        });
        setSelectedService(null);
        fetchData();
      } else {
        addToast(data.message || 'Failed to approve service', 'error');
      }
    } catch (err) {
      addToast('Failed to approve service', 'error');
    }
  };

  const handleDisapprove = async (serviceId) => {
    setDeleteTarget({ type: 'service', id: serviceId, name: 'this service' });
    setShowDeleteModal(true);
  };

  const handleDeleteVendor = async (vendorId, vendorName) => {
    setDeleteTarget({ type: 'vendor', id: vendorId, name: vendorName });
    setShowDeleteModal(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    setDeleteTarget({ type: 'booking', id: bookingId, name: 'this booking' });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setError('');
      setSuccess('');
      let response;
      
      if (deleteTarget.type === 'service') {
        response = await fetch(`${API_BASE_URL}/admin/services/${deleteTarget.id}/disapprove`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      } else if (deleteTarget.type === 'vendor') {
        response = await fetch(`${API_BASE_URL}/admin/vendors/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      } else if (deleteTarget.type === 'booking') {
        response = await fetch(`${API_BASE_URL}/bookings/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (deleteTarget.type === 'service') {
          addToast('Service disapproved and deleted successfully!', 'success');
          setPendingServices(pendingServices.filter(s => s._id !== deleteTarget.id));
          setStats({
            ...stats,
            pendingServices: stats.pendingServices - 1,
            totalServices: stats.totalServices - 1
          });
          setSelectedService(null);
        } else if (deleteTarget.type === 'vendor') {
          addToast('Vendor deleted successfully!', 'success');
          setAllVendors(allVendors.filter(v => v._id !== deleteTarget.id));
          setStats({
            ...stats,
            totalVendors: stats.totalVendors - 1
          });
        } else if (deleteTarget.type === 'booking') {
          addToast('Booking deleted successfully!', 'success');
          setAllBookings(allBookings.filter(b => b._id !== deleteTarget.id));
          setStats({
            ...stats,
            totalBookings: stats.totalBookings - 1
          });
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        addToast(data.message || 'Failed to delete', 'error');
      }
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/admin/login';
  };

  const filteredVendors = allVendors.filter(vendor => {
    const matchesStatus = vendorFilter.status === 'all' || vendor.status === vendorFilter.status;
    const matchesAvailability = vendorFilter.availability === 'all' || vendor.availabilityStatus === vendorFilter.availability;
    const matchesSearch = vendor.name.toLowerCase().includes(vendorFilter.search.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(vendorFilter.search.toLowerCase());
    return matchesStatus && matchesAvailability && matchesSearch;
  });

  const filteredBookings = allBookings.filter(booking => {
    const matchesService = bookingFilter.service === 'all' || booking.serviceCategory === bookingFilter.service;
    const matchesStatus = bookingFilter.status === 'all' || booking.status === bookingFilter.status;
    const matchesSearch = booking.userName?.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
                         booking.vendorName?.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
                         booking.userPhone?.includes(bookingFilter.search);
    return matchesService && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
      'Completed': 'bg-green-50 text-green-700 border-green-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`transform transition-all duration-300 ease-in-out animate-slide-in ${
              toast.type === 'success' 
                ? 'bg-white border-l-4 border-green-500 shadow-lg' 
                : 'bg-white border-l-4 border-red-500 shadow-lg'
            } rounded-lg p-4 flex items-start gap-3`}
          >
            <div className={`flex-shrink-0 ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteTarget?.name}</span>? 
                {deleteTarget?.type === 'vendor' && ' This will also delete all their services.'}
                {' '}This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-lg">×</button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle size={18} />
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto text-lg">×</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Shield className="text-slate-900" size={24} />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">Manage vendors, services and bookings</p>
            </div>
          </div>
        </div>

        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1">Total Vendors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVendors}</p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="text-green-600 font-medium">{stats.availableVendors} Available</span> •
                  <span className="text-orange-600 font-medium ml-1">{stats.busyVendors} Busy</span>
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <Clock className="text-amber-600" size={20} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1">Pending Services</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingServices}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1">Approved Services</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approvedServices}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Calendar className="text-purple-600" size={20} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div
                onClick={() => setView('vendors')}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{stats.totalVendors}</p>
                    <p className="text-xs text-gray-600">Total Vendors</p>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Manage Vendors</h3>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">View all vendors, check availability status, and manage accounts</p>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="text-green-600" size={14} />
                    <span className="text-gray-700">{stats.availableVendors} Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WifiOff className="text-orange-600" size={14} />
                    <span className="text-gray-700">{stats.busyVendors} Busy</span>
                  </div>
                </div>
                <button className="mt-4 sm:mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all text-sm">
                  View All Vendors →
                </button>
              </div>

              <div
                onClick={() => setView('bookings')}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
                    <p className="text-xs text-gray-600">Total Bookings</p>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Manage Bookings</h3>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">Track all customer bookings, filter by service and status</p>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="text-amber-600" size={14} />
                    <span className="text-gray-700">{stats.pendingBookings || 0} Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="text-green-600" size={14} />
                    <span className="text-gray-700">{stats.confirmedBookings || 0} Confirmed</span>
                  </div>
                </div>
                <button className="mt-4 sm:mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium transition-all text-sm">
                  View All Bookings →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="text-amber-600" size={18} />
                  Pending Service Approvals ({pendingServices.length})
                </h2>
                {pendingServices.length > 0 && (
                  <button
                    onClick={() => setView('pending')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
                  >
                    View All →
                  </button>
                )}
              </div>

              {pendingServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600 text-sm">No pending services to review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingServices.slice(0, 3).map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{service.category}</h3>
                          <p className="text-xs text-gray-600 truncate">by {service.vendorId?.name} • {service.location}</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleApprove(service._id)}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs sm:text-sm"
                          >
                            <CheckCircle size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleDisapprove(service._id)}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs sm:text-sm"
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'vendors' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="text-blue-600" size={18} />
                All Vendors ({filteredVendors.length})
              </h2>
              <button
                onClick={() => setView('dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={vendorFilter.search}
                  onChange={(e) => setVendorFilter({...vendorFilter, search: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <select
                value={vendorFilter.status}
                onChange={(e) => setVendorFilter({...vendorFilter, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                value={vendorFilter.availability}
                onChange={(e) => setVendorFilter({...vendorFilter, availability: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
              <button
                onClick={() => setVendorFilter({ status: 'all', availability: 'all', search: '' })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Clear Filters
              </button>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vendors Found</h3>
                <p className="text-gray-600 text-sm">No vendors match your search criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVendors.map((vendor) => (
                  <div key={vendor._id} className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-blue-300 transition-all">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{vendor.name}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${
                            vendor.availabilityStatus === 'available'
                              ? 'bg-green-50 text-green-700 border-green-200 flex items-center gap-1'
                              : 'bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1'
                          }`}>
                            {vendor.availabilityStatus === 'available' ? (
                              <><Wifi size={10} /> Available</>
                            ) : (
                              <><WifiOff size={10} /> Busy</>
                            )}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            vendor.status === 'Approved'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {vendor.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 text-gray-700 min-w-0">
                            <Mail size={14} className="text-blue-600 flex-shrink-0" />
                            <span className="text-xs truncate">{vendor.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={14} className="text-green-600 flex-shrink-0" />
                            <span className="text-xs">{vendor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 min-w-0">
                            <MapPin size={14} className="text-red-600 flex-shrink-0" />
                            <span className="text-xs truncate">{vendor.location}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
                        className="w-full lg:w-auto px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium border border-red-200 text-xs sm:text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="text-purple-600" size={18} />
                All Bookings ({filteredBookings.length})
              </h2>
              <button
                onClick={() => setView('dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 sm:mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={bookingFilter.search}
                  onChange={(e) => setBookingFilter({...bookingFilter, search: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <select
                value={bookingFilter.status}
                onChange={(e) => setBookingFilter({...bookingFilter, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => setBookingFilter({ service: 'all', status: 'all', search: '' })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Clear Filters
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-600 text-sm">No bookings match your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-purple-300 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{booking.serviceCategory}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="w-full sm:w-auto px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium border border-red-200 text-xs sm:text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5 text-xs sm:text-sm">
                          <User size={16} className="text-blue-600" />
                          Customer Details
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <User size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Name</p>
                              <p className="font-semibold text-gray-900 truncate">{booking.userName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Email</p>
                              <p className="text-gray-800 truncate">{booking.userEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Phone</p>
                              <p className="text-gray-800">{booking.userPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Home size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Address</p>
                              <p className="text-gray-800 break-words">{booking.userAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5 text-xs sm:text-sm">
                          <Users size={16} className="text-green-600" />
                          Vendor Details
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <User size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Name</p>
                              <p className="font-semibold text-gray-900 truncate">{booking.vendorName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Email</p>
                              <p className="text-gray-800 truncate">{booking.vendorEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Phone</p>
                              <p className="text-gray-800">{booking.vendorPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Service Location</p>
                              <p className="text-gray-800 break-words">{booking.serviceLocation}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <DollarSign size={12} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-600 font-medium">Price</p>
                              <p className="font-semibold text-green-600">Rs. {booking.servicePrice}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1.5 text-xs">
                          <MessageSquare size={14} className="text-gray-600" />
                          Customer Notes
                        </h4>
                        <p className="text-xs text-gray-700 break-words">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
