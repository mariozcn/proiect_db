import { useState, useEffect } from 'react';
import {
  getMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord,
  getPatients, getDoctors,
} from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const EMPTY = {
  patientId: '', doctorId: '', recordDate: '',
  diagnosis: '', treatment: '', notes: '',
};

export default function MedicalRecordsPage() {
  const [items, setItems]       = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
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
    Promise.all([getMedicalRecords(), getPatients(), getDoctors()])
      .then(([r, p, d]) => { setItems(r.data); setPatients(p.data); setDoctors(d.data); setError(null); })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      patientId:  item.patient?.id ?? '',
      doctorId:   item.doctor?.id ?? '',
      recordDate: item.recordDate ?? '',
      diagnosis:  item.diagnosis ?? '',
      treatment:  item.treatment ?? '',
      notes:      item.notes ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const { patientId, doctorId, ...rest } = form;
    const payload = {
      ...rest,
      patient: patientId ? { id: Number(patientId) } : null,
      doctor:  doctorId  ? { id: Number(doctorId)  } : null,
    };
    const req = editItem ? updateMedicalRecord(editItem.id, payload) : createMedicalRecord(payload);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteMedicalRecord(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = items.filter(item => {
    const pat = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : '';
    const doc = item.doctor  ? `${item.doctor.firstName} ${item.doctor.lastName}` : '';
    return `${pat} ${doc} ${item.diagnosis ?? ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Medical Records</h1>
          <p className="page-subtitle">{items.length} records total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Medical Records</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search patient, doctor, diagnosis…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="table-empty"><div className="table-empty-icon">📋</div>No records found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">
                      {d.patient ? `${d.patient.firstName} ${d.patient.lastName}` : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      {d.doctor ? `Dr. ${d.doctor.firstName} ${d.doctor.lastName}` : <span className="text-muted">—</span>}
                    </td>
                    <td>{d.recordDate || '—'}</td>
                    <td className="truncate" style={{ maxWidth: 200 }}>{d.diagnosis || <span className="text-muted">—</span>}</td>
                    <td className="truncate" style={{ maxWidth: 200 }}>{d.treatment || <span className="text-muted">—</span>}</td>
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
        <Modal title={editItem ? 'Edit Medical Record' : 'Add Medical Record'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient</label>
              <select value={form.patientId} onChange={set('patientId')}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor</label>
              <select value={form.doctorId} onChange={set('doctorId')}>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Record Date</label>
              <input type="date" value={form.recordDate} onChange={set('recordDate')} />
            </div>
            <div className="form-group full">
              <label>Diagnosis</label>
              <textarea value={form.diagnosis} onChange={set('diagnosis')} placeholder="Describe the diagnosis…" />
            </div>
            <div className="form-group full">
              <label>Treatment</label>
              <textarea value={form.treatment} onChange={set('treatment')} placeholder="Describe the treatment…" />
            </div>
            <div className="form-group full">
              <label>Notes</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Additional notes…" />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete medical record #${deleteTarget.id}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
