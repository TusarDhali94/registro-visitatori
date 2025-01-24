import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flatMap, Observable } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class DatiVisitatoriService {
  private strApi: string[] = ['visitors', 'adminUtente','recuperaVisitatori','firmaUscita'];
  private apiUrl = 'http://localhost:3000/api/';
  
  private autenticato :boolean = false ;
  private btncliccato : boolean = false ;
  constructor(private http: HttpClient) { }

   
  //Serve per salvare i dati dei visitatori inviati dal form
  saveVisitor(visitor: any): Observable<any> {
    return this.http.post(this.apiUrl+this.strApi[0], visitor);
  }
 
  // Metodo per inivare i dati al server per verificare se qual specifico utente è autorizzato per visulizzare i dati 
  recuperoDatiAdmin(username: string, password: string): Observable<any> {
    const datilogin = { nome_utente: username, password: password };
    return this.http.post<any>(this.apiUrl+this.strApi[1], datilogin);
  }

  // Metodo per ottenere i visitara dall'backend 
  getVisitatori(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+this.strApi[2]);
  }


  /*Funzione che aggiorna dataUscita Basando su operatore e data corrente */

  aggionraDataUscita(datiUscita: {Operatore: string; FirmaOut: string; DataUscita: string }) {
    return this.http.put(this.apiUrl+this.strApi[3], datiUscita);
  }


  login(username: string, password: string): void {
    this.autenticato = true;
  }

  logout(): void {
    this.autenticato = false;
  }



  isAuthenticated(): boolean {
    return this.autenticato;
  }
  



  
/*Queste funzione serve per impedire entrare nalla pagine Login senza cliccare sul bottone */

  bntcliccoAdmin():void{
   this.btncliccato=true
  }  

  bntNcliccoAdmin():void{
    this.btncliccato=false
  }  


  isBtnClick():boolean{
    return this.btncliccato;
  }
   
}
