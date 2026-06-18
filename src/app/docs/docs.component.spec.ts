import { TestBed } from '@angular/core/testing';

import { DocsComponent } from './docs.component';

describe('DocsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsComponent],
    }).compileComponents();
  });

  it('documents the OAuth2 and API authentication endpoints', () => {
    const fixture = TestBed.createComponent(DocsComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('GET /oauth2/authorize');
    expect(content).toContain('POST /oauth2/token');
    expect(content).toContain('POST /auth/login');
    expect(content).toContain('GET /auth/me');
  });
});
