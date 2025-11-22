import { useState } from "react";
import api from "../services/api";

const SpeakerForm = ({ fetchSpeakers }) => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    blog: "",
    blogVisible: true,
    order: "",
    image: null,
    imagePreview: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!form.name || !form.title || !form.bio) {
      alert("Name, Title and Bio are required.");
      return;
    }

    const formData = new FormData();
    if (form.image) formData.append("image", form.image);
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("bio", form.bio);
    formData.append("blog", form.blog);
    formData.append("blogVisible", form.blogVisible);
    if (form.order) formData.append("order", form.order);

    try {
      setUploading(true);
      await api.post("/speakers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchSpeakers();

      setForm({
        name: "",
        title: "",
        bio: "",
        blog: "",
        blogVisible: true,
        order: "",
        image: null,
        imagePreview: null,
      });

      document.querySelector("#speakerImage").value = "";
      alert("Speaker added successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add New Speaker</h5>

        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Speaker Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="form-label">Title or Position</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Speaker Title or Position"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label className="form-label">Bio</label>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Short speaker bio..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <label className="form-label">Blog Link (Optional)</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="https://speaker-blog-link.com"
          value={form.blog}
          onChange={(e) => setForm({ ...form, blog: e.target.value })}
        />

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={form.blogVisible}
            onChange={(e) =>
              setForm({ ...form, blogVisible: e.target.checked })
            }
            id="blogVisibleAdd"
          />
          <label className="form-check-label" htmlFor="blogVisibleAdd">
            Show Blog Link
          </label>
        </div>

        <label className="form-label">Order (Optional)</label>
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Auto if empty"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value })}
        />
        <small className="text-muted d-block mb-2">
          Lower numbers appear first. Leave blank to auto-assign the next order.
        </small>

        <label className="form-label">Speaker Image (Optional)</label>
        <input
          id="speakerImage"
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageChange}
        />

        {form.imagePreview && (
          <div className="mt-2 text-center">
            <img
              src={form.imagePreview}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Speaker"}
        </button>
      </div>
    </div>
  );
};

export default SpeakerForm;
