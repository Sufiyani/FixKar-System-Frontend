import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Star, Award, Wrench, Filter, CheckCircle, TrendingUp, Shield, Briefcase, Wifi, WifiOff, X, Calendar, User, Mail, Phone as PhoneIcon, Home, MessageSquare } from 'lucide-react';

const Vendors = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const karachiAreas = [
    'All', 'Clifton', 'Defence (DHA)', 'Gulshan-e-Iqbal', 'North Nazimabad',
    'Nazimabad', 'FB Area', 'Saddar', 'Buffer Zone', 'Bahadurabad',
    'Numaish', 'New Karachi', 'North Karachi', 'Malir', 'Korangi',
    'Landhi', 'Gulistan-e-Jauhar', 'Scheme 33', 'Surjani Town',
    'Tariq Road', 'PECHS', 'Shahrah-e-Faisal', 'Soldier Bazaar',
    'Garden', 'Liaquatabad', 'Orangi Town', 'Baldia Town', 'SITE Area',
    'Kemari', 'Lyari'
  ];

  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'Electrical', icon: '💡' },
    { name: 'Car Mechanic', icon: '🔧' },
    { name: 'Carpentry', icon: '🪵' },
    { name: 'Painting', icon: '🎨' },
    { name: 'AC Repair', icon: '❄️' },
    { name: 'Mobile Repair', icon: '📱' },
    { name: 'Home Cleaning', icon: '🧹' }
  ];

  useEffect(() => {
    fetchApprovedServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, selectedLocation, availabilityFilter, services]);

  const fetchApprovedServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/services/approved`);
      const data = await response.json();

      if (response.ok) {
        setServices(data);
        setFilteredServices(data);
      } else {
        setError('Failed to fetch services');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to connect to server');
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.vendorId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (selectedLocation !== 'All') {
      filtered = filtered.filter(service =>
        service.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(service =>
        service.vendorId?.availabilityStatus === availabilityFilter
      );
    }

    setFilteredServices(filtered);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Plumbing': '🔧',
      'Electrical': '⚡',
      'Car Mechanic': '🚗',
      'Carpentry': '🪚',
      'Painting': '🎨',
      'AC Repair': '❄️',
      'Mobile Repair': '📱',
      'Home Cleaning': '🧹'
    };
    return icons[category] || '🔧';
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
    setBookingSuccess(null);
    setFormErrors({});
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!bookingForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (bookingForm.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(bookingForm.name.trim())) {
      errors.name = 'Name should only contain letters';
    }
    
    // Email validation
    if (!bookingForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (Pakistani format)
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    const cleanPhone = bookingForm.phone.replace(/[\s-]/g, '');
    if (!bookingForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid Pakistani phone number (03XX XXXXXXX)';
    }
    
    // Address validation
    if (!bookingForm.address.trim()) {
      errors.address = 'Address is required';
    } else if (bookingForm.address.trim().length < 10) {
      errors.address = 'Please provide a complete address (at least 10 characters)';
    }
    
    return errors;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    setFormErrors(errors);
    
    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors in the form');
      return;
    }
    
    setBookingLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingForm,
          serviceId: selectedService._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(data);
        setBookingForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          notes: ''
        });
        setFormErrors({});
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    setBookingSuccess(null);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setFormErrors({});
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <Wrench className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">Find Expert Vendors</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Browse verified professionals for all your home service needs
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <CheckCircle className="text-emerald-400" size={18} />
              <span className="text-gray-300 text-sm">
                {filteredServices.length} Verified Professionals Available
              </span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by service, location, or vendor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && !showBookingModal && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-slate-900" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Wifi size={16} className="text-emerald-600" />
                  Availability
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setAvailabilityFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      availabilityFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Vendors
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('available')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                      availabilityFilter === 'available'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Wifi size={14} />
                    Available Now
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('busy')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                      availabilityFilter === 'busy'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <WifiOff size={14} />
                    Busy
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Wrench size={16} className="text-slate-900" />
                  Category
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                        selectedCategory === cat.name
                          ? 'bg-slate-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-red-600" />
                  Location (Karachi)
                </h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                >
                  {karachiAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchTerm || availabilityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                    setAvailabilityFilter('all');
                  }}
                  className="w-full mt-6 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-sm text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'} Found
              </h2>
              {(selectedCategory !== 'All' || selectedLocation !== 'All' || availabilityFilter !== 'all') && (
                <p className="text-gray-500 mt-1 text-sm">
                  {selectedCategory !== 'All' && `Category: ${selectedCategory}`}
                  {selectedLocation !== 'All' && selectedCategory !== 'All' && ' • '}
                  {selectedLocation !== 'All' && `Location: ${selectedLocation}`}
                  {availabilityFilter !== 'all' && ' • '}
                  {availabilityFilter === 'available' && 'Available Now'}
                  {availabilityFilter === 'busy' && 'Busy Vendors'}
                </p>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-500 mb-6 text-sm">Try adjusting your search filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                    setAvailabilityFilter('all');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                          {getCategoryIcon(service.category)}
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium text-center flex items-center justify-center gap-1">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                          {service.vendorId?.availabilityStatus && (
                            <div
                              className={`px-2.5 py-1 rounded-full text-xs font-medium text-center flex items-center justify-center gap-1 ${
                                service.vendorId.availabilityStatus === 'available'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-orange-50 text-orange-700'
                              }`}
                            >
                              {service.vendorId.availabilityStatus === 'available' ? (
                                <>
                                  <Wifi size={12} />
                                  Available
                                </>
                              ) : (
                                <>
                                  <WifiOff size={12} />
                                  Busy
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{service.vendorId?.name}</h3>
                              <div className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs">
                                <Shield size={12} />
                                <span>Verified</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Briefcase size={14} className="text-slate-600" />
                                {service.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-red-600" />
                                {service.location}
                              </span>
                              {service.experience && (
                                <span className="flex items-center gap-1">
                                  <Award size={14} className="text-orange-600" />
                                  {service.experience}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="flex items-center gap-1">
                              <Star className="text-amber-400 fill-amber-400" size={16} />
                              <span className="text-lg font-semibold text-gray-900">4.8</span>
                              <span className="text-xs text-gray-500">(50+)</span>
                            </div>
                          </div>
                        </div>

                        {service.description && (
                          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <Clock className="text-purple-600" size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-0.5">Availability</p>
                              <p className="text-sm font-semibold text-gray-900">{service.availability}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-50 p-2 rounded-lg">
                              <DollarSign className="text-emerald-600" size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-0.5">Price Range</p>
                              <p className="text-base font-semibold text-emerald-600">Rs. {service.price}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleBookNow(service)}
                            disabled={service.vendorId?.availabilityStatus === 'busy'}
                            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 text-sm ${
                              service.vendorId?.availabilityStatus === 'busy'
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <Calendar size={16} />
                            {service.vendorId?.availabilityStatus === 'busy' ? 'Currently Busy' : 'Book Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredServices.length > 0 && (
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center border-l-4 border-slate-900">
                  <TrendingUp className="text-slate-900 mx-auto mb-3" size={28} />
                  <p className="text-3xl font-semibold text-gray-900 mb-1">{services.length}+</p>
                  <p className="text-gray-600 text-sm">Verified Vendors</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center border-l-4 border-emerald-600">
                  <Wifi className="text-emerald-600 mx-auto mb-3" size={28} />
                  <p className="text-3xl font-semibold text-gray-900 mb-1">
                    {services.filter(s => s.vendorId?.availabilityStatus === 'available').length}+
                  </p>
                  <p className="text-gray-600 text-sm">Available Now</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center border-l-4 border-purple-600">
                  <CheckCircle className="text-emerald-600 mx-auto mb-3" size={28} />
                  <p className="text-3xl font-semibold text-gray-900 mb-1">100%</p>
                  <p className="text-gray-600 text-sm">Verified Services</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Book Service</h2>
                <p className="text-gray-300 text-sm">Fill in your details to book this service</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!bookingSuccess ? (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-900" />
                      Service Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600"><span className="font-medium">Vendor:</span> {selectedService.vendorId?.name}</p>
                      <p className="text-gray-600"><span className="font-medium">Service:</span> {selectedService.category}</p>
                      <p className="text-gray-600"><span className="font-medium">Location:</span> {selectedService.location}</p>
                      <p className="text-gray-600"><span className="font-medium">Price:</span> Rs. {selectedService.price}</p>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm">
                      <X size={18} />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User size={14} className="text-slate-900" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => {
                          setBookingForm({...bookingForm, name: e.target.value});
                          if (formErrors.name) {
                            setFormErrors({...formErrors, name: ''});
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <X size={12} />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail size={14} className="text-slate-900" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => {
                          setBookingForm({...bookingForm, email: e.target.value});
                          if (formErrors.email) {
                            setFormErrors({...formErrors, email: ''});
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <X size={12} />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <PhoneIcon size={14} className="text-slate-900" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => {
                          setBookingForm({...bookingForm, phone: e.target.value});
                          if (formErrors.phone) {
                            setFormErrors({...formErrors, phone: ''});
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="03XX XXXXXXX"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <X size={12} />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Home size={14} className="text-slate-900" />
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.address}
                        onChange={(e) => {
                          setBookingForm({...bookingForm, address: e.target.value});
                          if (formErrors.address) {
                            setFormErrors({...formErrors, address: ''});
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm ${
                          formErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your complete address"
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <X size={12} />
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare size={14} className="text-slate-900" />
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                        placeholder="Any specific requirements or details..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="flex-1 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-6 text-sm">Your booking has been successfully created.</p>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <PhoneIcon size={18} className="text-slate-900" />
                      Vendor Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Name</p>
                          <p className="text-sm font-semibold text-gray-900">{bookingSuccess.vendorContact.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <a
                            href={`tel:${bookingSuccess.vendorContact.phone}`}
                            className="text-sm font-semibold text-slate-900 hover:text-slate-700"
                          >
                            {bookingSuccess.vendorContact.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-slate-900" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <a
                            href={`mailto:${bookingSuccess.vendorContact.email}`}
                            className="text-sm font-semibold text-slate-900 hover:text-slate-700"
                          >
                            {bookingSuccess.vendorContact.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;

