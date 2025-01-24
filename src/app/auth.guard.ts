import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DatiVisitatoriService } from './dati-visitatori.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private datiVisitatoriService: DatiVisitatoriService) { }
  private bFlag : boolean = false
  canActivate(): boolean {
    if (this.datiVisitatoriService.isAuthenticated()) {
      this.bFlag = true; // Accesso consentito
    } else {
      this.router.navigate(['/login']); // Reindirizza al login
      this.bFlag = false;
    }
    
    // Verifica se il pulsante è stato cliccato
    if (this.datiVisitatoriService.isBtnClick()) {
      this.bFlag = true; // Consenti l'accesso alla pagina Admin
    } else {
      // Se il pulsante non è stato cliccato, reindirizza alla home
      this.router.navigate(['/']);
      this.bFlag = false; // Impedisci l'accesso
    }
    return this.bFlag
  }
}
