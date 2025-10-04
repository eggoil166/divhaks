import { motion } from "framer-motion";
import Header from "./components/Header";
import HomeBottom from "./components/HomeBottom";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header fades in slowly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2}} // fade in over 2 seconds
      >
        <Header />
      </motion.div>

      {/* HomeBottom slides in from the left */}
      <motion.div
        initial={{ x: -200, opacity: 0 }} // start off-screen to the left
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }} // slide in after header fade
      >
        <HomeBottom />
      </motion.div>
    </div>
  );
}

export default App;
