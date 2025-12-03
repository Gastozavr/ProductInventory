import React from 'react'

export default function OrgForm({ value, onChange, showErrors = false }) {
    const set = (k, v) => onChange?.({ ...value, [k]: v })

    const setAddr = (addrKey, patch) =>
        onChange?.({
            ...value,
            [addrKey]: { ...(value[addrKey] || { zipCode: '', town: { x: null, y: null, name: '' } }), ...patch }
        })

    const setTown = (addrKey, field, v) =>
        onChange?.({
            ...value,
            [addrKey]: {
                ...(value[addrKey] || {}),
                town: { ...((value[addrKey] && value[addrKey].town) || {}), [field]: v }
            }
        })

    const isBlank = (s) => s == null || String(s).trim() === ''
    const isNumber = (v) => typeof v === 'number' && Number.isFinite(v)
    const numOrNull = (s) => (s === '' ? null : Number(s))

    const oa = value.officialAddress || { zipCode: '', town: { x: null, y: null, name: '' } }
    const pa = value.postalAddress  || { zipCode: '', town: { x: null, y: null, name: '' } }

    const errors = {
        name: isBlank(value.name) ? 'Обязательное поле' : null,

        annualTurnover:
            value.annualTurnover == null ? 'Укажите число' :
                !isNumber(value.annualTurnover) ? 'Некорректное число' :
                    value.annualTurnover <= 0 ? 'Должно быть > 0' : null,

        employeesCount:
            value.employeesCount == null ? 'Укажите число' :
                !isNumber(value.employeesCount) ? 'Некорректное число' :
                    value.employeesCount < 1 ? 'Минимум 1' : null,

        fullName: null,

        rating:
            value.rating == null ? 'Укажите число' :
                !isNumber(value.rating) ? 'Некорректное число' :
                    value.rating < 1 ? 'Минимум 1' : null,

        officialZip: isBlank(oa.zipCode) ? 'Обязательное поле' : null,
        officialX: oa.town?.x == null ? 'Обязательное поле' : (!isNumber(oa.town?.x) ? 'Некорректное число' : null),
        officialY: oa.town?.y == null ? 'Обязательное поле' : (!isNumber(oa.town?.y) ? 'Некорректное число' : null),
        officialName: isBlank(oa.town?.name) ? 'Обязательное поле' : null,

        postalZip: isBlank(pa.zipCode) ? 'Обязательное поле' : null,
        postalX: pa.town?.x == null ? 'Обязательное поле' : (!isNumber(pa.town?.x) ? 'Некорректное число' : null),
        postalY: pa.town?.y == null ? 'Обязательное поле' : (!isNumber(pa.town?.y) ? 'Некорректное число' : null),
        postalName: isBlank(pa.town?.name) ? 'Обязательное поле' : null,
    }

    const errStyle = (has) => (showErrors && has) ? { borderColor: 'crimson', outlineColor: 'crimson' } : undefined
    const Err = ({msg}) => (showErrors && msg) ? <div style={{color:'crimson', fontSize:12, marginTop:4}}>{msg}</div> : null

    return (
        <div className="form-grid">
            <label>Короткое имя
                <input
                    required
                    value={value.name || ''}
                    onChange={e => set('name', e.target.value)}
                    aria-invalid={showErrors && !!errors.name}
                    style={errStyle(errors.name)}
                />
                <Err msg={errors.name}/>
            </label>

            <label>Годовой оборот
                <input
                    required type="number" min="0.01" step="0.01"
                    value={value.annualTurnover ?? ''}
                    onChange={e => set('annualTurnover', numOrNull(e.target.value))}
                    aria-invalid={showErrors && !!errors.annualTurnover}
                    style={errStyle(errors.annualTurnover)}
                />
                <Err msg={errors.annualTurnover}/>
            </label>

            <label>Число сотрудников
                <input
                    required type="number" min="1" step="1"
                    value={value.employeesCount ?? ''}
                    onChange={e => set('employeesCount', numOrNull(e.target.value))}
                    aria-invalid={showErrors && !!errors.employeesCount}
                    style={errStyle(errors.employeesCount)}
                />
                <Err msg={errors.employeesCount}/>
            </label>

            <label>Полное имя (опц.)
                <input
                    value={value.fullName || ''}
                    onChange={e => set('fullName', e.target.value)}
                />
            </label>

            <label>Рейтинг
                <input
                    required type="number" min="1" step="1"
                    value={value.rating ?? ''}
                    onChange={e => set('rating', numOrNull(e.target.value))}
                    aria-invalid={showErrors && !!errors.rating}
                    style={errStyle(errors.rating)}
                />
                <Err msg={errors.rating}/>
            </label>


            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <div className="muted" style={{ marginBottom: 6 }}>Официальный адрес</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                    <label>Почтовый индекс
                        <input
                            required
                            value={oa.zipCode || ''}
                            onChange={e => setAddr('officialAddress', { zipCode: e.target.value })}
                            aria-invalid={showErrors && !!errors.officialZip}
                            style={errStyle(errors.officialZip)}
                        />
                        <Err msg={errors.officialZip}/>
                    </label>
                    <label>Город X
                        <input
                            required type="number" step="0.01"
                            value={oa.town?.x ?? ''}
                            onChange={e => setTown('officialAddress', 'x', numOrNull(e.target.value))}
                            aria-invalid={showErrors && !!errors.officialX}
                            style={errStyle(errors.officialX)}
                        />
                        <Err msg={errors.officialX}/>
                    </label>
                    <label>Город Y
                        <input
                            required type="number" step="0.01"
                            value={oa.town?.y ?? ''}
                            onChange={e => setTown('officialAddress', 'y', numOrNull(e.target.value))}
                            aria-invalid={showErrors && !!errors.officialY}
                            style={errStyle(errors.officialY)}
                        />
                        <Err msg={errors.officialY}/>
                    </label>
                    <label>Город (имя)
                        <input
                            required
                            value={oa.town?.name || ''}
                            onChange={e => setTown('officialAddress', 'name', e.target.value)}
                            aria-invalid={showErrors && !!errors.officialName}
                            style={errStyle(errors.officialName)}
                        />
                        <Err msg={errors.officialName}/>
                    </label>
                </div>
            </div>

            {/* Почтовый адрес */}
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <div className="muted" style={{ marginBottom: 6 }}>Почтовый адрес</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                    <label>Почтовый индекс
                        <input
                            required
                            value={pa.zipCode || ''}
                            onChange={e => setAddr('postalAddress', { zipCode: e.target.value })}
                            aria-invalid={showErrors && !!errors.postalZip}
                            style={errStyle(errors.postalZip)}
                        />
                        <Err msg={errors.postalZip}/>
                    </label>
                    <label>Город X
                        <input
                            required type="number" step="0.01"
                            value={pa.town?.x ?? ''}
                            onChange={e => setTown('postalAddress', 'x', numOrNull(e.target.value))}
                            aria-invalid={showErrors && !!errors.postalX}
                            style={errStyle(errors.postalX)}
                        />
                        <Err msg={errors.postalX}/>
                    </label>
                    <label>Город Y
                        <input
                            required type="number" step="0.01"
                            value={pa.town?.y ?? ''}
                            onChange={e => setTown('postalAddress', 'y', numOrNull(e.target.value))}
                            aria-invalid={showErrors && !!errors.postalY}
                            style={errStyle(errors.postalY)}
                        />
                        <Err msg={errors.postalY}/>
                    </label>
                    <label>Город (имя)
                        <input
                            required
                            value={pa.town?.name || ''}
                            onChange={e => setTown('postalAddress', 'name', e.target.value)}
                            aria-invalid={showErrors && !!errors.postalName}
                            style={errStyle(errors.postalName)}
                        />
                        <Err msg={errors.postalName}/>
                    </label>
                </div>
            </div>
        </div>
    )
}
