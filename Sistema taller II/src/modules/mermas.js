// src/modules/mermas.js
import { state, showToast } from '../state/globalState.js';

export async function cargarMermas() {
  // No-op en modo demo
}

export async function registrarMermaSupabase(datos) {
  state.mermas.push({ ...datos, id: state.mermas.length + 1 });
  const insumo = state.inventario.find(i=>i.id==datos.id_insumo);
  if (!insumo) throw new Error('Insumo no encontrado');
  insumo.stock_actual = Math.max(0, insumo.stock_actual - datos.cantidad_merma);
}

export async function renderMermas() {
  const form = `
    <form id="form-merma" class="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-4 max-w-lg mx-auto">
      <div class="text-lg font-bold mb-2 text-slate-900">Registrar merma</div>
      <div>
        <label class="block text-slate-700 mb-1">Insumo</label>
        <select name="id_insumo" class="w-full rounded border p-2" required>
          <option value="">Seleccione...</option>
          ${state.inventario.map(i=>`<option value="${i.id}">${i.nombre} (${i.unidad_medida})</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Cantidad</label>
        <input name="cantidad_merma" type="number" min="0.01" step="0.01" class="w-full rounded border p-2" required>
      </div>
      <div>
        <label class="block text-slate-700 mb-1">Motivo</label>
        <select name="motivo_merma" class="w-full rounded border p-2" required>
          <option value="">Seleccione...</option>
          <option value="vencimiento">Vencimiento</option>
          <option value="daño operativo">Daño operativo</option>
          <option value="excedente">Excedente</option>
        </select>
      </div>
      <button type="submit" class="bg-slate-900 text-white rounded py-2 text-lg font-semibold hover:bg-slate-800">Registrar merma</button>
    </form>
  `;
  // Listado de mermas recientes
  const listado = `
    <div class="bg-white rounded-lg shadow p-4">
      <div class="text-lg font-bold mb-2 text-slate-900">Mermas recientes</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-200">
            <tr>
              <th class="px-2 py-1 text-left">Insumo</th>
              <th class="px-2 py-1 text-left">Cantidad</th>
              <th class="px-2 py-1 text-left">Motivo</th>
              <th class="px-2 py-1 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${state.mermas.slice(-10).reverse().map(m=>`
              <tr>
                <td class="px-2 py-1">${state.insumosMap[m.id_insumo]?.nombre || m.id_insumo}</td>
                <td class="px-2 py-1">${m.cantidad_merma}</td>
                <td class="px-2 py-1">${m.motivo_merma}</td>
                <td class="px-2 py-1">${new Date(m.timestamp).toLocaleString('es-VE')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('mermas-view').innerHTML = form + listado;
  document.getElementById('form-merma').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const datos = {
      id_insumo: fd.get('id_insumo'),
      cantidad_merma: parseFloat(fd.get('cantidad_merma')),
      motivo_merma: fd.get('motivo_merma'),
      timestamp: new Date().toISOString()
    };
    if (!datos.id_insumo || isNaN(datos.cantidad_merma) || !datos.motivo_merma) return showToast('Datos inválidos', 'error');
    try {
      await registrarMermaSupabase(datos);
      showToast('Merma registrada', 'success');
      renderMermas();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };
}
