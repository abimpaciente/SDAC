import { Injectable, inject, signal } from '@angular/core';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Iglesia } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

export type DatosIglesia = Pick<
  Iglesia,
  | 'nombre'
  | 'direccion'
  | 'pastor'
  | 'telefono'
  | 'email'
  | 'horarioEscuelaSabatica'
  | 'horarioCulto'
  | 'horarioOracion'
  | 'sitioWebOficial'
>;

@Injectable({ providedIn: 'root' })
export class IglesiaService {
  private readonly firestore = inject(FIRESTORE);

  readonly iglesia = signal<Iglesia | null>(null);
  readonly errorCarga = signal<string | null>(null);

  constructor() {
    onSnapshot(
      doc(this.firestore, 'iglesias', environment.iglesiaIdPorDefecto),
      (snapshot) => {
        this.iglesia.set(snapshot.exists() ? (snapshot.data() as Iglesia) : null);
        this.errorCarga.set(null);
      },
      (error) => {
        console.error('Error al escuchar la iglesia:', error);
        this.errorCarga.set(error.message);
      },
    );
  }

  async actualizar(datos: DatosIglesia): Promise<void> {
    const id = environment.iglesiaIdPorDefecto;
    await setDoc(doc(this.firestore, 'iglesias', id), { id, ...datos }, { merge: true });
  }
}
