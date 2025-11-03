import React from 'react';

// Card component for individual services
const ServiceCard = ({ icon, title, description, color }) => {
  // Determine gradient color based on prop (default to indigo if none provided)
  const gradientClass = color === 'green'
    ? 'from-green-500 to-emerald-500'
    : color === 'orange'
    ? 'from-orange-500 to-amber-500'
    : color === 'red'
    ? 'from-red-500 to-pink-500'
    : color === 'blue'
    ? 'from-blue-500 to-cyan-500'
    : color === 'yellow'
    ? 'from-yellow-500 to-amber-300'
    : 'from-indigo-500 to-purple-500';

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100 cursor-pointer">
      <div className={`p-4 rounded-full mb-4 inline-block bg-gradient-to-br ${gradientClass} shadow-xl`}>
        {/* Using Emojis for icons */}
        <span className="text-3xl" role="img" aria-label={title}>{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 text-center">{title}</h3>
      <p className="text-gray-500 text-center text-sm">{description}</p>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: '🏠', // House icon
      title: 'Buy Property',
      description: 'Find your perfect home from our extensive collection of verified properties.',
      color: 'indigo',
    },
    {
      icon: '🔑', // Key icon for Rent
      title: 'Rent Property',
      description: 'Discover rental properties that match your lifestyle, budget, and location needs.',
      color: 'green',
    },
    {
      icon: '💰', // Money bag icon for Sell
      title: 'Sell Property',
      description: 'Get the best value for your property with our expert assistance and wide network.',
      color: 'orange',
    },
    {
      icon: '🛠️', // Tools icon for construction/development
      title: 'Property Development',
      description: 'Expert guidance on new construction and renovation projects from planning to finish.',
      color: 'blue',
    },
    {
      icon: '📈', // Chart icon for investment
      title: 'Investment Advisory',
      description: 'Receive personalized advice to maximize returns on your real estate investments.',
      color: 'red',
    },
    {
      icon: '🧑‍⚖️', // Judge/Law icon for legal
      title: 'Legal Consultation',
      description: 'Comprehensive legal support for all property documentation and due diligence.',
      color: 'yellow',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" id='service'>
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle - Adjusted Font for a bolder, more prominent look */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 tracking-wide sm:text-5xl uppercase">
            Our Services
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Helping you achieve your real estate goals seamlessly.
          </p>
        </div>

        {/* Service Cards Container - Now a 3-column grid for 6 services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
