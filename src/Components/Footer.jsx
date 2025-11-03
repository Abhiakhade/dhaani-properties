import React from 'react';

// Replaced lucide-react imports with inline SVG components
const PhoneIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-7.5-7.5 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const MapPinIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const Footer = () => {
  // Define links and services data
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Sell', href: '/sell' },
  ];

  const services = [
    { name: 'Property Valuation', href: '/services/valuation' },
    { name: 'Legal Documentation', href: '/services/legal' },
    { name: 'Home Loans', href: '/services/loans' },
    { name: 'Property Management', href: '/services/management' },
  ];

  const contactInfo = [
    // Use inline SVG components here
    { icon: PhoneIcon, text: '+91 7037989896', type: 'tel' },
    { icon: MailIcon, text: 'info@dhaaniproperties.com', type: 'email' },
    { icon: MapPinIcon, text: 'Vrindavan , Uttar Pradesh', type: 'address' },
  ];

  const Column = ({ title, items, isContact = false }) => (
    <div className="flex flex-col">
      {/* Increased font size for column titles and added margin-bottom */}
      <h3 className="text-xl font-extrabold mb-2 text-white uppercase tracking-wider">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            {isContact ? (
              // Contact info layout refinement
              <div className="flex items-start text-gray-400">
                {/* Made icons slightly larger and kept pink color */}
                <item.icon className="w-5 h-5 mr-3 mt-1 text-white flex-shrink-0" />
                <span className="text-base hover:text-white transition-colors duration-200">{item.text}</span>
              </div>
            ) : (
              <a 
                href={item.href || '#'}
                className="text-base text-gray-400 hover:text-white transition-colors duration-200 block"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-black text-white">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Company Info - Used stronger color for the title */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-black text-white mb-4 tracking-tight">DHAANI PROPERTIES</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner in finding the perfect property. Buy, sell, and rent with confidence.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <Column title="Quick Links" items={quickLinks} />

          {/* Column 3: Services */}
          <Column title="Services" items={services} />

          {/* Column 4: Contact Info */}
          <Column title="Contact Info" items={contactInfo} isContact={true} />
        </div>

        {/* Divider and Copyright */}
        <div className="mt-5 pt-8 border-t border-gray-700/50">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2018 DHAANI PROPERTIES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
