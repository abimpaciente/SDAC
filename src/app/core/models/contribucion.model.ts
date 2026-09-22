export type TipoContribucion = 'himno' | 'cita' | 'anuncio' | 'oracion';

export interface Contribucion {
  id: string;
  iglesiaId: string;
  autorId: string;
  autorNombre: string;
  tipo: TipoContribucion;
  texto: string;
  /** Fecha ISO 8601. */
  fecha: string;
  agregadoABoletin: boolean;
}
