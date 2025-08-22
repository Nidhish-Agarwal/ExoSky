import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 text-white z-10"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-2xl font-bold">ExoSky</h1>
      <ul className="flex gap-6 text-lg">
        <li className="hover:text-blue-400 cursor-pointer">Home</li>
        <li className="hover:text-blue-400 cursor-pointer">Explore</li>
        <li className="hover:text-blue-400 cursor-pointer">About</li>
        <li className="hover:text-blue-400 cursor-pointer">Login</li>
      </ul>
    </motion.nav>
  );
}
