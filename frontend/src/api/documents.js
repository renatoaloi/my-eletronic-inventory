import client from './client'

export async function uploadDocument(productId, file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await client.post(`/products/${productId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteDocument(id) {
  const { data } = await client.delete(`/documents/${id}`)
  return data
}

export function getDocumentUrl(id) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}/documents/${id}/download`
}
