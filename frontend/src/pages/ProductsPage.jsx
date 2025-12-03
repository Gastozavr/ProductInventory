import React, { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import Modal from '../components/Modal.jsx'
import Toast from '../components/Toast.jsx'
import { bus } from '../api/client.js'
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../api/products.js'
import ProductForm from '../components/ProductForm.jsx'
import { subscribeWS } from '../api/ws.js'
import { uploadProductImport } from '../api/imports.js'

const SIZE_KEY = 'products.pageSize'

const empty = () => ({
  name: '',
  unitOfMeasure: '',
  price: null,
  manufactureCost: null,
  rating: null,
  partNumber: '',
  coordinates: { x: null, y: null },
  manufacturer: { id: null },
  owner: null
})

const initialFilters = { name: '', partNumber: '', unitOfMeasureLike: '', orgName: '', personName: '' }

function validateProduct(v) {
  const e = {}
  if (!v.name?.trim()) e.name = 'Обязательное поле'
  if (!v.unitOfMeasure) e.unitOfMeasure = 'Обязательное поле'
  if (!(v.price > 0)) e.price = 'Укажите число > 0'
  if (v.manufactureCost == null || !(v.manufactureCost >= 0)) e.manufactureCost = 'Укажите число ≥ 0'
  if (!(v.rating >= 1)) e.rating = 'Укажите число ≥ 1'
  if (!v.partNumber?.trim()) e.partNumber = 'Обязательное поле'
  const c = v.coordinates || {}
  if (c.x == null) e['coordinates.x'] = 'Обязательное поле'
  if (c.y == null) e['coordinates.y'] = 'Обязательное поле'
  if (!v.manufacturer?.id) e['manufacturer.id'] = 'Выберите производителя'
  return e
}

function extractServerError(err) {
  const fallback = 'Ошибка! Выполнить данное действие не получится'

  if (!err) return fallback
  if (typeof err === 'string') return err

  if (err.body) {
    if (typeof err.body === 'string') return err.body
    if (err.body.message) return err.body.message
    if (err.body.error) return err.body.error
  }

  if (err.message) return err.message
  if (err.error) return err.error

  return fallback
}

function calcTotalPages(data, size) {
  if (typeof data?.totalPages === 'number' && data.totalPages > 0) return data.totalPages
  if (typeof data?.total === 'number') return Math.max(1, Math.ceil(data.total / (size || 10)))
  if (typeof data?.totalElements === 'number') return Math.max(1, Math.ceil(data.totalElements / (size || 10)))
  if (Array.isArray(data)) return 1
  if (Array.isArray(data?.items) || Array.isArray(data?.content)) return 1
  return 1
}

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)

  const [size, setSize] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(SIZE_KEY))
      return Number.isFinite(saved) && saved > 0 ? saved : 5
    } catch {
      return 5
    }
  })

  const [sort, setSort] = useState('id')
  const [dir, setDir] = useState('asc')
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(initialFilters)
  const [view, setView] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(empty())
  const [toast, setToast] = useState('')

  const [errors, setErrors] = useState({})
  const [submitTried, setSubmitTried] = useState(false)

  const [uploading, setUploading] = useState(false)
  const fileRef = React.useRef(null)
  function onClickImport() { fileRef.current?.click() }
  async function onFileChosen(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const [err, data] = await uploadProductImport(file)
    if (err) {
      setToast(extractServerError(err))
    } else {
      setToast(`Импорт запущен: создано ${data?.createdCount ?? 0}`)
      bus.emit?.('product:changed')
    }
    e.target.value = ''
    setUploading(false)
  }

  useEffect(() => {
    try { localStorage.setItem(SIZE_KEY, String(size)) } catch {}
  }, [size])

  const columns = useMemo(() => [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Название' },
    { key: 'partNumber', title: 'Артикул' },
    { key: 'price', title: 'Цена' },
    { key: 'rating', title: 'Рейтинг' },
    { key: 'unitOfMeasure', title: 'Ед.' },
    {
      key: 'manufacturer',
      title: 'Производитель',
      render: (v) => v ? (v.name + ' (#' + v.id + ')') : ''
    },
    {
      key: 'owner',
      title: 'Владелец',
      render: (v) => v ? (v.name + ' (#' + v.id + ')') : ''
    },
    {
      key: 'creationDate',
      title: 'Создан',
      render: (v) => v ? new Date(v).toLocaleString() : ''
    },
  ], [])

  function load() {
    listProducts({ page, size, sort, dir, filters }).then(([err, data]) => {
      if (err) {
        setToast(extractServerError(err))
        return
      }

      const content =
          Array.isArray(data) ? data :
              (Array.isArray(data.items) ? data.items :
                  Array.isArray(data.content) ? data.content : [])

      if (typeof data?.size === 'number' && data.size > 0 && data.size !== size) {
        setSize(data.size)
      }

      const tp = calcTotalPages(data, size)

      setItems(content)
      setTotalPages(tp)

      setPage(p => Math.max(0, Math.min((tp || 1) - 1, p)))
    })
  }

  useEffect(load, [page, size, sort, dir, JSON.stringify(filters)])

  useEffect(() => {
    const off = bus.on?.((t) => {
      if (['product:changed', 'product:deleted', 'product:created'].includes(t)) load()
    })
    return () => { if (typeof off === 'function') off() }
  }, [])

  useEffect(() => {
    const off = subscribeWS((msg) => {
      const entity = msg?.entity ?? msg?.type
      const action = msg?.action ?? msg?.event
      if (entity === 'product' && ['created', 'updated', 'deleted'].includes(action)) {
        load()
      }
    })
    return off
  }, [page, size, sort, dir, JSON.stringify(filters)])

  useEffect(() => {
    setPage(p => Math.max(0, Math.min((totalPages || 1) - 1, p)))
  }, [totalPages])

  function onSort(col) {
    if (sort === col) setDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSort(col); setDir('asc') }
  }

  function resetAll() {
    setFilters(initialFilters)
    setPage(0); setSort('id'); setDir('asc')
  }

  function onFilterChange(patch) {
    setFilters(f => ({ ...f, ...patch }))
    setPage(0)
  }

  function openCreate() {
    setForm(empty())
    setEditId('create')
    setSubmitTried(false)
    setErrors({})
  }

  function openEdit(row) {
    setEditId(row.id)
    setForm({
      name: row.name ?? '',
      unitOfMeasure: row.unitOfMeasure ?? '',
      price: row.price ?? null,
      manufactureCost: row.manufactureCost ?? null,
      rating: row.rating ?? null,
      partNumber: row.partNumber ?? '',
      coordinates: { x: row.coordinates?.x ?? null, y: row.coordinates?.y ?? null },
      manufacturer: { id: row.manufacturer?.id ?? null },
      owner: row.owner?.id ? { id: row.owner.id } : null
    })
    setSubmitTried(false)
    setErrors({})
  }

  async function save() {
    setSubmitTried(true)
    const errs = validateProduct(form)
    setErrors(errs)
    if (Object.keys(errs).length) return

    const payload = { ...form, owner: form.owner && form.owner.id ? form.owner : null }
    const action = editId === 'create' ? createProduct(payload) : updateProduct(editId, payload)
    const [err] = await action
    if (err) {
      setToast(extractServerError(err))
      return
    }
    setEditId(null); load(); bus.emit?.('product:changed')
  }

  async function remove(row) {
    if (!confirm('Удалить продукт #' + row.id + '?')) return
    const [err] = await deleteProduct(row.id)
    if (err) {
      setToast(extractServerError(err))
      return
    }
    load(); bus.emit?.('product:deleted')
  }

  return (
      <div>
        <div className="toolbar">
          <input
              placeholder="Фильтр: имя"
              value={filters.name}
              onChange={e => onFilterChange({ name: e.target.value })}
          />
          <input
              placeholder="Фильтр: артикул"
              value={filters.partNumber}
              onChange={e => onFilterChange({ partNumber: e.target.value })}
          />
          <input
              placeholder="Единицы (LIKE)"
              value={filters.unitOfMeasureLike}
              onChange={e => onFilterChange({ unitOfMeasureLike: e.target.value })}
          />
          <input
              placeholder="Организация"
              value={filters.orgName}
              onChange={e => onFilterChange({ orgName: e.target.value })}
          />
          <input
              placeholder="Владелец"
              value={filters.personName}
              onChange={e => onFilterChange({ personName: e.target.value })}
          />
          <span className="spacer" />
          <button className="btn" onClick={resetAll}>Сбросить</button>

          {/* Кнопка импорта — между "Сбросить" и селектом */}
          <button className="btn" onClick={onClickImport} disabled={uploading}>
            {uploading ? 'Импорт…' : 'Импорт'}
          </button>
          <input
              type="file"
              accept=".csv,.json,.xlsx,.xls,.txt"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={onFileChosen}
          />

          <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0) }}>
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/стр</option>)}
          </select>
          <button className="btn primary" onClick={openCreate}>+ Создать</button>
        </div>

        <DataTable
            columns={columns}
            rows={items}
            sort={sort}
            dir={dir}
            onSort={onSort}
            rowActions={(row) => (
                <>
                  <button className="btn" onClick={() => setView(row.id)}>Открыть</button>
                  <button className="btn" onClick={() => openEdit(row)}>Изменить</button>
                  <button className="btn danger" onClick={() => remove(row)}>Удалить</button>
                </>
            )}
        />

        <Pagination page={page} size={size} totalPages={totalPages} onChange={setPage} />

        <Modal
            open={!!view}
            onClose={() => setView(null)}
            title={view ? ('Продукт #' + view) : ''}
            footer={<button className="btn" onClick={() => setView(null)}>Закрыть</button>}
        >
          <ProductDetails id={view} />
        </Modal>

        <Modal
            open={!!editId}
            onClose={() => setEditId(null)}
            title={editId === 'create' ? 'Создать продукт' : 'Изменить продукт'}
            footer={
              <>
                <button className="btn" onClick={() => setEditId(null)}>Отмена</button>
                <button className="btn primary" onClick={save}>Сохранить</button>
              </>
            }
        >
          <ProductForm value={form} onChange={setForm} submitTried={submitTried} errors={errors} />
        </Modal>

        <Toast text={toast} onClose={() => setToast('')} />
      </div>
  )
}

