import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../styles/Sidebar.module.css';
import {
  FaBars,
  FaSignOutAlt,
  FaTachometerAlt,
  FaListAlt,
  FaQuestionCircle,
  FaBullhorn,
  FaUsers,
  FaClipboardList,
  FaRegFileAlt,
  FaImages,
  FaCogs,
  FaFileSignature,
  FaCalendarAlt,
  FaEdit
} from "react-icons/fa";

const menuItems = [
  // --- Dashboard ---
  { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },

  // --- Content Managers ---
  { to: "/header-nav", icon: <FaEdit />, label: "Header, Navigation & Footer" },
  { to: "/hero", icon: <FaImages />, label: "Hero Section" },
  { to: "/about-content", icon: <FaRegFileAlt />, label: "About Page Content" },
  { to: "/paper-content", icon: <FaFileSignature />, label: "Call for Papers" },
  { to: "/speakers", icon: <FaUsers />, label: "Speakers Manager" },
  { to: "/committee", icon: <FaUsers />, label: "Committee Manager" },
  { to: "/extra", icon: <FaBullhorn />, label: "Extra Announcements" },

  // --- Event Details ---
  { to: "/dates", icon: <FaCalendarAlt />, label: "Important Dates" },
  { to: "/faq-editor", icon: <FaQuestionCircle />, label: "FAQ Editor" },
  { to: "/register", icon: <FaClipboardList />, label: "Registration Manager" },

  // --- Settings ---
  { to: "/settings", icon: <FaCogs />, label: "Settings" }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button onClick={toggleSidebar} className="hamburger-btn" aria-label="Toggle sidebar">
        <FaBars size={24} />
      </button>

      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <a href="/" className="sidebar-brand" onClick={closeSidebar}>
            <FaTachometerAlt className="me-2" />
            Dashboard
          </a>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <a href="/logout" className="sidebar-item" onClick={closeSidebar}>
            <FaSignOutAlt />
            <span>Logout</span>
          </a>
        </div>
      </nav>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
