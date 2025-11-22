import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Table } from "react-bootstrap";
import api from "../services/api";

// Default data templates
const defaultParagraph = { text: "", bullets: [], links: [], buttons: [], imageUrl: "", imageFile: null };
const defaultLink = { label: "", url: "" };
const defaultButton = { label: "", url: "" };

// ✅ Mini Component: Link Table
const LinkTable = ({ links, onEdit, onDelete }) => (
  <>
    {links?.length > 0 ? (
      <Table size="sm" bordered>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, idx) => (
            <tr key={idx}>
              <td>{link.label}</td>
              <td>{link.url}</td>
              <td>
                <Button size="sm" variant="outline-warning" onClick={() => onEdit(idx)}>✏</Button>{" "}
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(idx)}>🗑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : <p className="text-muted">No links</p>}
  </>
);

// ✅ Mini Component: Button Table
const ButtonTableUI = ({ buttons, onEdit, onDelete }) => (
  <>
    {buttons?.length > 0 ? (
      <Table size="sm" bordered>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buttons.map((btn, idx) => (
            <tr key={idx}>
              <td>{btn.label}</td>
              <td>{btn.url}</td>
              <td>
                <Button size="sm" variant="outline-warning" onClick={() => onEdit(idx)}>✏</Button>{" "}
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(idx)}>🗑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : <p className="text-muted">No buttons</p>}
  </>
);

// Mini Component: Image Preview + Upload
const ImageUpload = ({ para, onUpload }) => (
  <Form.Group className="mt-3">
    <Form.Label>Image</Form.Label>
    <div className="d-flex align-items-center gap-3">
      {para.imageFile || para.imageUrl ? (
        <img
          src={para.imageFile || para.imageUrl}
          alt="preview"
          style={{ height: "60px", borderRadius: "4px" }}
        />
      ) : <span className="text-muted">No Image</span>}
      <Form.Control type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
    </div>
  </Form.Group>
);

// Mini Component: Paragraph Editor
const ParagraphEditor = ({
  para, idx, updateParagraph, deleteParagraph, openLinkModal, deleteLink, openButtonModal, deleteButton, handleImageUpload
}) => (
  <div className="border p-2 mb-3">
    <Form.Group>
      <Form.Label>Paragraph Text</Form.Label>
      <Form.Control as="textarea" rows={2} value={para.text} onChange={(e) => updateParagraph(idx, { text: e.target.value })} />
    </Form.Group>

    {/* Bullets */}
    <Form.Group>
      <Form.Label>Bullets (comma-separated)</Form.Label>
      <Form.Control
        value={para.bullets?.join(", ") || ""}
        onChange={(e) => updateParagraph(idx, {
          bullets: e.target.value.split(",").map((b) => b.trim()).filter(Boolean)
        })}
      />
    </Form.Group>

    {/* Links */}
    <div className="mt-2">
      <h6>Links</h6>
      <LinkTable
        links={para.links}
        onEdit={(lIdx) => openLinkModal(idx, lIdx)}
        onDelete={(lIdx) => deleteLink(idx, lIdx)}
      />
      <Button size="sm" variant="info" onClick={() => openLinkModal(idx)}>+ Add Link</Button>
    </div>

    {/* Buttons */}
    <div className="mt-3">
      <h6>Buttons</h6>
      <ButtonTableUI
        buttons={para.buttons}
        onEdit={(bIdx) => openButtonModal(idx, bIdx)}
        onDelete={(bIdx) => deleteButton(idx, bIdx)}
      />
      <Button size="sm" variant="info" onClick={() => openButtonModal(idx)}>+ Add Button</Button>
    </div>

    {/* Image Upload */}
    <ImageUpload para={para} onUpload={(file) => handleImageUpload(idx, file)} />

    <Button variant="danger" size="sm" className="mt-2" onClick={() => deleteParagraph(idx)}>
      Delete Paragraph
    </Button>
  </div>
);

const AboutSectionManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const [formData, setFormData] = useState({ title: "", subtitle: "", order: 1, paragraphs: [] });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showButtonModal, setShowButtonModal] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(null);
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [editingButtonIndex, setEditingButtonIndex] = useState(null);
  const [linkForm, setLinkForm] = useState(defaultLink);
  const [buttonForm, setButtonForm] = useState(defaultButton);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    setLoading(true);
    const res = await api.get("/about");
    setSections(res.data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingSection(null);
    setFormData({ title: "", subtitle: "", order: sections.length + 1, paragraphs: [] });
    setShowModal(true);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData(section);
    setShowModal(true);
  };

  const saveSection = async () => {
    const payload = {
      ...formData,
      paragraphs: formData.paragraphs.map((p) => p.imageFile ? { ...p, imageFile: p.imageFile } : p)
    };
    editingSection ? await api.patch(`/about/${editingSection._id}`, payload) : await api.post("/about", payload);
    setShowModal(false);
    fetchSections();
  };

  const deleteSection = async (id) => {
    if (window.confirm("Delete this about section?")) {
      await api.delete(`/about/${id}`);
      fetchSections();
    }
  };

  // Paragraph Logic
  const addParagraph = () => setFormData((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, { ...defaultParagraph }] }));
  const updateParagraph = (index, updatedData) => {
    const updated = [...formData.paragraphs];
    updated[index] = { ...updated[index], ...updatedData };
    setFormData((prev) => ({ ...prev, paragraphs: updated }));
  };
  const deleteParagraph = (index) => setFormData((prev) => ({
    ...prev,
    paragraphs: prev.paragraphs.filter((_, i) => i !== index)
  }));
  const handleImageUpload = (idx, file) => {
    const reader = new FileReader();
    reader.onloadend = () => updateParagraph(idx, { imageFile: reader.result });
    reader.readAsDataURL(file);
  };

  // Link/Button Modal Logic (same)
  const openLinkModal = (pIdx, linkIdx = null) => {
    setCurrentParagraphIndex(pIdx);
    setEditingLinkIndex(linkIdx);
    setLinkForm(linkIdx !== null ? { ...formData.paragraphs[pIdx].links[linkIdx] } : defaultLink);
    setShowLinkModal(true);
  };
  const saveLink = () => {
    const updated = [...formData.paragraphs[currentParagraphIndex].links];
    editingLinkIndex !== null ? (updated[editingLinkIndex] = linkForm) : updated.push(linkForm);
    updateParagraph(currentParagraphIndex, { links: updated });
    setShowLinkModal(false);
  };
  const deleteLink = (pIdx, lIdx) => updateParagraph(pIdx, {
    links: formData.paragraphs[pIdx].links.filter((_, i) => i !== lIdx)
  });

  const openButtonModal = (pIdx, btnIdx = null) => {
    setCurrentParagraphIndex(pIdx);
    setEditingButtonIndex(btnIdx);
    setButtonForm(btnIdx !== null ? { ...formData.paragraphs[pIdx].buttons[btnIdx] } : defaultButton);
    setShowButtonModal(true);
  };
  const saveButton = () => {
    const updated = [...formData.paragraphs[currentParagraphIndex].buttons];
    editingButtonIndex !== null ? (updated[editingButtonIndex] = buttonForm) : updated.push(buttonForm);
    updateParagraph(currentParagraphIndex, { buttons: updated });
    setShowButtonModal(false);
  };
  const deleteButton = (pIdx, bIdx) => updateParagraph(pIdx, {
    buttons: formData.paragraphs[pIdx].buttons.filter((_, i) => i !== bIdx)
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2>About Section Manager</h2>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>+ Add About Section</Button>

      {/* Existing Sections */}
      {sections.map((sec) => (
        <Card key={sec._id} className="mb-3">
          <Card.Body className="d-flex justify-content-between">
            <div>
              <strong>{sec.order}. {sec.title}</strong>
              <br /><small>{sec.subtitle}</small>
              <p>{sec.paragraphs.length} Paragraph(s)</p>
            </div>
            <div>
              <Button variant="warning" size="sm" onClick={() => handleEdit(sec)}>Edit</Button>{" "}
              <Button variant="danger" size="sm" onClick={() => deleteSection(sec._id)}>Delete</Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSection ? "Edit About Section" : "Add About Section"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Title</Form.Label><Form.Control value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>Subtitle</Form.Label><Form.Control value={formData.subtitle || ""} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></Form.Group>

            {/* Order Selector */}
            <Form.Group className="mt-2">
              <Form.Label>Order</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Button variant="outline-secondary" size="sm" onClick={() => setFormData((p) => ({ ...p, order: Math.max(1, p.order - 1) }))}>➖</Button>
                <span>{formData.order}</span>
                <Button variant="outline-secondary" size="sm" onClick={() => setFormData((p) => ({ ...p, order: p.order + 1 }))}>➕</Button>
              </div>
            </Form.Group>

            <hr />
            <h5>Paragraphs</h5>
            {formData.paragraphs.map((para, idx) => (
              <ParagraphEditor
                key={idx}
                para={para}
                idx={idx}
                updateParagraph={updateParagraph}
                deleteParagraph={deleteParagraph}
                openLinkModal={openLinkModal}
                deleteLink={deleteLink}
                openButtonModal={openButtonModal}
                deleteButton={deleteButton}
                handleImageUpload={handleImageUpload}
              />
            ))}

            <Button variant="info" size="sm" onClick={addParagraph}>+ Add Paragraph</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveSection}>Save Section</Button>
        </Modal.Footer>
      </Modal>

      {/* Link Modal */}
      <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingLinkIndex !== null ? "Edit Link" : "Add Link"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Label</Form.Label><Form.Control value={linkForm.label} onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>URL</Form.Label><Form.Control value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveLink}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Button Modal */}
      <Modal show={showButtonModal} onHide={() => setShowButtonModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingButtonIndex !== null ? "Edit Button" : "Add Button"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Label</Form.Label><Form.Control value={buttonForm.label} onChange={(e) => setButtonForm({ ...buttonForm, label: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>URL</Form.Label><Form.Control value={buttonForm.url} onChange={(e) => setButtonForm({ ...buttonForm, url: e.target.value })} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowButtonModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveButton}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AboutSectionManager;
