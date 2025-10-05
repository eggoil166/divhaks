// src/App.tsx
import { motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import Header from "./components/Header";
import HomeBottom from "./components/HomeBottom";
import Dashboard from "./components/Dashboard";
import { LoginButton } from "./components/LoginButton";
import { LogoutButton } from "./components/LogoutButton";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

export default function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
    >
      {/* Use your palette */}
      <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        {/* Header fades in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Header />
          <div className="px-6 lg:px-10 pt-2 flex gap-3">
            <LoginButton />
            <LogoutButton />
          </div>
        </motion.div>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                <HomeBottom />
              </motion.div>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Later:
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/store" element={<Store />} /> */}
        </Routes>
      </div>
    </Auth0Provider>
  );
}
