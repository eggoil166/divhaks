import { motion } from "framer-motion";
import Header from "./components/Header";
import HomeBottom from "./components/HomeBottom";
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
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
    </Auth0Provider>
  );
}

export default App;
