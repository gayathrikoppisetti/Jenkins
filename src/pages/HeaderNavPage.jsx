import React from "react";
import HeaderManager from "../components/HeaderManager";
import NavbarManager from "../components/NavbarManager";
import FooterManager from "../components/FooterManager";

const HeaderNavPage = () => {
  return (
    <div className="container my-5">
      
      {/* Page Title */}
      <h1 className="text-center mb-5 fw-bold">
        Site Branding & Navigation Manager
      </h1>

      {/* Header Manager Section */}
      <div className="card shadow-sm mb-5" style={{ border: "1px solid #0d6efd" }}>
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Header Branding Manager</h4>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Configure your site’s header, including titles, logos, and branding elements.
          </p>
          <HeaderManager />
        </div>
      </div>

      {/* Navbar Manager Section */}
      <div className="card shadow-sm mb-5" style={{ border: "1px solid #198754" }}>
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Navbar Manager</h4>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Manage navigation links, dropdown menus, and visibility for your site’s navbar.
          </p>
          <NavbarManager />
        </div>
      </div>

      {/* Footer Manager Section */}
      <div className="card shadow-sm" style={{ border: "1px solid #6c757d" }}>
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Footer Manager</h4>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Customize footer content, social links, and other bottom-page elements.
          </p>
          <FooterManager />
        </div>
      </div>

    </div>
  );
};

export default HeaderNavPage;
