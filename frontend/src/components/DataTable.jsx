
import React from 'react'

export default function DataTable({columns, rows, sort, dir, onSort, rowActions}){
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={()=>onSort?.(col.key)}>
                {col.title} {sort===col.key ? (dir==='asc'?'▲':'▼') : ''}
              </th>
            ))}
            {rowActions && <th style={{width:120}}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id || JSON.stringify(row)}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {rowActions && <td className="row-actions">{rowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
