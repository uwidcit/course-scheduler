import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/app.routing';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';

import { CalendarComponent } from './calendar.component';
import { environment } from 'src/environments/environment';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, DemoMaterialModule,
        BrowserAnimationsModule, RouterModule.forRoot(AppRoutes),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
      ],
      declarations: [ CalendarComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}  },
        { provide: MAT_DIALOG_DATA, useValue: { update: false } },
         FirebaseDBServiceService, AuthenticationService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    //expect(true).toBeTrue()
  });
});
