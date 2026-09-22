export interface Iglesia {
  id: string;
  nombre: string;
  direccion?: string;
  logoUrl?: string;
  pastor?: string;
  telefono?: string;
  email?: string;
  /** Texto libre, p. ej. "10:00 am". */
  horarioEscuelaSabatica?: string;
  /** Texto libre, p. ej. "11:15 am". */
  horarioCulto?: string;
  /** Texto libre, p. ej. "Miércoles 7:15 pm". */
  horarioOracion?: string;
  /** Enlace al sitio web oficial (p. ej. la plantilla de la NAD), para quien quiera más detalle doctrinal/institucional. */
  sitioWebOficial?: string;
}
