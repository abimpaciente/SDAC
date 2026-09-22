import { Injectable, inject, signal } from '@angular/core';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Iglesia } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

@Injectable({ providedIn: 'root' })
export class IglesiaService {
  private readonly firestore = inject(FIRESTORE);

  readonly iglesia = signal<Iglesia | null>(null);

  constructor() {
    onSnapshot(doc(this.firestore, 'iglesias', environment.iglesiaIdPorDefecto), (snapshot) => {
      this.iglesia.set(snapshot.exists() ? (snapshot.data() as Iglesia) : null);
    });
  }

  async actualizar(datos: Pick<Iglesia, 'nombre' | 'direccion'>): Promise<void> {
    const id = environment.iglesiaIdPorDefecto;
    await setDoc(doc(this.firestore, 'iglesias', id), { id, ...datos }, { merge: true });
  }
}
