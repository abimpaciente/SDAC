export interface Evento {
  id: string;
  iglesiaId: string;
  titulo: string;
  descripcion: string;
  /** Fecha ISO 8601. */
  fecha: string;
  lugar: string;
}
