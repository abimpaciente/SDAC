import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ItemNav {
  etiqueta: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  protected readonly items: ItemNav[] = [
    { etiqueta: 'Inicio', ruta: '/inicio', icono: 'inicio' },
    { etiqueta: 'Compartir', ruta: '/compartir', icono: 'compartir' },
    { etiqueta: 'Boletín', ruta: '/boletin', icono: 'boletin' },
    { etiqueta: 'Programas', ruta: '/programas', icono: 'programas' },
  ];
}
