import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp, FiCalendar, FiUser, FiMail, FiPhone, FiClock } from 'react-icons/fi';

const ReservationPage = () => {
  // Mock reservation data
  const mockReservations = [
    {
      id: 1,
      guestName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      date: '2023-06-15',
      time: '19:30',
      partySize: 4,
      serviceType: 'Dinner',
      status: 'confirmed',
      specialRequests: 'Window seat preferred',
    },
    {
      id: 2,
      guestName: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      date: '2023-06-16',
      time: '12:00',
      partySize: 2,
      serviceType: 'Brunch',
      status: 'pending',
      specialRequests: 'Allergic to nuts',
    },
    {
      id: 3,
      guestName: 'Michael Chen',
      email: 'michael.c@example.com',
      phone: '+1 (555) 456-7890',
      date: '2023-06-17',
      time: '20:00',
      partySize: 6,
      serviceType: 'Dinner',
      status: 'confirmed',
      specialRequests: 'Celebrating anniversary',
    },
    {
      id: 4,
      guestName: 'Emily Wilson',
      email: 'emily.w@example.com',
      phone: '+1 (555) 789-0123',
      date: '2023-06-18',
      time: '18:30',
      partySize: 3,
      serviceType: 'Dinner',
      status: 'cancelled',
      specialRequests: '',
    },
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    serviceType: '',
  });

  // Filter reservations based on search and filters
  const filteredReservations = mockReservations.filter(reservation => {
    const matchesSearch = 
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.date || reservation.date === filters.date) &&
      (!filters.status || reservation.status === filters.status) &&
      (!filters.serviceType || reservation.serviceType.toLowerCase() === filters.serviceType.toLowerCase());
    
    return matchesSearch && matchesFilters;
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      date: '',
      status: '',
      serviceType: '',
    });
    setSearchTerm('');
  };

  // Status badge colors
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Reservation Management</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiFilter className="mr-2" />
              Filters
              {showFilters ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
          </div>
          
          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Filter */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Service Type Filter */}
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filters.serviceType}
                      onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                    >
                      <option value="">All Service Types</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Brunch">Brunch</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                </div>
                
                {/* Reset Filters Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Reservations Grid */}
        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{reservation.guestName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    {new Date(reservation.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    {reservation.time}
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No reservations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Reservation Detail Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </motion.div>
              
              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Reservation Details
                        </h3>
                        <button
                          onClick={() => setSelectedReservation(null)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>
                      
                      <div className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{selectedReservation.guestName}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedReservation.status)}`}>
                              {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-start">
                              <FiMail className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm text-gray-900">{selectedReservation.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FiPhone className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm text-gray-900">{selectedReservation.phone}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FiCalendar className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm text-gray-900">
                                  {new Date(selectedReservation.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FiClock className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="text-sm text-gray-900">{selectedReservation.time}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FiUser className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Party Size</p>
                                <p className="text-sm text-gray-900">{selectedReservation.partySize}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-5 w-5 mr-2"></div>
                              <div>
                                <p className="text-xs text-gray-500">Service Type</p>
                                <p className="text-sm text-gray-900">{selectedReservation.serviceType}</p>
                              </div>
                            </div>
                          </div>
                          
                          {selectedReservation.specialRequests && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-500">Special Requests</p>
                              <p className="text-sm text-gray-900 mt-1">{selectedReservation.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel Reservation
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReservation(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationPage;