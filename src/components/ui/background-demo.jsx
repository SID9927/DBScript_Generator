import AnimatedGradientBackground from "./animated-gradient-background";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";
import React from "react";

const DemoVariant1 = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Gradient Background */}
      <AnimatedGradientBackground />

      <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <DotLottieReact
            src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
            loop
            autoplay
            style={{ width: '300px', height: '300px' }}
          />
        </motion.div>
        <p className="mt-4 text-lg text-gray-300 md:text-xl max-w-lg font-medium">
          A customizable animated radial gradient background with a subtle
          breathing effect.
        </p>
      </div>
    </div>
  );
};

export default DemoVariant1;
