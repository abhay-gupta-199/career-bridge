import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const staggerFade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Navbar />

      {/* Hero Section with Freepik background */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat h-[80vh]"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/recruiting-professionals-studying-candidate-profiles_1262-21404.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-md"></div>

          {/* Floating soft circles */}
          <div className="absolute w-72 h-72 bg-[#ff6f91]/10 rounded-full top-10 left-10 animate-floatSlow"></div>
          <div className="absolute w-56 h-56 bg-[#845ec2]/10 rounded-full bottom-20 right-16 animate-floatSlow"></div>
          <div className="absolute w-96 h-96 bg-[#00c9a7]/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-floatSlow"></div>
        </div>

        {/* Hero Card shifted top-left and smaller */}
        <div className="absolute top-10 left-6 md:top-16 md:left-12 lg:top-24 lg:left-24 max-w-md">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6f91] via-[#845ec2] to-[#00c9a7] opacity-20 blur-3xl rounded-2xl animate-glowSlow"></div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-extrabold mb-4 text-[#10002b] leading-tight relative z-10"
            >
              About Career Bridge
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-md md:text-lg text-gray-700 relative z-10"
            >
              Connecting students, colleges, and careers through innovative technology and personalized experiences.
            </motion.p>

            {/* Call-to-action buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-start relative z-10"
            >
              <a
                href="/signup"
                className="bg-[#10002b] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#240046] transition-colors duration-200 text-sm md:text-base"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="border-2 border-[#10002b] text-[#10002b] font-medium py-2 px-6 rounded-lg hover:bg-[#10002b] hover:text-white transition-colors duration-200 text-sm md:text-base"
              >
                Sign In
              </a>
            </motion.div>
          </motion.div>
        </div>

        <style>{`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-floatSlow { animation: floatSlow 12s ease-in-out infinite; }

          @keyframes glowSlow {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.3; }
          }
          .animate-glowSlow { animation: glowSlow 10s ease-in-out infinite; }
        `}</style>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative bg-gradient-to-r from-[#f5f5ff] to-[#e0e0ff]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#10002b] mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Career Bridge was born to eliminate the gap between students seeking opportunities,
              colleges tracking their success, and companies finding the right talent.
            </p>
            <p className="text-gray-700">
              We leverage cutting-edge technology to create meaningful connections,
              streamline processes, and provide data-driven insights for all stakeholders.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-10 bg-white/20 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-[#240046] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#10002b] mb-4 text-center">Innovation</h3>
            <p className="text-gray-700 text-center">
              Continuously evolving our platform with the latest technologies for a smooth user experience and accurate job matching.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#10002b] mb-4"
          >
            Our Core Values
          </motion.h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            The principles that guide everything we do at Career Bridge
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Accessibility', desc: 'Opportunities accessible to all students regardless of background or location.' },
            { title: 'Quality', desc: 'Maintaining high standards in job matching, UX, and data accuracy.' },
            { title: 'Empathy', desc: 'Designing our platform with empathy for intuitive career navigation.' }
          ].map((value, i) => (
            <motion.div
              key={i}
              variants={staggerFade}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-[#10002b] mb-4 text-center">{value.title}</h3>
              <p className="text-gray-700 text-center">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 relative bg-gradient-to-r from-[#ffffff] via-[#f0f4ff] to-[#e0e0ff]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#10002b] mb-4"
          >
            Our Impact
          </motion.h2>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Numbers that reflect our commitment to transforming careers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Students Connected' },
              { number: '500+', label: 'Colleges Partnered' },
              { number: '5,000+', label: 'Jobs Matched' },
              { number: '85%', label: 'Success Rate' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={staggerFade}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#240046] mb-2">{stat.number}</div>
                <div className="text-gray-700">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#10002b] py-16 relative">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Transform Your Career Journey?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of students who have already discovered their perfect career path with Career Bridge
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <a
              href="/signup"
              className="bg-white text-[#10002b] font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
