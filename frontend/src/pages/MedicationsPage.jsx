import { useState, useEffect } from 'react';
import { getMedications, createMedication, updateMedication, deleteMedication } from '../services/api';
import Modal, { ConfirmDialog } from '../components/Modal';

const DOSAGE_FORMS = ['TABLET','CAPSULE','SYRUP','INJECTION','CREAM','OTHER'];

const EMPTY = {
  name: '', manufacturer: '', dosageForm: 'TABLET',
  unitPrice: '', stockQuantity: '', expiryDate: '',
};

export default function MedicationsPage() {
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
    getMedications()
      .then(r => { setItems(r.data); setError(null); })
      .catch(() => setError('Failed to load medications.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({
      name:          item.name ?? '',
      manufacturer:  item.manufacturer ?? '',
      dosageForm:    item.dosageForm ?? 'TABLET',
      unitPrice:     item.unitPrice ?? '',
      stockQuantity: item.stockQuantity ?? '',
      expiryDate:    item.expiryDate ?? '',
    });
    setEditItem(item); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = () => {
    setSaving(true);
    const req = editItem ? updateMedication(editItem.id, form) : createMedication(form);
    req.then(() => { closeModal(); load(); }).catch(() => alert('Save failed.')).finally(() => setSaving(false));
  };

  const handleDelete = () => {
    setSaving(true);
    deleteMedication(deleteTarget.id)
      .then(() => { setDeleteTarget(null); load(); })
      .catch(() => alert('Delete failed.'))
      .finally(() => setSaving(false));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const stockColor = (qty) => {
    if (qty == null) return 'badge-gray';
    if (qty <= 0) return 'badge-red';
    if (qty < 20) return 'badge-yellow';
    return 'badge-green';
  };

  const filtered = items.filter(d =>
    `${d.name} ${d.manufacturer} ${d.dosageForm}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Medications</h1>
          <p className="page-subtitle">{items.length} medications in inventory</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Medication</button>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Medication Inventory</span>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search name, manufacturer…" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th>Form</th>
                  <th>Manufacturer</th>
                  <th>Unit Price</th>
                  <th>Stock</th>
                  <th>Expiry</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}><div className="table-empty"><div className="table-empty-icon">💊</div>No medications found.</div></td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id}>
                    <td className="text-muted font-mono">{d.id}</td>
                    <td className="text-strong">{d.name}</td>
                    <td><span className="badge badge-blue">{d.dosageForm}</span></td>
                    <td>{d.manufacturer || <span className="text-muted">—</span>}</td>
                    <td className="font-mono">{d.unitPrice != null ? `$${Number(d.unitPrice).toFixed(2)}` : '—'}</td>
                    <td>
                      <span className={`badge ${stockColor(d.stockQuantity)}`}>{d.stockQuantity ?? '—'} units</span>
                    </td>
                    <td>{d.expiryDate || <span className="text-muted">—</span>}</td>
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
        <Modal title={editItem ? 'Edit Medication' : 'Add Medication'} onClose={closeModal} onSave={handleSave} saving={saving} wide>
          <div className="form-grid">
            <div className="form-group full">
              <label>Name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Aspirin" />
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input value={form.manufacturer} onChange={set('manufacturer')} placeholder="e.g. Bayer" />
            </div>
            <div className="form-group">
              <label>Dosage Form</label>
              <select value={form.dosageForm} onChange={set('dosageForm')}>
                {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Unit Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.unitPrice} onChange={set('unitPrice')} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="100" />
            </div>
            <div className="form-group full">
              <label>Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={set('expiryDate')} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete medication "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
