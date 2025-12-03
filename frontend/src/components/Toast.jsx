
import React from 'react'
export default function Toast({text, onClose}){
  if (!text) return null
  return <div className="toast">{text} <button className="btn" onClick={onClose} style={{marginLeft:8}}>OK</button></div>
}
