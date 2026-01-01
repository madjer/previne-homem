import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChicoAvatar } from './chico-avatar';

describe('ChicoAvatar', () => {
  let component: ChicoAvatar;
  let fixture: ComponentFixture<ChicoAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChicoAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChicoAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
