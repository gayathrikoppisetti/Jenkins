import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function HeroSectionManager() {
  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    backgroundImage: null,
    heroImage: null,
  });
  const [preview, setPreview] = useState({ backgroundImage: null, heroImage: null });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const PDF_URL = "/brochure.pdf";

  const showMsg = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchHero = async () => {
    try {
      const { data } = await api.get("/hero");
      setHero(data);
      setFormData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        primaryButtonText: data.primaryButton?.text || "",
        primaryButtonLink: data.primaryButton?.link || "",
        secondaryButtonText: data.secondaryButton?.text || "",
        backgroundImage: null,
        heroImage: null,
      });
      setPreview({
        backgroundImage: data.backgroundImageUrl || null,
        heroImage: data.heroImageUrl || null,
      });
    } catch {
      showMsg("Failed to fetch hero section", "danger");
    }
  };

  useEffect(() => { fetchHero(); }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setFormData({ ...formData, [name]: file });
    if (file) setPreview({ ...preview, [name]: URL.createObjectURL(file) });
  };

  const updateHero = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));
    try {
      const res = await api.put("/hero", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHero(res.data);
      showMsg("Hero section updated");
      fetchHero();
    } catch {
      showMsg("Update failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = () => window.open(PDF_URL, "_blank");

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = "conference-brochure.pdf";
    link.click();
  };

  if (!hero) return <div className="p-3 text-center">Loading...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Manage Hero Section</h2>

      {alert && (
        <div className={`alert alert-${alert.type} text-center`}>
          {alert.message}
        </div>
      )}

      <div className="card shadow p-4">
        <h5 className="mb-3">Hero Section Texts</h5>

        <label>Title</label>
        <input
          name="title"
          className="form-control mb-3"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Subtitle</label>
        <textarea
          name="subtitle"
          className="form-control mb-3"
          rows="3"
          value={formData.subtitle}
          onChange={handleChange}
        />

        <div className="row">
          <div className="col-md-6">
            <label>Primary Button Text</label>
            <input
              name="primaryButtonText"
              className="form-control mb-3"
              value={formData.primaryButtonText}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Primary Button Link</label>
            <input
              name="primaryButtonLink"
              className="form-control mb-3"
              value={formData.primaryButtonLink}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Secondary Button Text</label>
        <input
          name="secondaryButtonText"
          className="form-control mb-4"
          value={formData.secondaryButtonText}
          onChange={handleChange}
        />

        {/* Images */}
        <h5 className="mb-3 mt-4">Hero Images</h5>
        <div className="row">
          {[
            { name: "backgroundImage", label: "Background Image" },
            { name: "heroImage", label: "Hero Image" },
          ].map((img) => (
            <div className="col-md-6" key={img.name}>
              <label>{img.label}</label>
              <input
                type="file"
                name={img.name}
                accept="image/*"
                className="form-control mb-2"
                onChange={handleFileChange}
              />
              {preview[img.name] && (
                <img
                  src={preview[img.name]}
                  alt={img.label}
                  className="img-fluid rounded mt-2 shadow"
                />
              )}
            </div>
          ))}
        </div>

        {/* Brochure PDF */}
        <h5 className="mt-4 mb-2">Brochure PDF</h5>
        <div>
          <button
            onClick={handleViewPDF}
            className="btn btn-outline-primary btn-sm me-2"
          >
            View Online
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-success btn-sm">
            Download Brochure
          </button>
          <p className="text-muted small mt-2">
            To update, replace <code>public/brochure.pdf</code>.
          </p>
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary mt-4 px-4"
            onClick={updateHero}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
