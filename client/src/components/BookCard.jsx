import { motion } from 'framer-motion'

const BookCard = ({ book, onViewDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md card-shadow hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Book Cover</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <div className="flex justify-between items-center mt-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {book.available ? 'Available' : 'Checked Out'}
          </span>
          <button 
            onClick={() => onViewDetails(book)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default BookCard