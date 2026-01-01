import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoCheckup } from './resultado-checkup';

describe('ResultadoCheckup', () => {
  let component: ResultadoCheckup;
  let fixture: ComponentFixture<ResultadoCheckup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoCheckup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoCheckup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
