// src/state/globalState.js
import { mockInventario, mockMermas, mockPedidos } from '../modules/_mockData.js';
export const state = {
  inventario: [...mockInventario],
  pedidos: [...mockPedidos],
  mermas: [...mockMermas],
  insumosMap: Object.fromEntries(mockInventario.map(i=>[i.id,i])),
  online: true,
  syncStatus: 'online',
  COLA_KEY: 'sig_cola_transacciones'
};

export function saveStateLocal() {
  localStorage.setItem('sig_state', JSON.stringify(state));
}

export function loadStateLocal() {
  const s = localStorage.getItem('sig_state');
  if (s) Object.assign(state, JSON.parse(s));
}

export function showToast(mensaje, tipo = 'info', duracion = 3500) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.className = `fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-sm font-semibold ` +
    (tipo === 'error' ? 'bg-red-600 text-white' : tipo === 'success' ? 'bg-green-600 text-white' : tipo === 'warn' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 text-white');
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, duracion);
}

// Cola offline
export function getCola() {
  return JSON.parse(localStorage.getItem(state.COLA_KEY) || '[]');
}
export function setCola(cola) {
  localStorage.setItem(state.COLA_KEY, JSON.stringify(cola));
}
export function agregarACola(tipo, datos) {
  const cola = getCola();
  cola.push({ tipo, datos, timestamp: new Date().toISOString() });
  setCola(cola);
  showToast('Modo Offline: datos guardados en el navegador', 'warn');
  state.syncStatus = 'offline';
}
