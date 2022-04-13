import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';

import { PromptDialogComponent } from './prompt-dialog.component';

describe('PromptDialogComponent', () => {
  let component: PromptDialogComponent;
  let fixture: ComponentFixture<PromptDialogComponent>;
  let mockData = {
    events: [{
      createdBy: "dX87L2xMQPbMOj1wcvirwbSo37q2",
      title: "Comp 1600 Exam1",
      type: "core"
    }],
    freeSlots: {end: "2022-04-07T17:55:27.802Z", start: "2022-04-05T17:55:27.802Z"}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoMaterialModule, FormsModule],
      declarations: [ PromptDialogComponent ],
      providers: [
        //MatDialogRef,
      {provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}  },
        { provide: MAT_DIALOG_DATA,  useValue: mockData }
      ]
    })
    .compileComponents();
    //TestBed.inject(MatDialogRef)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    //expect(true).toBeTrue()
  });
});
