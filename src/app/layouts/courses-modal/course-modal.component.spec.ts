import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { CourseModalComponent } from './course-modal.component';

describe('CourseModalComponent', () => {
  let component: CourseModalComponent;
  let fixture: ComponentFixture<CourseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, DemoMaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [ CourseModalComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}  },
        { provide: MAT_DIALOG_DATA, useValue: { update: false } },
         FirebaseDBServiceService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    //expect(true).toBeTrue()
  });
});
