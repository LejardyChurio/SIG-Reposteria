// src/modules/pedidos.js
import { state, showToast } from '../state/globalState.js';

export async function cargarPedidos() {
  // No-op en modo demo
}

export async function registrarPedidoSupabase(datos) {
  state.pedidos.push({ ...datos, id: state.pedidos.length + 1 });
}

export async function marcarEntregado(id) {
  const pedido = state.pedidos.find(p => p.id == id);
  if (pedido) pedido.estado = 'Entregado';
}

export async function renderPedidos() {
  const form = `
    <form id="form-pedido" class="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-4 max-w-lg mx-auto">
      <div class="text-lg font-bold mb-2 text-slate-900">Registrar pedido</div>
      <div>
        <label class="block text-slate-700 mb-1">Cliente</label>
        <input name="cliente" type="text" class="w-full rounded border p-2" required>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Receta</label>
        <input name="receta_nombre" type="text" class="w-full rounded border p-2" required>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Cantidad</label>
        <input name="cantidad" type="number" min="1" step="1" class="w-full rounded border p-2" required>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Fecha de entrega</label>
        <input name="fecha_entrega" type="date" class="w-full rounded border p-2" required>
      </div>
      <button type="submit" class="bg-slate-900 text-white rounded py-2 text-lg font-semibold hover:bg-slate-800">Registrar pedido</button>
    </form>
  `;
  // Listado de pedidos pendientes
  const listado = `
    <div class="bg-white rounded-lg shadow p-4">
      <div class="text-lg font-bold mb-2 text-slate-900">Pedidos pendientes</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-200">
            <tr>
              <th class="px-2 py-1 text-left">Cliente</th>
              <th class="px-2 py-1 text-left">Receta</th>
              <th class="px-2 py-1 text-left">Cantidad</th>
              <th class="px-2 py-1 text-left">Entrega</th>
              <th class="px-2 py-1 text-left">Estado</th>
              <th class="px-2 py-1 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${state.pedidos.filter(p=>p.estado==='Pendiente').sort((a,b)=>a.fecha_entrega.localeCompare(b.fecha_entrega)).map(p=>`
              <tr>
                <td class="px-2 py-1">${p.cliente}</td>
                <td class="px-2 py-1">${p.receta_nombre}</td>
                <td class="px-2 py-1">${p.cantidad}</td>
                <td class="px-2 py-1">${p.fecha_entrega}</td>
                <td class="px-2 py-1">${p.estado}</td>
                <td class="px-2 py-1">
                  <button class="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 text-xs" onclick="window._marcarEntregado(${p.id})">Entregado</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('pedidos-view').innerHTML = form + listado;
  document.getElementById('form-pedido').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const datos = {
      cliente: fd.get('cliente'),
      receta_nombre: fd.get('receta_nombre'),
      cantidad: parseInt(fd.get('cantidad')),
      estado: 'Pendiente',
      fecha_entrega: fd.get('fecha_entrega'),
      timestamp: new Date().toISOString()
    };
    if (!datos.cliente || !datos.receta_nombre || isNaN(datos.cantidad) || !datos.fecha_entrega) return showToast('Datos inválidos', 'error');
    try {
      await registrarPedidoSupabase(datos);
      showToast('Pedido registrado', 'success');
      renderPedidos();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };
  // Exponer función para botones
  window._marcarEntregado = async function(id) {
    await marcarEntregado(id);
    renderPedidos();
  };
}
