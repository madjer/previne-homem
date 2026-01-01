import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaudeSexual } from './saude-sexual';

describe('SaudeSexual', () => {
  let component: SaudeSexual;
  let fixture: ComponentFixture<SaudeSexual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaudeSexual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaudeSexual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
