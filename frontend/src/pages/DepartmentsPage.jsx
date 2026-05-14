import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const EMPTY = { name: '', description: '', location: '', phone: '' };

export default function DepartmentsPage() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getDepartments()
      .then(r => { setItems(r.data); setError(null); })
      .catch(() => setError('Failed to load departments.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ name: item.name, description: item.description ?? '', location: item.location ?? '', phone: item.phone ?? '' }); setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const req = editItem
      ? updateDepartment(editItem.id, form)
      : createDepartment(form);
    req
      .then(() => { closeModal(); load(); })
      .catch(() => alert('Save failed. Check your input and try again.'))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteDepartment(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = items.filter(d =>
    `${d.name} ${d.location} ${d.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Departments</h1>
          <p className="page-subtitle">{items.length} departments total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Department</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Departments</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="table-empty"><div className="table-empty-icon">🏢</div>No departments found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">{d.name}</td>
                    <td className="truncate" style={{ maxWidth: 200 }}>{d.description || <span className="text-muted">—</span>}</td>
                    <td>{d.location || <span className="text-muted">—</span>}</td>
                    <td className="font-mono">{d.phone || <span className="text-muted">—</span>}</td>
                    <td className="text-muted">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)} title="Edit">✏️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(d)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title={editItem ? 'Edit Department' : 'Add Department'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Cardiology" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={set('location')} placeholder="e.g. Floor 2, Wing A" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={set('phone')} placeholder="e.g. +40 721 000 000" />
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} placeholder="Optional description…" />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete department "${deleteTarget.name}"? This may affect linked doctors and rooms.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
