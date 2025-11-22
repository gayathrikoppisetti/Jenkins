import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const initialForm = { _id: null, question: "", answer: "", link: "", linkText: "" };

const FaqEditor = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [faqForm, setFaqForm] = useState(initialForm);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("/api/faqs");
      setFaqs(res.data);
    } catch {
      setAlert({ type: "danger", msg: "Failed to load FAQs" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleChange = (e) => setFaqForm({ ...faqForm, [e.target.name]: e.target.value });

  const saveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return setAlert({ type: "danger", msg: "Question & Answer required" });
    setSaving(true);
    try {
      faqForm._id ? await axios.put(`/api/faqs/${faqForm._id}`, faqForm) : await axios.post("/api/faqs", faqForm);
      setAlert({ type: "success", msg: faqForm._id ? "FAQ updated" : "FAQ added" });
      setFaqForm(initialForm);
      fetchFaqs();
    } catch {
      setAlert({ type: "danger", msg: "Failed to save FAQ" });
    }
    setSaving(false);
  };

  const editFaq = (faq) => { setFaqForm(faq); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const cancelEdit = () => setFaqForm(initialForm);

  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await axios.delete(`/api/faqs/${id}`);
      setAlert({ type: "success", msg: "FAQ deleted" });
      fetchFaqs();
    } catch {
      setAlert({ type: "danger", msg: "Delete failed" });
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Manage FAQs</h2>

      {alert.msg && <Alert variant={alert.type} onClose={() => setAlert({})} dismissible>{alert.msg}</Alert>}

      {/* Add/Edit Form */}
      <Form onSubmit={saveFaq} className="mb-4 p-3 border rounded bg-light">
        <Row>
          <Col md={6}><Form.Label>Question</Form.Label>
            <Form.Control name="question" value={faqForm.question} onChange={handleChange} required />
          </Col>
          <Col md={6}><Form.Label>Answer</Form.Label>
            <Form.Control name="answer" value={faqForm.answer} onChange={handleChange} required />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}><Form.Label>Link</Form.Label>
            <Form.Control name="link" value={faqForm.link} onChange={handleChange} />
          </Col>
          <Col md={6}><Form.Label>Link Text</Form.Label>
            <Form.Control name="linkText" value={faqForm.linkText} onChange={handleChange} />
          </Col>
        </Row>
        <div className="text-end mt-3">
          <Button type="submit" variant="success" disabled={saving}>
            {saving ? "Saving..." : faqForm._id ? "Update FAQ" : "Add FAQ"}
          </Button>{" "}
          {faqForm._id && <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>}
        </div>
      </Form>

      {/* FAQ List */}
      {loading ? (
        <div className="text-center my-4"><Spinner animation="border" /></div>
      ) : faqs.length === 0 ? (
        <p className="text-center text-muted">No FAQs yet</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead><tr><th>Question</th><th>Answer</th><th>Link</th><th>Link Text</th><th>Actions</th></tr></thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f._id}>
                <td>{f.question}</td>
                <td>{f.answer}</td>
                <td>{f.link ? <a href={f.link} target="_blank" rel="noreferrer">{f.link}</a> : "-"}</td>
                <td>{f.linkText || "-"}</td>
                <td>
                  <Button size="sm" variant="outline-secondary" onClick={() => editFaq(f)}>Edit</Button>{" "}
                  <Button size="sm" variant="outline-danger" onClick={() => deleteFaq(f._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default FaqEditor;
