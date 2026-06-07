import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import Loading from '../components/Loading'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error) return <p className="text-red-600">{error.message}</p>
  if (!data) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-neutral-400 text-sm mt-1">Visão geral do estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-neutral-400 mb-1">Valor Total do Estoque</p>
          <p className="text-3xl font-bold text-neutral-800">{formatBRL(data.total_stock_value || 0)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-400 mb-1">Total de Produtos</p>
          <p className="text-3xl font-bold text-neutral-800">{data.total_products || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-400 mb-1">Total de Categorias</p>
          <p className="text-3xl font-bold text-neutral-800">{data.total_categories || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title mb-4">Últimos Produtos</h2>
          {data.last_products?.length > 0 ? (
            <div className="space-y-3">
              {data.last_products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.photos?.find((p) => p.is_cover) || product.photos?.[0] ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/photos/${(product.photos.find((p) => p.is_cover) || product.photos[0]).id}/file`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-800 truncate">{product.name}</p>
                    <p className="text-xs text-neutral-400">{product.category?.name}</p>
                  </div>
                  <p className="font-semibold text-neutral-800">{formatBRL(product.price)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm">Nenhum produto cadastrado.</p>
          )}
        </div>

        <div className="card">
          <h2 className="section-title mb-4">Top 5 Categorias por Valor</h2>
          {data.top_categories?.length > 0 ? (
            <div className="space-y-3">
              {data.top_categories.map((cat, index) => {
                const maxValue = Math.max(...data.top_categories.map((c) => Number(c.total_value)))
                const pct = maxValue > 0 ? (Number(cat.total_value) / maxValue) * 100 : 0
                return (
                  <div key={cat.id || index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-700">{cat.name}</span>
                      <span className="font-semibold text-neutral-800">{formatBRL(cat.total_value)}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm">Nenhuma categoria encontrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}
