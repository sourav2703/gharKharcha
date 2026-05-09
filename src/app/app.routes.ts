import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },

  {
    path: 'home',
    canActivate: [authGuardGuard],
    loadComponent: () => import('../app/features/homes/home.component')
      .then(m => m.HomesComponent)
  },
 {
  path: 'dashboard/:id',
  loadComponent: () => import('./features/user/dashboard/dashboard.component')
    .then(m => m.DashboardComponent)
},
  {
  path: 'signup',
  loadComponent: () => import('./features/auth/signup/signup.component')
    .then(m => m.SignupComponent)
},
{
  path: 'add-expense/:id',
  loadComponent: () => import('./features/user/add-expense/add-expense.component')
    .then(m => m.AddExpenseComponent)
},
{
  path: 'view-expenses/:id',
  loadComponent: () =>
    import('../app/features/user/view-expense/view-expense.component')
      .then(m => m.ViewExpenseComponent)
}
];