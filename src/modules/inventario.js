// src/modules/inventario.js
import { state, showToast } from '../state/globalState.js';

export async function cargarInventario() {
  // No-op en modo demo
}

export async function registrarEntradaInsumo(id_insumo, cantidad) {
  const insumo = state.inventario.find(i => i.id == id_insumo);
  if (!insumo) throw new Error('Insumo no encontrado');
  insumo.stock_actual = Number(insumo.stock_actual) + Number(cantidad);
}

export async function renderInventario() {
  // Formulario de entrada de insumos
  const form = `
    <form id="form-entrada-insumo" class="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-4 max-w-lg mx-auto">
      <div class="text-lg font-bold mb-2 text-slate-900">Registrar entrada de insumo</div>
      <div>
        <label class="block text-slate-700 mb-1">Insumo</label>
        <select name="id_insumo" class="w-full rounded border p-2" required>
          <option value="">Seleccione...</option>
          ${state.inventario.map(i=>`<option value="${i.id}">${i.nombre} (${i.unidad_medida})</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Cantidad</label>
        <input name="cantidad" type="number" min="0.01" step="0.01" class="w-full rounded border p-2" required>
      </div>
      <button type="submit" class="bg-slate-900 text-white rounded py-2 text-lg font-semibold hover:bg-slate-800">Registrar entrada</button>
    </form>
  `;
  // Tabla de inventario
  const tabla = `
    <div class="bg-white rounded-lg shadow p-4">
      <div class="text-lg font-bold mb-2 text-slate-900">Inventario actual</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-200">
            <tr>
              <th class="px-2 py-1 text-left">Insumo</th>
              <th class="px-2 py-1 text-left">Stock</th>
              <th class="px-2 py-1 text-left">Stock Seguridad</th>
              <th class="px-2 py-1 text-left">Unidad</th>
            </tr>
          </thead>
          <tbody>
            ${state.inventario.map(i=>`
              <tr class="${i.stock_actual <= i.stock_seguridad ? 'bg-red-100' : ''}">
                <td class="px-2 py-1">${i.nombre}</td>
                <td class="px-2 py-1">${i.stock_actual}</td>
                <td class="px-2 py-1">${i.stock_seguridad}</td>
                <td class="px-2 py-1">${i.unidad_medida}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('inventario-view').innerHTML = form + tabla;
  document.getElementById('form-entrada-insumo').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id_insumo = fd.get('id_insumo');
    const cantidad = parseFloat(fd.get('cantidad'));
    if (!id_insumo || isNaN(cantidad) || cantidad <= 0) return showToast('Datos inválidos', 'error');
    try {
      await registrarEntradaInsumo(id_insumo, cantidad);
      showToast('Entrada registrada', 'success');
      renderInventario();
      renderDashboard();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };
}

export function renderDashboard() {
  // KPIs
  const kpiCards = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div class="bg-slate-900 text-white rounded-lg p-6 flex flex-col items-center shadow">
        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor"><use href="#heroicon-o-clock"/></svg>
        <div class="text-lg font-bold">Optimización de Tiempo</div>
        <div class="text-2xl mt-2">${state.inventario.length} insumos</div>
        <div class="text-xs mt-1 text-slate-300">Inventario activo</div>
      </div>
      <div class="bg-slate-900 text-white rounded-lg p-6 flex flex-col items-center shadow">
        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor"><use href="#heroicon-o-document-check"/></svg>
        <div class="text-lg font-bold">0 Papel</div>
        <div class="text-2xl mt-2">${state.pedidos.length + state.mermas.length}</div>
        <div class="text-xs mt-1 text-slate-300">Transacciones demo</div>
      </div>
      <div class="bg-slate-900 text-white rounded-lg p-6 flex flex-col items-center shadow">
        <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor"><use href="#heroicon-o-database"/></svg>
        <div class="text-lg font-bold">Integridad</div>
        <div class="flex items-center mt-2">
          <span class="inline-block w-3 h-3 rounded-full mr-2 bg-green-400"></span>
          <span class="text-base">Demo</span>
        </div>
        <button disabled class="mt-3 px-3 py-1 bg-slate-700 rounded text-xs opacity-50 cursor-not-allowed">Sincronización</button>
      </div>
    </div>
  `;
  document.getElementById('dashboard-view').innerHTML = kpiCards;
  renderAlertas();
}

function renderAlertas() {
  const criticos = state.inventario.filter(i => i.stock_actual <= i.stock_seguridad);
  const alertasDiv = document.getElementById('alertas');
  if (criticos.length) {
    alertasDiv.innerHTML = `
      <div class="parpadea bg-red-600 text-white text-center py-2 font-bold text-lg rounded mb-2 shadow animate-pulse">
        <svg class="w-6 h-6 inline mr-2 align-middle" fill="none" stroke="currentColor"><use href="#heroicon-o-exclamation-triangle"/></svg>
        ¡Alerta crítica! Insumos en mínimo: ${criticos.map(i=>i.nombre).join(', ')}
      </div>
    `;
  } else {
    alertasDiv.innerHTML = '';
  }
}
