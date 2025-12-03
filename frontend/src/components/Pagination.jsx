
import React from 'react'
export default function Pagination({page, size, totalPages, onChange}){
  const go = (p)=> onChange?.(Math.max(0, Math.min(totalPages-1, p)))
  return (
    <div className="pagination">
      <span className="pill">Стр. {page+1} / {Math.max(1,totalPages)}</span>
      <button className="btn" onClick={()=>go(0)} disabled={page<=0}>« Первая</button>
      <button className="btn" onClick={()=>go(page-1)} disabled={page<=0}>‹ Назад</button>
      <button className="btn" onClick={()=>go(page+1)} disabled={page>=totalPages-1}>Вперёд ›</button>
      <button className="btn" onClick={()=>go(totalPages-1)} disabled={page>=totalPages-1}>Последняя »</button>
    </div>
  )
}
