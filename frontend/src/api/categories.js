import client from './client'

export async function listCategories() {
  const { data } = await client.get('/categories')
  return data
}

export async function getCategory(id) {
  const { data } = await client.get(`/categories/${id}`)
  return data
}

export async function createCategory(category) {
  const { data } = await client.post('/categories', category)
  return data
}

export async function updateCategory(id, category) {
  const { data } = await client.put(`/categories/${id}`, category)
  return data
}

export async function deleteCategory(id) {
  const { data } = await client.delete(`/categories/${id}`)
  return data
}
