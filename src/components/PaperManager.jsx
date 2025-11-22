import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";

const API_URL = "/api/paper";

const PaperManager = () => {
  const [sections, setSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const emptyParagraph = { order: 1, text: "", bullets: [], links: [], buttonText: "", buttonLink: "", imageUrl: "", imageFile: null };
  const [formData, setFormData] = useState({ title: "", subtitle: "", order: 1, paragraphs: [emptyParagraph] });

  const fetchSections = async () => setSections((await axios.get(API_URL)).data);
  useEffect(() => { fetchSections(); }, []);

  const openModal = (section = null) => {
    setEditingSection(section);
    setFormData(section ? { ...section, paragraphs: section.paragraphs?.length ? section.paragraphs : [emptyParagraph] } : { title: "", subtitle: "", order: 1, paragraphs: [emptyParagraph] });
    setShowModal(true);
  };

  const saveSection = async () => {
    if (editingSection) await axios.put(`${API_URL}/${editingSection._id}`, formData);
    else await axios.post(API_URL, formData);
    fetchSections();
    setShowModal(false);
  };

  const deleteSection = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchSections();
  };

  const updateParagraph = (idx, field, value) => {
    const paras = [...formData.paragraphs];
    paras[idx][field] = value;
    setFormData({ ...formData, paragraphs: paras });
  };

  const addParagraph = () => setFormData({ ...formData, paragraphs: [...formData.paragraphs, emptyParagraph] });
  const removeParagraph = (idx) => setFormData({ ...formData, paragraphs: formData.paragraphs.filter((_, i) => i !== idx) });

  const addBullet = (p) => updateParagraph(p, "bullets", [...formData.paragraphs[p].bullets, ""]);
  const updateBullet = (p, b, v) => {
    const bullets = [...formData.paragraphs[p].bullets];
    bullets[b] = v;
    updateParagraph(p, "bullets", bullets);
  };
  const removeBullet = (p, b) => updateParagraph(p, "bullets", formData.paragraphs[p].bullets.filter((_, i) => i !== b));

  const addLink = (p) => updateParagraph(p, "links", [...formData.paragraphs[p].links, { label: "", url: "" }]);
  const updateLink = (p, l, f, v) => {
    const links = [...formData.paragraphs[p].links];
    links[l][f] = v;
    updateParagraph(p, "links", links);
  };
  const removeLink = (p, l) => updateParagraph(p, "links", formData.paragraphs[p].links.filter((_, i) => i !== l));

  const handleImageUpload = (pIdx, file) => {
    const reader = new FileReader();
    reader.onload = () => updateParagraph(pIdx, "imageFile", reader.result);
    reader.readAsDataURL(file);
    updateParagraph(pIdx, "imageUrl", URL.createObjectURL(file));
  };

  return (
    <Container className="py-4">
      <h2>Manage Paper Sections</h2>
      <Button className="mb-3" onClick={() => openModal()}>Add Section</Button>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Subtitle</th>
            <th>Paragraphs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s._id}>
              <td>{s.order}</td>
              <td>{s.title}</td>
              <td>{s.subtitle || "—"}</td>
              <td>{s.paragraphs?.length || 0}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(s)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteSection(s._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSection ? "Edit Section" : "Add Section"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {["title", "subtitle"].map((f) => (
            <Form.Group className="mb-3" key={f}>
              <Form.Label>{f[0].toUpperCase() + f.slice(1)}</Form.Label>
              <Form.Control value={formData[f]} onChange={(e) => setFormData({ ...formData, [f]: e.target.value })} />
            </Form.Group>
          ))}
          <Form.Group className="mb-4">
            <Form.Label>Order</Form.Label>
            <Form.Control type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: +e.target.value })} />
          </Form.Group>

          <h5>Paragraphs</h5>
          {formData.paragraphs.map((p, pIdx) => (
            <div key={pIdx} className="border p-3 mb-3 rounded">
              <Row>
                <Col md={8}>
                  <Form.Label>Text</Form.Label>
                  <Form.Control as="textarea" rows={3} value={p.text} onChange={(e) => updateParagraph(pIdx, "text", e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label>Order</Form.Label>
                  <Form.Control type="number" value={p.order} onChange={(e) => updateParagraph(pIdx, "order", +e.target.value)} />
                  <Form.Label className="mt-2">Image</Form.Label>
                  {p.imageUrl && <img src={p.imageUrl} alt="preview" style={{ width: "100%", borderRadius: 6 }} />}
                  <Form.Control type="file" onChange={(e) => handleImageUpload(pIdx, e.target.files[0])} />
                </Col>
              </Row>

              <div className="mt-2">
                <h6>Bullets</h6>
                {p.bullets.map((b, bIdx) => (
                  <InputGroup className="mb-1" key={bIdx}>
                    <Form.Control value={b} onChange={(e) => updateBullet(pIdx, bIdx, e.target.value)} />
                    <Button variant="danger" onClick={() => removeBullet(pIdx, bIdx)}>Remove</Button>
                  </InputGroup>
                ))}
                <Button size="sm" onClick={() => addBullet(pIdx)}>Add Bullet</Button>
              </div>

              <div className="mt-2">
                <h6>Links</h6>
                {p.links.map((link, lIdx) => (
                  <Row className="mb-1" key={lIdx}>
                    <Col><Form.Control placeholder="Label" value={link.label} onChange={(e) => updateLink(pIdx, lIdx, "label", e.target.value)} /></Col>
                    <Col><Form.Control placeholder="URL" value={link.url} onChange={(e) => updateLink(pIdx, lIdx, "url", e.target.value)} /></Col>
                    <Col md="auto"><Button variant="danger" onClick={() => removeLink(pIdx, lIdx)}>X</Button></Col>
                  </Row>
                ))}
                <Button size="sm" onClick={() => addLink(pIdx)}>Add Link</Button>
              </div>

              <Row className="mt-2">
                <Col><Form.Control placeholder="Button Text" value={p.buttonText || ""} onChange={(e) => updateParagraph(pIdx, "buttonText", e.target.value)} /></Col>
                <Col><Form.Control placeholder="Button Link" value={p.buttonLink || ""} onChange={(e) => updateParagraph(pIdx, "buttonLink", e.target.value)} /></Col>
              </Row>

              <div className="text-end mt-2">
                <Button size="sm" variant="outline-danger" onClick={() => removeParagraph(pIdx)}>Remove Paragraph</Button>
              </div>
            </div>
          ))}
          <Button variant="outline-secondary" onClick={addParagraph}>Add Paragraph</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveSection}>{editingSection ? "Save" : "Create"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaperManager;
