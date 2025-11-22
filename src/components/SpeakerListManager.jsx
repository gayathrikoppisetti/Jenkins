import { useState } from "react";
import api from "../services/api";

const SpeakerList = ({ speakers, fetchSpeakers, onDelete }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newImage, setNewImage] = useState(null);

  const startEdit = (speaker) => {
    setEditId(speaker._id);
    setEditForm({
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      blog: speaker.blog || "",
      blogVisible: speaker.blogVisible,
      order: speaker.order || "",
    });
    setNewImage(null);
  };

  const saveEdit = async (id) => {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("title", editForm.title);
    formData.append("bio", editForm.bio);
    formData.append("blog", editForm.blog);
    formData.append("blogVisible", editForm.blogVisible);
    if (editForm.order) formData.append("order", editForm.order);
    if (newImage) formData.append("image", newImage);

    try {
      await api.put(`/speakers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditId(null);
      fetchSpeakers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update speaker.");
    }
  };

  return (
    <div className="row gy-4">
      {speakers.map((sp) => (
        <div className="col-12 col-md-6" key={sp._id}>
          <div className="card shadow-sm h-100" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="row g-0 align-items-center">
              {/* Speaker Image */}
              <div className="col-12 col-sm-4 d-flex justify-content-center p-3" style={{ background: "#f8f9fa" }}>
                <img
                  src={sp.imageUrl}
                  alt={sp.name}
                  className="rounded shadow-sm"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Speaker Details */}
              <div className="col-12 col-sm-8">
                <div className="card-body">
                  {editId === sp._id ? (
                    <>
                      <input
                        className="form-control mb-2"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Speaker name"
                      />
                      <input
                        className="form-control mb-2"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Title or position"
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Speaker bio"
                      />
                      <input
                        className="form-control mb-2"
                        value={editForm.blog}
                        onChange={(e) => setEditForm({ ...editForm, blog: e.target.value })}
                        placeholder="Blog link (optional)"
                      />

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editForm.blogVisible}
                          onChange={(e) => setEditForm({ ...editForm, blogVisible: e.target.checked })}
                          id={`blogVisible-${sp._id}`}
                        />
                        <label className="form-check-label" htmlFor={`blogVisible-${sp._id}`}>
                          Show Blog Link
                        </label>
                      </div>

                      <input
                        className="form-control mb-2"
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm({ ...editForm, order: e.target.value })}
                        placeholder="Display order"
                      />

                      <input
                        type="file"
                        className="form-control mb-2"
                        onChange={(e) => setNewImage(e.target.files[0])}
                      />
                      <small className="text-muted d-block mb-2">
                        Leave blank to keep the current image.
                      </small>

                      <div className="d-flex justify-content-between mt-2">
                        <button className="btn btn-success btn-sm" onClick={() => saveEdit(sp._id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title mb-1">{sp.name}</h5>
                        {sp.order && <span className="badge bg-primary">#{sp.order}</span>}
                      </div>
                      <h6 className="text-muted">{sp.title}</h6>
                      <p className="small text-secondary mb-2">{sp.bio}</p>

                      {sp.blog && (
                        <p className="small mb-2">
                          <strong>Blog:</strong>{" "}
                          <a href={sp.blog} target="_blank" rel="noreferrer">
                            {sp.blog}
                          </a>{" "}
                          <span className={sp.blogVisible ? "text-success" : "text-danger"}>
                            {sp.blogVisible ? "Visible" : "Hidden"}
                          </span>
                        </p>
                      )}

                      <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(sp)}>
                          Edit
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(sp._id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {speakers.length === 0 && <div className="text-center text-muted">No speakers found.</div>}
    </div>
  );
};

export default SpeakerList;
