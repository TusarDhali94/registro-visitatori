import { TestBed } from '@angular/core/testing';

import { DatiVisitatoriService } from './dati-visitatori.service';

describe('DatiVisitatoriService', () => {
  let service: DatiVisitatoriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatiVisitatoriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
