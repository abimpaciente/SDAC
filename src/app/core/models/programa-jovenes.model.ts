/** Orden fijo del programa de Sociedad de Jóvenes. */
export type ClaveParteJovenes =
  | 'servicioCanto'
  | 'sabiasQue'
  | 'ejercicioBiblico'
  | 'temaReflexion'
  | 'despedida';

export interface ParteProgramaJovenes {
  clave: ClaveParteJovenes;
  titulo: string;
  asignadoA: string | null;
}

export interface ProgramaJovenes {
  /** Fecha en formato YYYY-MM-DD, usada como id del documento. */
  id: string;
  iglesiaId: string;
  fecha: string;
  partes: ParteProgramaJovenes[];
}
