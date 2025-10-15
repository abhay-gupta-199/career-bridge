import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="py-12"
      style={{
        background: 'linear-gradient(135deg, #10002b 0%, #240046 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-bold mb-4 text-white">Career Bridge</h4>
          <p className="text-gray-200 max-w-xs">
            Connecting students, colleges, and companies to create meaningful career opportunities.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            {['Home', 'About', 'Jobs', 'Contact'].map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-4 text-white">Contact Us</h4>
          <p className="text-gray-200">support@careerbridge.com</p>
          <p className="text-gray-200 mt-2">+1 234 567 890</p>
          <div className="flex space-x-4 mt-4">
            {['Facebook', 'Twitter', 'LinkedIn'].map((platform, idx) => (
              <a
                key={idx}
                href="#"
                className="text-gray-200 hover:text-white transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-300 mt-12">
        &copy; {new Date().getFullYear()} Career Bridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
