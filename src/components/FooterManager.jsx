import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Modal } from "react-bootstrap";
import axios from "axios";

const defaultFooter = {
  logo: { textPrimary: "", textSecondary: "", url: "" },
  description: "",
  socialLinks: { facebook: "", twitter: "", linkedin: "", instagram: "" },
  contactEmail: "",
  copyright: ""
};

export default function FooterManager() {
  const [footer, setFooter] = useState(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const fetchFooter = async () => {
    try {
      const res = await axios.get("/api/footer");
      setFooter(res.data || defaultFooter);
    } catch (err) {
      console.error("Load footer error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFooter(); }, []);

  const handleChange = (path, value) => {
    setFooter(prev => {
      const copy = { ...prev };
      const keys = path.split(".");
      let obj = copy;
      while (keys.length > 1) obj = obj[keys.shift()];
      obj[keys[0]] = value;
      return copy;
    });
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      const { description, contactEmail, copyright, logo, socialLinks } = footer;
      Object.entries({ description, contactEmail, copyright, ...logo, ...socialLinks })
        .forEach(([k, v]) => data.append(k, v));
      if (logoFile) data.append("logoImage", logoFile);

      const res = await axios.put("/api/footer", data, { headers: { "Content-Type": "multipart/form-data" } });
      setFooter(res.data.data);
      setShowModal(true);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save footer!");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Container className="py-4">
        <h3>Edit Footer</h3>
        <Card className="p-4 shadow-sm">

          {/* Logo */}
          <Form.Group>
            <Form.Label>Primary Text</Form.Label>
            <Form.Control value={footer.logo.textPrimary} onChange={e => handleChange("logo.textPrimary", e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Secondary Text</Form.Label>
            <Form.Control value={footer.logo.textSecondary} onChange={e => handleChange("logo.textSecondary", e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Upload Logo</Form.Label>
            <Form.Control type="file" onChange={e => setLogoFile(e.target.files[0])} />
            {footer.logo.url && <img src={footer.logo.url} alt="logo" style={{ maxHeight: 80, marginTop: 10 }} />}
          </Form.Group>

          {/* Description & Email */}
          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={footer.description} onChange={e => handleChange("description", e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control type="email" value={footer.contactEmail} onChange={e => handleChange("contactEmail", e.target.value)} />
          </Form.Group>

          {/* Social Links */}
          <h6 className="mt-4">Social Links</h6>
          {Object.keys(footer.socialLinks).map(p => (
            <Form.Group className="mt-2" key={p}>
              <Form.Label>{p.toUpperCase()}</Form.Label>
              <Form.Control value={footer.socialLinks[p]} onChange={e => handleChange(`socialLinks.${p}`, e.target.value)} />
            </Form.Group>
          ))}

          {/* Copyright */}
          <Form.Group className="mt-4">
            <Form.Label>Copyright</Form.Label>
            <Form.Control value={footer.copyright} onChange={e => handleChange("copyright", e.target.value)} />
          </Form.Group>

          {/* Save */}
          <div className="text-end mt-4">
            <Button onClick={saveFooter} disabled={saving}>{saving ? "Saving..." : "Save Footer"}</Button>
          </div>
        </Card>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Saved</Modal.Title></Modal.Header>
        <Modal.Body>Footer updated successfully.</Modal.Body>
        <Modal.Footer><Button onClick={() => setShowModal(false)}>OK</Button></Modal.Footer>
      </Modal>
    </>
  );
}
