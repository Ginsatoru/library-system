import { motion } from 'framer-motion';
import { 
  BookOpen,
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  BookMarked,
  Search,
  User,
  CalendarCheck,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isOpen = true; // You can replace this with actual opening hours logic

  // Primary user actions
  const quickActions = [
    { icon: <Search className="h-4 w-4" />, name: "Search Books", url: "/search" },
    { icon: <BookMarked className="h-4 w-4" />, name: "My Loans", url: "/loans" },
    { icon: <CalendarCheck className="h-4 w-4" />, name: "Renewals", url: "/renewals" },
    { icon: <CreditCard className="h-4 w-4" />, name: "Pay Fines", url: "/fines" },
    { icon: <User className="h-4 w-4" />, name: "My Account", url: "/account" }
  ];

  // Help and support
  const supportLinks = [
    { name: "Contact Us", url: "/contact" },
    { name: "FAQs", url: "/faq" },
    { name: "Library Guides", url: "/guides" },
    { name: "Report an Issue", url: "/report" }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 text-white border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Library Branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">
                BBU Library
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering your academic journey with quality resources and services.
            </p>
            
            {/* Library Status */}
            <div className="flex items-center space-x-2 pt-2">
              <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <p className="text-sm text-gray-300">
                {isOpen ? 'Open now' : 'Currently closed'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Quick Actions
            </h4>
            <ul className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    to={action.url} 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {action.icon}
                    <span>{action.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Help & Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    to={link.url} 
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="pt-2">
              <Link 
                to="/help" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Need immediate help?
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Siem Reap, Cambodia
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a 
                  href="mailto:library@bbu.edu.kh" 
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  library@bbu.edu.kh
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a 
                  href="tel:+855231234567" 
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  +855 23 123 4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300 text-sm">
                  Mon-Fri: 8AM - 8:30PM<br />
                  Sat-Sun: 8AM - 5PM<br />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-left mb-4 md:mb-0">
            © {currentYear} Build Bright University Library. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/accessibility" 
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
            >
              Accessibility
            </Link>
            <Link 
              to="/feedback" 
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;