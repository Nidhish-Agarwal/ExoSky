import { motion } from "framer-motion";
import { AnimatedTooltip } from "./AnimatedTooltip";

export default function CTASection() {
  const teammates = [
    {
      id: 1,
      name: "Kirana Trupthi Shree",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      name: "Tejas Philip Thomas",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      name: "Kiesha Maria",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      name: "Nidhish Agarwal",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      name: "Varsha Vijyashwini Panda",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
  ];
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-black text-center px-6 relative overflow-hidden">
      {/* Subtle starry overlay effect */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none"></div> */}

      <motion.h2
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Ready to Explore the Stars?
      </motion.h2>

      {/* <motion.button
        className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white font-semibold shadow-lg backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button> */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <footer className="bg-black p-8 flex justify-center space-x-8">
        <h2 className="text-white text-2xl font-bold tracking-widest">
          THE TEAM
        </h2>
        <AnimatedTooltip items={teammates} />
      </footer>
    </section>
  );
}
