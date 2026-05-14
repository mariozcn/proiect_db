import { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const BLOOD_TYPES = ['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'];
const GENDERS = ['M','F'];

const EMPTY = {
  firstName: '', lastName: '', dateOfBirth: '', phone: '',
  email: '', address: '', bloodType: '', gender: '',
};

const fmtBlood = (v) => v?.replace('_POS', '+').replace('_NEG', '-') ?? '—';

export default function PatientsPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getPatients()
      .then(r => { setItems(r.data); setError(null); })
      .catch(() => setError('Failed to load patients.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      firstName: item.firstName ?? '',
      lastName:  item.lastName ?? '',
      dateOfBirth: item.dateOfBirth ?? '',
      phone:     item.phone ?? '',
      email:     item.email ?? '',
      address:   item.address ?? '',
      bloodType: item.bloodType ?? '',
      gender:    item.gender ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const req = editItem ? updatePatient(editItem.id, form) : createPatient(form);
    req
      .then(() => { closeModal(); load(); })
      .catch(() => alert('Save failed.'))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deletePatient(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = items.filter(d =>
    `${d.firstName} ${d.lastName} ${d.email} ${d.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Patients</h1>
          <p className="page-subtitle">{items.length} patients registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Patient</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Patients</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Blood Type</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}><div className="table-empty"><div className="table-empty-icon">👤</div>No patients found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">{d.firstName} {d.lastName}</td>
                    <td>{d.dateOfBirth || '—'}</td>
                    <td>{d.gender === 'M' ? '♂ Male' : d.gender === 'F' ? '♀ Female' : '—'}</td>
                    <td>
                      {d.bloodType
                        ? <span className="badge badge-red">{fmtBlood(d.bloodType)}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td className="font-mono">{d.phone || '—'}</td>
                    <td>{d.email || '—'}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(d)}>🗑️</button>
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
        <Modal title={editItem ? 'Edit Patient' : 'Add Patient'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="John" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={set('gender')}>
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g === 'M' ? 'Male' : 'Female'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select value={form.bloodType} onChange={set('bloodType')}>
                <option value="">Select blood type</option>
                {BLOOD_TYPES.map(b => <option key={b} value={b}>{fmtBlood(b)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={set('phone')} placeholder="+40 721 000 000" />
            </div>
            <div className="form-group full">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="patient@email.com" />
            </div>
            <div className="form-group full">
              <label>Address</label>
              <textarea value={form.address} onChange={set('address')} placeholder="Street, City, Country" />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete patient "${deleteTarget.firstName} ${deleteTarget.lastName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
