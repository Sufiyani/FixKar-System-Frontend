import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaWhatsapp
} from "react-icons/fa";
import { Wrench, Heart, Shield, Award, Clock, Mail, Phone, MapPin, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    setEmail('');
    alert('Thanks for subscribing!');
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/vendors", label: "Find Services" },
    { to: "/register", label: "Become a Vendor" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" }
  ];

  const services = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "AC Repair",
    "Mechanics"
  ];

  const socialMedia = [
    { icon: FaFacebook, color: "hover:bg-blue-600 hover:text-white", link: "https://facebook.com" },
    { icon: FaTwitter, color: "hover:bg-sky-500 hover:text-white", link: "https://twitter.com" },
    { icon: FaInstagram, color: "hover:bg-pink-600 hover:text-white", link: "https://instagram.com" },
    { icon: FaLinkedin, color: "hover:bg-blue-700 hover:text-white", link: "https://linkedin.com" },
    { icon: FaWhatsapp, color: "hover:bg-green-600 hover:text-white", link: "https://wa.me/923001234567" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden border-t border-gray-200">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"></div>

      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60L60 50C120 40 240 20 360 16.7C480 13 600 27 720 33.3C840 40 960 40 1080 33.3C1200 27 1320 13 1380 6.7L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white" fillOpacity="1"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <Wrench className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FixKar
                </h2>
                <p className="text-xs font-semibold text-gray-500 tracking-wide flex items-center gap-1">
                  <Sparkles size={9} className="text-indigo-500" />
                  Professional Services
                </p>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Your trusted platform for verified home service professionals. Quality work, guaranteed satisfaction.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <p className="font-bold text-gray-900 text-lg">500+</p>
                <p className="text-gray-500 text-xs">Experts</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <p className="font-bold text-gray-900 text-lg">10K+</p>
                <p className="text-gray-500 text-xs">Customers</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all">
                <p className="font-bold text-gray-900 text-lg">4.9★</p>
                <p className="text-gray-500 text-xs">Rating</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              Quick Links
              <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 text-blue-500" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              Our Services
              <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-300 to-transparent"></div>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/vendors"
                    className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <CheckCircle2 size={14} className="text-green-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              Stay Connected
              <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-300 to-transparent"></div>
            </h3>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 pr-28 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all flex items-center gap-1 text-sm font-semibold text-white shadow-sm"
                >
                  <Mail size={16} />
                  Subscribe
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="space-y-3 mb-6 text-sm">
              <a href="tel:+923001234567" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors border border-blue-200">
                  <Phone size={16} className="text-blue-600" />
                </div>
                <span>+92 300 1234567</span>
              </a>
              <a href="mailto:support@fixkar.com" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors group">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors border border-green-200">
                  <Mail size={16} className="text-green-600" />
                </div>
                <span>support@fixkar.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                  <MapPin size={16} className="text-purple-600" />
                </div>
                <span>Karachi, Pakistan</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-2">
              {socialMedia.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-100 p-2.5 rounded-xl ${social.color} transition-all hover:scale-110 border border-gray-200 text-gray-700`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 mb-10 border-y border-gray-200">
          <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">24/7 Support</p>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Verified Experts</p>
              <p className="text-xs text-gray-500">Background checked</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Quality Guaranteed</p>
              <p className="text-xs text-gray-500">100% satisfaction</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span>© {currentYear} FixKar. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span>Crafted with</span>
            <Heart className="text-red-500 fill-red-500 animate-pulse" size={16} />
            <span>in Pakistan</span>
          </div>
          
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;