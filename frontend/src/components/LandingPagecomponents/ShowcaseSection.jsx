import { motion } from "framer-motion";

export default function ShowcaseSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-black text-center px-6 relative overflow-hidden">
      <motion.h2
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Universe Awaits
      </motion.h2>
      <motion.p
        className="mt-6 text-lg text-gray-400 max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Navigate through stars, zoom into exoplanets, and uncover hidden
        constellations with real astronomical datasets.
      </motion.p>
    </section>
  );
}
