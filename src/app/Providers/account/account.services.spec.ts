import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccountServices } from './account.services';

describe('AccountService', () => {
  let service: AccountServices;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AccountServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
