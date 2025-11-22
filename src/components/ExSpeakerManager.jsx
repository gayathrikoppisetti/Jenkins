import React, { useState, useEffect } from "react";
import api from "../services/api";

const SpeakerManager = () => {
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    blog: "",
    blogVisible: true,
    order: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    bio: "",
    blog: "",
    blogVisible: true,
    order: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // ✅ Fetch speakers sorted by order
  const fetchSpeakers = async () => {
    try {
      const res = await api.get("/speakers");
      setSpeakers(res.data.sort((a, b) => a.order - b.order)); // ensure sorting
    } catch (err) {
      showMsg("Failed to load speakers", "danger");
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // ✅ Show alert message
  const showMsg = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ Upload new speaker
  const handleUpload = async () => {
    if (!form.image || !form.name || !form.title || !form.bio) {
      return showMsg("Image, Name, Title & Bio required", "danger");
    }

    const formData = new FormData();
    formData.append("image", form.image);
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("bio", form.bio);
    formData.append("blog", form.blog);
    formData.append("blogVisible", form.blogVisible);
    if (form.order) formData.append("order", form.order);

    try {
      const res = await api.post("/speakers", formData);
      setSpeakers([...speakers, res.data].sort((a, b) => a.order - b.order));
      setForm({
        name: "",
        title: "",
        bio: "",
        blog: "",
        blogVisible: true,
        order: "",
        image: null,
      });
      document.querySelector("#speakerImage").value = "";
      showMsg("Speaker added successfully");
    } catch (err) {
      showMsg(err.response?.data?.error || "Upload failed", "danger");
    }
  };

  // ✅ Confirm delete modal
  const confirmDeleteModal = (id) => {
    setDeleteModal({ show: true, id });
  };

  // ✅ Delete speaker
  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/speakers/${deleteModal.id}`);
      setSpeakers(speakers.filter((sp) => sp._id !== deleteModal.id));
      setDeleteModal({ show: false, id: null });
      showMsg("Deleted successfully");
    } catch {
      showMsg("Delete failed", "danger");
    }
  };

  // ✅ Start editing speaker text fields
  const startEdit = (speaker) => {
    setEditId(speaker._id);
    setEditForm({
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      blog: speaker.blog,
      blogVisible: speaker.blogVisible,
      order: speaker.order || "",
    });
  };

  // ✅ Save edited speaker
  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/speakers/${id}`, editForm);
      setSpeakers(
        speakers.map((sp) => (sp._id === id ? res.data : sp)).sort((a, b) => a.order - b.order)
      );
      setEditId(null);
      showMsg("Updated successfully");
    } catch (err) {
      showMsg(err.response?.data?.error || "Update failed", "danger");
    }
  };

  // ✅ Toggle blog visibility
  const toggleBlogVisibility = async (id) => {
    try {
      const res = await api.patch(`/speakers/${id}/toggle-blog`);
      setSpeakers(
        speakers.map((sp) => (sp._id === id ? res.data.speaker : sp)).sort((a, b) => a.order - b.order)
      );
      showMsg(`Blog visibility: ${res.data.speaker.blogVisible ? "Visible" : "Hidden"}`);
    } catch {
      showMsg("Toggle failed", "danger");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Manage Speakers</h2>

      {/* ✅ Alert message */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {/* ✅ Add new speaker */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Add New Speaker</h5>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Blog Link (optional)</label>
            <input
              type="text"
              className="form-control"
              value={form.blog}
              onChange={(e) => setForm({ ...form, blog: e.target.value })}
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.blogVisible}
              onChange={(e) =>
                setForm({ ...form, blogVisible: e.target.checked })
              }
              id="blogVisibleCheck"
            />
            <label className="form-check-label" htmlFor="blogVisibleCheck">
              Blog Visible
            </label>
          </div>

          {/* ✅ Order field */}
          <div className="mb-3">
            <label className="form-label">Order (Optional, unique)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Leave empty for auto order"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
            <small className="text-muted">
              Lower number appears first. Leave blank to auto-assign next.
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">Speaker Image</label>
            <input
              id="speakerImage"
              type="file"
              className="form-control"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
          </div>

          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {/* ✅ Speakers List */}
     <div className="row gy-4">
  {speakers.map((speaker) => (
    <div className="col-12 col-md-6" key={speaker._id}>
      <div className="card shadow-sm border-0 h-100 speaker-card">
        <div className="row g-0">
          {/* Left: Speaker Image */}
          <div className="col-4 d-flex align-items-center">
            <img
              src={speaker.imageUrl}
              alt={speaker.name}
              className="img-fluid rounded-start"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Right: Speaker Info */}
          <div className="col-8">
            <div className="card-body d-flex flex-column h-100">
              {/* Order Badge */}
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-1">{speaker.name}</h5>
                <span className="badge bg-primary">
                  #{speaker.order !== undefined && speaker.order !== null ? speaker.order : "Auto"}
                </span>
              </div>

              <h6 className="text-muted">{speaker.title}</h6>

              <p className="card-text small text-secondary">{speaker.bio}</p>

              {speaker.blog && (
                <p className="small mt-auto mb-1">
                  <strong>Blog:</strong>{" "}
                  <a
                    href={speaker.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-underline"
                  >
                    {speaker.blog}
                  </a>{" "}
                  <span className={speaker.blogVisible ? "text-success" : "text-danger"}>
                    {speaker.blogVisible ? "✅ Visible" : "❌ Hidden"}
                  </span>
                </p>
              )}

              {/* Edit Mode */}
              {editId === speaker._id && (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Blog Link"
                    value={editForm.blog}
                    onChange={(e) => setEditForm({ ...editForm, blog: e.target.value })}
                  />
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={editForm.blogVisible}
                      onChange={(e) =>
                        setEditForm({ ...editForm, blogVisible: e.target.checked })
                      }
                      id={`blogVisibleEdit-${speaker._id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`blogVisibleEdit-${speaker._id}`}
                    >
                      Blog Visible
                    </label>
                  </div>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Order"
                    value={editForm.order}
                    onChange={(e) => setEditForm({ ...editForm, order: e.target.value })}
                  />
                </>
              )}

              {/* Footer Buttons */}
              <div className="mt-3 d-flex justify-content-between">
                {editId === speaker._id ? (
                  <button className="btn btn-success btn-sm" onClick={() => saveEdit(speaker._id)}>
                    ✅ Save
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => startEdit(speaker)}
                  >
                    ✏️ Edit
                  </button>
                )}
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => toggleBlogVisibility(speaker._id)}
                >
                  {speaker.blogVisible ? "🙈 Hide Blog" : "👁️ Show Blog"}
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => confirmDeleteModal(speaker._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      {speakers.length === 0 && (
        <div className="text-center text-muted mt-3">
          No speakers found. Add your first one above.
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setDeleteModal({ show: false, id: null })}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to <strong>delete</strong> this speaker?
                <br />
                <span className="text-danger">
                  This action cannot be undone!
                </span>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModal({ show: false, id: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirmed}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerManager;
