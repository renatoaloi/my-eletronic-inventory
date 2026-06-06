import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCategory, createCategory, updateCategory } from '../api/categories'
import Loading from '../components/Loading'
import toast from '../components/Toast'

export default function CategoryForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isEditing) return
    getCategory(id)
      .then((data) => setForm({ name: data.name || '', description: data.description || '' }))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'O nome é obrigatório.'
    if (form.name.length > 50) errs.name = 'O nome deve ter no máximo 50 caracteres.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEditing) {
        await updateCategory(id, form)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await createCategory(form)
        toast.success('Categoria criada com sucesso!')
      }
      navigate('/categories')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="page-title">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {isEditing ? 'Atualize os dados da categoria' : 'Preencha os dados para criar uma nova categoria'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome *</label>
          <input
            type="text"
            maxLength={50}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
            placeholder="Ex: Capacitores"
          />
          <div className="flex justify-between mt-1">
            {errors.name ? (
              <p className="text-red-500 text-xs">{errors.name}</p>
            ) : <span />}
            <span className="text-xs text-neutral-400">{form.name.length}/50</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder="Descrição da categoria (opcional)"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/categories')} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  )
}
