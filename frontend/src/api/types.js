import client from './client'

export async function listTypes() {
  const { data } = await client.get('/types')
  return data
}

export async function getType(id) {
  const { data } = await client.get(`/types/${id}`)
  return data
}

export async function createType(type) {
  const { data } = await client.post('/types', type)
  return data
}

export async function updateType(id, type) {
  const { data } = await client.put(`/types/${id}`, type)
  return data
}

export async function deleteType(id) {
  const { data } = await client.delete(`/types/${id}`)
  return data
}
