import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HigieneIntima } from './higiene-intima';

describe('HigieneIntima', () => {
  let component: HigieneIntima;
  let fixture: ComponentFixture<HigieneIntima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HigieneIntima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HigieneIntima);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
