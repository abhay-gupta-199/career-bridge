import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * Status Badge Component with icons and animations
 * Perfect for application status, job status, etc.
 */
const StatusBadge = ({ 
  status = 'applied',
  text = null,
  size = 'md'
}) => {
  const statusConfig = {
    applied: {
      icon: <Clock size={16} />,
      color: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    shortlisted: {
      icon: <CheckCircle2 size={16} />,
      color: 'from-green-400 to-emerald-600',
      bg: 'bg-green-50',
      textColor: 'text-green-700'
    },
    rejected: {
      icon: <XCircle size={16} />,
      color: 'from-red-400 to-rose-600',
      bg: 'bg-red-50',
      textColor: 'text-red-700'
    },
    pending: {
      icon: <Clock size={16} />,
      color: 'from-yellow-400 to-orange-600',
      bg: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    }
  };

  const config = statusConfig[status] || statusConfig.applied;
  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }[size];

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-2 ${sizeClass}
        rounded-full font-semibold ${config.bg} ${config.textColor}
        border-2 border-current/20 shadow-md backdrop-blur-sm
      `}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        {config.icon}
      </motion.div>
      <span>{text || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </motion.div>
  );
};

export default StatusBadge;
