import React, { useRef } from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Rahul Sharma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Dhaani Properties made selling my home smooth and stress-free. The support team was amazing!",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Very professional service. I found my dream apartment within days!",
    rating: 5,
  },
  {
    name: "Arjun Verma",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    text: "Loved the clean UI and easy navigation. Property approval was quick.",
    rating: 4,
  },
  {
    name: "Neha Singh",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I could easily list my flat for sale and got serious buyers in a week!",
    rating: 5,
  },
  {
    name: "Karan Patel",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    text: "Excellent experience. The platform is fast, secure, and user-friendly.",
    rating: 4,
  },
  {
    name: "Simran Kaur",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    text: "I really liked how Dhaani Properties connects buyers and sellers directly.",
    rating: 5,
  },
  {
    name: "Rohit Desai",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    text: "Great customer service and a professional team that helped me with my listing.",
    rating: 5,
  },
  {
    name: "Isha Malhotra",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    text: "The map feature and real-time updates made it easy to shortlist properties.",
    rating: 4,
  },
  {
    name: "Vikram Joshi",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
    text: "Easy to use and modern website! Highly recommended for property owners.",
    rating: 5,
  },
  {
    name: "Ananya Rao",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    text: "Clean design and excellent responsiveness. I’ll definitely use it again.",
    rating: 5,
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  // 🧠 Drag to scroll (touch support)
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => (isDown = false);
  const handleMouseUp = () => (isDown = false);
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 overflow-hidden relative">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10">
        💬 What Our Clients Say
      </h2>

      <div
        className="overflow-hidden group relative px-6 cursor-grab active:cursor-grabbing"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Infinite scroll container */}
        <div className="flex animate-scrollX space-x-6 w-max group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-lg border border-gray-200 hover:border-indigo-400 
                         shadow-md hover:shadow-2xl rounded-2xl p-4 w-64 flex-shrink-0 transition-all 
                         duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="flex items-center mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover border border-indigo-200"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </h3>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-yellow-400 text-xs drop-shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs italic leading-relaxed">
                “{t.text}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient fade on edges */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Testimonials;
