import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuvidasUbs } from './duvidas-ubs';

describe('DuvidasUbs', () => {
  let component: DuvidasUbs;
  let fixture: ComponentFixture<DuvidasUbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuvidasUbs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuvidasUbs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
