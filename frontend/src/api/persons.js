import { api, withErrors } from './client'

export async function listPersons({ page=0, size=20, sort='id', dir='asc', filters={} } = {}) {
  const params = { page, size, sort, dir }
  if (filters.name)         params.name = filters.name
  if (filters.eyeColor)     params.eyeColor = filters.eyeColor
  if (filters.hairColor)    params.hairColor = filters.hairColor
  if (filters.nationality)  params.nationality = filters.nationality
  if (filters.locationName) params.locationName = filters.locationName

  logRequest('get', '/person', { params })
  return withErrors(api.get('/person', { params }))
}

function logRequest(method, path, { params, data } = {}) {
  const url = params
  const dataInfo = data == null ? '' : { type: typeof data, keys: Object.keys(data || {}) }
  console.log('→', method.toUpperCase(), path, url, dataInfo)
}

export async function getPerson(id){ return withErrors(api.get(`/person/${id}`)) }
export async function createPerson(payload){ return withErrors(api.post('/person', payload)) }
export async function updatePerson(id, payload){ return withErrors(api.put(`/person/${id}`, payload)) }
export async function deletePerson(id){ return withErrors(api.delete(`/person/${id}`)) }
