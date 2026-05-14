import { useState, useEffect } from 'react';
import {
  getAdmissions, createAdmission, updateAdmission, deleteAdmission,
  getPatients, getRooms,
} from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const STATUSES = ['ACTIVE','DISCHARGED','TRANSFERRED'];
const statusBadge = {
  ACTIVE:      'badge-green',
  DISCHARGED:  'badge-gray',
  TRANSFERRED: 'badge-yellow',
};

const EMPTY = {
  patientId: '', roomId: '', admissionDate: '',
  dischargeDate: '', reason: '', status: 'ACTIVE',
};

export default function AdmissionsPage() {
  const [items, setItems]       = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms]       = useState([]);
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
    Promise.all([getAdmissions(), getPatients(), getRooms()])
      .then(([a, p, r]) => { setItems(a.data); setPatients(p.data); setRooms(r.data); setError(null); })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      patientId:     item.patient?.id ?? '',
      roomId:        item.room?.id ?? '',
      admissionDate: item.admissionDate ?? '',
      dischargeDate: item.dischargeDate ?? '',
      reason:        item.reason ?? '',
      status:        item.status ?? 'ACTIVE',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const { patientId, roomId, ...rest } = form;
    const payload = {
      ...rest,
      patient: patientId ? { id: Number(patientId) } : null,
      room:    roomId    ? { id: Number(roomId)    } : null,
    };
    const req = editItem ? updateAdmission(editItem.id, payload) : createAdmission(payload);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteAdmission(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = items.filter(item => {
    const pat = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : '';
    const room = item.room?.roomNumber ?? '';
    return `${pat} ${room} ${item.reason ?? ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Admissions</h1>
          <p className="page-subtitle">{items.length} admissions total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Admission</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Admissions</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search patient, room, reason…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Patient</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Admitted</th>
                  <th>Discharged</th>
                  <th>Reason</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}><div className="table-empty"><div className="table-empty-icon">🏨</div>No admissions found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">
                      {d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : <span className="text-muted">—</span>}
                    </td>
                    <td className="font-mono">{d.room?.roomNumber || <span className="text-muted">—</span>}</td>
                    <td><span className={`badge ${statusBadge[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                    <td>{d.admissionDate || '—'}</td>
                    <td>{d.dischargeDate || <span className="text-muted">—</span>}</td>
                    <td className="truncate" style={{ maxWidth: 180 }}>{d.reason || <span className="text-muted">—</span>}</td>
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
        <Modal title={editItem ? 'Edit Admission' : 'Add Admission'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient</label>
              <select value={form.patientId} onChange={set('patientId')}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Room</label>
              <select value={form.roomId} onChange={set('roomId')}>
                <option value="">Select room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} ({r.type})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Admission Date</label>
              <input type="date" value={form.admissionDate} onChange={set('admissionDate')} />
            </div>
            <div className="form-group">
              <label>Discharge Date</label>
              <input type="date" value={form.dischargeDate} onChange={set('dischargeDate')} />
            </div>
            <div className="form-group full">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Reason</label>
              <textarea value={form.reason} onChange={set('reason')} placeholder="Reason for admission…" />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete admission #${deleteTarget.id}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
