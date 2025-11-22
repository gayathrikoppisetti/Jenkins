import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Table, Spinner } from "react-bootstrap";
import api from "../services/api";

const NavbarManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isChild, setIsChild] = useState(false);
  const [parentItem, setParentItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "", order: 1, visible: true });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/navbar");
      setItems(res.data.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setFormData({ title: "", url: "", order: 1, visible: true });
    setEditingItem(null);
    setParentItem(null);
    setIsChild(false);
  };

  const openModal = (edit = null, parent = null, childMode = false) => {
    setEditingItem(edit);
    setParentItem(parent);
    setIsChild(childMode);
    setFormData(edit || { title: "", url: "", order: 1, visible: true });
    setShowModal(true);
  };

  const save = async () => {
    const endpoint = isChild
      ? editingItem
        ? `/navbar/${parentItem._id}/children/${editingItem._id}`
        : `/navbar/${parentItem._id}/children`
      : editingItem
      ? `/navbar/${editingItem._id}`
      : "/navbar";

    const method = editingItem ? api.patch : api.post;
    await method(endpoint, formData);
    setShowModal(false);
    fetchItems();
  };

  const remove = async (id, parent = null) => {
    if (!window.confirm("Delete?")) return;
    const url = parent ? `/navbar/${parent._id}/children/${id}` : `/navbar/${id}`;
    await api.delete(url);
    fetchItems();
  };

  const changeOrder = (d) => setFormData((p) => ({ ...p, order: Math.max(1, p.order + d) }));

  if (loading) return <Spinner className="m-4" />;

  return (
    <div className="container my-4">
      <h2>Navbar Manager</h2>
      <Button className="mb-3" onClick={() => openModal()}>Add Navbar Item</Button>

      {items.map((item) => (
        <Card key={item._id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <strong>{item.order}. {item.title}</strong><br />
                <small>{item.url}</small><br />
                <span className={`badge ${item.visible ? "bg-success" : "bg-secondary"}`}>
                  {item.visible ? "Visible" : "Hidden"}
                </span>
              </div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="warning" onClick={() => openModal(item)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => remove(item._id)}>Delete</Button>
                <Button size="sm" variant="info" onClick={() => openModal(null, item, true)}>Add Child</Button>
              </div>
            </div>

            {item.children?.length > 0 && (
              <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                  <tr><th>Order</th><th>Title</th><th>URL</th><th>Visible</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {item.children.sort((a, b) => a.order - b.order).map((child) => (
                    <tr key={child._id}>
                      <td>{child.order}</td>
                      <td>{child.title}</td>
                      <td>{child.url}</td>
                      <td>{child.visible ? "✅" : "❌"}</td>
                      <td>
                        <Button size="sm" variant="outline-warning" onClick={() => openModal(child, item, true)}>Edit</Button>{" "}
                        <Button size="sm" variant="outline-danger" onClick={() => remove(child._id, item)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit" : "Add"} {isChild ? "Child" : "Navbar"} Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Title</Form.Label>
              <Form.Control value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
            <Form.Group><Form.Label>URL</Form.Label>
              <Form.Control value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Order</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Button size="sm" onClick={() => changeOrder(-1)}>–</Button>
                <span>{formData.order}</span>
                <Button size="sm" onClick={() => changeOrder(1)}>+</Button>
              </div>
            </Form.Group>
            <Form.Check type="switch" label="Visible?" className="mt-2" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NavbarManager;
