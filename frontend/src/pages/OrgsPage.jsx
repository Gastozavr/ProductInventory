import React, { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import Modal from '../components/Modal.jsx'
import Toast from '../components/Toast.jsx'
import { bus } from '../api/client.js'
import { listOrgs, getOrg, createOrg, updateOrg, deleteOrg } from '../api/orgs.js'
import OrgForm from '../components/OrgForm.jsx'
import { subscribeWS } from '../api/ws.js'

const empty = () => ({
    name:'', annualTurnover:null, employeesCount:null, fullName:'', rating:null,
    officialAddress: { zipCode:'', town: { x:null, y:null, name:'' } },
    postalAddress:  { zipCode:'', town: { x:null, y:null, name:'' } }
})

function validateOrganization(v){
    const isBlank = (s) => s == null || String(s).trim() === ''
    const isNum = (n) => typeof n === 'number' && Number.isFinite(n)
    const oa = v.officialAddress || { zipCode:'', town:{} }
    const pa = v.postalAddress  || { zipCode:'', town:{} }

    const errs = []
    if (isBlank(v.name)) errs.push('name')
    if (!(isNum(v.annualTurnover) && v.annualTurnover > 0)) errs.push('annualTurnover')
    if (!(isNum(v.employeesCount) && v.employeesCount >= 1)) errs.push('employeesCount')
    if (!(isNum(v.rating) && v.rating >= 1)) errs.push('rating')

    if (isBlank(oa.zipCode)) errs.push('official.zip')
    if (!isNum(oa.town?.x)) errs.push('official.x')
    if (!isNum(oa.town?.y)) errs.push('official.y')
    if (isBlank(oa.town?.name)) errs.push('official.name')

    if (isBlank(pa.zipCode)) errs.push('postal.zip')
    if (!isNum(pa.town?.x)) errs.push('postal.x')
    if (!isNum(pa.town?.y)) errs.push('postal.y')
    if (isBlank(pa.town?.name)) errs.push('postal.name')

    return { hasErrors: errs.length > 0, fields: errs }
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

export default function OrgsPage(){
    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(5)
    const [sort, setSort] = useState('id')
    const [dir, setDir] = useState('asc')
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({ name:'', officialTownName:'', postalTownName:'' })
    const [view, setView] = useState(null)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(empty())
    const [toast, setToast] = useState('')
    const [showErrors, setShowErrors] = useState(false)

    const columns = useMemo(()=>[
        { key:'id', title:'ID' },
        { key:'name', title:'Имя' },
        { key:'employeesCount', title:'Сотрудники' },
        { key:'annualTurnover', title:'Оборот' },
        { key:'rating', title:'Рейтинг' },
        { key:'officialCity', title:'Оф. город', render:(_,row)=> row.officialAddress?.town?.name ?? '—' },
        { key:'postalCity', title:'Почт. город', render:(_,row)=> row.postalAddress?.town?.name ?? '—' },
    ],[])

    function load(){
        listOrgs({page,size,sort,dir,filters}).then(([err, data])=>{
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
            if ([
                'org:changed','org:deleted','org:created',
                'organization:changed','organization:deleted','organization:created'
            ].includes(t)) load()
        })
        return ()=> { if (typeof off === 'function') off() }
    },[])

    useEffect(()=>{
        const off = subscribeWS((msg)=>{
            const entity = msg?.entity ?? msg?.type
            const action = msg?.action ?? msg?.event
            if (entity === 'organization' && ['created','updated','deleted'].includes(action)) {
                load()
            }
        })
        return off
    }, [page,size,sort,dir, JSON.stringify(filters)])

    function onSort(col){
        if (sort===col) setDir(d=>d==='asc'?'desc':'asc'); else { setSort(col); setDir('asc') }
    }

    function openCreate(){
        setForm(empty())
        setEditId('create')
        setShowErrors(false)
    }

    function openEdit(row){
        setEditId(row.id)
        setForm({
            name: row.name ?? '',
            annualTurnover: row.annualTurnover ?? null,
            employeesCount: row.employeesCount ?? null,
            fullName: row.fullName ?? '',
            rating: row.rating ?? null,
            officialAddress: row.officialAddress ?? { zipCode:'', town:{ x:null, y:null, name:'' } },
            postalAddress:  row.postalAddress  ?? { zipCode:'', town:{ x:null, y:null, name:'' } },
        })
        setShowErrors(false)
    }

    async function save(){
        setShowErrors(true)
        const { hasErrors } = validateOrganization(form)
        if (hasErrors){
            setToast('Исправьте ошибки в форме перед сохранением')
            return
        }

        const payload = {...form}
        const [err] = (editId==='create')
            ? await createOrg(payload)
            : await updateOrg(editId, payload)

        if (err){
            setToast(extractServerError(err))
            return
        }

        setEditId(null)
        setShowErrors(false)
        load()
        bus.emit?.('org:changed')
    }

    async function remove(row){
        if (!confirm('Удалить организацию #'+row.id+'?')) return
        const [err] = await deleteOrg(row.id)
        if (err){
            setToast(extractServerError(err))
            return
        }
        load()
        bus.emit?.('org:deleted')
    }

    return (
        <div>
            <div className="toolbar" style={{display:'flex',alignItems:'center',gap:6,flexWrap:'nowrap',overflowX:'auto',padding:4}}>
                {(() => {
                    const inputStyle = { width: 140, padding: '6px 8px' }
                    const selectStyle = { width: 90, padding: '6px 8px' }
                    return (
                        <>
                            <input style={inputStyle} placeholder="Имя" value={filters.name}
                                   onChange={e=>{ setFilters({...filters, name: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Оф. город" value={filters.officialTownName}
                                   onChange={e=>{ setFilters({...filters, officialTownName: e.target.value}); setPage(0) }}/>
                            <input style={inputStyle} placeholder="Почт. город" value={filters.postalTownName}
                                   onChange={e=>{ setFilters({...filters, postalTownName: e.target.value}); setPage(0) }}/>
                            <button className="btn" style={{ padding:'6px 10px' }}
                                    onClick={()=>{ setFilters({ name:'', officialTownName:'', postalTownName:'' }); setPage(0); setSort('id'); setDir('asc') }}>
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
                title={view ? ('Организация #'+view) : ''}
                footer={<button className="btn" onClick={()=>setView(null)}>Закрыть</button>}
            >
                <OrgDetails id={view}/>
            </Modal>

            <Modal
                open={!!editId}
                onClose={()=>{ setEditId(null); setShowErrors(false) }}
                title={editId==='create' ? 'Создать организацию' : 'Изменить организацию'}
                footer={
                    <>
                        <button className="btn" onClick={()=>{ setEditId(null); setShowErrors(false) }}>Отмена</button>
                        <button className="btn primary" onClick={save}>Сохранить</button>
                    </>
                }
            >
                <OrgForm value={form} onChange={setForm} showErrors={showErrors}/>
            </Modal>

            <Toast text={toast} onClose={()=>setToast('')} />
        </div>
    )
}

function OrgDetails({id}){
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(()=>{
        if (!id) return
        getOrg(id).then(([e,d])=>{
            if (e){
                setError(extractServerError(e))
            } else {
                setError(null)
                setData(d)
            }
        })
    },[id])

    if (!id) return null
    if (error) return <div className="card">{error}</div>
    if (!data) return <div className="card">Загрузка…</div>

    const oa = data.officialAddress || {}
    const oTown = oa.town || {}
    const pa = data.postalAddress || {}
    const pTown = pa.town || {}

    return (
        <div className="card">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:12}}>
                <Field label="Имя" value={data.name}/>
                <Field label="Полное имя" value={data.fullName}/>
                <Field label="Сотрудники" value={data.employeesCount}/>
                <Field label="Оборот" value={data.annualTurnover}/>
                <Field label="Рейтинг" value={data.rating}/>

                <div style={{gridColumn:'1 / -1', marginTop:8}}>
                    <div className="muted" style={{marginBottom:6}}>Официальный адрес</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
                        <Field label="Индекс" value={oa.zipCode}/>
                        <Field label="Город X" value={oTown.x}/>
                        <Field label="Город Y" value={oTown.y}/>
                        <Field label="Город" value={oTown.name}/>
                    </div>
                </div>

                <div style={{gridColumn:'1 / -1', marginTop:8}}>
                    <div className="muted" style={{marginBottom:6}}>Почтовый адрес</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
                        <Field label="Индекс" value={pa.zipCode}/>
                        <Field label="Город X" value={pTown.x}/>
                        <Field label="Город Y" value={pTown.y}/>
                        <Field label="Город" value={pTown.name}/>
                    </div>
                </div>
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
