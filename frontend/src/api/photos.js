import client from './client'

export async function uploadPhoto(productId, file, isCover = false) {
  const formData = new FormData()
  formData.append('file', file)
  if (isCover) {
    formData.append('is_cover', 'true')
  }
  const { data } = await client.post(`/products/${productId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deletePhoto(id) {
  const { data } = await client.delete(`/photos/${id}`)
  return data
}

export async function setCoverPhoto(id) {
  const { data } = await client.put(`/photos/${id}/cover`)
  return data
}
