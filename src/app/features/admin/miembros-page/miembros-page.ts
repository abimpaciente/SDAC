import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { MINISTERIOS_CONOCIDOS, Rol, Usuario } from '../../../core/models';
import { UsuariosService } from '../../../core/services/usuarios.service';

const ROLES: { valor: Rol; etiqueta: string }[] = [
  { valor: 'miembro', etiqueta: 'Miembro' },
  { valor: 'lider_ministerio', etiqueta: 'Líder de ministerio' },
  { valor: 'secretario', etiqueta: 'Secretario/a de iglesia' },
  { valor: 'administrador', etiqueta: 'Administrador/Pastor' },
];

@Component({
  selector: 'app-miembros-page',
  imports: [],
  templateUrl: './miembros-page.html',
  styleUrl: './miembros-page.scss',
})
export class MiembrosPage {
  private readonly usuariosService = inject(UsuariosService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuarios = this.usuariosService.usuarios;
  protected readonly cargando = this.usuariosService.cargando;
  protected readonly roles = ROLES;
  protected readonly ministerios = MINISTERIOS_CONOCIDOS;
  protected readonly guardandoUid = signal<string | null>(null);

  constructor() {
    // Solo administradores pueden estar aquí; a cualquier otro (o mientras
    // se resuelve el estado de sesión) lo mandamos de vuelta a Inicio.
    effect(() => {
      if (!this.auth.cargando() && this.auth.usuario()?.rol !== 'administrador') {
        this.router.navigateByUrl('/inicio');
      }
    });
  }

  protected async cambiarRol(usuario: Usuario, rol: string): Promise<void> {
    const nuevoMinisterio = rol === 'lider_ministerio' ? (usuario.ministerio ?? this.ministerios[0]) : null;
    await this.guardar(usuario.uid, rol as Rol, nuevoMinisterio);
  }

  protected async cambiarMinisterio(usuario: Usuario, ministerio: string): Promise<void> {
    await this.guardar(usuario.uid, usuario.rol, ministerio);
  }

  private async guardar(uid: string, rol: Rol, ministerio: string | null): Promise<void> {
    this.guardandoUid.set(uid);
    try {
      await this.usuariosService.actualizarRol(uid, rol, ministerio);
    } finally {
      this.guardandoUid.set(null);
    }
  }
}
