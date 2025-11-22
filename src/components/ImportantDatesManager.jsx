import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const ImportantDates = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", date: "", dateRange: [] });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch dates
  const fetchDates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/important-dates");
      setDates(data);
    } catch (err) {
      console.error("Failed to fetch dates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", date: "", dateRange: [] });
    setEditingId(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRangeChange = (index, value) => {
    const range = [...(formData.dateRange || [])];
    range[index] = value;
    setFormData({ ...formData, dateRange: range });
  };

  const saveDate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/important-dates/${editingId}`, formData);
      } else {
        await axios.post("/api/important-dates", formData);
      }
      resetForm();
      fetchDates();
    } catch (err) {
      console.error("Save failed", err);
      alert("❌ Failed to save date");
    }
  };

  const editDate = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      date: item.date || "",
      dateRange: item.dateRange || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this date?")) return;
    try {
      await axios.delete(`/api/important-dates/${id}`);
      fetchDates();
    } catch {
      alert("❌ Failed to delete date");
    }
  };

  if (loading) return <p>Loading dates...</p>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Manage Important Dates</h2>

      {/* Form Section */}
      <Card className="p-4 shadow-sm mb-4">
        <h5>{editingId ? "Edit Date" : "Add New Date"}</h5>

        <Form onSubmit={saveDate}>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Paper Submission Deadline"
              required
            />
          </Form.Group>

          {/* Single Date */}
          <Form.Group className="mb-3">
            <Form.Label>Single Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. June 17, 2025"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
            <small className="text-muted">Leave empty if using a date range</small>
          </Form.Group>

          {/* Date Range */}
          <Form.Group className="mb-3">
            <Form.Label>Date Range</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Start Date (e.g. Aug 8, 2025)"
                  value={formData.dateRange?.[0] || ""}
                  onChange={(e) => handleRangeChange(0, e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="End Date (e.g. Aug 9, 2025)"
                  value={formData.dateRange?.[1] || ""}
                  onChange={(e) => handleRangeChange(1, e.target.value)}
                />
              </Col>
            </Row>
            <small className="text-muted">
              If both fields are filled, it overrides the single date.
            </small>
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">
              {editingId ? "Update Date" : "Add Date"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      {/* Existing Dates */}
      <h4>Existing Dates</h4>
      {dates.length === 0 ? (
        <p className="text-muted">No dates added yet.</p>
      ) : (
        dates.map((item) => (
          <Card key={item._id} className="mb-3 p-3 shadow-sm">
            <Row>
              <Col>
                <h5>{item.title}</h5>
                <p className="mb-0">
                  {item.dateRange?.length
                    ? `${item.dateRange[0]} - ${item.dateRange[1]}`
                    : item.date}
                </p>
              </Col>
              <Col xs="auto" className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => editDate(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteDate(item._id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ImportantDates;
