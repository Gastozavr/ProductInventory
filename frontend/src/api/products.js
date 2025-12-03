import { api, withErrors } from './client'

function buildUrl(path, params = {}) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue
    if (Array.isArray(v)) v.forEach(val => usp.append(k, val))
    else usp.append(k, v)
  }
  const qs = usp.toString()
  return qs ? `${path}?${qs}` : path
}

function logRequest(method, path, { params, data } = {}) {
  const url = buildUrl(path, params)
  const dataInfo = data == null ? '' : { type: typeof data, keys: Object.keys(data || {}) }
  console.log('→', method.toUpperCase(), url, dataInfo)
}

export async function listProducts({ page = 0, size = 20, sort = 'id', dir = 'asc', filters = {} } = {}) {
  const params = { page, size, sort, dir }
  if (filters.name)        params.name = filters.name
  if (filters.partNumber)  params.partNumber = filters.partNumber
  if (filters.unitLike)    params.unit = filters.unitLike
  if (filters.orgName)     params.organizationName = filters.orgName
  if (filters.personName)  params.personName = filters.personName

  logRequest('get', '/product', { params })
  return withErrors(api.get('/product', { params }))
}

export async function getProduct(id) {
  logRequest('get', `/product/${id}`)
  return withErrors(api.get(`/product/${id}`))
}

export async function createProduct(payload) {
  logRequest('post', '/product', { data: payload })
  return withErrors(api.post('/product', payload))
}

export async function updateProduct(id, payload) {
  logRequest('put', `/product/${id}`, { data: payload })
  return withErrors(api.put(`/product/${id}`, payload))
}

export async function deleteProduct(id) {
  logRequest('delete', `/product/${id}`)
  return withErrors(api.delete(`/product/${id}`))
}
