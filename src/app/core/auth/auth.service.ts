import { Injectable, inject, signal } from '@angular/core';
import {
  User as UsuarioFirebase,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { Usuario } from '../models';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase/firebase-app.provider';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(FIREBASE_AUTH);
  private readonly firestore = inject(FIRESTORE);

  /** El usuario con sesión activa, o `null` si no hay sesión (incluido mientras se resuelve el estado inicial: ver `cargando`). */
  readonly usuario = signal<Usuario | null>(null);
  /** true hasta que se resuelve el estado inicial de sesión (evita parpadeos de "no autenticado" al cargar la app). */
  readonly cargando = signal(true);

  // Mientras `registrar()` está creando el documento `usuarios/{uid}`, el
  // listener de abajo ignora el evento: si intentara leer el perfil en ese
  // instante, el documento todavía no existiría (carrera con el `setDoc`).
  // `registrar()` mismo se encarga de fijar `usuario` cuando termina.
  private registrando = false;

  constructor() {
    onAuthStateChanged(this.auth, async (usuarioFirebase) => {
      if (this.registrando) {
        return;
      }
      this.usuario.set(usuarioFirebase ? (await this.cargarPerfil(usuarioFirebase)) ?? null : null);
      this.cargando.set(false);
    });
  }

  async registrar(nombre: string, email: string, password: string): Promise<void> {
    this.registrando = true;
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(credencial.user, { displayName: nombre });

      const nuevoUsuario: Usuario = {
        uid: credencial.user.uid,
        nombre,
        email,
        telefono: null,
        rol: 'miembro',
        ministerio: null,
        iglesiaId: environment.iglesiaIdPorDefecto,
      };
      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), nuevoUsuario);
      this.usuario.set(nuevoUsuario);
      this.cargando.set(false);
    } finally {
      this.registrando = false;
    }
  }

  async iniciarSesion(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.auth);
  }

  private async cargarPerfil(usuarioFirebase: UsuarioFirebase): Promise<Usuario | undefined> {
    try {
      const snapshot = await getDoc(doc(this.firestore, 'usuarios', usuarioFirebase.uid));
      return snapshot.exists() ? (snapshot.data() as Usuario) : undefined;
    } catch {
      // El perfil puede no existir todavía (p. ej. justo tras registrarse)
      // o las reglas pueden denegar la lectura; en ambos casos, tratamos
      // como "sin perfil" en vez de romper el flujo de autenticación.
      return undefined;
    }
  }
}
