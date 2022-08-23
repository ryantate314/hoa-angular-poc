import { TestBed } from '@angular/core/testing';

import { FakeBackEndInterceptor } from './fake-back-end.interceptor';

describe('FakeBackEndInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FakeBackEndInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FakeBackEndInterceptor = TestBed.inject(FakeBackEndInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
