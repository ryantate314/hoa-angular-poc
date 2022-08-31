import { TestBed } from '@angular/core/testing';

import { PlotsResolver } from './plots.resolver';

describe('PlotsResolver', () => {
  let resolver: PlotsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PlotsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
