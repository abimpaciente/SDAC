import { Injectable, inject, signal } from '@angular/core';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Rol, Usuario } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly firestore = inject(FIRESTORE);
  private readonly coleccion = collection(this.firestore, 'usuarios');

  readonly usuarios = signal<Usuario[]>([]);
  readonly cargando = signal(true);

  constructor() {
    const consulta = query(this.coleccion, where('iglesiaId', '==', environment.iglesiaIdPorDefecto));
    onSnapshot(consulta, (snapshot) => {
      this.usuarios.set(
        snapshot.docs
          .map((d) => d.data() as Usuario)
          .sort((a, b) => a.nombre.localeCompare(b.nombre)),
      );
      this.cargando.set(false);
    });
  }

  async actualizarRol(uid: string, rol: Rol, ministerio: string | null): Promise<void> {
    await updateDoc(doc(this.firestore, 'usuarios', uid), {
      rol,
      ministerio: rol === 'lider_ministerio' ? ministerio : null,
    });
  }
}
