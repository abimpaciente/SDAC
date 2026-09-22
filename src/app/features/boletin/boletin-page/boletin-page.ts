import { Component, computed, signal } from '@angular/core';

import { Boletin, ParteBoletin } from '../../../core/models';
import { BOLETIN_MOCK } from '../../../shared/mock/boletin.mock';
import { FilaBoletin } from '../../../shared/components/fila-boletin/fila-boletin';

type TabBoletin = 'escuelaSabatica' | 'culto' | 'anuncios';

@Component({
  selector: 'app-boletin-page',
  imports: [FilaBoletin],
  templateUrl: './boletin-page.html',
  styleUrl: './boletin-page.scss',
})
export class BoletinPage {
  protected readonly boletin: Boletin = BOLETIN_MOCK;

  protected readonly tabs: { clave: TabBoletin; etiqueta: string }[] = [
    { clave: 'escuelaSabatica', etiqueta: 'Escuela Sabática' },
    { clave: 'culto', etiqueta: 'Culto' },
    { clave: 'anuncios', etiqueta: 'Anuncios' },
  ];

  protected readonly tabActiva = signal<TabBoletin>('escuelaSabatica');

  protected readonly partesEscuelaSabatica = computed<ParteBoletin[]>(() => {
    const seccion = this.boletin.escuelaSabatica;
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

  protected readonly partesCulto = computed<ParteBoletin[]>(() => {
    const seccion = this.boletin.culto;
    return Object.values(seccion).sort((a, b) => a.orden - b.orden);
  });

  protected seleccionarTab(tab: TabBoletin): void {
    this.tabActiva.set(tab);
  }

  protected exportarPdf(): void {
    window.print();
  }

  protected formatearAnuncio(texto: string): string {
    return texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
