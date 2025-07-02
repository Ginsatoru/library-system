import { motion } from 'framer-motion'

const BookDetailsModal = ({ book, onClose, onBorrow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded mb-4">
              <span className="text-gray-400">Book Cover</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Author</h3>
                <p className="text-gray-800">{book.author}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                <p className="text-gray-800">{book.isbn || '978-3-16-148410-0'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Published Year</h3>
                <p className="text-gray-800">{book.year || '2021'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {book.available ? 'Available for checkout' : 'Currently checked out'}
                </p>
              </div>
              
              {book.dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p className="text-gray-800">{book.dueDate}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {book.available && (
              <button
                onClick={onBorrow}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Borrow Book
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BookDetailsModal