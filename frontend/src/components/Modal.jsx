
import React, { useEffect } from 'react'

export default function Modal({open, onClose, title, children, footer}){
  useEffect(()=>{
    function onKey(e){ if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  },[open, onClose])
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={(e)=>{ if(e.target===e.currentTarget) onClose?.() }}>
      <div className="modal">
        <h3>{title}</h3>
        <div style={{marginTop:8}}>{children}</div>
        {footer && <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>{footer}</div>}
      </div>
    </div>
  )
}
