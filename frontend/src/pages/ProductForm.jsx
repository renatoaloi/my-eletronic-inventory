import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, createProduct, updateProduct } from '../api/products'
import { listCategories, createCategory } from '../api/categories'
import { listTypes, createType } from '../api/types'
import { uploadPhoto, deletePhoto, setCoverPhoto } from '../api/photos'
import { uploadDocument, deleteDocument } from '../api/documents'
import MarkdownEditor from '../components/MarkdownEditor'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import toast from '../components/Toast'

const STATUS_OPTIONS = [
  { value: 'a venda', label: 'A Venda' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'não vender', label: 'Não Vender' },
]

export default function ProductForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const fileInputRef = useRef()
  const docInputRef = useRef()

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [photos, setPhotos] = useState([])
  const [documents, setDocuments] = useState([])
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    price: '',
    quantity: 0,
    category_id: '',
    type_id: '',
    status: 'a venda',
  })
  const [errors, setErrors] = useState({})
  const [newCategoryModal, setNewCategoryModal] = useState(false)
  const [newTypeModal, setNewTypeModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newTypeName, setNewTypeName] = useState('')

  useEffect(() => {
    Promise.all([listCategories(), listTypes()])
      .then(([cats, ts]) => {
        setCategories(cats || [])
        setTypes(ts || [])
      })
      .catch((err) => toast.error(err.message))
  }, [])

  useEffect(() => {
    if (!isEditing) return
    getProduct(id)
      .then((data) => {
        setForm({
          name: data.name || '',
          code: data.code || '',
          description: data.description || '',
          price: data.price ? String(data.price) : '',
          quantity: data.quantity || 0,
          category_id: data.category_id || '',
          type_id: data.type_id || '',
          status: data.status || 'a venda',
        })
        setPhotos(data.photos || [])
        setDocuments(data.documents || [])
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'O nome é obrigatório.'
    if (form.name.length > 50) errs.name = 'O nome deve ter no máximo 50 caracteres.'
    if (!form.code.trim()) errs.code = 'O código é obrigatório.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Informe um preço válido.'
    if (!form.category_id) errs.category_id = 'Selecione uma categoria.'
    if (!form.type_id) errs.type_id = 'Selecione um tipo.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      }
      if (isEditing) {
        await updateProduct(id, payload)
        toast.success('Produto atualizado com sucesso!')
      } else {
        const created = await createProduct(payload)
        navigate(`/products/${created.id}`)
        return
      }
      navigate(`/products/${id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(e) {
    const files = e.target.files
    if (!files?.length) return
    const productId = id
    if (!productId) {
      toast.error('Salve o produto antes de adicionar fotos.')
      return
    }
    try {
      for (const file of files) {
        const photo = await uploadPhoto(productId, file)
        setPhotos((prev) => [...prev, photo])
      }
      toast.success('Foto(s) enviada(s) com sucesso!')
    } catch (err) {
      toast.error(err.message)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSetCover(photoId) {
    try {
      await setCoverPhoto(photoId)
      setPhotos((prev) =>
        prev.map((p) => ({ ...p, is_cover: p.id === photoId }))
      )
      toast.success('Foto de capa atualizada!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDeletePhoto(photoId) {
    try {
      await deletePhoto(photoId)
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
      toast.success('Foto removida.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDocumentUpload(e) {
    const files = e.target.files
    if (!files?.length) return
    const productId = id
    if (!productId) {
      toast.error('Salve o produto antes de adicionar documentos.')
      return
    }
    try {
      for (const file of files) {
        const doc = await uploadDocument(productId, file)
        setDocuments((prev) => [...prev, doc])
      }
      toast.success('Documento(s) enviado(s) com sucesso!')
    } catch (err) {
      toast.error(err.message)
    }
    if (docInputRef.current) docInputRef.current.value = ''
  }

  async function handleDeleteDocument(docId) {
    try {
      await deleteDocument(docId)
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
      toast.success('Documento removido.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return
    if (newCategoryName.length > 50) {
      toast.error('O nome deve ter no máximo 50 caracteres.')
      return
    }
    try {
      const cat = await createCategory({ name: newCategoryName })
      setCategories((prev) => [...prev, cat])
      setForm((prev) => ({ ...prev, category_id: cat.id }))
      setNewCategoryModal(false)
      setNewCategoryName('')
      toast.success('Categoria criada!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleCreateType() {
    if (!newTypeName.trim()) return
    if (newTypeName.length > 50) {
      toast.error('O nome deve ter no máximo 50 caracteres.')
      return
    }
    try {
      const t = await createType({ name: newTypeName })
      setTypes((prev) => [...prev, t])
      setForm((prev) => ({ ...prev, type_id: t.id }))
      setNewTypeModal(false)
      setNewTypeName('')
      toast.success('Tipo criado!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {isEditing ? 'Atualize os dados do produto' : 'Preencha os dados para cadastrar um novo produto'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-5">
          <h2 className="section-title">Informações Básicas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome *</label>
              <input
                type="text"
                maxLength={50}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Ex: Capacitor Eletrolítico 100µF"
              />
              <div className="flex justify-between mt-1">
                {errors.name ? <p className="text-red-500 text-xs">{errors.name}</p> : <span />}
                <span className="text-xs text-neutral-400">{form.name.length}/50</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Código *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={`input-field ${errors.code ? 'border-red-400' : ''}`}
                placeholder="Ex: CAP-100UF-25V"
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>
          </div>

          <MarkdownEditor
            label="Descrição"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={`input-field ${errors.price ? 'border-red-400' : ''}`}
                placeholder="0,00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Quantidade</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="section-title">Classificação</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Categoria *</label>
              <div className="flex gap-2">
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className={`select-field flex-1 ${errors.category_id ? 'border-red-400' : ''}`}
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setNewCategoryModal(true)} className="btn-secondary text-sm whitespace-nowrap px-3">
                  + Nova
                </button>
              </div>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Tipo *</label>
              <div className="flex gap-2">
                <select
                  value={form.type_id}
                  onChange={(e) => setForm({ ...form, type_id: e.target.value })}
                  className={`select-field flex-1 ${errors.type_id ? 'border-red-400' : ''}`}
                >
                  <option value="">Selecione...</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setNewTypeModal(true)} className="btn-secondary text-sm whitespace-nowrap px-3">
                  + Novo
                </button>
              </div>
              {errors.type_id && <p className="text-red-500 text-xs mt-1">{errors.type_id}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="select-field"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="section-title">Fotos</h2>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-neutral-800 hover:file:bg-primary-hover"
            />
            {!id && <p className="text-xs text-neutral-400 mt-1">Salve o produto antes de adicionar fotos.</p>}
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/photos/${photo.id}/file`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {photo.is_cover && (
                    <div className="absolute top-1 left-1 bg-primary text-neutral-800 text-xs font-bold px-2 py-0.5 rounded">
                      CAPA
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!photo.is_cover && (
                      <button type="button" onClick={() => handleSetCover(photo.id)} className="bg-white text-neutral-800 text-xs font-semibold px-2 py-1 rounded hover:bg-neutral-100">
                        Capa
                      </button>
                    )}
                    <button type="button" onClick={() => handleDeletePhoto(photo.id)} className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded hover:bg-red-700">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <h2 className="section-title">Documentos</h2>
          <div>
            <input
              ref={docInputRef}
              type="file"
              multiple
              onChange={handleDocumentUpload}
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-hover"
            />
            {!id && <p className="text-xs text-neutral-400 mt-1">Salve o produto antes de adicionar documentos.</p>}
          </div>
          {documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-neutral-700 truncate">{doc.filename || doc.file_name || 'Documento'}</span>
                  </div>
                  <button type="button" onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-700 text-xs font-semibold flex-shrink-0 ml-2">
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate(isEditing ? `/products/${id}` : '/products')} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Criar Produto'}
          </button>
        </div>
      </form>

      <Modal open={newCategoryModal} onClose={() => setNewCategoryModal(false)} title="Nova Categoria" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome</label>
            <input
              type="text"
              maxLength={50}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="input-field"
              placeholder="Nome da categoria"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setNewCategoryModal(false)} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={handleCreateCategory} className="btn-primary">Criar</button>
          </div>
        </div>
      </Modal>

      <Modal open={newTypeModal} onClose={() => setNewTypeModal(false)} title="Novo Tipo" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome</label>
            <input
              type="text"
              maxLength={50}
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="input-field"
              placeholder="Nome do tipo"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateType()}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setNewTypeModal(false)} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={handleCreateType} className="btn-primary">Criar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
