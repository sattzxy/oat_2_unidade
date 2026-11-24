import { Routes } from '@angular/router';
import { CaronasPage } from './pages/caronas/caronas';
import { ImpactoPage } from './pages/impacto/impacto';

// Cada rota liga um endereço a uma tela.
export const routes: Routes = [
  { path: '', component: CaronasPage, title: 'Caronas da Facul' },
  { path: 'impacto', component: ImpactoPage, title: 'Meu impacto · Caronas da Facul' },
  { path: '**', redirectTo: '' },
];
