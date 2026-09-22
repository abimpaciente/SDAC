import { Injectable, computed, inject, signal } from '@angular/core';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { AnuncioBoletin, Boletin, ParteBoletin, SeccionCulto, SeccionEscuelaSabatica } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

export type SeccionConPartes = 'escuelaSabatica' | 'culto';

export type FilaEscuelaSabatica =
  | { tipo: 'campo'; clave: string; parte: ParteBoletin }
  | { tipo: 'clase'; indice: number; parte: ParteBoletin };

function parteVacia(titulo: string, orden: number): ParteBoletin {
  return { titulo, orden, valor: '', asignadoA: null };
}

function escuelaSabaticaVacia(): SeccionEscuelaSabatica {
  return {
    alabanzas: parteVacia('Alabanzas', 1),
    bienvenida: parteVacia('Bienvenida', 2),
    himnoInicial: parteVacia('Himno inicial', 3),
    lecturaBiblica: parteVacia('Lectura bíblica', 4),
    oracion: parteVacia('Oración', 5),
    divisionClases: [
      parteVacia('Clase 1', 6),
      parteVacia('Clase 2', 7),
      parteVacia('Clase de visitas', 8),
      parteVacia('Clase de jóvenes', 9),
    ],
    elMisionero: parteVacia('El Misionero', 10),
    musicaEspecial: parteVacia('Música especial', 11),
    himnoFinal: parteVacia('Himno final', 12),
    oracionFinal: parteVacia('Oración final', 13),
  };
}

function cultoVacio(): SeccionCulto {
  return {
    anuncios: parteVacia('Anuncios', 1),
    intro: parteVacia('Intro', 2),
    alabanzas: parteVacia('Alabanzas', 3),
    doxologia: parteVacia('Doxología', 4),
    bienvenida: parteVacia('Bienvenida', 5),
    himnoInicial: parteVacia('Himno inicial', 6),
    lecturaBiblica: parteVacia('Lectura bíblica', 7),
    rinconDeOracion: parteVacia('Rincón de oración', 8),
    video: parteVacia('Video', 9),
    diezmosYOfrendas: parteVacia('Diezmos y ofrendas', 10),
    temaSermon: parteVacia('Tema / sermón', 11),
    himnoFinal: parteVacia('Himno final', 12),
    oracionFinal: parteVacia('Oración final', 13),
    musicaDeFondo: parteVacia('Música de fondo', 14),
  };
}

/** Fecha (YYYY-MM-DD) del sábado de esta semana: hoy si es sábado, si no el próximo. */
export function fechaSabadoActual(): string {
  const hoy = new Date();
  const diasHastaSabado = (6 - hoy.getDay() + 7) % 7;
  const sabado = new Date(hoy);
  sabado.setDate(hoy.getDate() + diasHastaSabado);
  return sabado.toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class BoletinService {
  private readonly firestore = inject(FIRESTORE);
  readonly fecha = fechaSabadoActual();

  readonly boletin = signal<Boletin | null>(null);
  readonly cargando = signal(true);
  readonly existe = computed(() => this.boletin() !== null);
  readonly errorCarga = signal<string | null>(null);

  readonly partesEscuelaSabatica = computed<FilaEscuelaSabatica[]>(() => {
    const seccion = this.boletin()?.escuelaSabatica;
    if (!seccion) {
      return [];
    }
    const campos: FilaEscuelaSabatica[] = [
      { tipo: 'campo', clave: 'alabanzas', parte: seccion.alabanzas },
      { tipo: 'campo', clave: 'bienvenida', parte: seccion.bienvenida },
      { tipo: 'campo', clave: 'himnoInicial', parte: seccion.himnoInicial },
      { tipo: 'campo', clave: 'lecturaBiblica', parte: seccion.lecturaBiblica },
      { tipo: 'campo', clave: 'oracion', parte: seccion.oracion },
      { tipo: 'campo', clave: 'elMisionero', parte: seccion.elMisionero },
      { tipo: 'campo', clave: 'musicaEspecial', parte: seccion.musicaEspecial },
      { tipo: 'campo', clave: 'himnoFinal', parte: seccion.himnoFinal },
      { tipo: 'campo', clave: 'oracionFinal', parte: seccion.oracionFinal },
      ...seccion.divisionClases.map((parte, indice): FilaEscuelaSabatica => ({ tipo: 'clase', indice, parte })),
    ];
    return campos.sort((a, b) => a.parte.orden - b.parte.orden);
  });

  readonly partesCulto = computed<{ clave: string; parte: ParteBoletin }[]>(() => {
    const seccion = this.boletin()?.culto;
    if (!seccion) {
      return [];
    }
    return (Object.keys(seccion) as (keyof SeccionCulto)[])
      .map((clave) => ({ clave, parte: seccion[clave] }))
      .sort((a, b) => a.parte.orden - b.parte.orden);
  });

  constructor() {
    onSnapshot(
      doc(this.firestore, 'boletines', this.fecha),
      (snapshot) => {
        this.boletin.set(snapshot.exists() ? (snapshot.data() as Boletin) : null);
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      (error) => {
        console.error('Error al escuchar el boletín:', error);
        this.errorCarga.set(error.message);
        this.cargando.set(false);
      },
    );
  }

  async crearBoletinDeEstaSemana(): Promise<void> {
    const nuevo: Boletin = {
      id: this.fecha,
      iglesiaId: environment.iglesiaIdPorDefecto,
      fecha: this.fecha,
      publicado: false,
      ocaso: '',
      horaCulto: '',
      escuelaSabatica: escuelaSabaticaVacia(),
      culto: cultoVacio(),
      anuncios: [],
    };
    await setDoc(doc(this.firestore, 'boletines', this.fecha), nuevo);
  }

  async actualizarParte(
    seccion: SeccionConPartes,
    campo: string,
    valor: string,
    asignadoA: string | null,
  ): Promise<void> {
    await updateDoc(doc(this.firestore, 'boletines', this.fecha), {
      [`${seccion}.${campo}.valor`]: valor,
      [`${seccion}.${campo}.asignadoA`]: asignadoA,
    });
  }

  /** `divisionClases` es un array, así que se reescribe completo (Firestore no permite editar un índice por dot-path). */
  async actualizarClase(indice: number, valor: string, asignadoA: string | null): Promise<void> {
    const actual = this.boletin();
    if (!actual) {
      return;
    }
    const clases = actual.escuelaSabatica.divisionClases.map((clase, i) =>
      i === indice ? { ...clase, valor, asignadoA } : clase,
    );
    await updateDoc(doc(this.firestore, 'boletines', this.fecha), {
      'escuelaSabatica.divisionClases': clases,
    });
  }

  async actualizarEncabezado(ocaso: string, horaCulto: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'boletines', this.fecha), { ocaso, horaCulto });
  }

  async actualizarAnuncios(anuncios: AnuncioBoletin[]): Promise<void> {
    await updateDoc(doc(this.firestore, 'boletines', this.fecha), { anuncios });
  }
}
