import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let setSpy: jasmine.Spy;
  let clearSpy: jasmine.Spy;

  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    setSpy = spyOn(localStorage, 'setItem');
    clearSpy = spyOn(localStorage, 'clear');
  });

  beforeEach(inject([AuthService], (authService: AuthService) => {
    service = authService;
  }));

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  it('login() should set localStorage', () => {

    setSpy.calls.reset();

    const testToken = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwidmVyaWZpZWQiOnRydWV9',
      'bIdS3nLkTnXR-wy2i46XwyimO_K0Or89Oxj5VafjC0k'
    ].join('.');

    service.login(testToken);

    expect(setSpy.calls.count()).toEqual(3);
    expect(setSpy.calls.argsFor(0)).toEqual(['token', JSON.stringify(testToken)]);
    expect(setSpy.calls.argsFor(1)).toEqual(['username', JSON.stringify('username')]);
    expect(setSpy.calls.argsFor(2)).toEqual(['isEmailVerified', JSON.stringify(true)]);
  });

  it('logout() should clear localStorage', () => {
    clearSpy.calls.reset();

    service.logout();

    expect(clearSpy.calls.count()).toEqual(1);
  });

  it('logged', () => {
    spyOn(localStorage, 'getItem').and.callFake((name: string) => {
      switch (name) {
        case 'username':
          return '"username"';
        case 'isEmailVerified':
          return 'true';
      }
    });

    expect(service.logged).toEqual(true);
    expect(service.loggedUnverified).toEqual(false);
    expect(service.username).toEqual('username');
  });

  it('loggedUnverified', () => {
    spyOn(localStorage, 'getItem').and.callFake((name: string) => {
      switch (name) {
        case 'username':
          return '"username"';
        case 'isEmailVerified':
          return 'false';
      }
    });

    expect(service.logged).toEqual(false);
    expect(service.loggedUnverified).toEqual(true);
    expect(service.username).toEqual('username');
  });

  it('not logged', () => {
    spyOn(localStorage, 'getItem').and.callFake((name: string) => {
      switch (name) {
        case 'username':
          return 'null';
        case 'isEmailVerified':
          return 'null';
      }
    });

    expect(service.logged).toEqual(false);
    expect(service.loggedUnverified).toEqual(false);
    expect(service.username).toEqual(null);
  });

  it('token', () => {
    spyOn(localStorage, 'getItem').and.callFake((name: string) => {
      switch (name) {
        case 'token':
          return '"aaaa.bbbb.cccc"';
      }
    });

    expect(service.header).toEqual('Bearer aaaa.bbbb.cccc');
    expect(service.token).toEqual('aaaa.bbbb.cccc');
  });
});
