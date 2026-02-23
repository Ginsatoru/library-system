import { useState, useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";

const HomeBooks = () => {
  const [books, setBooks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const mockBooks = [
      {
        id: 1,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        category: "Computer Science",
        available: true,
        rating: 4.8,
      },
      {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        cover:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        category: "Programming",
        available: true,
        rating: 4.9,
      },
      {
        id: 3,
        title: "Data Science Handbook",
        author: "Jake VanderPlas",
        cover:
          "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400",
        category: "Data Science",
        available: false,
        rating: 4.7,
      },
      {
        id: 4,
        title: "Design Patterns",
        author: "Erich Gamma",
        cover:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400",
        category: "Software Engineering",
        available: true,
        rating: 4.6,
      },
      {
        id: 5,
        title: "The Art of Programming",
        author: "Donald Knuth",
        cover:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
        category: "Computer Science",
        available: true,
        rating: 4.9,
      },
      {
        id: 6,
        title: "Database Systems",
        author: "Ramez Elmasri",
        cover:
          "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400",
        category: "Database",
        available: true,
        rating: 4.5,
      },
      {
        id: 7,
        title: "Web Development",
        author: "Jon Duckett",
        cover:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        category: "Web Development",
        available: false,
        rating: 4.7,
      },
      {
        id: 8,
        title: "Machine Learning",
        author: "Andrew Ng",
        cover:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
        category: "AI/ML",
        available: true,
        rating: 4.8,
      },
    ];

    setBooks(mockBooks);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex justify-between items-center mb-12 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600">
              Popular picks from our collection
            </p>
          </div>
          <a
            href="/browse"
            className="hidden md:inline-flex items-center font-semibold transition-colors hover:opacity-80 group"
            style={{ color: "#000080" }}
          >
            See All Books
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <div
              key={book.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden group transform hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Book Cover */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!book.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Checked Out
                    </span>
                  </div>
                )}
                {book.available && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Available
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="p-5">
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "#000080" }}
                >
                  {book.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {book.rating}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  className="w-full text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: "#000080" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#000066")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#000080")
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile See All Button */}
        <div
          className={`mt-8 text-center md:hidden transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <a
            href="/browse"
            className="inline-flex items-center font-semibold transition-colors hover:opacity-80 group"
            style={{ color: "#000080" }}
          >
            See All Books
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeBooks;