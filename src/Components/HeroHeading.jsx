import { motion } from "framer-motion";

const HeroHeading = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto mb-10 text-center"
    >
      {/* ✨ Animated Title */}
      <motion.h1
        initial={{ backgroundPosition: "200% center" }}
        animate={{ backgroundPosition: "0% center" }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 4,
          ease: "linear",
        }}
        className="text-4xl md:text-6xl font-extrabold mb-4 uppercase bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-[length:200%_auto] bg-clip-text text-transparent"
      >
        Find Your Dream{" "}
        <span className="text-white drop-shadow-[0_2px_6px_rgba(16,185,129,0.4)]">
          Property
        </span>
      </motion.h1>

      {/* ✨ Subtitle with subtle fade */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 11, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-300 tracking-wide"
      >
        Buy & Sell Properties with{" "}
        <span className="font-semibold text-emerald-400">
          DHAANI PROPERTIES
        </span>
      </motion.p>

      {/* ✨ Underline Glow Accent */}
      <div className="mt-5 flex justify-center">
        <div className="h-1.5 w-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
      </div>
    </motion.div>
  );
};

export default HeroHeading;
