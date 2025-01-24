import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { PaginaAmministratoreComponent } from './pagina-amministratore/pagina-amministratore.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Importa MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core';
import { PopupMessageComponent } from './popup-message/popup-message.component'; // Importa MatNativeDateModule
import { MatDialogModule } from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    AppComponent,
    RegistroFormComponent,
    PaginaAmministratoreComponent,
    LoginAdminComponent,
    PopupMessageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDatepickerModule, // Aggiungi MatDatepickerModule
    MatNativeDateModule, // Aggiungi MatNativeDateModule
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule



    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
