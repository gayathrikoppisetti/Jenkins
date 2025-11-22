import React from "react";
import Announcement from "../components/Announcement";
import CarouseManager from "../components/CarouseManager";

const ExtraPage = () => {
  return (
    <div className="container my-5">
      {/* Page Title */}
      <h1 className="text-center mb-5 fw-bold">Extra Features Manager</h1>

      {/* Announcement Manager */}
      <div className="card shadow-sm mb-5" style={{ border: "1px solid #0dcaf0" }}>
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">Announcement Manager</h4>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Create and manage announcements or alerts displayed across your site.
          </p>
          <Announcement />
        </div>
      </div>

      {/* Carousel Manager */}
      <div className="card shadow-sm" style={{ border: "1px solid #ffc107" }}>
        <div className="card-header bg-warning text-dark">
          <h4 className="mb-0">Carousel Manager</h4>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Manage homepage banners, carousel images, and their display order.
          </p>
          <CarouseManager />
        </div>
      </div>
    </div>
  );
};

export default ExtraPage;
