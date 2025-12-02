import { motion } from 'framer-motion';

/**
 * Glassmorphism Card Component with blur effects
 * Perfect for hero sections, stats, and featured content
 */
const GlassCard = ({ 
  children, 
  className = '',
  delay = 0,
  glow = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className={`
        relative rounded-2xl backdrop-blur-xl border border-white/20
        bg-white/10 shadow-2xl overflow-hidden group
        ${glow ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent' : ''}
        ${className}
      `}
    >
      {/* Glow effect on hover */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
