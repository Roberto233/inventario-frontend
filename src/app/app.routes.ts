import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  {
    path: 'productos',
    loadComponent: () =>
      import('./productos/productos.component').then((m) => m.ProductosComponent),
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./historial/historial.component').then((m) => m.HistorialComponent),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./categorias/categorias.component').then(m => m.CategoriasComponent)
  },
    {
    path: 'reportes',
    loadComponent: () =>
      import('./reportes/reportes.component').then((m) => m.ReportesComponent),
  }
];
