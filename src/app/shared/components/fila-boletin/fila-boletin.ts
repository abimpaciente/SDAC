import { Component, input } from '@angular/core';

export interface FilaBoletinData {
  titulo: string;
  valor?: string;
  asignadoA: string | null;
}

@Component({
  selector: 'app-fila-boletin',
  imports: [],
  templateUrl: './fila-boletin.html',
  styleUrl: './fila-boletin.scss',
})
export class FilaBoletin {
  readonly parte = input.required<FilaBoletinData>();
}
