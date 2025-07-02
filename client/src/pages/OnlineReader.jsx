import { useState, useRef, useEffect } from 'react';
import { 
  X,
  BookOpen,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Fullscreen,
  Download as DownloadIcon,
  Bookmark,
  Search as SearchIcon
} from 'lucide-react';

const OnlineReader = ({ book, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const pdfContainerRef = useRef(null);

  const mockPdfContent = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="mb-8 p-8 bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{book.title} - Page {i + 1}</h2>
      <p className="text-lg mb-4">
        This is a sample page from "{book.title}". In a real application, this would display 
        the actual book content from a PDF or other document format.
      </p>
      <p className="text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
        Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
        rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna 
        non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut 
        dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit 
        odio.
      </p>
    </div>
  ));

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    scrollToTop();
  };

  const scrollToTop = () => {
    pdfContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const preventDownload = (e) => {
      if (e.target.href?.includes('.pdf')) {
        e.preventDefault();
        alert('Downloading this book is not permitted. Please read online only.');
      }
    };

    document.addEventListener('click', preventDownload);
    return () => document.removeEventListener('click', preventDownload);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">
            Reading: {book.title} by {book.author}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-700 text-white p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-600 transition-colors">
            <ZoomIn className="h-5 w-5" />
          </button>
          <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-600 transition-colors">
            <ZoomOut className="h-5 w-5" />
          </button>
          <button onClick={handleRotate} className="p-2 rounded hover:bg-gray-600 transition-colors">
            <RotateCw className="h-5 w-5" />
          </button>
          <div className="flex items-center mx-4">
            <span className="text-sm mr-2">{(scale * 100).toFixed(0)}%</span>
            <input
              type="range"
              min="50"
              max="300"
              value={scale * 100}
              onChange={(e) => setScale(e.target.value / 100)}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded hover:bg-gray-600 transition-colors ${showSearch ? 'bg-gray-600' : ''}`}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button onClick={() => alert('Bookmark added!')} className="p-2 rounded hover:bg-gray-600 transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
          <button onClick={() => alert('Full screen mode activated!')} className="p-2 rounded hover:bg-gray-600 transition-colors">
            <Fullscreen className="h-5 w-5" />
          </button>
          <button 
            onClick={() => alert('Downloading is disabled for this book.')}
            className="p-2 rounded hover:bg-gray-600 transition-colors"
          >
            <DownloadIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Search Panel */}
      {showSearch && (
        <div className="bg-gray-600 p-3">
          <div className="flex items-center max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search in book..."
              className="flex-1 px-3 py-2 rounded-l-md bg-gray-700 text-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div 
        ref={pdfContainerRef}
        className="flex-1 overflow-auto bg-gray-100 p-4"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center top',
          transition: 'transform 0.2s ease',
          height: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}
      >
        <div className="max-w-4xl mx-auto">
          {mockPdfContent[currentPage - 1]}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md flex items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </button>
        
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Math.min(Math.max(parseInt(e.target.value) || 1, 1), totalPages);
              setCurrentPage(page);
            }}
            className="w-16 px-2 py-1 text-center bg-gray-700 rounded-md mx-2"
          />
          <span>of {totalPages}</span>
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md flex items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default OnlineReader;