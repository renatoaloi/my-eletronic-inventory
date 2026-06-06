import { useState, useEffect } from 'react'
import { listTypes, createType, updateType, deleteType } from '../api/types'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import toast from '../components/Toast'

export default function Types() {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  async function fetchData() {
    try {
      const data = await listTypes()
      setTypes(data || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  function openCreate() {
    setEditingType(null)
    setForm({ name: '', description: '' })
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(type) {
    setEditingType(type)
    setForm({ name: type.name || '', description: type.description || '' })
    setErrors({})
    setModalOpen(true)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'O nome é obrigatório.'
    if (form.name.length > 50) errs.name = 'O nome deve ter no máximo 50 caracteres.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editingType) {
        await updateType(editingType.id, form)
        toast.success('Tipo atualizado com sucesso!')
      } else {
        await createType(form)
        toast.success('Tipo criado com sucesso!')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteType(deleteTarget.id)
      toast.success('Tipo excluído com sucesso!')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Tipos</h1>
          <p className="text-neutral-400 text-sm mt-1">Gerencie os tipos dos produtos</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Novo Tipo
        </button>
      </div>

      {types.length === 0 ? (
        <EmptyState message="Nenhum tipo cadastrado.">
          <button onClick={openCreate} className="btn-primary mt-4">
            Criar Tipo
          </button>
        </EmptyState>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Descrição</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {types.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">{t.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500 max-w-xs truncate">{t.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(t)} className="btn-ghost text-xs py-1.5">Editar</button>
                      <button onClick={() => setDeleteTarget(t)} className="btn-ghost text-xs py-1.5 text-red-600 hover:text-red-700">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingType ? 'Editar Tipo' : 'Novo Tipo'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome *</label>
            <input
              type="text"
              maxLength={50}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Ex: Eletrolítico"
            />
            <div className="flex justify-between mt-1">
              {errors.name ? <p className="text-red-500 text-xs">{errors.name}</p> : <span />}
              <span className="text-xs text-neutral-400">{form.name.length}/50</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[80px]"
              placeholder="Descrição do tipo (opcional)"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : editingType ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Tipo"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
