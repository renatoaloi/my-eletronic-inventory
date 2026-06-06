import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkdownEditor({ value, onChange, label, placeholder = 'Digite a descrição em markdown...' }) {
  const [preview, setPreview] = useState(false)

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{label}</label>}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${!preview ? 'bg-white text-neutral-800 border-r border-neutral-200' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${preview ? 'bg-white text-neutral-800 border-l border-neutral-200' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Visualizar
          </button>
        </div>
        {preview ? (
          <div className="p-4 min-h-[160px] prose prose-sm max-w-none text-neutral-700">
            {value ? <ReactMarkdown>{value}</ReactMarkdown> : <span className="text-neutral-400">Nenhuma visualização disponível.</span>}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 min-h-[160px] text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none resize-y"
          />
        )}
      </div>
    </div>
  )
}
