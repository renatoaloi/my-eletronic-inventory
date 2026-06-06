import client from './client'

export async function listProducts(params = {}) {
  const { data } = await client.get('/products', { params })
  return data
}

export async function getProduct(id) {
  const { data } = await client.get(`/products/${id}`)
  return data
}

export async function createProduct(product) {
  const { data } = await client.post('/products', product)
  return data
}

export async function updateProduct(id, product) {
  const { data } = await client.put(`/products/${id}`, product)
  return data
}

export async function deleteProduct(id) {
  const { data } = await client.delete(`/products/${id}`)
  return data
}

export async function exportKit(id) {
  const { data } = await client.get(`/products/${id}/export`)
  return data
}
