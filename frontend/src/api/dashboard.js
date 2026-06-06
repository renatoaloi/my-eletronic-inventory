import client from './client'

export async function getDashboard() {
  const { data } = await client.get('/dashboard')
  return data
}
