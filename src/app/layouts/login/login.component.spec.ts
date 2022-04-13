import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { LoginComponent } from './login.component';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, DemoMaterialModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
        AuthenticationService,
        Auth,
        FirebaseDBServiceService,
        Router, HotToastService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
