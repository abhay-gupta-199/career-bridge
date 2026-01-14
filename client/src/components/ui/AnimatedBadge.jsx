import { motion } from 'framer-motion';

/**
 * Animated Badge Component for skills, statuses, and tags
 * Supports different variants: skill, status, tag, match
 */
const AnimatedBadge = ({
  text,
  variant = 'skill',
  icon = null,
  animate = true,
  className = '',
  ...props
}) => {
  const variants = {
    skill: 'bg-gradient-to-r from-green-400 to-emerald-600 text-white',
    missing: 'bg-gradient-to-r from-red-400 to-rose-600 text-white',
    status: 'bg-gradient-to-r from-blue-400 to-cyan-600 text-white',
    match: 'bg-gradient-to-r from-purple-400 to-pink-600 text-white',
    tag: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
  };

  const motionVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    },
    hover: animate ? { scale: 1.1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' } : {}
  };

  return (
    <motion.span
      variants={motionVariants}
      initial="hidden"
      animate="visible"
      whileHover={animate ? "hover" : ""}
      whileTap={props.onClick ? { scale: 0.95 } : {}}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
        shadow-md backdrop-blur-sm ${variants[variant]}
        ${props.onClick ? 'cursor-pointer' : 'cursor-default'} transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{text}</span>
    </motion.span>
  );
};

export default AnimatedBadge;
