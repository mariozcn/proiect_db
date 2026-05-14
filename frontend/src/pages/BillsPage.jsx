import { useState, useEffect } from 'react';
import {
  getBills, createBill, updateBill, deleteBill,
  getPatients, getAdmissions,
} from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const STATUSES = ['PENDING','PARTIAL','PAID','OVERDUE'];
const statusBadge = {
  PENDING:  'badge-yellow',
  PARTIAL:  'badge-blue',
  PAID:     'badge-green',
  OVERDUE:  'badge-red',
};

const EMPTY = {
  patientId: '', admissionId: '',
  totalAmount: '', paidAmount: '',
  status: 'PENDING', issueDate: '', dueDate: '',
};

export default function BillsPage() {
  const [items, setItems]         = useState([]);
  const [patients, setPatients]   = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getBills(), getPatients(), getAdmissions()])
      .then(([b, p, a]) => {
        setItems(b.data); setPatients(p.data); setAdmissions(a.data); setError(null);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      patientId:   item.patient?.id ?? '',
      admissionId: item.admission?.id ?? '',
      totalAmount: item.totalAmount ?? '',
      paidAmount:  item.paidAmount ?? '',
      status:      item.status ?? 'PENDING',
      issueDate:   item.issueDate ?? '',
      dueDate:     item.dueDate ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const { patientId, admissionId, ...rest } = form;
    const payload = {
      ...rest,
      patient:   patientId   ? { id: Number(patientId)   } : null,
      admission: admissionId ? { id: Number(admissionId) } : null,
    };
    const req = editItem ? updateBill(editItem.id, payload) : createBill(payload);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteBill(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const admissionLabel = (a) => {
    const pat = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Unknown';
    return `#${a.id} — ${pat} (${a.admissionDate ?? '?'})`;
  };

  const filtered = items.filter(item => {
    const pat = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : '';
    return `${pat} ${item.status ?? ''}`.toLowerCase().includes(search.toLowerCase());
  });

  const totalRevenue = items.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);
  const pendingCount = items.filter(b => b.status === 'PENDING' || b.status === 'OVERDUE').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Bills</h1>
          <p className="page-subtitle">{items.length} bills · {pendingCount} pending/overdue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Bill</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>💰</div>
          <div className="stat-info">
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Collected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
          <div className="stat-info">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending / Overdue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>📄</div>
          <div className="stat-info">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">Total Bills</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Bills</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search patient, status…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Status</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9}><div className="table-empty"><div className="table-empty-icon">💳</div>No bills found.</div></td></tr>
                ) : filtered.map(d => {
                  const balance = (Number(d.totalAmount) || 0) - (Number(d.paidAmount) || 0);
                  return (
                    <tr key={d.id}>
                      <td className="text-muted font-mono">{d.id}</td>
                      <td className="text-strong">
                        {d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : <span className="text-muted">—</span>}
                      </td>
                      <td><span className={`badge ${statusBadge[d.status] ?? 'badge-gray'}`}>{d.status}</span></td>
                      <td className="font-mono">${Number(d.totalAmount || 0).toFixed(2)}</td>
                      <td className="font-mono">${Number(d.paidAmount || 0).toFixed(2)}</td>
                      <td className="font-mono" style={{ color: balance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                        ${balance.toFixed(2)}
                      </td>
                      <td>{d.issueDate || '—'}</td>
                      <td>{d.dueDate || '—'}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(d)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title={editItem ? 'Edit Bill' : 'Add Bill'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient</label>
              <select value={form.patientId} onChange={set('patientId')}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Admission</label>
              <select value={form.admissionId} onChange={set('admissionId')}>
                <option value="">Select admission (optional)</option>
                {admissions.map(a => <option key={a.id} value={a.id}>{admissionLabel(a)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Total Amount ($)</label>
              <input type="number" step="0.01" min="0" value={form.totalAmount} onChange={set('totalAmount')} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Paid Amount ($)</label>
              <input type="number" step="0.01" min="0" value={form.paidAmount} onChange={set('paidAmount')} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" value={form.issueDate} onChange={set('issueDate')} />
            </div>
            <div className="form-group full">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete bill #${deleteTarget.id}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
