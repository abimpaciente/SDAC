import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProgramaJovenes } from '../../../core/models';
import { BoletinService } from '../../../core/services/boletin.service';
import { PROGRAMA_JOVENES_MOCK } from '../../../shared/mock/programa-jovenes.mock';
import { FilaBoletin } from '../../../shared/components/fila-boletin/fila-boletin';

type TabPrograma = 'matutino' | 'vespertino';

@Component({
  selector: 'app-programas-page',
  imports: [FilaBoletin],
  templateUrl: './programas-page.html',
  styleUrl: './programas-page.scss',
})
export class ProgramasPage {
  private readonly route = inject(ActivatedRoute);
  private readonly boletinService = inject(BoletinService);

  protected readonly tabs: { clave: TabPrograma; etiqueta: string }[] = [
    { clave: 'matutino', etiqueta: 'Matutino' },
    { clave: 'vespertino', etiqueta: 'Vespertino' },
  ];

  protected readonly tabActiva = signal<TabPrograma>(
    this.route.snapshot.queryParamMap.get('tab') === 'vespertino' ? 'vespertino' : 'matutino',
  );

  // Todavía sin conectar a Firestore: falta un ProgramaJovenesService.
  protected readonly programaJovenes: ProgramaJovenes = PROGRAMA_JOVENES_MOCK;

  protected readonly cargando = this.boletinService.cargando;
  protected readonly boletin = this.boletinService.boletin;
  protected readonly partesEscuelaSabatica = this.boletinService.partesEscuelaSabatica;
  protected readonly partesCulto = this.boletinService.partesCulto;

  protected seleccionarTab(tab: TabPrograma): void {
    this.tabActiva.set(tab);
  }
}
