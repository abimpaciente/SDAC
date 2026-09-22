import { Component, computed, input, output } from '@angular/core';

import { Contribucion } from '../../../core/models';
import { TIPOS_CONTRIBUCION } from '../../utils/tipos-contribucion';

@Component({
  selector: 'app-contribucion-card',
  imports: [],
  templateUrl: './contribucion-card.html',
  styleUrl: './contribucion-card.scss',
})
export class ContribucionCard {
  readonly contribucion = input.required<Contribucion>();
  /** Si el visitante puede marcar/desmarcar candidato (requiere sesión). */
  readonly puedeMarcarCandidato = input(false);

  readonly candidatoAlternado = output<Contribucion>();

  protected readonly tipoInfo = computed(() =>
    TIPOS_CONTRIBUCION.find((t) => t.valor === this.contribucion().tipo),
  );

  protected formatearFecha(fechaIso: string): string {
    return new Date(fechaIso).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
