import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAmministratoreComponent } from './pagina-amministratore.component';

describe('PaginaAmministratoreComponent', () => {
  let component: PaginaAmministratoreComponent;
  let fixture: ComponentFixture<PaginaAmministratoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaAmministratoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaAmministratoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
