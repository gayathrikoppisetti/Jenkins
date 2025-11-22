import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Modal } from "react-bootstrap";
import axios from "axios";

const RegisterManager = () => {
  const defaultData = {
    fees: [],
    guidelines: [],
    importantNote: "",
    payment: {
      indianAuthorsLink: "",
      foreignAuthors: {
        accountName: "",
        bank: "",
        address: "",
        accountNo: "",
        ifsc: "",
        micr: "",
        adCode: "",
        branch: "",
        swiftCode: "",
      },
    },
    steps: [],
    googleFormLink: "",
    googleFormNote: "",
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(defaultData);

  const mergeData = (apiData) => ({
    ...defaultData,
    ...apiData,
    payment: {
      ...defaultData.payment,
      ...(apiData?.payment || {}),
      foreignAuthors: {
        ...defaultData.payment.foreignAuthors,
        ...(apiData?.payment?.foreignAuthors || {}),
      },
    },
  });

  useEffect(() => {
    axios
      .get("/api/registration")
      .then((res) => {
        setData(mergeData(res.data || {}));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (path, value) => {
    setData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let temp = updated;
      while (keys.length > 1) temp = temp[keys.shift()];
      temp[keys[0]] = value;
      return updated;
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await axios.put("/api/registration", data);
      setData(mergeData(res.data.data));
      setShowModal(true);
    } catch {
      alert("Failed to update registration data!");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Container className="py-4">
        <h2 className="mb-4">Admin: Edit Registration Data</h2>
        <Card className="p-4 shadow-sm">
          <Form.Group className="mb-3">
            <Form.Label>Important Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={data.importantNote || ""}
              onChange={(e) => handleChange("importantNote", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Google Form Link</Form.Label>
            <Form.Control
              value={data.googleFormLink || ""}
              onChange={(e) => handleChange("googleFormLink", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Google Form Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={data.googleFormNote || ""}
              onChange={(e) => handleChange("googleFormNote", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Guidelines (one per line)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={data.guidelines?.join("\n") || ""}
              onChange={(e) => handleChange("guidelines", e.target.value.split("\n"))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Steps to Register (one per line)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={data.steps?.join("\n") || ""}
              onChange={(e) => handleChange("steps", e.target.value.split("\n"))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Indian Authors Payment Link</Form.Label>
            <Form.Control
              value={data.payment?.indianAuthorsLink || ""}
              onChange={(e) => handleChange("payment.indianAuthorsLink", e.target.value)}
            />
          </Form.Group>

          <h5 className="mt-4">Foreign Authors Payment Info</h5>
          {Object.keys(data.payment.foreignAuthors).map((field) => (
            <Form.Group key={field} className="mb-2">
              <Form.Label>{field}</Form.Label>
              <Form.Control
                value={data.payment.foreignAuthors[field] || ""}
                onChange={(e) =>
                  handleChange(`payment.foreignAuthors.${field}`, e.target.value)
                }
              />
            </Form.Group>
          ))}

          <h5 className="mt-4">Registration Fees</h5>
          {data.fees?.map((feeItem, idx) => (
            <Row key={idx} className="mb-2">
              <Col md={6}>
                <Form.Control
                  placeholder="Category"
                  value={feeItem.category || ""}
                  onChange={(e) => {
                    const updated = [...data.fees];
                    updated[idx].category = e.target.value;
                    setData({ ...data, fees: updated });
                  }}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  placeholder="Fee"
                  value={feeItem.fee || ""}
                  onChange={(e) => {
                    const updated = [...data.fees];
                    updated[idx].fee = e.target.value;
                    setData({ ...data, fees: updated });
                  }}
                />
              </Col>
            </Row>
          ))}

          <Button
            variant="outline-secondary"
            size="sm"
            className="mb-3"
            onClick={() =>
              setData({
                ...data,
                fees: [...data.fees, { category: "", fee: "" }],
              })
            }
          >
            Add Fee Row
          </Button>

          <div className="mt-4 text-end">
            <Button variant="primary" onClick={saveChanges} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>Registration data updated successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RegisterManager;
