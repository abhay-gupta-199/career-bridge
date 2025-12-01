import { motion } from 'framer-motion';

/**
 * Modern Gradient Card Component with hover effects
 * Perfect for job listings, notifications, and data displays
 */
const GradientCard = ({ 
  children, 
  gradient = 'from-purple-500 via-pink-500 to-red-500',
  className = '',
  hover = true,
  delay = 0
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      className={`relative group overflow-hidden rounded-2xl ${className}`}
    >
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300">
        {children}
      </div>

      {/* Animated Border on Hover */}
      {hover && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-5 -z-10`}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export default GradientCard;
