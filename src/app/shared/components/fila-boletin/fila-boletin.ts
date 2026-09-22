import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilaBoletinData {
  titulo: string;
  valor?: string;
  asignadoA: string | null;
}

export interface CandidatoSugerido {
  id: string;
  texto: string;
  autorNombre: string;
}

@Component({
  selector: 'app-fila-boletin',
  imports: [FormsModule],
  templateUrl: './fila-boletin.html',
  styleUrl: './fila-boletin.scss',
})
export class FilaBoletin {
  readonly parte = input.required<FilaBoletinData>();
  /** Si esta fila puede editarse (rol/ministerio con permiso sobre esta sección). */
  readonly editable = input(false);
  /** Contribuciones marcadas "candidato al boletín", para llenar el campo con un toque. */
  readonly candidatos = input<CandidatoSugerido[]>([]);

  readonly guardado = output<{ valor: string; asignadoA: string | null }>();

  protected readonly editando = signal(false);
  protected readonly valorEditado = signal('');
  protected readonly asignadoEditado = signal('');

  protected abrirEdicion(): void {
    if (!this.editable()) {
      return;
    }
    this.valorEditado.set(this.parte().valor ?? '');
    this.asignadoEditado.set(this.parte().asignadoA ?? '');
    this.editando.set(true);
  }

  protected usarCandidato(candidato: CandidatoSugerido): void {
    this.valorEditado.set(candidato.texto);
    this.asignadoEditado.set(candidato.autorNombre);
  }

  protected cancelar(): void {
    this.editando.set(false);
  }

  protected guardar(): void {
    this.guardado.emit({
      valor: this.valorEditado().trim(),
      asignadoA: this.asignadoEditado().trim() || null,
    });
    this.editando.set(false);
  }
}
