import { TipoContribucion } from '../../core/models';

export const TIPOS_CONTRIBUCION: { valor: TipoContribucion; etiqueta: string; chip: string }[] = [
  { valor: 'himno', etiqueta: 'Himno', chip: 'chip--salvia' },
  { valor: 'cita', etiqueta: 'Cita bíblica', chip: '' },
  { valor: 'anuncio', etiqueta: 'Anuncio', chip: 'chip--dorado' },
  { valor: 'oracion', etiqueta: 'Oración', chip: 'chip--vino' },
];
