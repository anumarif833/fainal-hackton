import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = ({ onStatusChange = () => {} }) => { 
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const authNavItems = isAuthenticated
    ? [
        { to: "/taskManagement", icon: faCalendarCheck, text: "Task Management" },
        { to: "/logout", icon: faSignOutAlt, text: "Logout" },
      ]
    : [
        { to: "/signup", icon: faSignOutAlt, text: "Sign Up" },
        { to: "/", icon: faSignOutAlt, text: "Login" },
      ];

  return (
    <nav className="w-full bg-black text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Title */}
          <div className="text-xl font-bold">Smit Task</div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            {authNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onStatusChange(item.text)}
                className={`flex items-center px-3 py-2 rounded-md transition duration-300 ${
                  location.pathname === item.to
                    ? "bg-[#F7F7F7] text-black font-semibold"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
