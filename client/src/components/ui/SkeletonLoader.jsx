import { motion } from 'framer-motion';

/**
 * Skeleton Loader Component for smooth loading states
 */
const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmer = {
    initial: { backgroundPosition: '200% 0' },
    animate: {
      backgroundPosition: '0 0',
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl"
            style={{
              backgroundSize: '200% 100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
          style={{
            backgroundSize: '200% 100%'
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
