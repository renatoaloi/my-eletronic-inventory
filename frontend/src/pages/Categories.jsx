import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCategories, deleteCategory } from '../api/categories'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import toast from '../components/Toast'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const navigate = useNavigate()

  async function fetchData() {
    try {
      const data = await listCategories()
      setCategories(data || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      toast.success('Categoria excluída com sucesso!')
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
          <h1 className="page-title">Categorias</h1>
          <p className="text-neutral-400 text-sm mt-1">Gerencie as categorias dos produtos</p>
        </div>
        <button onClick={() => navigate('/categories/new')} className="btn-primary">
          + Nova Categoria
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState message="Nenhuma categoria cadastrada.">
          <button onClick={() => navigate('/categories/new')} className="btn-primary mt-4">
            Criar Categoria
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
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500 max-w-xs truncate">{cat.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/categories/${cat.id}/edit`)}
                        className="btn-ghost text-xs py-1.5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="btn-ghost text-xs py-1.5 text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
