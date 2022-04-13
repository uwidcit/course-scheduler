import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { ProgrammeModalComponent } from './programme-modal.component';

describe('ProgrammeModalComponent', () => {
  let component: ProgrammeModalComponent;
  let fixture: ComponentFixture<ProgrammeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, BrowserModule, FormsModule,
        BrowserAnimationsModule,
        DemoMaterialModule
      ],
      declarations: [ ProgrammeModalComponent ],
      providers: [
        //MatDialogRef,
      {provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}  },
        { provide: MAT_DIALOG_DATA, useValue: { update: false } }
        , FirebaseDBServiceService
      ]
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
    //expect(true).toBeTrue()
  });
});
