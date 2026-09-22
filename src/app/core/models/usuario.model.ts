export type Rol = 'miembro' | 'lider_ministerio' | 'secretario' | 'administrador';

// Nombres de ministerio conocidos, usados en selects. El campo real en el
// modelo es un string libre para no cerrar la puerta a que cada
// congregación defina los suyos.
export const MINISTERIOS_CONOCIDOS = [
  'Escuela Sabática',
  'Sociedad de Jóvenes',
  'Comunicaciones',
] as const;

export interface Usuario {
  uid: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  rol: Rol;
  /** Solo aplica cuando rol === 'lider_ministerio'. */
  ministerio: string | null;
  iglesiaId: string;
}
