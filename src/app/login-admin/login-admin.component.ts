import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatiVisitatoriService } from '../dati-visitatori.service';
@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  errorMessage: string | null = null;


  constructor(private router: Router,private datiVisitatoriService: DatiVisitatoriService ) {}

  validareLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;

    this.datiVisitatoriService.recuperoDatiAdmin(username, password).subscribe(
      (response) => {
        console.log('Login effettuato con successo:', response);
        this.datiVisitatoriService.login(username, password); // Imposta autenticazione
        this.router.navigate(['/amministratore']);
      },
      (error) => {
        console.error('Errore nel login:', error);
        this.errorMessage = error.error.message || 'Credenziali non valide.';
      }
    );
  }

  PaginaRegistro() {
    // Naviga alla pagina Admin
    this.router.navigate(['/']);
  }
}
