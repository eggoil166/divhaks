import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { Profile } from './profile';
import { useAuth0 } from '@auth0/auth0-react';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  const navigate = useNavigate();

  return (
    <header className="w-full  bg-gray-300 text-[var(--text)] border-b border-[var(--secondary)] shadow-sm fixed top-0 left-0 z-50">
      <div className="px-10 py-5 flex flex-col sm:flex-row items-center justify-between w-full">
        {/* Logo / Title */}
        <Link to="/" className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-[var(--primary)] hover:text-[var(--accent)] transition-colors cursor-pointer">
            Priorikitty
          </h1>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          
          <button
            onClick={() => navigate("/")}
            className="bg-[var(--primary)] hover:bg-[var(--accent)] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-sm"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[var(--primary)] hover:bg-[var(--accent)] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-sm"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/schedule")}
            className="bg-[var(--secondary)] hover:bg-[var(--accent)] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-sm"
          >
            Schedule
          </button>
          <button
            onClick={() => navigate("/store")}
            className="bg-[var(--secondary)] hover:bg-[var(--accent)] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 active:scale-95 font-semibold text-sm"
          >
            Store
          </button>
          { isAuthenticated ? (<LogoutButton />) : (<LoginButton />) }
          { isAuthenticated && <Profile />}
        </div>
      </div>
    </header>
  );
};

export default Header;
