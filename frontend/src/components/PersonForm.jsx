import React from 'react'

const DEPARTMENTS = ['SALES','LOGISTICS','FINANCE','IT','HR']
const COUNTRIES = ['RUSSIA','UNITED_KINGDOM','CHINA','USA','GERMANY','FRANCE','JAPAN','SOUTH_KOREA','INDIA','BRAZIL']

export default function PersonForm({ value, onChange, showErrors=false, errors={} }){
    const err = (k)=> showErrors && errors[k]
    const mark = (k)=> err(k) ? { borderColor:'#e55', boxShadow:'0 0 0 1px #e55 inset' } : null
    const hint = (k)=> err(k) && <div style={{color:'#e55', fontSize:12, marginTop:4}}>{errors[k]}</div>

    function set(k,v){ onChange?.({ ...value, [k]: v }) }
    function setLoc(k,v){ onChange?.({ ...value, location: { ...(value.location||{}), [k]: v } }) }

    return (
        <div className="form-grid">
            <label>ФИО
                <input required value={value.name || ''} onChange={e=>set('name', e.target.value)} style={mark('name')}/>
                {hint('name')}
            </label>

            <label>Страна
                <select required value={value.nationality || ''} onChange={e=>set('nationality', e.target.value || null)} style={mark('nationality')}>
                    <option value="">— выбрать —</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {hint('nationality')}
            </label>

            <label>Стаж (лет)
                <input required type="number" min="0.01" step="0.01"
                       value={value.height ?? ''} onChange={e=>set('height', e.target.value ? Number(e.target.value) : null)}
                       style={mark('height')}/>
                {hint('height')}
            </label>

            <label>Отдел
                <select value={value.eyeColor || ''} onChange={e=>set('eyeColor', e.target.value || null)}>
                    <option value="">— не задано —</option>
                    {DEPARTMENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </label>

            <label>Должность
                <select value={value.hairColor || ''} onChange={e=>set('hairColor', e.target.value || null)}>
                    <option value="">— не задано —</option>
                    {DEPARTMENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </label>

            <label>Офис (долгота)
                <input type="number" step="0.01"
                       value={value.location?.x ?? ''} onChange={e=>setLoc('x', e.target.value==='' ? null : Number(e.target.value))}
                       style={mark('locationX')}/>
                {hint('locationX')}
            </label>

            <label>Офис (широта)
                <input type="number" step="0.01"
                       value={value.location?.y ?? ''} onChange={e=>setLoc('y', e.target.value==='' ? null : Number(e.target.value))}
                       style={mark('locationY')}/>
                {hint('locationY')}
            </label>

            <label>Город офиса
                <input value={value.location?.name ?? ''} onChange={e=>setLoc('name', e.target.value)} style={mark('locationName')}/>
                {hint('locationName')}
            </label>
        </div>
    )
}
