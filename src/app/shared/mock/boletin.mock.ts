import { AnuncioBoletin, Boletin, ParteBoletin } from '../../core/models';

function parte(titulo: string, orden: number, valor = '', asignadoA: string | null = null): ParteBoletin {
  return { titulo, orden, valor, asignadoA };
}

export const BOLETIN_MOCK: Boletin = {
  id: '2026-09-26',
  iglesiaId: 'demo',
  fecha: '2026-09-26',
  publicado: false,
  escuelaSabatica: {
    alabanzas: parte('Alabanzas', 1, '', 'Ana Torres'),
    bienvenida: parte('Bienvenida', 2, 'Palabras de bienvenida a visitas', 'Carlos Peña'),
    himnoInicial: parte('Himno inicial', 3, 'Himno 5 — "Santo, Santo, Santo"'),
    lecturaBiblica: parte('Lectura bíblica', 4, 'Salmo 100', 'Carlos Peña'),
    oracion: parte('Oración', 5),
    divisionClases: [
      parte('Clase 1', 6, '', 'María Gómez'),
      parte('Clase 2', 7, '', 'Jorge Ruiz'),
      parte('Clase de visitas', 8),
      parte('Clase de jóvenes', 9, '', 'Daniela Soto'),
    ],
    elMisionero: parte('El Misionero', 10, 'Reporte de la sección infantil'),
    musicaEspecial: parte('Música especial', 11),
    himnoFinal: parte('Himno final', 12, 'Himno 240 — "Firmes y Adelante"'),
    oracionFinal: parte('Oración final', 13, '', 'Pastor Ismael Duarte'),
  },
  culto: {
    anuncios: parte('Anuncios', 1, '', 'Comunicaciones'),
    intro: parte('Intro', 2),
    alabanzas: parte('Alabanzas', 3, '', 'Grupo de alabanza'),
    doxologia: parte('Doxología', 4),
    bienvenida: parte('Bienvenida', 5, '', 'Carlos Peña'),
    himnoInicial: parte('Himno inicial', 6, 'Himno 13 — "Oh, Cuán Grande Es Él"'),
    lecturaBiblica: parte('Lectura bíblica', 7, 'Romanos 8:28'),
    rinconDeOracion: parte('Rincón de oración', 8),
    video: parte('Video', 9),
    diezmosYOfrendas: parte('Diezmos y ofrendas', 10, '', 'Roberto Díaz'),
    temaSermon: parte('Tema / sermón', 11, '"La esperanza que no falla"', 'Pastor Ismael Duarte'),
    himnoFinal: parte('Himno final', 12),
    oracionFinal: parte('Oración final', 13),
    musicaDeFondo: parte('Música de fondo', 14, '', 'Grupo de alabanza'),
  },
  anuncios: [
    { orden: 1, texto: '**Semana de oración**: todas las noches a las 7:00 pm en el templo.' },
    { orden: 2, texto: 'Se solicita a los líderes de ministerio actualizar sus reportes trimestrales.' },
    { orden: 3, texto: '**Almuerzo de compañerismo** el próximo sábado tras el culto divino.' },
  ] satisfies AnuncioBoletin[],
};
