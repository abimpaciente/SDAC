import { ProgramaJovenes } from '../../core/models';

export const PROGRAMA_JOVENES_MOCK: ProgramaJovenes = {
  id: '2026-09-26',
  iglesiaId: 'demo',
  fecha: '2026-09-26',
  partes: [
    { clave: 'servicioCanto', titulo: 'Servicio de canto', asignadoA: 'Daniela Soto' },
    { clave: 'sabiasQue', titulo: '¿Sabías que...?', asignadoA: null },
    { clave: 'ejercicioBiblico', titulo: 'Ejercicio bíblico', asignadoA: 'Jorge Ruiz' },
    { clave: 'temaReflexion', titulo: 'Tema o reflexión', asignadoA: 'Pastor Ismael Duarte' },
    { clave: 'despedida', titulo: 'Despedida', asignadoA: null },
  ],
};
