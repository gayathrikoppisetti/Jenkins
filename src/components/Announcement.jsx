import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Add, Edit, Save, Close } from "@mui/icons-material";
import api from "../services/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const [notify, setNotify] = useState({ open: false, text: "", type: "success" });

  const show = (text, type = "success") => setNotify({ open: true, text, type });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch {
      show("Failed to fetch", "error");
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const addAnnouncement = async () => {
    if (!newMessage.trim()) return show("Message cannot be empty", "error");
    try {
      const res = await api.post("/announcements", { message: newMessage });
      setAnnouncements([res.data, ...announcements]);
      setNewMessage("");
      show("Added");
    } catch {
      show("Add failed", "error");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
      show("Deleted");
    } catch {
      show("Delete failed", "error");
    }
  };

  const saveEdit = async () => {
    if (!editMessage.trim()) return show("Message cannot be empty", "error");
    try {
      const res = await api.patch(`/announcements/${editId}`, { message: editMessage });
      setAnnouncements(announcements.map((a) => (a._id === editId ? res.data : a)));
      setEditId(null);
      setEditMessage("");
      show("Updated");
    } catch {
      show("Update failed", "error");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Manage Announcements</Typography>

      {/* Add New */}
      <Stack direction="row" spacing={1} mb={2}>
        <TextField fullWidth label="New Announcement" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <Button variant="contained" startIcon={<Add />} onClick={addAnnouncement}>Add</Button>
      </Stack>

      {loading ? <CircularProgress /> : (
        <Stack spacing={2}>
          {announcements.length ? announcements.map((a) => (
            <Paper key={a._id} sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
              {editId === a._id ? (
                <>
                  <TextField fullWidth size="small" value={editMessage} onChange={e => setEditMessage(e.target.value)} />
                  <Stack direction="row">
                    <IconButton color="success" onClick={saveEdit}><Save /></IconButton>
                    <IconButton color="warning" onClick={() => setEditId(null)}><Close /></IconButton>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography>{a.message}</Typography>
                  <Stack direction="row">
                    <IconButton onClick={() => { setEditId(a._id); setEditMessage(a.message); }}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => deleteAnnouncement(a._id)}><Delete /></IconButton>
                  </Stack>
                </>
              )}
            </Paper>
          )) : <Typography>No announcements yet.</Typography>}
        </Stack>
      )}

      <Snackbar open={notify.open} autoHideDuration={3000} onClose={() => setNotify({ ...notify, open: false })}>
        <Alert severity={notify.type}>{notify.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
