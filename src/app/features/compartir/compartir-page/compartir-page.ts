import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { Contribucion, TipoContribucion } from '../../../core/models';
import { ContribucionesService } from '../../../core/services/contribuciones.service';
import { ContribucionCard } from '../../../shared/components/contribucion-card/contribucion-card';
import { TIPOS_CONTRIBUCION } from '../../../shared/utils/tipos-contribucion';

type Filtro = TipoContribucion | 'todos';

@Component({
  selector: 'app-compartir-page',
  imports: [ReactiveFormsModule, RouterLink, ContribucionCard],
  templateUrl: './compartir-page.html',
  styleUrl: './compartir-page.scss',
})
export class CompartirPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly contribucionesService = inject(ContribucionesService);
  private readonly router = inject(Router);

  protected readonly tipos = TIPOS_CONTRIBUCION;
  protected readonly filtro = signal<Filtro>('todos');
  protected readonly enviando = signal(false);

  protected readonly usuario = this.auth.usuario;
  protected readonly sesionResuelta = computed(() => !this.auth.cargando());

  protected readonly contribuciones = computed(() => {
    const filtro = this.filtro();
    const todas = this.contribucionesService.contribuciones();
    return filtro === 'todos' ? todas : todas.filter((c) => c.tipo === filtro);
  });

  protected readonly form = this.fb.nonNullable.group({
    tipo: ['himno' as TipoContribucion, Validators.required],
    texto: ['', Validators.required],
  });

  protected seleccionarFiltro(filtro: Filtro): void {
    this.filtro.set(filtro);
  }

  protected async publicar(): Promise<void> {
    const autor = this.usuario();
    if (!autor || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { tipo, texto } = this.form.getRawValue();
    this.enviando.set(true);
    try {
      await this.contribucionesService.publicar(autor, tipo, texto.trim());
      this.form.reset({ tipo, texto: '' });
    } finally {
      this.enviando.set(false);
    }
  }

  protected async alternarCandidato(contribucion: Contribucion): Promise<void> {
    if (!this.usuario()) {
      await this.router.navigateByUrl('/login?volver=/compartir');
      return;
    }
    await this.contribucionesService.alternarCandidato(contribucion);
  }
}
