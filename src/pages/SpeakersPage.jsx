import { useState, useEffect } from "react";
import api from "../services/api";
import SpeakerForm from "../components/SpeakerFormManager";
import SpeakerList from "../components/SpeakerListManager";

const SpeakerManager = () => {
  const [speakers, setSpeakers] = useState([]);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get("/speakers");
      // Sort speakers based on the 'order' value before setting state
      setSpeakers(res.data.sort((a, b) => a.order - b.order));
    } catch {
      alert("Unable to fetch speakers. Please try again.");
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this speaker?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/speakers/${id}`);
      fetchSpeakers(); // Refresh the list after deletion
    } catch {
      alert("Failed to delete speaker. Please try again.");
    }
  };

  const toggleBlogVisibility = async (id) => {
    try {
      await api.patch(`/speakers/${id}/toggle-blog`);
      fetchSpeakers(); // Refresh the list after toggle
    } catch {
      alert("Failed to update blog visibility.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold text-center">Speaker Management</h2>

      <SpeakerForm fetchSpeakers={fetchSpeakers} />

      <SpeakerList
        speakers={speakers}
        fetchSpeakers={fetchSpeakers}
        onDelete={handleDelete}
        onToggleBlog={toggleBlogVisibility}
      />
    </div>
  );
};

export default SpeakerManager;
