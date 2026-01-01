import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpoExames } from './corpo-exames';

describe('CorpoExames', () => {
  let component: CorpoExames;
  let fixture: ComponentFixture<CorpoExames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpoExames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpoExames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
