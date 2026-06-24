// src/ui/router.js
import { renderDashboard, renderInventario } from '../modules/inventario.js';
import { renderMermas } from '../modules/mermas.js';
import { renderPedidos } from '../modules/pedidos.js';

const views = ['dashboard', 'inventario', 'mermas', 'pedidos'];

export function switchView(view) {
  views.forEach(v => {
    document.getElementById(`${v}-view`).classList.toggle('hidden', v !== view);
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('bg-slate-800', btn.dataset.view === view);
  });
  if (view === 'dashboard') renderDashboard();
  if (view === 'inventario') renderInventario();
  if (view === 'mermas') renderMermas();
  if (view === 'pedidos') renderPedidos();
}

// Inicialización de navegación y vistas demo
window.addEventListener('DOMContentLoaded', () => {
  // Inicializa listeners solo si existen los botones
  const navBtns = document.querySelectorAll('.nav-btn');
  if (navBtns.length) {
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
  }
  // Siempre muestra el dashboard al cargar
  switchView('dashboard');
});
