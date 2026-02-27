import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  BookMarked,
  Search,
  User,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../images/logofooter.png";

const getLibraryStatus = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours + minutes / 60;

  if (day >= 1 && day <= 5) return time >= 8 && time < 20.5;
  if (day === 0 || day === 6) return time >= 8 && time < 17;
  return false;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isOpen = getLibraryStatus();

  const quickActions = [
    { icon: <Search className="h-4 w-4" />, name: "Browse Books", url: "/browse" },
    { icon: <BookMarked className="h-4 w-4" />, name: "My History", url: "/history" },
    { icon: <Heart className="h-4 w-4" />, name: "Wishlist", url: "/wishlist" },
    { icon: <User className="h-4 w-4" />, name: "My Profile", url: "/profile" },
  ];

  const accountLinks = [
    { name: "Login", url: "/login" },
    { name: "Register", url: "/register" },
    { name: "Forgot Password", url: "/forgot-password" },
    { name: "Library Log", url: "/library-log" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#17196D] text-white border-t border-gray-800"
    >
      <div className="max-w-[82rem] mx-auto px-6 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Library Branding */}
          <div className="space-y-4">
            <img src={Logo} alt="BBU Library" className="h-10 w-auto object-contain" />
            <p className="text-gray-300 text-sm">
              Empowering your academic journey with quality resources and services.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-400" : "bg-red-400"}`} />
              <p className="text-sm text-gray-300">
                {isOpen ? "Open now" : "Currently closed"}
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
                <motion.li key={index} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
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

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Account
            </h4>
            <ul className="space-y-3">
              {accountLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    to={link.url}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">Siem Reap, Cambodia</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:info@sr.bbu.edu.kh" className="text-gray-300 hover:text-white text-sm transition-colors">
                  info@sr.bbu.edu.kh
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+855231234567" className="text-gray-300 hover:text-white text-sm transition-colors">
                  +855 23 123 4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300 text-sm">
                  Mon-Fri: 8AM - 8:30PM
                  <br />
                  Sat-Sun: 8AM - 5PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left mb-4 md:mb-0">
            © {currentYear} Build Bright University Library. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Home</Link>
            <Link to="/browse" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Browse</Link>
            <Link to="/wishlist" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Wishlist</Link>
            <Link to="/profile" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Profile</Link>
          </div>
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;