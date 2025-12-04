import React, { useEffect, useState } from 'react'
import { listOrgs } from '../api/orgs'
import { listPersons } from '../api/persons'

const UNITS = ['PIECES','KILOGRAMS','LITERS','METERS','BOXES','SETS','PACKAGES']

export default function ProductForm({ value, onChange, submitTried=false, errors={} }) {
    const [orgs, setOrgs] = useState([])
    const [persons, setPersons] = useState([])

    useEffect(() => {
        listOrgs({ page:0, size:100 }).then(([e,d]) => { if (!e) setOrgs(d.items||[]) })
        listPersons({ page:0, size:100 }).then(([e,d]) => { if (!e) setPersons(d.items||[]) })
    }, [])

    function set(path, v) {
        const next = { ...value }
        const keys = path.split('.')
        let cur = next
        for (let i = 0; i < keys.length - 1; i++) {
            cur[keys[i]] = cur[keys[i]] || {}
            cur = cur[keys[i]]
        }
        cur[keys[keys.length - 1]] = v
        onChange?.(next)
    }

    const hasError = (name) => submitTried && errors[name]
    const mark = (name) => hasError(name) ? { borderColor: '#d33' } : {}
    const hint = (name) => hasError(name) ? <div className="muted" style={{ color:'#e66', fontSize:12, marginTop:4 }}>{errors[name]}</div> : null

    return (
        <div className="form-grid">
            <label>Название
                <input required value={value.name || ''} onChange={e=>set('name', e.target.value)} style={mark('name')} />
                {hint('name')}
            </label>

            <label>Ед. измерения
                <select required value={value.unitOfMeasure || ''} onChange={e=>set('unitOfMeasure', e.target.value || null)} style={mark('unitOfMeasure')}>
                    <option value="">— выбрать —</option>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {hint('unitOfMeasure')}
            </label>

            <label>Цена
                <input required type="number" min="1" value={value.price ?? ''} onChange={e=>set('price', e.target.value===''? null : Number(e.target.value))} style={mark('price')} />
                {hint('price')}
            </label>

            <label>Себестоимость
                <input required type="number" min="0" step="1" value={value.manufactureCost ?? ''} onChange={e=>set('manufactureCost', e.target.value===''? null : Number(e.target.value))} style={mark('manufactureCost')} />
                {hint('manufactureCost')}
            </label>

            <label>Рейтинг
                <input required type="number" min="1" value={value.rating ?? ''} onChange={e=>set('rating', e.target.value===''? null : Number(e.target.value))} style={mark('rating')} />
                {hint('rating')}
            </label>

            <label>Артикул (partNumber)
                <input required value={value.partNumber || ''} onChange={e=>set('partNumber', e.target.value)} style={mark('partNumber')} />
                {hint('partNumber')}
            </label>

            <label>Координата X
                <input required type="number" step="0.01" value={value.coordinates?.x ?? ''} onChange={e=>set('coordinates.x', e.target.value===''? null : Number(e.target.value))} style={mark('coordinates.x')} />
                {hint('coordinates.x')}
            </label>

            <label>Координата Y
                <input required type="number" step="1" value={value.coordinates?.y ?? ''} onChange={e=>set('coordinates.y', e.target.value===''? null : Number(e.target.value))} style={mark('coordinates.y')} />
                {hint('coordinates.y')}
            </label>

            <label>Производитель (организация)
                <select required value={value.manufacturer?.id ?? ''} onChange={e=>set('manufacturer.id', e.target.value ? Number(e.target.value) : null)} style={mark('manufacturer.id')}>
                    <option value="">— выбрать —</option>
                    {orgs.map(o => <option key={o.id} value={o.id}>{o.id} · {o.name}</option>)}
                </select>
                {hint('manufacturer.id')}
            </label>

            <label>Владелец (персона, опционально)
                <select
                    value={value.owner?.id ?? ''}
                    onChange={e=>{
                        const id = e.target.value ? Number(e.target.value) : null
                        onChange?.({ ...value, owner: id ? { id } : null })
                    }}
                >
                    <option value="">— без владельца —</option>
                    {persons.map(p => <option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}
                </select>
            </label>
        </div>
    )
}
