import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio-page/inicio-page').then((m) => m.InicioPage),
  },
  {
    path: 'compartir',
    loadComponent: () =>
      import('./features/compartir/compartir-page/compartir-page').then((m) => m.CompartirPage),
  },
  {
    path: 'boletin',
    loadComponent: () =>
      import('./features/boletin/boletin-page/boletin-page').then((m) => m.BoletinPage),
  },
  {
    path: 'programas',
    loadComponent: () =>
      import('./features/programas/programas-page/programas-page').then((m) => m.ProgramasPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'admin/miembros',
    loadComponent: () =>
      import('./features/admin/miembros-page/miembros-page').then((m) => m.MiembrosPage),
  },
  { path: '**', redirectTo: 'inicio' },
];
