import { useState, useEffect } from 'react';
import {
  getPrescriptions, createPrescription, updatePrescription, deletePrescription,
  getMedicalRecords, getMedications,
} from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const EMPTY = {
  medicalRecordId: '', medicationId: '',
  dosage: '', frequency: '', durationDays: '', instructions: '',
};

export default function PrescriptionsPage() {
  const [items, setItems]               = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medications, setMedications]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getPrescriptions(), getMedicalRecords(), getMedications()])
      .then(([p, mr, m]) => {
        setItems(p.data); setMedicalRecords(mr.data); setMedications(m.data); setError(null);
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      medicalRecordId: item.medicalRecord?.id ?? '',
      medicationId:    item.medication?.id ?? '',
      dosage:          item.dosage ?? '',
      frequency:       item.frequency ?? '',
      durationDays:    item.durationDays ?? '',
      instructions:    item.instructions ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const { medicalRecordId, medicationId, ...rest } = form;
    const payload = {
      ...rest,
      medicalRecord: medicalRecordId ? { id: Number(medicalRecordId) } : null,
      medication:    medicationId    ? { id: Number(medicationId)    } : null,
    };
    const req = editItem ? updatePrescription(editItem.id, payload) : createPrescription(payload);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deletePrescription(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const mrLabel = (mr) => {
    if (!mr) return `Record #${mr?.id}`;
    const pat = mr.patient ? `${mr.patient.firstName} ${mr.patient.lastName}` : 'Unknown';
    return `#${mr.id} — ${pat} (${mr.recordDate ?? '?'})`;
  };

  const filtered = items.filter(item => {
    const med = item.medication?.name ?? '';
    const pat = item.medicalRecord?.patient
      ? `${item.medicalRecord.patient.firstName} ${item.medicalRecord.patient.lastName}` : '';
    return `${med} ${pat} ${item.dosage ?? ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Prescriptions</h1>
          <p className="page-subtitle">{items.length} prescriptions total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Prescription</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Prescriptions</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search medication, patient…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Medication</th>
                  <th>Patient</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="table-empty"><div className="table-empty-icon">📄</div>No prescriptions found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">{d.medication?.name || <span className="text-muted">—</span>}</td>
                    <td>
                      {d.medicalRecord?.patient
                        ? `${d.medicalRecord.patient.firstName} ${d.medicalRecord.patient.lastName}`
                        : <span className="text-muted">—</span>}
                    </td>
                    <td>{d.dosage || '—'}</td>
                    <td>{d.frequency || '—'}</td>
                    <td>{d.durationDays ? `${d.durationDays} days` : '—'}</td>
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
        <Modal title={editItem ? 'Edit Prescription' : 'Add Prescription'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group full">
              <label>Medical Record</label>
              <select value={form.medicalRecordId} onChange={set('medicalRecordId')}>
                <option value="">Select medical record</option>
                {medicalRecords.map(mr => <option key={mr.id} value={mr.id}>{mrLabel(mr)}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Medication</label>
              <select value={form.medicationId} onChange={set('medicationId')}>
                <option value="">Select medication</option>
                {medications.map(m => <option key={m.id} value={m.id}>{m.name} ({m.dosageForm})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input value={form.dosage} onChange={set('dosage')} placeholder="e.g. 500mg" />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <input value={form.frequency} onChange={set('frequency')} placeholder="e.g. twice daily" />
            </div>
            <div className="form-group">
              <label>Duration (days)</label>
              <input type="number" min="1" value={form.durationDays} onChange={set('durationDays')} placeholder="7" />
            </div>
            <div className="form-group full">
              <label>Instructions</label>
              <textarea value={form.instructions} onChange={set('instructions')} placeholder="e.g. Take with food…" />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete prescription #${deleteTarget.id}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
