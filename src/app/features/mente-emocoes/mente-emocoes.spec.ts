import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteEmocoes } from './mente-emocoes';

describe('MenteEmocoes', () => {
  let component: MenteEmocoes;
  let fixture: ComponentFixture<MenteEmocoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenteEmocoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenteEmocoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
