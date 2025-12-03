import { api, withErrors } from './client'

export async function uploadProductImport(file) {
    const form = new FormData()
    form.append('file', file)
    return withErrors(api.post('/import/product/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }))
}

export async function listImports({ page = 0, size = 20, sort = 'id', dir = 'desc' } = {}) {
    return withErrors(api.get('/import', { params: { page, size, sort, dir } }))
}
