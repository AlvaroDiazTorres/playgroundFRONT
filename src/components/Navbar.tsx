import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserProps } from '../models/User';
import logo from '../assets/logos/logo_colores.png';
import logout from '../assets/logout.png';

interface NavbarProps {
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
}

export default function Navbar({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="bg-white border-b-2 border-black w-full h-15 flex flex-row items-center sticky top-0 z-10">
      <Link to="/" className="w-50">
        <img
          className="pb-2.5"
          src={logo}
          alt="playgrounds logo"
        />
      </Link>
      {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition ml-4"
          >
            Control Panel
          </Link>
        )}
      <div className="flex-1 bg-white" />
      <div className="flex items-center gap-4 mr-6">
        <Link
          to={user ? "/profile" : "/login"}
          className="text-black font-semibold hover:underline cursor-pointer bg-white"
        >
          {user ? `${user.name} ${user.surname}` : "Sign In"}
        </Link>
     
        {user && (
          <button onClick={handleLogout} className="hover:opacity-80">
            <img
              src={logout}
              alt="Logout"
              className="w-6 h-6"
            />
          </button>
        )}
      </div>
    </div>
  );
}
