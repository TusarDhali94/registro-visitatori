import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatiVisitatoriService } from '../dati-visitatori.service';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-pagina-amministratore',
  templateUrl: './pagina-amministratore.component.html',
  styleUrls: ['./pagina-amministratore.component.css']
})
export class PaginaAmministratoreComponent implements OnInit, AfterViewInit {
  colonne: string[] = ['Operatore', 'RiferenteInterno', 'Ditta', 'Email', 'FirmaIn', 'DataEntrata', 'FirmaOut', 'DataUscita'];
  dataSource = new MatTableDataSource<any>(); // Usa MatTableDataSource per i dati
  filtroNome: string = '';
  dateSelezionate: Date | null = null;
  


  @ViewChild(MatPaginator) paginator!: MatPaginator; // Aggiungi un ViewChild per il paginator
  @ViewChild(MatSort) sort!: MatSort;  // Aggiungi il ViewChild per MatSort

  constructor(private router: Router, private datiVisitatoriService: DatiVisitatoriService) {}

  ngOnInit(): void {
    this.datiVisitatoriService.getVisitatori().subscribe((data) => {
      this.dataSource.data = data; // Assegno i dati alla sorgente
     
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Configuriamo il paginator
    this.dataSource.sort = this.sort; // Inizializza il MatSort
  }

  esciAdmin() {
    this.router.navigate(['/login']);
    this.datiVisitatoriService.logout();
  }

  /*stampaTabella() {
    const dataCorrente = new Date().toLocaleString();
    const contenutoDaStampare = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 2px solid #ddd;
            padding: 8px;
          }
          th {
            text-align: left;
            background-color: #f4f4f4;
          }
          img.logo {
            display: block;
            margin: 0 auto;
            max-height: 80px;
          }
          h1 {
            margin: 10px 0;
          }
          p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
          <h1 style="margin: 0;">REGISTRO ACCESSI</h1>
          <img src="https://www.warehouse-logistics.com/Website/images/AnbieterLogos/Anbieter_38.jpg" class="logo" alt="Logo" style="max-height: 80px;">
          <p style="margin: 0;">Data di stampa: ${dataCorrente}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${this.colonne.map(col => `<th>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${this.dataSource.data.map((visitatore: any) => `
              <tr>
                <td>${visitatore.Operatore}</td>
                <td>${visitatore.RiferenteInterno}</td>
                <td>${visitatore.Ditta}</td>
                <td>${visitatore.Email}</td>
                <td>${visitatore.FirmaIn ? `<img src="${visitatore.FirmaIn}" style="max-height: 50px;">` : ''}</td>
                <td>${new Date(visitatore.DataEntrata).toLocaleString('it-IT', {
                  timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}</td>
                <td>${visitatore.FirmaOut ? `<img src="${visitatore.FirmaOut}" style="max-height: 50px;">` : ''}</td>
                <td>${new Date(visitatore.DataUscita).toLocaleString('it-IT', {
                  timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const finestraStampa = window.open('', '_blank');
    finestraStampa!.document.write(contenutoDaStampare);
    finestraStampa!.document.close();
    finestraStampa!.focus();
    finestraStampa!.onload = () => finestraStampa!.print();
  }*/


    stampaTabella() {
      // Se la data selezionata esiste, la usiamo come filtro
      const selectedDate = this.dateSelezionate ? this.dateSelezionate.toLocaleDateString('it-IT') : null;
      
      // Filtro i dati in base alla data selezionata
      const filteredData = selectedDate ? this.dataSource.data.filter((visitatore: any) => {
        // Converte la DataEntrata del visitatore in formato stringa (solo data, senza ora)
        const visitatoreDate = new Date(visitatore.DataEntrata).toLocaleDateString('it-IT');
        return visitatoreDate === selectedDate; // Confronta la data
      }) : this.dataSource.data; // Se non c'è una data selezionata, usa tutti i dati
      
      // Se non ci sono dati da stampare, mostriamo un messaggio
      if (filteredData.length === 0) {
        alert('Non ci sono dati per la data selezionata.');
        return;
      }
    
      const dataCorrente = new Date().toLocaleString();
      const contenutoDaStampare = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 2px solid #ddd;
              padding: 8px;
            }
            th {
              text-align: left;
              background-color: #f4f4f4;
            }
            img.logo {
              display: block;
              margin: 0 auto;
              max-height: 80px;
            }
            h1 {
              margin: 10px 0;
            }
            p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
            <h1 style="margin: 0;">REGISTRO ACCESSI</h1>
            <img src="https://www.warehouse-logistics.com/Website/images/AnbieterLogos/Anbieter_38.jpg" class="logo" alt="Logo" style="max-height: 80px;">
            <p style="margin: 0;">Data di stampa: ${dataCorrente}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${this.colonne.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((visitatore: any) => `
                <tr>
                  <td>${visitatore.Operatore}</td>
                  <td>${visitatore.RiferenteInterno}</td>
                  <td>${visitatore.Ditta}</td>
                  <td>${visitatore.Email}</td>
                  <td>${visitatore.FirmaIn ? `<img src="${visitatore.FirmaIn}" style="max-height: 50px;">` : ''}</td>
                  <td>${new Date(visitatore.DataEntrata).toLocaleString('it-IT', {
                    timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}</td>
                  <td>${visitatore.FirmaOut ? `<img src="${visitatore.FirmaOut}" style="max-height: 50px;">` : ''}</td>
                  <td>${new Date(visitatore.DataUscita).toLocaleString('it-IT', {
                    timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
    
      const finestraStampa = window.open('', '_blank');
      finestraStampa!.document.write(contenutoDaStampare);
      finestraStampa!.document.close();
      finestraStampa!.focus();
      finestraStampa!.onload = () => finestraStampa!.print();
    }
    
  FiltroTramiteData() {
    if (this.dateSelezionate) {
      const selectedDateString = this.dateSelezionate.toLocaleDateString('it-IT');
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const visitatoreDate = new Date(data.DataEntrata).toLocaleDateString('it-IT');
        return visitatoreDate === filter;
      };
      this.dataSource.filter = selectedDateString; // Imposta il filtro sulla data selezionata
    } else  {
      // Ripristina i dati originali senza filtro
      this.datiVisitatoriService.getVisitatori().subscribe((data) => {
        this.dataSource.data = data; // Ripristina i dati originali
      });
    }
  }
  

  

  FiltroTramiteNome() {
    const nomeLower = this.filtroNome.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const name = data.Operatore ? data.Operatore.toLowerCase() : '';
      return name.includes(filter);
    };
    this.dataSource.filter = nomeLower;
  }
  

 
   
  
}
