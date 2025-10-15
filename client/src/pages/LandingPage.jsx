import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-500">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Floating AI shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-72 h-72 bg-[#ff6f91] rounded-full opacity-20 animate-pulse-slow -top-10 -left-10" />
          <div className="absolute w-60 h-60 bg-[#845ec2] rounded-full opacity-15 animate-pulse-slow -bottom-10 right-10" />
          <div className="absolute w-80 h-80 bg-[#00c9a7] rounded-full opacity-10 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-[#10002b]"
          >
            Bridge the Gap Between
            <span className="block">Students, Colleges & Careers</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl max-w-3xl mx-auto text-[#240046]"
          >
            Discover AI-powered opportunities, analytics, and personalized career insights — all on one intelligent platform.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:scale-105 transition-all duration-300 bg-[#10002b] text-white hover:bg-[#240046]"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg text-lg font-medium border border-[#10002b] text-[#10002b] hover:bg-[#f9f9f9] hover:text-[#240046] transition-all duration-300"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Tailwind custom animations */}
        <style>
          {`
            @keyframes pulse-slow {
              0%, 100% { transform: scale(1); opacity: 0.2; }
              50% { transform: scale(1.2); opacity: 0.3; }
            }
            .animate-pulse-slow {
              animation: pulse-slow 8s ease-in-out infinite;
            }
          `}
        </style>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-gray-900"
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            className="text-lg mb-16 max-w-2xl mx-auto text-gray-600"
          >
            Smart tools and dashboards designed for students, colleges, and administrators.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Students',
                emoji: '🎓',
                points: [
                  'AI-based job recommendations',
                  'Smart resume analyzer',
                  'Career roadmap & insights',
                  'Application tracking system',
                ],
              },
              {
                title: 'Colleges',
                emoji: '🏛️',
                points: [
                  'Student performance analytics',
                  'Placement dashboard',
                  'Skill-gap insights',
                  'Department metrics',
                ],
              },
              {
                title: 'Administrators',
                emoji: '⚙️',
                points: [
                  'Automated job postings',
                  'Real-time analytics',
                  'User management',
                  'System notifications',
                ],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 0.2 * i }}
                className="p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300 bg-white text-gray-800"
              >
                <div className="text-5xl mb-4">{card.emoji}</div>
                <h3 className="text-2xl font-semibold mb-6">{card.title}</h3>
                <ul className="text-left space-y-2">
                  {card.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-green-500">✔</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-white">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className="text-3xl md:text-4xl font-bold mb-4 text-[#10002b]"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.2 }}
          className="text-lg mb-8 max-w-2xl mx-auto text-[#240046]"
        >
          Join thousands already building their career journey with Career Bridge.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/signup"
            className="py-3 px-10 rounded-full text-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 bg-[#10002b] text-white hover:bg-[#240046]"
          >
            Create Your Account
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
