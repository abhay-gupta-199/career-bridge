import { Link } from 'react-router-dom';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Motion Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: 'easeOut' },
  }),
};

const floatVariants = {
  animate: {
    y: [0, 20, 0],
    x: [0, 15, -15, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const shimmerText = {
  hidden: { backgroundPosition: '200% 0' },
  visible: {
    backgroundPosition: '0 0',
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: 2,
      ease: 'linear',
    },
  },
};

const LandingPage = () => {
  const { scrollY } = useViewportScroll();
  const [offsetY, setOffsetY] = useState(0);

  // Hero Parallax effect
  const yHero = useTransform(scrollY, [0, 300], [0, -50]);
  const yParticles = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setOffsetY(latest);
    });
  }, [scrollY]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#faf5ff] to-[#f9f9ff] text-gray-900 transition-colors duration-500">

      {/* Floating Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: yParticles }}
          className="absolute w-80 h-80 bg-[#845ec2]/30 rounded-full blur-3xl top-10 left-[-10%]"
          variants={floatVariants}
          animate="animate"
        />
        <motion.div
          style={{ y: yParticles }}
          className="absolute w-96 h-96 bg-[#ff6f91]/30 rounded-full blur-3xl bottom-20 right-[-10%]"
          variants={floatVariants}
          animate="animate"
        />
        <motion.div
          style={{ y: yParticles }}
          className="absolute w-72 h-72 bg-[#00c9a7]/30 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative py-40 flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0">
          <motion.img
            style={{ y: yHero }}
            src="https://wallpapers.com/images/hd/office-worker-best-laptop-corporate-job-9bjgv24faioiqnvy.jpg"
            alt="Professional corporate background"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b0033]/60 via-[#3a006e]/40 to-[#1a0033]/60 mix-blend-soft-light backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-[#ffffff] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]">
          <motion.h1
            custom={0.1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Bridge the Gap Between
            <motion.span
              className="block bg-gradient-to-r from-[#d4bfff] via-[#c686f7] to-[#9d4edd] bg-clip-text text-transparent"
              variants={shimmerText}
              initial="hidden"
              animate="visible"
            >
              Students, Colleges & Careers
            </motion.span>
          </motion.h1>

          <motion.p
            custom={0.3}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-xl max-w-3xl mx-auto text-[#f3eaff] font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          >
            Discover AI-powered opportunities, analytics, and personalized career insights — all on one intelligent platform.
          </motion.p>

          <motion.div
            custom={0.5}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 1, boxShadow: '0 20px 25px rgba(0,0,0,0.35)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/signup"
                className="px-10 py-3 rounded-full text-lg font-semibold shadow-lg bg-gradient-to-r from-[#7b2cbf] via-[#5a189a] to-[#3c096c] text-white"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, backgroundColor: 'rgba(199, 125, 255, 0.2)' }}>
              <Link
                to="/login"
                className="px-10 py-3 rounded-full text-lg font-semibold border border-[#cdb4ff] text-[#f1eaff]"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            custom={0.1}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-[#10002b]"
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p
            custom={0.3}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-lg mb-16 max-w-2xl mx-auto text-gray-700"
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
                custom={0.2 * i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="relative p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl bg-white/90 backdrop-blur-md transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#845ec2]/10 to-[#240046]/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 animate-bounce">{card.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-6 text-[#10002b]">{card.title}</h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    {card.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className="text-green-500 animate-pulse">✔</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center bg-gradient-to-br from-[#faf5ff] via-[#ffffff] to-[#f3edff] relative overflow-hidden">
        <motion.h2
          custom={0.1}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className="text-3xl md:text-4xl font-bold mb-4 text-[#10002b]"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          custom={0.3}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          className="text-lg mb-10 max-w-2xl mx-auto text-[#240046]"
        >
          Join thousands already building their career journey with Career Bridge.
        </motion.p>

        <motion.div custom={0.5} variants={fadeInUp} initial="hidden" whileInView="visible">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 1, boxShadow: '0 20px 25px rgba(0,0,0,0.35)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/signup"
              className="py-4 px-12 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white"
            >
              Create Your Account
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
