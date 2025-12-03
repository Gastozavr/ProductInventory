
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

export const api = axios.create({
  baseURL,
  timeout: 15000
})

function extractMessage(err){
  if (err.response?.data?.message) return err.response.data.message
  if (typeof err.response?.data === 'string') return err.response.data
  return err.message || 'Ошибка запроса'
}

export function withErrors(promise){
  return promise.then(r => [null, r.data]).catch(err => [extractMessage(err), null])
}

export const bus = (() => {
  const ch = (window.BroadcastChannel) ? new BroadcastChannel('IS-lab1 409914') : null
  const subs = new Set()
  const api = {
    on(fn){ subs.add(fn); return () => subs.delete(fn) },
    emit(type, payload){ subs.forEach(fn => fn(type, payload)); if (ch) ch.postMessage({type, payload}) }
  }
  if (ch){ ch.onmessage = (e) => subs.forEach(fn => fn(e.data.type, e.data.payload)) }
  return api
})()
