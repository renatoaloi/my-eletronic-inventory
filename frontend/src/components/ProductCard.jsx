import { useNavigate } from 'react-router-dom'

function getStatusLabel(status) {
  const labels = { 'a venda': 'A Venda', reservado: 'Reservado', vendido: 'Vendido', 'não vender': 'Não Vender' }
  return labels[status] || status
}

export default function ProductCard({ product, onDelete }) {
  const navigate = useNavigate()
  const coverPhoto = product.photos?.find((p) => p.is_cover) || product.photos?.[0]
  const photoUrl = coverPhoto
    ? `${import.meta.env.VITE_API_BASE_URL || '/api'}/photos/${coverPhoto.id}/file`
    : null

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-4">
        {photoUrl ? (
          <img src={photoUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`status-${product.status?.replace(/\s+/g, '-')}`}>
            {getStatusLabel(product.status)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-neutral-800 truncate">{product.name}</h3>
        <p className="text-price">
          {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          {product.category && (
            <span className="bg-neutral-100 px-2 py-0.5 rounded">{product.category.name}</span>
          )}
          {product.type && (
            <span className="bg-neutral-100 px-2 py-0.5 rounded">{product.type.name}</span>
          )}
        </div>
        <p className="text-xs text-neutral-400">Qtd: {product.quantity}</p>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
        <button onClick={() => navigate(`/products/${product.id}`)} className="btn-ghost text-xs flex-1 py-1.5">
          Visualizar
        </button>
        <button onClick={() => navigate(`/products/${product.id}/edit`)} className="btn-ghost text-xs flex-1 py-1.5">
          Editar
        </button>
        <button onClick={() => onDelete(product)} className="btn-ghost text-xs flex-1 py-1.5 text-red-600 hover:text-red-700">
          Excluir
        </button>
      </div>
    </div>
  )
}
