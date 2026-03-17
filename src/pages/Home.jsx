import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Search, Shield, Clock, Award, Star, TrendingUp, 
  CheckCircle, Phone, Mail, MapPin, Users, Zap,
  ThumbsUp, ArrowRight, Play, Quote, X, Sparkles
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-emerald-500" : type === "info" ? "bg-blue-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : type === "info" ? Sparkles : X;

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

// Video Modal Component
const VideoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-slate-900 rounded-3xl shadow-2xl p-2 max-w-4xl w-full animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-slate-900 hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all z-10"
        >
          <X size={24} />
        </button>
        <div className="relative pb-[56.25%] rounded-2xl overflow-hidden bg-slate-800">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/F4sYfuhK5aQ?si=K4IeY1qWGUNIR31v"
            title="FixKar Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const Home = () => {

    const token = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');

  // Auto-redirect if logged in
  if (token && userType) {
    if (userType === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (userType === 'vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    }
  }

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/vendors?search=${searchTerm}`);
      showToast(`Searching for "${searchTerm}"...`, "info");
    } else {
      showToast("Please enter a search term", "error");
    }
  };

  const services = [
    { icon: '🔧', name: 'Plumbing', count: '150+ Experts', color: 'from-blue-500 to-blue-600' },
    { icon: '⚡', name: 'Electrical', count: '120+ Experts', color: 'from-amber-500 to-amber-600' },
    { icon: '🔨', name: 'Carpentry', count: '90+ Experts', color: 'from-orange-500 to-orange-600' },
    { icon: '🎨', name: 'Painting', count: '110+ Experts', color: 'from-purple-500 to-purple-600' },
    { icon: '❄️', name: 'AC Repair', count: '80+ Experts', color: 'from-cyan-500 to-cyan-600' },
    { icon: '🚗', name: 'Car Mechanic', count: '95+ Experts', color: 'from-red-500 to-red-600' },
    { icon: '📱', name: 'Mobile Repair', count: '70+ Experts', color: 'from-indigo-500 to-indigo-600' },
    { icon: '🏠', name: 'Home Cleaning', count: '130+ Experts', color: 'from-emerald-500 to-emerald-600' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      role: 'Business Owner',
      image: '👨‍💼',
      rating: 5,
      text: 'FixKar helped me find an excellent electrician within minutes. The professional was punctual, skilled, and very reasonably priced. Highly recommend!',
      service: 'Electrical Work'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      role: 'Homemaker',
      image: '👩',
      rating: 5,
      text: 'I was worried about finding a reliable plumber, but FixKar made it so easy. The service was professional and the prices were transparent. Will definitely use again!',
      service: 'Plumbing'
    },
    {
      id: 3,
      name: 'Ali Raza',
      role: 'Software Engineer',
      image: '👨‍💻',
      rating: 5,
      text: 'Best platform for home services in Karachi! I found a carpenter who did amazing work on my furniture. The booking process was seamless.',
      service: 'Carpentry'
    },
    {
      id: 4,
      name: 'Sara Ahmed',
      role: 'Teacher',
      image: '👩‍🏫',
      rating: 5,
      text: 'Quick response, verified professionals, and excellent service. FixKar has become my go-to platform for all home maintenance needs.',
      service: 'AC Repair'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Shield, value: '500+', label: 'Verified Experts', color: 'text-emerald-600' },
    { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-amber-500' },
    { icon: CheckCircle, value: '50,000+', label: 'Jobs Completed', color: 'text-purple-600' }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Search Service',
      description: 'Browse or search for the service you need from our wide range of categories',
      icon: Search,
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Choose Expert',
      description: 'View profiles, ratings, and reviews to select the perfect professional for your job',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      step: '03',
      title: 'Book & Pay',
      description: 'Schedule your service at your convenience and pay securely through our platform',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      step: '04',
      title: 'Get It Done',
      description: 'Sit back and relax while our verified professional completes your job perfectly',
      icon: ThumbsUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All service providers undergo thorough background checks and verification',
      color: 'bg-blue-600'
    },
    {
      icon: Clock,
      title: 'Quick Response Time',
      description: 'Get connected with professionals within minutes of booking',
      color: 'bg-emerald-600'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: '100% satisfaction guarantee or your money back, no questions asked',
      color: 'bg-purple-600'
    },
    {
      icon: Star,
      title: 'Top Rated Service',
      description: 'Consistently rated 4.9/5 stars by thousands of satisfied customers',
      color: 'bg-amber-500'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book services instantly with our easy-to-use platform',
      color: 'bg-orange-600'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you anytime',
      color: 'bg-red-600'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
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
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .card-hover-lift {
          transition: all 0.3s ease;
        }
        
        .card-hover-lift:hover {
          transform: translateY(-8px);
        }
        
        .service-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .service-card:hover {
          transform: translateY(-4px) scale(1.02);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20 hover:bg-white/15 transition-all animate-float">
                <Shield className="text-emerald-400" size={16} />
                <span className="text-white text-sm font-medium">Trusted by 10,000+ Customers</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">
                Your Trusted Platform for
                <span className="block gradient-text mt-2">
                  Home Services
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Connect with verified, skilled professionals for all your service needs. Fast, reliable, and affordable.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
                <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 hover:shadow-emerald-500/20 transition-all">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Search for plumbers, electricians, mechanics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 text-gray-700 rounded-xl focus:outline-none bg-transparent"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    <Search size={18} />
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <button 
                  onClick={() => navigate('/vendors')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium border border-white/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  Browse All Services
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 animate-pulse-glow"
                >
                  Become a Service Provider
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium border border-white/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  <Play size={16} />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover-lift hover:bg-white/10 transition-all"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <stat.icon className={`${stat.color} mx-auto mb-3`} size={28} />
                    <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                <Sparkles size={16} />
                Popular Services
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                What Are You Looking For?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our wide range of professional home services
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/vendors?category=${service.name}`);
                    showToast(`Showing ${service.name} services`, "info");
                  }}
                  className="service-card group cursor-pointer bg-white rounded-2xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-2xl"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{service.name}</h3>
                  <p className="text-gray-500 text-sm">{service.count}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/vendors')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 transform hover:scale-105 active:scale-95"
              >
                View All Services
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                <TrendingUp size={16} />
                Simple Process
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                How FixKar Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get your service done in 4 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="card-hover-lift bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full hover:shadow-2xl hover:border-emerald-200 transition-all">
                    <div className={`absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-4 mt-6 shadow-lg`}>
                      <step.icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="text-emerald-400" size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                <Award size={16} />
                Our Features
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                Why Choose FixKar?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing the best service experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card-hover-lift bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:border-emerald-200 transition-all"
                >
                  <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="text-white" size={22} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-4 font-medium text-sm backdrop-blur-sm">
                <Star className="text-amber-400" size={16} />
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="card-hover-lift bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <Quote className="text-emerald-400/30 mb-3" size={32} />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-amber-400 fill-amber-400" size={16} />
                    ))}
                  </div>
                  <p className="text-white text-sm mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-xs">{testimonial.role}</p>
                      <p className="text-emerald-400 text-xs mt-0.5">Service: {testimonial.service}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(Math.ceil(testimonials.length / 2))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTestimonial === index ? 'bg-emerald-400 w-8' : 'bg-white/30'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who trust FixKar for their service needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/vendors')}
                    className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    Find a Service
                    <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    Become a Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                <Phone size={16} />
                Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions? We're here to help 24/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-hover-lift bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-500 text-sm mb-2">Mon-Sun: 24/7</p>
                <a 
                  href="tel:+923001234567" 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                  onClick={() => showToast("Opening phone dialer...", "info")}
                >
                  +92 300 1234567
                </a>
              </div>

              <div className="card-hover-lift bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-500 text-sm mb-2">Response within 24 hours</p>
                <a 
                  href="mailto:support@fixkar.com" 
                  className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                  onClick={() => showToast("Opening email client...", "info")}
                >
                  support@fixkar.com
                </a>
              </div>

              <div className="card-hover-lift bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-500 text-sm mb-2">Mon-Fri: 9AM - 6PM</p>
                <p className="text-purple-600 font-medium">
                  Karachi, Pakistan
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <VideoModal onClose={() => setShowVideoModal(false)} />
      )}
    </>
  );
};

export default Home;

