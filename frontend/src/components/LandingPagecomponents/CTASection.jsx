import { motion } from "framer-motion";
import { AnimatedTooltip } from "./AnimatedTooltip";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  const teammates = [
    {
      id: 1,
      name: "Kirana Trupthi Shree",
      designation: "FullStack Developer",
      image: "/Kiranaa.jpeg",
    },
    {
      id: 2,
      name: "Tejas Philip Thomas",
      designation: "FullStack Developer",
      image: "/TejasT.jpeg",
    },
    {
      id: 3,
      name: "Kiesha Maria",
      designation: "FullStack Developer",
      image: "/Kiesha.jpeg",
    },
    {
      id: 4,
      name: "Nidhish Agarwal",
      designation: "FullStack Developer",
      image: "/nidhish.jpg",
    },
    {
      id: 5,
      name: "Varsha Vijyashwini Panda",
      designation: "FullStack Developer",
      image: "/varsha.jpg",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-between bg-black text-center px-6 relative overflow-hidden">
      {/* Main content */}
      <div className="flex-grow flex flex-col justify-center items-center py-16">
        {/* Subtle starry overlay effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

        <motion.h2
          className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 drop-shadow-lg mb-6"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ready to Explore the Stars?
        </motion.h2>

        <motion.p
          className="text-gray-300 text-lg max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Join our community of space enthusiasts and explore the universe like
          never before.
        </motion.p>

        <motion.button
          className="mt-6 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
        >
          Login to explore
        </motion.button>
      </div>

      {/* Team section */}
      <motion.footer
        className="bg-black from-black to-gray-900 p-8 md:p-12 w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-white text-2xl md:text-3xl font-bold tracking-widest mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            MEET THE TEAM
          </motion.h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <div className="flex-1 max-w-md">
              <p className="text-gray-400 text-sm md:text-base mb-6 text-center md:text-left">
                Our talented team of developers has created an immersive space
                exploration experience using cutting-edge technology.
              </p>
            </div>

            <div className="flex-1 flex justify-center">
              <AnimatedTooltip items={teammates} />
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ExoSky. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </section>
  );
}
