import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/auth/auth.service';
import { AnuncioBoletin } from '../../../core/models';
import { BoletinService, FilaEscuelaSabatica, SeccionConPartes } from '../../../core/services/boletin.service';
import { ContribucionesService } from '../../../core/services/contribuciones.service';
import { IglesiaService } from '../../../core/services/iglesia.service';
import { CandidatoSugerido, FilaBoletin } from '../../../shared/components/fila-boletin/fila-boletin';

type TabBoletin = 'escuelaSabatica' | 'culto' | 'anuncios';

@Component({
  selector: 'app-boletin-page',
  imports: [FilaBoletin, FormsModule],
  templateUrl: './boletin-page.html',
  styleUrl: './boletin-page.scss',
})
export class BoletinPage {
  private readonly auth = inject(AuthService);
  private readonly boletinService = inject(BoletinService);
  private readonly contribucionesService = inject(ContribucionesService);
  private readonly iglesiaService = inject(IglesiaService);

  protected readonly nombreIglesia = computed(() => this.iglesiaService.iglesia()?.nombre ?? 'RDS Iglesia Adventista');

  protected readonly fechaLarga = computed(() => {
    const boletin = this.boletin();
    if (!boletin) return '';
    // Se parsea como fecha local (no UTC) sumando la hora del mediodía,
    // para que no se corra un día por el desfase de zona horaria.
    return new Date(`${boletin.fecha}T12:00:00`).toLocaleDateString('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  protected readonly tabs: { clave: TabBoletin; etiqueta: string }[] = [
    { clave: 'escuelaSabatica', etiqueta: 'Escuela Sabática' },
    { clave: 'culto', etiqueta: 'Culto' },
    { clave: 'anuncios', etiqueta: 'Anuncios' },
  ];

  protected readonly tabActiva = signal<TabBoletin>('escuelaSabatica');

  protected readonly boletin = this.boletinService.boletin;
  protected readonly cargando = this.boletinService.cargando;
  protected readonly errorCarga = this.boletinService.errorCarga;
  protected readonly creando = signal(false);
  protected readonly errorGuardado = signal<string | null>(null);

  protected readonly puedeEditarTodo = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol === 'secretario' || rol === 'administrador';
  });

  private readonly seccionDeMiMinisterio = computed<SeccionConPartes | null>(() => {
    const usuario = this.auth.usuario();
    if (usuario?.rol !== 'lider_ministerio') {
      return null;
    }
    if (usuario.ministerio === 'Escuela Sabática') return 'escuelaSabatica';
    if (usuario.ministerio === 'Culto') return 'culto';
    return null;
  });

  protected puedeEditarSeccion(seccion: SeccionConPartes): boolean {
    return this.puedeEditarTodo() || this.seccionDeMiMinisterio() === seccion;
  }

  protected readonly candidatos = computed<CandidatoSugerido[]>(() =>
    this.contribucionesService
      .contribuciones()
      .filter((c) => c.agregadoABoletin)
      .map((c) => ({ id: c.id, texto: c.texto, autorNombre: c.autorNombre })),
  );

  protected readonly partesEscuelaSabatica = this.boletinService.partesEscuelaSabatica;
  protected readonly partesCulto = this.boletinService.partesCulto;

  protected readonly editandoAnuncios = signal(false);
  protected readonly textoAnuncios = signal('');

  protected readonly editandoEncabezado = signal(false);
  protected readonly ocaso = signal('');
  protected readonly horaCulto = signal('');

  protected seleccionarTab(tab: TabBoletin): void {
    this.tabActiva.set(tab);
  }

  protected exportarPdf(): void {
    window.print();
  }

  protected async crearBoletin(): Promise<void> {
    this.creando.set(true);
    this.errorGuardado.set(null);
    try {
      await this.boletinService.crearBoletinDeEstaSemana();
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    } finally {
      this.creando.set(false);
    }
  }

  protected async guardarEscuelaSabatica(
    fila: FilaEscuelaSabatica,
    cambios: { valor: string; asignadoA: string | null },
  ): Promise<void> {
    this.errorGuardado.set(null);
    try {
      if (fila.tipo === 'clase') {
        await this.boletinService.actualizarClase(fila.indice, cambios.valor, cambios.asignadoA);
      } else {
        await this.boletinService.actualizarParte('escuelaSabatica', fila.clave, cambios.valor, cambios.asignadoA);
      }
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    }
  }

  protected async guardarCulto(
    clave: string,
    cambios: { valor: string; asignadoA: string | null },
  ): Promise<void> {
    this.errorGuardado.set(null);
    try {
      await this.boletinService.actualizarParte('culto', clave, cambios.valor, cambios.asignadoA);
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    }
  }

  protected abrirEdicionAnuncios(): void {
    this.textoAnuncios.set(this.boletin()!.anuncios.map((a) => a.texto).join('\n'));
    this.editandoAnuncios.set(true);
  }

  protected cancelarEdicionAnuncios(): void {
    this.editandoAnuncios.set(false);
  }

  protected async guardarAnuncios(): Promise<void> {
    const anuncios: AnuncioBoletin[] = this.textoAnuncios()
      .split('\n')
      .map((linea) => linea.trim())
      .filter((linea) => linea.length > 0)
      .map((texto, i) => ({ orden: i + 1, texto }));
    this.errorGuardado.set(null);
    try {
      await this.boletinService.actualizarAnuncios(anuncios);
      this.editandoAnuncios.set(false);
    } catch (error) {
      this.errorGuardado.set(this.mensajeError(error));
    }
  }

  protected abrirEdicionEncabezado(): void {
    this.ocaso.set(this.boletin()?.ocaso ?? '');
    this.horaCulto.set(this.boletin()?.horaCulto ?? '');
    this.editandoEncabezado.set(true);
  }

  protected cancelarEdicionEncabezado(): void {
    this.editandoEncabezado.set(false);
  }

  protected async guardarEncabezado(): Promise<void> {
    this.errorGuardado.set(null);
    try {
      await this.boletinService.actualizarEncabezado(this.ocaso().trim(), this.horaCulto().trim());
      this.editandoEncabezado.set(false);
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

  protected formatearAnuncio(texto: string): string {
    return texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
