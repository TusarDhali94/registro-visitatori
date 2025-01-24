import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DatiVisitatoriService } from '../dati-visitatori.service';
import SignaturePad from 'signature_pad';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; // Importa NgForm
import { MatDialog } from '@angular/material/dialog';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.css']
})

export class RegistroFormComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  isChecked = false; // Stato iniziale del checkbox

  visitatori = {
    Operatore: '',
    RiferenteInterno: '',
    Ditta: '',
    Email: '',
    FirmaIn: '', // Firma di ingresso
    FirmaOut: '', // Firma di uscita
    DataUscita: '' // Data di uscita
  };

  constructor(private datiVisitatoriService: DatiVisitatoriService, private router: Router,private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.signaturePad = new SignaturePad(canvas, {
      backgroundColor: '#fff',
      penColor: 'black'
    });
  }

  onNavigate() {
    // Naviga alla pagina Admin
    this.datiVisitatoriService.bntcliccoAdmin();
    this.router.navigate(['/login']);
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  saveSignature(isExit: boolean): void {
    if (!this.signaturePad.isEmpty()) {
      if (isExit) {

        const dataCorrente = new Date();
        // Ottieni la data in formato ISO ma con l'ora locale
        const dataLocale = new Date(dataCorrente.getTime() - dataCorrente.getTimezoneOffset() * 60000).toISOString();
        this.visitatori.FirmaOut = this.signaturePad.toDataURL(); // Salva la firma di uscita
        this.visitatori.DataUscita = dataLocale; // Salva la data di uscita in formato ISO con orario locale
        console.log('Firma di uscita salvata:', this.visitatori.FirmaOut);
         this.visitatori.FirmaIn = ''
      } else {
        this.visitatori.FirmaIn = this.signaturePad.toDataURL(); // Salva la firma di ingresso
        console.log('Firma di ingresso salvata:', this.visitatori.FirmaIn);
        this.visitatori.FirmaOut = ''; // Assicurati che la firma di uscita sia vuota
        this.visitatori.DataUscita = ''; // Pulisce la data di uscita
      }
    } else {
     /* alert('La firma è vuota. Per favore, firma prima di salvare.');*/
      this.dialog.open(PopupMessageComponent, {
        width: '400px',
        data: {
          title: 'Errore',
          message: 'La firma è vuota. Per favore, firma prima di salvare.',
          type: 'error' // Errore
        }
      });
    }
  }

  onSubmit(visitorForm: NgForm): void {
    if (this.signaturePad.isEmpty()) {
      /*alert('Per favore, aggiungi la tua firma prima di inviare il modulo.');*/
      this.dialog.open(PopupMessageComponent, {
        width: '400px',
        data: {
          title: 'Errore',
          message: 'Per favore, aggiungi la tua firma prima di inviare il modulo.',
          type: 'error' // Errore
        }
      });
      return;
    }

    if (this.isChecked) {
      // Se è selezionata l'uscita
      this.saveSignature(true); // Salva la firma di uscita
      this.datiVisitatoriService.aggionraDataUscita({
        Operatore: this.visitatori.Operatore,
        FirmaOut: this.visitatori.FirmaOut,
        DataUscita: this.visitatori.DataUscita
      }).subscribe(
        (response) => {
          this.dialog.open(PopupMessageComponent, {
            width: '400px',
            data: {
              title: 'Operazione riuscita',
              message: 'Uscita registrata con successo!',
              type: 'success' // Successo
            }
          });
          this.clearSignature();
          this.resetForm(visitorForm);
        },
        (error) => {
         /*alert('Errore durante la registrazione dell\'uscita');*/
         this.dialog.open(PopupMessageComponent, {
          width: '400px',
          data: {
            title: 'Errore',
            message: `Errore durante la registrazione dell'uscita: ${this.visitatori.Operatore} non ha ancora registrato l'entrata`,
            type: 'error' // Errore
          }
        });
           console.log(error)
        }
      );
    } else {
      // Se è selezionato l'ingresso
      this.saveSignature(false); // Salva la firma di ingresso
      this.datiVisitatoriService.saveVisitor(this.visitatori).subscribe(
        (response) => {
          /*alert('Visitatore registrato con successo!');*/
          this.dialog.open(PopupMessageComponent, {
            width: '400px',
            data: {
              title: 'Operazione riuscita',
              message: 'Visitatore registrato con successo!',
              type: 'success' // Successo
            }
          });
          
          console.log(response);
          this.clearSignature();
          this.resetForm(visitorForm);
        },
        (error) => {
          /*alert('Errore durante la registrazione del visitatore');*/
          this.dialog.open(PopupMessageComponent, {
            width: '400px',
            data: {
              title: 'Errore',
              message: 'Manca la firma di uscita per l\'entrata precedente. Si prega di firmare per completare la nuova entrata.',
              type: 'error' // Errore
            }
          });
          console.error(error);
        }
      );
    }
  }

  resetForm(visitorForm: NgForm): void {
    // Resetta lo stato di validità e toccamento del modulo
    visitorForm.resetForm();
    // Resetta i dati del visitatore
    this.visitatori = {
      Operatore: "",
      RiferenteInterno: "",
      Ditta: "",
      Email: "",
      FirmaIn: "",
      FirmaOut: "",
      DataUscita: ""
    };
    
    this.isChecked = false;
  }
}
