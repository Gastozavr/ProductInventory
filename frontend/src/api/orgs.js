
import { api, withErrors } from './client'
export async function listOrgs({ page = 0, size = 20, sort = 'id', dir = 'asc', filters = {} } = {}) {
  const params = { page, size, sort, dir }
  if (filters.name)         params.name = filters.name
  if (filters.officialTownName) params.officialTownName = filters.officialTownName
  if (filters.postalTownName)   params.postalTownName   = filters.postalTownName

  logRequest('get', '/organization', { params })
  return withErrors(api.get('/organization', { params }))
}

function logRequest(method, path, { params, data } = {}) {
  const url = params;
  const dataInfo = data == null ? '' : { type: typeof data, keys: Object.keys(data || {}) }
  console.log('→', method.toUpperCase(), url, dataInfo)
}
export async function getOrg(id){ return withErrors(api.get(`/organization/${id}`)) }
export async function createOrg(payload){ return withErrors(api.post('/organization', payload)) }
export async function updateOrg(id, payload){ return withErrors(api.put(`/organization/${id}`, payload)) }
export async function deleteOrg(id){ return withErrors(api.delete(`/organization/${id}`)) }
