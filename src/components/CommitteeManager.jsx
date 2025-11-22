import React, { useState, useEffect } from "react";
import api from "../services/api";

const emptyCommittee = { sectionTitle: "", sectionDescription: "", cardTitle: "", roles: [] };

const CommitteeManager = () => {
  const [committees, setCommittees] = useState([]);
  const [form, setForm] = useState(emptyCommittee);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await api.get("/committee");
      setCommittees(res.data);
    } catch { notify("Failed to fetch committees", "danger"); }
  };

  const notify = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2500);
  };

  const sanitize = (c) => ({
    ...c,
    roles: c.roles
      .map(r => ({ ...r, bullets: r.bullets.filter(b => b.trim()) }))
      .filter(r => r.memberRole.trim() || r.bullets.length)
  });

  // ✅ Create / Update
  const saveCommittee = async () => {
    if (!form.cardTitle.trim()) return notify("Card title required", "danger");
    const data = sanitize(form);
    try {
      if (editId) {
        const res = await api.put(`/committee/${editId}`, data);
        setCommittees(committees.map(c => c._id === editId ? res.data : c));
        setEditId(null);
        notify("Committee updated");
      } else {
        const res = await api.post("/committee", data);
        setCommittees([...committees, res.data]);
        notify("Committee created");
      }
      setForm(emptyCommittee);
    } catch { notify("Save failed", "danger"); }
  };

  // ✅ Delete
  const handleDelete = async () => {
    try {
      await api.delete(`/committee/${deleteId}`);
      setCommittees(committees.filter(c => c._id !== deleteId));
      setDeleteId(null);
      notify("Deleted");
    } catch { notify("Delete failed", "danger"); }
  };

  // ✅ Add role/member
  const addRole = () => setForm({ ...form, roles: [...form.roles, { memberRole: "", bullets: [] }] });
  const addMember = (rIdx) => {
    const roles = [...form.roles];
    roles[rIdx].bullets.push("");
    setForm({ ...form, roles });
  };

  const updateRole = (rIdx, field, val) => {
    const roles = [...form.roles];
    roles[rIdx][field] = val;
    setForm({ ...form, roles });
  };
  const updateBullet = (rIdx, bIdx, val) => {
    const roles = [...form.roles];
    roles[rIdx].bullets[bIdx] = val;
    setForm({ ...form, roles });
  };

  const startEdit = (c) => { setEditId(c._id); setForm(JSON.parse(JSON.stringify(c))); };

  return (
    <div className="container py-4">
      <h2>Manage Committees</h2>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Form (Create / Edit) */}
      <div className="card p-3 mb-4">
        <h4>{editId ? "Edit Committee" : "New Committee"}</h4>
        {["sectionTitle","sectionDescription","cardTitle"].map((f,i)=>(
          <input key={i} className="form-control mb-2" placeholder={f==="cardTitle"?"Card Title (Required)":`Optional ${f}`} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
        ))}

        {/* Roles */}
        <h6>Roles</h6>
        {form.roles.map((role, rIdx)=>(
          <div key={rIdx} className="border p-2 mb-2">
            <input className="form-control mb-1" placeholder="Role (e.g. Publicity Chairs)" value={role.memberRole} onChange={e=>updateRole(rIdx,"memberRole",e.target.value)}/>
            {role.bullets.map((m,bIdx)=>(
              <input key={bIdx} className="form-control mb-1" placeholder="Member name" value={m} onChange={e=>updateBullet(rIdx,bIdx,e.target.value)}/>
            ))}
            <button className="btn btn-sm btn-outline-primary" onClick={()=>addMember(rIdx)}>+ Add Member</button>
          </div>
        ))}
        <button className="btn btn-secondary mb-2" onClick={addRole}>+ Add Role</button>

        <div>
          <button className="btn btn-primary me-2" onClick={saveCommittee}>{editId?"Save Changes":"Save Committee"}</button>
          {editId && <button className="btn btn-secondary" onClick={()=>{setEditId(null);setForm(emptyCommittee)}}>Cancel</button>}
        </div>
      </div>

      {/* List */}
      <h4>Existing Committees</h4>
      {committees.map(c=>(
        <div key={c._id} className="card p-3 mb-3">
          {c.sectionTitle && <h5>{c.sectionTitle}</h5>}
          {c.sectionDescription && <p>{c.sectionDescription}</p>}
          <strong>{c.cardTitle}</strong>
          {c.roles.map((r,i)=>(
            (r.memberRole.trim()||r.bullets.length>0)&&(
              <div key={i} className="mt-2">
                {r.memberRole && <strong>{r.memberRole}</strong>}
                {r.bullets.length>0 && <ul>{r.bullets.map((b,j)=><li key={j}>{b}</li>)}</ul>}
              </div>
            )
          ))}
          <div className="mt-2">
            <button className="btn btn-warning btn-sm me-2" onClick={()=>startEdit(c)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={()=>setDeleteId(c._id)}>Delete</button>
          </div>
        </div>
      ))}

      {committees.length===0 && <p className="text-muted">No committees yet.</p>}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal fade show" style={{display:"block",background:"rgba(0,0,0,0.4)"}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="text-danger">Confirm Delete</h5></div>
              <div className="modal-body">Delete this committee? <br/><small className="text-danger">This cannot be undone.</small></div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeManager;
