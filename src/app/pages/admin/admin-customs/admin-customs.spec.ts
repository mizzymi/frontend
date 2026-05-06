import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustoms } from './admin-customs';

describe('AdminCustoms', () => {
  let component: AdminCustoms;
  let fixture: ComponentFixture<AdminCustoms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustoms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustoms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
