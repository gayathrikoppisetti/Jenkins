import React, { useState, useEffect } from "react";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { dashboardService } from "../services/dashboardService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [visitorData, setVisitorData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async (showFullLoader = false) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const [statsRes, visitors, , activities, regTypes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getVisitorData(),
        dashboardService.getRegistrationData(),
        dashboardService.getRecentActivities(),
        dashboardService.getRegistrationTypes(),
      ]);

      setStats(statsRes || {});
      setVisitorData(visitors || []);
      setPieData(regTypes || []);
      setRecentActivities(activities || []);
    } catch (err) {
      setError("❌ Failed to fetch dashboard data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
    const interval = setInterval(() => {
      if (!document.hidden) fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const STAT_CONFIG = [
    { key: "totalVisitors", title: "Total Visitors", icon: "bi-people", color: "bg-primary" },
    { key: "totalRegistrations", title: "Total Registrations", icon: "bi-calendar-event", color: "bg-success" },
    { key: "activeUsers", title: "Active Users", icon: "bi-graph-up-arrow", color: "bg-warning" },
  ];

  const StatCard = ({ title, value, iconClass, colorClass }) => (
    <div className="col-12 col-md-6 col-lg-3 mb-3">
      <div className="card shadow-sm border-0">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h4 className="fw-bold">{value?.toLocaleString?.() ?? 0}</h4>
          </div>
          <div className={`rounded-circle p-3 text-white ${colorClass}`}>
            <i className={`bi ${iconClass}`}></i>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => fetchDashboardData()}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats */}
      <div className="row">
        {STAT_CONFIG.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stats[stat.key]}
            iconClass={stat.icon}
            colorClass={stat.color}
          />
        ))}
      </div>

      <div className="row my-4">

       
      </div>

      <div className="row">
        {/* Recent Activities */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h5>Recent Activities</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fetchDashboardData()}
                  disabled={refreshing}
                >
                  Refresh
                </button>
              </div>
              {recentActivities.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {recentActivities.map((a) => (
                    <li key={a.id} className="list-group-item d-flex justify-content-between">
                      <span><i className="bi bi-bell text-primary me-2"></i>{a.action}</span>
                      <small className="text-muted">{a.user} • {a.time}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center py-3">No recent activities</p>
              )}
            </div>
          </div>
        </div>

        
      
      </div>
    </div>
  );
};

export default Dashboard;
