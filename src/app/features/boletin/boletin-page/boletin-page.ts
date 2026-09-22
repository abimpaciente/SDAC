import { Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { AnuncioBoletin, ParteBoletin, SeccionCulto } from '../../../core/models';
import { BoletinService, SeccionConPartes } from '../../../core/services/boletin.service';
import { ContribucionesService } from '../../../core/services/contribuciones.service';
import { CandidatoSugerido, FilaBoletin } from '../../../shared/components/fila-boletin/fila-boletin';

type TabBoletin = 'escuelaSabatica' | 'culto' | 'anuncios';

type FilaEscuelaSabatica =
  | { tipo: 'campo'; clave: string; parte: ParteBoletin }
  | { tipo: 'clase'; indice: number; parte: ParteBoletin };

@Component({
  selector: 'app-boletin-page',
  imports: [FilaBoletin],
  templateUrl: './boletin-page.html',
  styleUrl: './boletin-page.scss',
})
export class BoletinPage {
  private readonly auth = inject(AuthService);
  private readonly boletinService = inject(BoletinService);
  private readonly contribucionesService = inject(ContribucionesService);

  protected readonly tabs: { clave: TabBoletin; etiqueta: string }[] = [
    { clave: 'escuelaSabatica', etiqueta: 'Escuela Sabática' },
    { clave: 'culto', etiqueta: 'Culto' },
    { clave: 'anuncios', etiqueta: 'Anuncios' },
  ];

  protected readonly tabActiva = signal<TabBoletin>('escuelaSabatica');

  protected readonly boletin = this.boletinService.boletin;
  protected readonly cargando = this.boletinService.cargando;
  protected readonly creando = signal(false);

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

  protected readonly partesEscuelaSabatica = computed<FilaEscuelaSabatica[]>(() => {
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

  protected readonly partesCulto = computed<{ clave: string; parte: ParteBoletin }[]>(() => {
    const seccion = this.boletin()?.culto;
    if (!seccion) {
      return [];
    }
    return (Object.keys(seccion) as (keyof SeccionCulto)[])
      .map((clave) => ({ clave, parte: seccion[clave] }))
      .sort((a, b) => a.parte.orden - b.parte.orden);
  });

  protected readonly editandoAnuncios = signal(false);
  protected readonly textoAnuncios = signal('');

  protected seleccionarTab(tab: TabBoletin): void {
    this.tabActiva.set(tab);
  }

  protected exportarPdf(): void {
    window.print();
  }

  protected async crearBoletin(): Promise<void> {
    this.creando.set(true);
    try {
      await this.boletinService.crearBoletinDeEstaSemana();
    } finally {
      this.creando.set(false);
    }
  }

  protected async guardarEscuelaSabatica(
    fila: FilaEscuelaSabatica,
    cambios: { valor: string; asignadoA: string | null },
  ): Promise<void> {
    if (fila.tipo === 'clase') {
      await this.boletinService.actualizarClase(fila.indice, cambios.valor, cambios.asignadoA);
    } else {
      await this.boletinService.actualizarParte('escuelaSabatica', fila.clave, cambios.valor, cambios.asignadoA);
    }
  }

  protected async guardarCulto(
    clave: string,
    cambios: { valor: string; asignadoA: string | null },
  ): Promise<void> {
    await this.boletinService.actualizarParte('culto', clave, cambios.valor, cambios.asignadoA);
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
    await this.boletinService.actualizarAnuncios(anuncios);
    this.editandoAnuncios.set(false);
  }

  protected formatearAnuncio(texto: string): string {
    return texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
