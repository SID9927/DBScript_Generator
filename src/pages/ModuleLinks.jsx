import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const ModuleLinks = ({ basePath, modules }) => (
  <motion.div
    className="flex gap-4 flex-wrap"
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
  >
    {modules.map((mod, idx) => (
      <motion.div key={idx} variants={staggerItem}>
        <Link
          to={mod.to.startsWith('/') ? mod.to : `${basePath}${mod.to}`}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mod.name}
          </motion.button>
        </Link>
      </motion.div>
    ))}
  </motion.div>
);

export default ModuleLinks;

