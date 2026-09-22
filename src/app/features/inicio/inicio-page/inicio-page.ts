import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { Evento } from '../../../core/models';
import { DatosEvento, EventosService } from '../../../core/services/eventos.service';
import { IglesiaService } from '../../../core/services/iglesia.service';

interface AccesoDirecto {
  etiqueta: string;
  ruta: string;
  queryParams?: Record<string, string>;
  icono: string;
}

@Component({
  selector: 'app-inicio-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
})
export class InicioPage {
  private readonly auth = inject(AuthService);
  private readonly eventosService = inject(EventosService);
  private readonly iglesiaService = inject(IglesiaService);

  protected readonly nombreIglesia = computed(() => this.iglesiaService.iglesia()?.nombre ?? 'RDS Iglesia Adventista');
  protected readonly iglesia = this.iglesiaService.iglesia;

  protected readonly accesos: AccesoDirecto[] = [
    { etiqueta: 'Boletín', ruta: '/boletin', icono: 'boletin' },
    {
      etiqueta: 'Programa matutino',
      ruta: '/programas',
      queryParams: { tab: 'matutino' },
      icono: 'escuela',
    },
    {
      etiqueta: 'Programa vespertino',
      ruta: '/programas',
      queryParams: { tab: 'vespertino' },
      icono: 'jovenes',
    },
    { etiqueta: 'Compartir', ruta: '/compartir', icono: 'compartir' },
  ];

  protected readonly eventos = this.eventosService.eventos;
  protected readonly cargando = this.eventosService.cargando;
  protected readonly errorCargaEventos = this.eventosService.errorCarga;
  protected readonly errorGuardado = signal<string | null>(null);

  protected readonly puedeEditar = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol === 'secretario' || rol === 'administrador';
  });

  protected readonly mostrandoFormulario = signal(false);
  protected readonly editandoId = signal<string | null>(null);
  protected readonly guardando = signal(false);

  protected readonly titulo = signal('');
  protected readonly fecha = signal('');
  protected readonly lugar = signal('');
  protected readonly descripcion = signal('');

  protected formatearFecha(fechaIso: string): string {
    return new Date(fechaIso).toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  protected abrirNuevo(): void {
    this.editandoId.set(null);
    this.titulo.set('');
    this.fecha.set('');
    this.lugar.set('');
    this.descripcion.set('');
    this.mostrandoFormulario.set(true);
  }

  protected abrirEdicion(evento: Evento): void {
    this.editandoId.set(evento.id);
    this.titulo.set(evento.titulo);
    this.fecha.set(evento.fecha.slice(0, 16));
    this.lugar.set(evento.lugar);
    this.descripcion.set(evento.descripcion);
    this.mostrandoFormulario.set(true);
  }

  protected cancelar(): void {
    this.mostrandoFormulario.set(false);
  }

  protected async guardar(): Promise<void> {
    if (!this.titulo().trim() || !this.fecha()) {
      return;
    }
    const datos: DatosEvento = {
      titulo: this.titulo().trim(),
      fecha: this.fecha(),
      lugar: this.lugar().trim(),
      descripcion: this.descripcion().trim(),
    };
    this.guardando.set(true);
    this.errorGuardado.set(null);
    try {
      const id = this.editandoId();
      if (id) {
        await this.eventosService.actualizar(id, datos);
      } else {
        await this.eventosService.crear(datos);
      }
      this.mostrandoFormulario.set(false);
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    } finally {
      this.guardando.set(false);
    }
  }

  protected async eliminar(evento: Evento): Promise<void> {
    if (!confirm(`¿Eliminar "${evento.titulo}"?`)) {
      return;
    }
    try {
      await this.eventosService.eliminar(evento.id);
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    }
  }

  private mensajeError(error: unknown): string {
    const codigo = (error as { code?: string })?.code;
    if (codigo === 'permission-denied') {
      return 'No tienes permiso para hacer esto.';
    }
    return 'No se pudo guardar. Intenta de nuevo.';
  }
}
