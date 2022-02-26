import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeModalComponent } from './programme-modal.component';

describe('ProgrammeModalComponent', () => {
  let component: ProgrammeModalComponent;
  let fixture: ComponentFixture<ProgrammeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
