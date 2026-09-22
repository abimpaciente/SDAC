/** Un campo asignable del boletín: puede estar "Por asignar" (asignadoA null). */
export interface ParteBoletin {
  titulo: string;
  asignadoA: string | null;
  valor: string;
  orden: number;
}

export interface SeccionEscuelaSabatica {
  alabanzas: ParteBoletin;
  bienvenida: ParteBoletin;
  himnoInicial: ParteBoletin;
  lecturaBiblica: ParteBoletin;
  oracion: ParteBoletin;
  /** Clase 1, Clase 2, Clase de visitas, Clase de jóvenes. */
  divisionClases: ParteBoletin[];
  elMisionero: ParteBoletin;
  musicaEspecial: ParteBoletin;
  himnoFinal: ParteBoletin;
  oracionFinal: ParteBoletin;
}

export interface SeccionCulto {
  anuncios: ParteBoletin;
  intro: ParteBoletin;
  alabanzas: ParteBoletin;
  doxologia: ParteBoletin;
  bienvenida: ParteBoletin;
  himnoInicial: ParteBoletin;
  lecturaBiblica: ParteBoletin;
  rinconDeOracion: ParteBoletin;
  video: ParteBoletin;
  diezmosYOfrendas: ParteBoletin;
  temaSermon: ParteBoletin;
  himnoFinal: ParteBoletin;
  oracionFinal: ParteBoletin;
  musicaDeFondo: ParteBoletin;
}

/** Item de la lista numerada de Anuncios. El texto admite **negritas**. */
export interface AnuncioBoletin {
  orden: number;
  texto: string;
}

export interface Boletin {
  /** Fecha del boletín en formato YYYY-MM-DD, usada como id del documento. */
  id: string;
  iglesiaId: string;
  fecha: string;
  publicado: boolean;
  /** Hora del ocaso ("Sunset"), texto libre (p. ej. "8:09 pm"). */
  ocaso: string;
  /** Hora del servicio de adoración, texto libre (p. ej. "10:55 AM"). */
  horaCulto: string;
  escuelaSabatica: SeccionEscuelaSabatica;
  culto: SeccionCulto;
  anuncios: AnuncioBoletin[];
}
