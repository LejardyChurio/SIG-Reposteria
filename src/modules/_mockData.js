// src/modules/_mockData.js
export const mockInventario = [
  { id: 1, nombre: 'Harina', stock_actual: 10, stock_seguridad: 5, unidad_medida: 'kg' },
  { id: 2, nombre: 'Azúcar', stock_actual: 8, stock_seguridad: 3, unidad_medida: 'kg' },
  { id: 3, nombre: 'Huevos', stock_actual: 30, stock_seguridad: 12, unidad_medida: 'unid.' }
];

export const mockRecetas = [
  { id: 1, nombre: 'Torta Selva Negra', descripcion: 'Torta húmeda con crema y cerezas' },
  { id: 2, nombre: 'Torta de Chocolate', descripcion: 'Torta húmeda de cacao' },
  { id: 3, nombre: 'Cupcakes de Vainilla', descripcion: 'Cupcakes esponjosos con buttercream' },
  { id: 4, nombre: 'Cheesecake', descripcion: 'Cheesecake cremoso con base de galleta' }
];

export const mockMermas = [
  { id: 1, id_insumo: 1, cantidad_merma: 1, motivo_merma: 'vencimiento', timestamp: new Date().toISOString() }
];

export const mockPedidos = [
  { id: 1, cliente: 'Cliente Demo', recetaId: 1, cantidad: 2, estado: 'Pendiente', fecha_entrega: '2026-06-01', timestamp: new Date().toISOString() }
];
