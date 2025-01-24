import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-message',
  template: `
    <div class="popup-container">
      <div class="icon-container">
        <mat-icon [class.success-icon]="data.type === 'success'" [class.error-icon]="data.type === 'error'">
          {{ data.type === 'success' ? 'check_circle' : 'error' }}
        </mat-icon>
      </div>
      <h1 mat-dialog-title>{{ data.title }}</h1>
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="onClose()">Chiudi</button>
      </div>
    </div>
  `,
  styles: [
    `
      .popup-container {
        text-align: center;
        padding: 20px;
      }
      .icon-container {
        margin-bottom: 10px;
      }
      .mat-icon {
        height: 44px;
        width: 45px;
     }   
      .success-icon {
        color: green;
        font-size: 48px;
      }
      .error-icon {
        color: red;
        font-size: 48px;
      }
      h1 {
        font-size: 24px;
        margin: 10px 0;
      }
      p {
        font-size: 16px;
        color: #555;
      }
      mat-dialog-actions {
        display: flex;
        justify-content: center;
      }

    .icon-container[_ngcontent-fwr-c18] {
      margin-bottom: -22px;
     }
    `
  ]
})
export class PopupMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
