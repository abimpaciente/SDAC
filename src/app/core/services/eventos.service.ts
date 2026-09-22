import { Injectable, inject, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Evento } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

export type DatosEvento = Pick<Evento, 'titulo' | 'descripcion' | 'fecha' | 'lugar'>;

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly firestore = inject(FIRESTORE);
  private readonly coleccion = collection(this.firestore, 'eventos');

  readonly eventos = signal<Evento[]>([]);
  readonly cargando = signal(true);
  /** Si la escucha en tiempo real falla (p. ej. falta un índice de Firestore), queda aquí en vez de fallar en silencio. */
  readonly errorCarga = signal<string | null>(null);

  constructor() {
    const consulta = query(
      this.coleccion,
      where('iglesiaId', '==', environment.iglesiaIdPorDefecto),
      orderBy('fecha', 'asc'),
    );
    onSnapshot(
      consulta,
      (snapshot) => {
        this.eventos.set(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Evento));
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      (error) => {
        console.error('Error al escuchar eventos:', error);
        this.errorCarga.set(error.message);
        this.cargando.set(false);
      },
    );
  }

  async crear(datos: DatosEvento): Promise<void> {
    await addDoc(this.coleccion, { ...datos, iglesiaId: environment.iglesiaIdPorDefecto });
  }

  async actualizar(id: string, datos: DatosEvento): Promise<void> {
    await updateDoc(doc(this.firestore, 'eventos', id), { ...datos });
  }

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'eventos', id));
  }
}
