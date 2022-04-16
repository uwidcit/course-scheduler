import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';

import { AdminComponent } from './admin.component';
import { environment } from 'src/environments/environment';
import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { AppRoutes } from 'src/app/app.routing';
import { RouterModule } from '@angular/router';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        HotToastModule.forRoot(),
        RouterModule.forRoot(AppRoutes),
      ],
      declarations: [ AdminComponent ],
      providers: [
         FirebaseDBServiceService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    //expect(true).toBeTrue()
  });
});
