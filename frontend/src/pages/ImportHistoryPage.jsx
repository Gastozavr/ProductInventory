import React, { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import Toast from '../components/Toast.jsx'
import { listImports } from '../api/imports.js'
import { subscribeWS } from '../api/ws.js'

function fmtDate(v){
    if (!v) return '—'
    try { return new Date(v).toLocaleString() } catch { return String(v) }
}

export default function ImportHistoryPage(){
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState('')

    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const [totalPages, setTotalPages] = useState(1)
    const [sort, setSort] = useState('id')
    const [dir, setDir] = useState('desc')

    const reloading = useRef(false)

    async function load(){
        setLoading(true)
        const [err, data] = await listImports({ page, size, sort, dir })
        if (err){
            setToast(typeof err === 'string' ? err : (err?.message ?? 'Ошибка загрузки'))
            setLoading(false)
            return
        }
        const items = Array.isArray(data?.items)
            ? data.items
            : (Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []))
        const tp = (typeof data?.totalPages === 'number' && data.totalPages > 0) ? data.totalPages : 1

        setRows(items)
        setTotalPages(tp)
        setPage(p => Math.max(0, Math.min(tp - 1, p)))
        setLoading(false)
    }

    useEffect(() => { load() }, [page, size, sort, dir])

    useEffect(() => {
        const off = subscribeWS((msg) => {
            if (!msg || typeof msg !== 'object') return
            const entity = String(msg.entity ?? '').toLowerCase()
            const action = String(msg.action ?? '').toLowerCase()
            if (entity === 'imports' && action === 'updated') {
                if (!reloading.current) {
                    reloading.current = true
                    setToast('История импорта обновлена')
                    load().finally(() => { reloading.current = false })
                }
            }
        })
        return off
    }, [page, size, sort, dir])

    function onSort(colKey){
        if (sort === colKey) setDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSort(colKey); setDir('asc') }
        setPage(0)
    }

    const columns = useMemo(() => ([
        { key: 'id', title: 'ID', width: 80 },
        { key: 'status', title: 'Статус', width: 140, render: v => <Tag value={v}/> },
        { key: 'createdCount', title: 'Создано', width: 110, render: v => (v ?? 0) },
        { key: 'startedAt', title: 'Начало', render: v => fmtDate(v) },
        { key: 'finishedAt', title: 'Окончание', render: v => fmtDate(v) },
    ]), [])

    const toolbarStyle = { display:'flex', alignItems:'center', gap:6, flexWrap:'nowrap', overflowX:'auto', padding:4 }
    const selectStyle = { width: 90, padding: '6px 8px' }

    return (
        <div className="page">
            <div className="page-head">
                <h1>История импорта</h1>
            </div>

            {/* верхняя «полоса» с таким же селектом, как на других страницах */}
            <div className="toolbar" style={toolbarStyle}>
                <span style={{ flex:1 }} />
                <select
                    style={selectStyle}
                    value={size}
                    onChange={e => { setSize(Number(e.target.value)); setPage(0) }}
                    aria-label="Размер страницы"
                >
                    {[5,10,20,50].map(n => <option key={n} value={n}>{n}/стр</option>)}
                </select>
            </div>

            <div className="card">
                {loading ? <div>Загрузка…</div> : (
                    <>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            sort={sort}
                            dir={dir}
                            onSort={onSort}
                        />
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                            <Pagination page={page} size={size} totalPages={totalPages} onChange={setPage}/>
                        </div>
                    </>
                )}
            </div>

            <Toast text={toast} onClose={()=>setToast('')} />
        </div>
    )
}

function Tag({ value }){
    const normalized = String(value || '').toUpperCase()
    const color = (normalized === 'SUCCESS' || normalized === 'COMPLETED') ? '#16a34a'
        : (normalized === 'FAILED') ? '#dc2626'
            : (normalized === 'IN_PROGRESS' || normalized === 'RUNNING') ? '#2563eb'
                : '#6b7280'
    const bg = color + '22'
    return <span style={{display:'inline-block', padding:'2px 8px', borderRadius:12, fontSize:12, background:bg, color}}>
    {value ?? '—'}
  </span>
}
