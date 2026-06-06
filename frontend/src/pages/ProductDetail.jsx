import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getProduct, deleteProduct, exportKit } from '../api/products'
import { deletePhoto } from '../api/photos'
import { deleteDocument, getDocumentUrl } from '../api/documents'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import toast from '../components/Toast'

function getStatusLabel(status) {
  const labels = { 'a venda': 'A Venda', reservado: 'Reservado', vendido: 'Vendido', 'não vender': 'Não Vender' }
  return labels[status] || status
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photoModal, setPhotoModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(false)

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    try {
      await deleteProduct(id)
      toast.success('Produto excluído com sucesso!')
      navigate('/products')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleExport() {
    try {
      const data = await exportKit(id)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kit-${product.name}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Kit exportado com sucesso!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDeletePhoto(photoId) {
    try {
      await deletePhoto(photoId)
      setProduct((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }))
      toast.success('Foto removida.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDeleteDocument(docId) {
    try {
      await deleteDocument(docId)
      setProduct((prev) => ({
        ...prev,
        documents: prev.documents.filter((d) => d.id !== docId),
      }))
      toast.success('Documento removido.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loading />
  if (!product) return <p className="text-neutral-400">Produto não encontrado.</p>

  const coverPhoto = product.photos?.find((p) => p.is_cover) || product.photos?.[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <button onClick={() => navigate('/products')} className="text-sm text-neutral-400 hover:text-neutral-600 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="page-title">{product.name}</h1>
          <p className="text-sm text-neutral-400">Código: {product.code}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm">
            Exportar Kit
          </button>
          <button onClick={() => navigate(`/products/${id}/edit`)} className="btn-primary text-sm">
            Editar
          </button>
          <button onClick={() => setDeleteTarget(true)} className="btn-danger text-sm">
            Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Detalhes</h2>
              <span className={`status-${product.status?.replace(/\s+/g, '-')}`}>
                {getStatusLabel(product.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-400">Preço</p>
                <p className="text-price text-xl">
                  {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Quantidade</p>
                <p className="font-semibold text-neutral-800">{product.quantity}</p>
              </div>
              <div>
                <p className="text-neutral-400">Categoria</p>
                <p className="font-semibold text-neutral-800">{product.category?.name || '-'}</p>
              </div>
              <div>
                <p className="text-neutral-400">Tipo</p>
                <p className="font-semibold text-neutral-800">{product.type?.name || '-'}</p>
              </div>
              <div>
                <p className="text-neutral-400">Data de Criação</p>
                <p className="font-semibold text-neutral-800">
                  {product.created_at ? new Date(product.created_at).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Última Atualização</p>
                <p className="font-semibold text-neutral-800">
                  {product.updated_at ? new Date(product.updated_at).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="card">
              <h2 className="section-title mb-3">Descrição</h2>
              <div className="prose prose-sm max-w-none text-neutral-700">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="section-title mb-3">Foto de Capa</h2>
            {coverPhoto ? (
              <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => setPhotoModal(coverPhoto)}>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || '/api'}/photos/${coverPhoto.id}/file`}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {product.photos?.length > 1 && (
            <div className="card">
              <h2 className="section-title mb-3">Todas as Fotos</h2>
              <div className="grid grid-cols-3 gap-2">
                {product.photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden group">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL || '/api'}/photos/${photo.id}/file`}
                      alt=""
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPhotoModal(photo)}
                    />
                    {photo.is_cover && (
                      <div className="absolute top-1 left-1 bg-primary text-neutral-800 text-xs font-bold px-1.5 py-0.5 rounded">
                        CAPA
                      </div>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.documents?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-3">Documentos</h2>
              <div className="space-y-2">
                {product.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-neutral-700 truncate">{doc.filename || doc.file_name || 'Documento'}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={getDocumentUrl(doc.id)}
                        download
                        className="text-secondary hover:text-secondary-hover text-xs font-semibold"
                      >
                        Download
                      </a>
                      <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-700 text-xs font-semibold">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!photoModal} onClose={() => setPhotoModal(null)} title="Foto" size="full">
        {photoModal && (
          <div className="flex items-center justify-center">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL || '/api'}/photos/${photoModal.id}/file`}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={deleteTarget}
        onClose={() => setDeleteTarget(false)}
        onConfirm={handleDelete}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
