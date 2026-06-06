import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { listProducts, deleteProduct } from '../api/products'
import { listCategories } from '../api/categories'
import { listTypes } from '../api/types'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import toast from '../components/Toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const navigate = useNavigate()

  const filters = {
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    type_id: searchParams.get('type_id') || '',
    status: searchParams.get('status') || '',
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category_id) params.category_id = filters.category_id
      if (filters.type_id) params.type_id = filters.type_id
      if (filters.status) params.status = filters.status
      const [prodData, catData, typeData] = await Promise.all([
        listProducts(params),
        listCategories(),
        listTypes(),
      ])
      setProducts(prodData || [])
      setCategories(catData || [])
      setTypes(typeData || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.category_id, filters.type_id, filters.status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget.id)
      toast.success('Produto excluído com sucesso!')
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'a venda', label: 'A Venda' },
    { value: 'reservado', label: 'Reservado' },
    { value: 'vendido', label: 'Vendido' },
    { value: 'não vender', label: 'Não Vender' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Produtos</h1>
          <p className="text-neutral-400 text-sm mt-1">Gerencie seu inventário de componentes</p>
        </div>
        <button onClick={() => navigate('/products/new')} className="btn-primary">
          + Novo Produto
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="input-field"
          />
          <select
            value={filters.category_id}
            onChange={(e) => setFilter('category_id', e.target.value)}
            className="select-field"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filters.type_id}
            onChange={(e) => setFilter('type_id', e.target.value)}
            className="select-field"
          >
            <option value="">Todos os tipos</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="select-field"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <EmptyState message="Nenhum produto encontrado com os filtros atuais.">
          <button onClick={() => navigate('/products/new')} className="btn-primary mt-4">
            Cadastrar Produto
          </button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
