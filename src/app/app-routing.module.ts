import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { PaginaAmministratoreComponent } from './pagina-amministratore/pagina-amministratore.component';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { AuthGuard } from './auth.guard'; // Importa il guard

/*,canActivate: [AuthGuard] */
/*,canActivate: [AuthGuard] */

const routes: Routes = [
  { path: '', component: RegistroFormComponent },  // Route per la pagina principale 
  { path: 'login', component: LoginAdminComponent},  // Route per la pagina di login_amdin
  { path: 'amministratore', component: PaginaAmministratoreComponent,canActivate: [AuthGuard]},  // Route per la pagina di amministrazione
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

