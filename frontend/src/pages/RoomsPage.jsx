import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom, getDepartments } from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const ROOM_TYPES   = ['GENERAL','ICU','PRIVATE','OPERATING'];
const ROOM_STATUSES = ['AVAILABLE','OCCUPIED','MAINTENANCE'];

const statusBadge = {
  AVAILABLE:   'badge-green',
  OCCUPIED:    'badge-blue',
  MAINTENANCE: 'badge-yellow',
};
const typeBadge = {
  GENERAL:   'badge-gray',
  ICU:       'badge-red',
  PRIVATE:   'badge-purple',
  OPERATING: 'badge-cyan',
};

const EMPTY = { roomNumber: '', type: 'GENERAL', capacity: '', roomStatus: 'AVAILABLE', dailyRate: '', departmentId: '' };

export default function RoomsPage() {
  const [items, setItems]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getRooms(), getDepartments()])
      .then(([r, d]) => { setItems(r.data); setDepartments(d.data); setError(null); })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      roomNumber:   item.roomNumber ?? '',
      type:         item.type ?? 'GENERAL',
      capacity:     item.capacity ?? '',
      roomStatus:   item.roomStatus ?? 'AVAILABLE',
      dailyRate:    item.dailyRate ?? '',
      departmentId: item.department?.id ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const { departmentId, ...rest } = form;
    const payload = { ...rest, department: departmentId ? { id: Number(departmentId) } : null };
    const req = editItem ? updateRoom(editItem.id, payload) : createRoom(payload);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteRoom(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = items.filter(d =>
    `${d.roomNumber} ${d.type} ${d.roomStatus} ${d.department?.name ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Rooms</h1>
          <p className="page-subtitle">{items.length} rooms total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Room</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Rooms</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search room, type, status…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Room No.</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Daily Rate</th>
                  <th>Department</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}><div className="table-empty"><div className="table-empty-icon">🛏</div>No rooms found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong font-mono">{d.roomNumber}</td>
                    <td><span className={`badge ${typeBadge[d.type] ?? 'badge-gray'}`}>{d.type}</span></td>
                    <td><span className={`badge ${statusBadge[d.roomStatus] ?? 'badge-gray'}`}>{d.roomStatus}</span></td>
                    <td>{d.capacity ?? '—'}</td>
                    <td className="font-mono">{d.dailyRate != null ? `$${Number(d.dailyRate).toFixed(2)}` : '—'}</td>
                    <td>{d.department?.name || <span className="text-muted">—</span>}</td>
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
        <Modal title={editItem ? 'Edit Room' : 'Add Room'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group">
              <label>Room Number</label>
              <input value={form.roomNumber} onChange={set('roomNumber')} placeholder="e.g. 101A" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={set('type')}>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.roomStatus} onChange={set('roomStatus')}>
                {ROOM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" min="1" value={form.capacity} onChange={set('capacity')} placeholder="e.g. 2" />
            </div>
            <div className="form-group">
              <label>Daily Rate ($)</label>
              <input type="number" step="0.01" min="0" value={form.dailyRate} onChange={set('dailyRate')} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.departmentId} onChange={set('departmentId')}>
                <option value="">No department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete room "${deleteTarget.roomNumber}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
