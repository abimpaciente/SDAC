import { Injectable, inject, signal } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Contribucion, TipoContribucion, Usuario } from '../models';
import { FIRESTORE } from '../firebase/firebase-app.provider';

@Injectable({ providedIn: 'root' })
export class ContribucionesService {
  private readonly firestore = inject(FIRESTORE);
  private readonly coleccion = collection(this.firestore, 'contribuciones');

  readonly contribuciones = signal<Contribucion[]>([]);
  readonly cargando = signal(true);

  constructor() {
    const consulta = query(
      this.coleccion,
      where('iglesiaId', '==', environment.iglesiaIdPorDefecto),
      orderBy('fecha', 'desc'),
    );

    onSnapshot(consulta, (snapshot) => {
      this.contribuciones.set(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Contribucion),
      );
      this.cargando.set(false);
    });
  }

  async publicar(autor: Usuario, tipo: TipoContribucion, texto: string): Promise<void> {
    const nueva: Omit<Contribucion, 'id'> = {
      iglesiaId: autor.iglesiaId,
      autorId: autor.uid,
      autorNombre: autor.nombre,
      tipo,
      texto,
      fecha: new Date().toISOString(),
      agregadoABoletin: false,
    };
    await addDoc(this.coleccion, nueva);
  }

  async alternarCandidato(contribucion: Contribucion): Promise<void> {
    await updateDoc(doc(this.firestore, 'contribuciones', contribucion.id), {
      agregadoABoletin: !contribucion.agregadoABoletin,
    });
  }
}
