import { UIKitSection } from '../components/UIKitSection';
import { motion } from 'motion/react';

export function UIKitPage() {
  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <UIKitSection />
      </motion.div>
    </div>
  );
}