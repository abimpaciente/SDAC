import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ParteBoletin, ProgramaJovenes } from '../../../core/models';
import { BOLETIN_MOCK } from '../../../shared/mock/boletin.mock';
import { PROGRAMA_JOVENES_MOCK } from '../../../shared/mock/programa-jovenes.mock';
import { FilaBoletin } from '../../../shared/components/fila-boletin/fila-boletin';

type TabPrograma = 'escuela-sabatica' | 'jovenes';

@Component({
  selector: 'app-programas-page',
  imports: [FilaBoletin],
  templateUrl: './programas-page.html',
  styleUrl: './programas-page.scss',
})
export class ProgramasPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly tabs: { clave: TabPrograma; etiqueta: string }[] = [
    { clave: 'escuela-sabatica', etiqueta: 'Escuela Sabática' },
    { clave: 'jovenes', etiqueta: 'Sociedad de Jóvenes' },
  ];

  protected readonly tabActiva = signal<TabPrograma>(
    this.route.snapshot.queryParamMap.get('tab') === 'jovenes' ? 'jovenes' : 'escuela-sabatica',
  );

  protected readonly programaJovenes: ProgramaJovenes = PROGRAMA_JOVENES_MOCK;

  protected readonly flujoEscuelaSabatica = computed<ParteBoletin[]>(() => {
    const seccion = BOLETIN_MOCK.escuelaSabatica;
    return [
      seccion.alabanzas,
      seccion.bienvenida,
      seccion.himnoInicial,
      seccion.lecturaBiblica,
      seccion.oracion,
      ...seccion.divisionClases,
      seccion.elMisionero,
      seccion.musicaEspecial,
      seccion.himnoFinal,
      seccion.oracionFinal,
    ].sort((a, b) => a.orden - b.orden);
  });

  protected seleccionarTab(tab: TabPrograma): void {
    this.tabActiva.set(tab);
  }
}
