import React, { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import Modal from '../components/Modal.jsx'
import Toast from '../components/Toast.jsx'
import { bus } from '../api/client.js'
import { listPersons, getPerson, createPerson, updatePerson, deletePerson } from '../api/persons.js'
import PersonForm from '../components/PersonForm.jsx'
import { subscribeWS } from '../api/ws.js'

const empty = () => ({
    name: '',
    eyeColor: '',
    hairColor: '',
    height: null,
    nationality: '',
    location: { x: null, y: null, name: '' }
})

function validatePerson(v){
    const e = {}
    if (!v.name?.trim()) e.name = 'Обязательное поле'
    if (!(v.height > 0)) e.height = 'Укажите число'
    if (!v.nationality) e.nationality = 'Обязательное поле'
    const loc = v.location || {}
    const any = loc.x != null || loc.y != null || (loc.name && loc.name.trim() !== '')
    if (any){
        if (loc.x == null) e.locationX = 'Обязательное поле'
        if (loc.y == null) e.locationY = 'Обязательное поле'
        if (!loc.name?.trim()) e.locationName = 'Обязательное поле'
    }
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

export default function PersonsPage(){
    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(5)
    const [sort, setSort] = useState('id')
    const [dir, setDir] = useState('asc')
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({ name:'', nationality:'', eyeColor:'', hairColor:'', locationName:'' })
    const [view, setView] = useState(null)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(empty())
    const [toast, setToast] = useState('')

    const [submitTried, setSubmitTried] = useState(false)
    const [errors, setErrors] = useState({})

    const columns = useMemo(()=>[
        { key:'id', title:'ID' },
        { key:'name', title:'Имя' },
        { key:'nationality', title:'Гражданство' },
        { key:'height', title:'Рост' },
        { key:'eyeColor', title:'Глаза' },
        { key:'hairColor', title:'Волосы' },
        { key:'locationName', title:'Локация', render:(v,row)=> v ?? `(${row.locationX ?? '–'}, ${row.locationY ?? '–'})` },
    ],[])

    function load(){
        listPersons({ page, size, sort, dir, filters }).then(([err, data])=>{
            if (err){
                setToast(extractServerError(err))
                return
            }
            setItems(data.items || [])
            setTotalPages(data.totalPages || 1)
        })
    }

    useEffect(load, [page,size,sort,dir, JSON.stringify(filters)])

    useEffect(()=>{
        const off = bus.on?.((t)=>{
            if(['person:changed','person:deleted','person:created'].includes(t)) load()
        })
        return ()=> { if (typeof off === 'function') off() }
    },[])

    useEffect(()=>{
        const off = subscribeWS((msg)=>{
            const entity = msg?.entity ?? msg?.type
            const action = msg?.action ?? msg?.event
            if (entity === 'person' && ['created','updated','deleted'].includes(action)) load()
        })
        return off
    }, [page,size,sort,dir, JSON.stringify(filters)])

    function onSort(col){
        if (sort===col) setDir(d=>d==='asc'?'desc':'asc')
        else { setSort(col); setDir('asc') }
    }

    function openCreate(){
        setForm(empty())
        setEditId('create')
        setSubmitTried(false)
        setErrors({})
    }

    function openEdit(row){
        setEditId(row.id)
        setSubmitTried(false)
        setErrors({})
        setForm({
            name: row.name ?? '',
            eyeColor: row.eyeColor ?? '',
            hairColor: row.hairColor ?? '',
            height: row.height ?? null,
            nationality: row.nationality ?? '',
            location: {
                x: row.locationX ?? row.location?.x ?? null,
                y: row.locationY ?? row.location?.y ?? null,
                name: row.locationName ?? row.location?.name ?? ''
            }
        })
    }

    async function save(){
        setSubmitTried(true)
        const errs = validatePerson(form)
        setErrors(errs)
        if (Object.keys(errs).length){
            setToast('Исправьте ошибки в форме перед сохранением')
            return
        }

        const payload = { ...form }
        const [err] = (editId==='create')
            ? await createPerson(payload)
            : await updatePerson(editId, payload)

        if (err){
            setToast(extractServerError(err))
            return
        }

        setEditId(null)
        load()
        bus.emit?.('person:changed')
    }

    async function remove(row){
        if (!confirm('Удалить персону #'+row.id+'?')) return
        const [err] = await deletePerson(row.id)
        if (err){
            setToast(extractServerError(err))
            return
        }
        load()
        bus.emit?.('person:deleted')
    }

    return (
        <div>
            <div className="toolbar" style={{display:'flex',alignItems:'center',gap:6,flexWrap:'nowrap',overflowX:'auto',padding:4}}>
                {(() => {
                    const inputStyle = { width: 130, padding: '6px 8px' }
                    const selectStyle = { width: 90, padding: '6px 8px' }
                    return (
                        <>
                            <input style={inputStyle} placeholder="Имя" value={filters.name}
                                   onChange={e=>{ setFilters({...filters, name: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Гражд." value={filters.nationality}
                                   onChange={e=>{ setFilters({...filters, nationality: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Глаза" value={filters.eyeColor}
                                   onChange={e=>{ setFilters({...filters, eyeColor: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Волосы" value={filters.hairColor}
                                   onChange={e=>{ setFilters({...filters, hairColor: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Локация" value={filters.locationName}
                                   onChange={e=>{ setFilters({...filters, locationName: e.target.value}); setPage(0) }}/>
                            <button className="btn" style={{ padding:'6px 10px' }}
                                    onClick={()=>{ setFilters({ name:'', nationality:'', eyeColor:'', hairColor:'', locationName:'' }); setPage(0) }}>
                                Сброс
                            </button>
                            <span style={{ flex:1 }} />
                            <select style={selectStyle} value={size} onChange={e=>{ setSize(Number(e.target.value)); setPage(0) }}>
                                {[5,10,20,50].map(n=><option key={n} value={n}>{n}/стр</option>)}
                            </select>
                            <button className="btn primary" style={{ whiteSpace:'nowrap', padding:'6px 10px' }} onClick={openCreate}>
                                + Создать
                            </button>
                        </>
                    )
                })()}
            </div>

            <DataTable
                columns={columns}
                rows={items}
                sort={sort}
                dir={dir}
                onSort={onSort}
                rowActions={(row)=>(
                    <>
                        <button className="btn" onClick={()=>setView(row.id)}>Открыть</button>
                        <button className="btn" onClick={()=>openEdit(row)}>Изменить</button>
                        <button className="btn danger" onClick={()=>remove(row)}>Удалить</button>
                    </>
                )}
            />

            <Pagination page={page} size={size} totalPages={totalPages} onChange={setPage} />

            <Modal
                open={!!view}
                onClose={()=>setView(null)}
                title={view ? ('Персона #'+view) : ''}
                footer={<button className="btn" onClick={()=>setView(null)}>Закрыть</button>}
            >
                <PersonDetails id={view}/>
            </Modal>

            <Modal
                open={!!editId}
                onClose={()=>setEditId(null)}
                title={editId==='create' ? 'Создать персону' : 'Изменить персону'}
                footer={
                    <>
                        <button className="btn" onClick={()=>setEditId(null)}>Отмена</button>
                        <button className="btn primary" onClick={save}>Сохранить</button>
                    </>
                }
            >
                <PersonForm value={form} onChange={setForm} showErrors={submitTried} errors={errors}/>
            </Modal>

            <Toast text={toast} onClose={()=>setToast('')} />
        </div>
    )
}

function PersonDetails({ id }){
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(()=>{
        if (!id) return
        getPerson(id).then(([e,d])=>{
            if (e){
                setError(extractServerError(e))
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
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:12}}>
                <Field label="Имя" value={data.name}/>
                <Field label="Глаза" value={data.eyeColor}/>
                <Field label="Волосы" value={data.hairColor}/>
                <Field label="Рост" value={data.height}/>
                <Field label="Гражданство" value={data.nationality}/>
                <Field label="Локация" value={data.locationName}/>
                <Field label="Локация X" value={data.locationX}/>
                <Field label="Локация Y" value={data.locationY}/>
            </div>
        </div>
    )
}

function Field({label, value}){
    return (
        <div>
            <div className="muted">{label}</div>
            <div>{value ?? '—'}</div>
        </div>
    )
}
