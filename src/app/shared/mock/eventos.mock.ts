import { Evento } from '../../core/models';

export const EVENTOS_MOCK: Evento[] = [
  {
    id: 'ev-1',
    iglesiaId: 'demo',
    titulo: 'Semana de oración',
    descripcion: 'Encuentros cada noche a las 7:00 pm en el templo.',
    fecha: '2026-09-27T19:00:00',
    lugar: 'Templo principal',
  },
  {
    id: 'ev-2',
    iglesiaId: 'demo',
    titulo: 'Almuerzo de compañerismo',
    descripcion: 'Después del culto divino, todos están invitados.',
    fecha: '2026-09-28T13:00:00',
    lugar: 'Salón social',
  },
  {
    id: 'ev-3',
    iglesiaId: 'demo',
    titulo: 'Ensayo del coro',
    descripcion: 'Preparación de música especial para el próximo sábado.',
    fecha: '2026-10-01T18:30:00',
    lugar: 'Sala de música',
  },
];