function ProductDetails({ id }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    getProduct(id).then(([err, d]) => {
      if (err) {
        setError(extractServerError(err))
      } else {
        setError(null)
        setData(d)
      }
    })
  }, [id])

  if (!id) return null
  if (error) return <div className="card">{error}</div>
  if (!data) return <div className="card">Загрузка…</div>

  return (
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><div className="muted">Название</div><div>{data.name}</div></div>
          <div><div className="muted">Артикул</div><div>{data.partNumber}</div></div>
          <div><div className="muted">Цена</div><div>{data.price}</div></div>
          <div><div className="muted">Рейтинг</div><div>{data.rating}</div></div>
          <div><div className="muted">Единицы</div><div>{data.unitOfMeasure}</div></div>
          <div>
            <div className="muted">Координаты</div>
            <div>X: {data.coordinates?.x} · Y: {data.coordinates?.y}</div>
          </div>
          <div>
            <div className="muted">Производитель</div>
            <div>{data.manufacturer?.name} (#{data.manufacturer?.id})</div>
          </div>
          <div>
            <div className="muted">Владелец</div>
            <div>{data.owner ? (data.owner.name + ' (#' + data.owner.id + ')') : '—'}</div>
          </div>
          <div>
            <div className="muted">Создан</div>
            <div>{data.creationDate ? new Date(data.creationDate).toLocaleString() : ''}</div>
          </div>
        </div>
      </div>
  )
}
