import React, { useContext } from "react";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { adminUser, logout } = useContext(AuthContext);

  const displayName =
    adminUser?.username ||
    adminUser?.name ||
    adminUser?.email ||
    "Admin";

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <h4 className="m-0">Dashboard</h4>

      <div className="d-flex align-items-center gap-3">
        <div className="dropdown">
          <button
            className="btn btn-link text-dark dropdown-toggle d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <FaUser className="me-2" /> {displayName}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
          {/* Optional items */}
            <li><a className="dropdown-item" href="/profile">Profile</a></li>
            <li><a className="dropdown-item" href="/settings">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
