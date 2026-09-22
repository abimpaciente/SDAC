import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Evento } from '../../../core/models';
import { EVENTOS_MOCK } from '../../../shared/mock/eventos.mock';

interface AccesoDirecto {
  etiqueta: string;
  ruta: string;
  queryParams?: Record<string, string>;
  icono: string;
}

@Component({
  selector: 'app-inicio-page',
  imports: [RouterLink],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
})
export class InicioPage {
  protected readonly accesos: AccesoDirecto[] = [
    { etiqueta: 'Boletín', ruta: '/boletin', icono: 'boletin' },
    {
      etiqueta: 'Escuela Sabática',
      ruta: '/programas',
      queryParams: { tab: 'escuela-sabatica' },
      icono: 'escuela',
    },
    {
      etiqueta: 'Sociedad de Jóvenes',
      ruta: '/programas',
      queryParams: { tab: 'jovenes' },
      icono: 'jovenes',
    },
    { etiqueta: 'Compartir', ruta: '/compartir', icono: 'compartir' },
  ];

  protected readonly eventos: Evento[] = EVENTOS_MOCK;

  protected formatearFecha(fechaIso: string): string {
    return new Date(fechaIso).toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
