import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function HeaderBrandManager() {
  const [brand, setBrand] = useState(null);
  const [titles, setTitles] = useState({ titlePrimary: "", titleSecondary: "" });
  const [iconForm, setIconForm] = useState({ link: "", order: 0, file: null });
  const [editIcon, setEditIcon] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showMsg = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchBrand = async () => {
    try {
      const res = await api.get("/header-brand");
      setBrand(res.data);
      setTitles({ titlePrimary: res.data.titlePrimary, titleSecondary: res.data.titleSecondary });
    } catch {
      showMsg("Failed to fetch header brand", "danger");
    }
  };

  useEffect(() => { fetchBrand(); }, []);

  const updateTitles = async () => {
    try {
      const res = await api.put("/header-brand/titles", titles);
      setBrand(res.data);
      showMsg("Titles updated");
    } catch { showMsg("Failed to update titles", "danger"); }
  };

  const uploadIcon = async () => {
    if (!iconForm.file || !iconForm.link) return showMsg("Icon & link required", "danger");
    const formData = new FormData();
    Object.entries(iconForm).forEach(([k, v]) => formData.append(k === "file" ? "icon" : k, v));
    try {
      const res = await api.post("/header-brand/icons", formData);
      setBrand(res.data);
      setIconForm({ link: "", order: 0, file: null });
      showMsg("Icon added");
    } catch { showMsg("Upload failed", "danger"); }
  };

  const saveIconEdit = async (id) => {
    try {
      let res;
      if (editIcon.file) {
        const fd = new FormData();
        fd.append("link", editIcon.link);
        fd.append("order", editIcon.order);
        fd.append("icon", editIcon.file);
        res = await api.put(`/header-brand/icons/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await api.put(`/header-brand/icons/${id}`, { link: editIcon.link, order: editIcon.order });
      }
      setBrand(res.data);
      setEditIcon(null);
      showMsg("Icon updated");
    } catch { showMsg("Update failed", "danger"); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/header-brand/icons/${deleteId}`);
      fetchBrand();
      setDeleteId(null);
      showMsg("Icon deleted");
    } catch { showMsg("Delete failed", "danger"); }
  };

  if (!brand) return <div className="p-3">Loading...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Header Branding</h2>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Titles */}
      <div className="card p-3 mb-4">
        <h5>Brand Titles</h5>
        {["titlePrimary", "titleSecondary"].map((field) => (
          <input key={field} className="form-control mb-2" placeholder={field} value={titles[field]}
            onChange={(e) => setTitles({ ...titles, [field]: e.target.value })} />
        ))}
        <button className="btn btn-primary" onClick={updateTitles}>Save Titles</button>
      </div>

      {/* Add Icon */}
      <div className="card p-3 mb-4">
        <h5>Add New Icon</h5>
        <input className="form-control mb-2" placeholder="Icon Link" value={iconForm.link}
          onChange={(e) => setIconForm({ ...iconForm, link: e.target.value })} />
        <input type="number" className="form-control mb-2" placeholder="Order" value={iconForm.order}
          onChange={(e) => setIconForm({ ...iconForm, order: e.target.value })} />
        <input type="file" className="form-control mb-2" onChange={(e) => setIconForm({ ...iconForm, file: e.target.files[0] })} />
        <button className="btn btn-success" onClick={uploadIcon}>Upload Icon</button>
      </div>

      {/* Existing Icons */}
      <h5>Existing Icons</h5>
      {brand.icons.sort((a, b) => a.order - b.order).map(icon =>
        <div key={icon._id} className="card mb-3 p-3 d-flex flex-row align-items-center">
          <img src={editIcon?.preview || icon.imageUrl} alt="icon" className="me-3 rounded" style={{ width: 80, height: 80 }} />
          <div className="flex-fill">
            {editIcon?.id === icon._id ? (
              <>
                <input className="form-control mb-2" value={editIcon.link} onChange={(e) => setEditIcon({ ...editIcon, link: e.target.value })} />
                <input type="number" className="form-control mb-2" value={editIcon.order} onChange={(e) => setEditIcon({ ...editIcon, order: e.target.value })} />
                <input type="file" className="form-control mb-2" onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setEditIcon({ ...editIcon, file: f, preview: URL.createObjectURL(f) });
                }} />
                <button className="btn btn-success me-2" onClick={() => saveIconEdit(icon._id)}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditIcon(null)}>Cancel</button>
              </>
            ) : (
              <>
                <a href={icon.link} target="_blank" rel="noreferrer">{icon.link}</a>
                <div className="text-muted small">Order: {icon.order}</div>
                <button className="btn btn-warning btn-sm me-2 mt-2" onClick={() => setEditIcon({ ...icon, id: icon._id })}>Edit</button>
                <button className="btn btn-danger btn-sm mt-2" onClick={() => setDeleteId(icon._id)}>Delete</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="text-danger">Confirm Delete</h5></div>
              <div className="modal-body">Are you sure you want to delete this icon? <span className="text-danger">This cannot be undone!</span></div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
