import { motion } from "framer-motion";

const features = [
  { title: "Real Data", desc: "Powered by Gaia & SIMBAD star catalogs." },
  { title: "3D Universe", desc: "Explore stars in a 360° immersive space." },
  {
    title: "Constellations",
    desc: "View, learn, and interact with patterns in the night sky.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-black text-white px-6">
      <h2 className="text-4xl font-bold mb-12">Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur shadow-xl cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
