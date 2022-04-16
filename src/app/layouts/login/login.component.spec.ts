import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { AppRoutes } from 'src/app/app.routing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HotToastModule.forRoot(),
        RouterModule.forRoot(AppRoutes),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
      ],
      declarations: [ LoginComponent ],
      providers: [
        AuthenticationService//, Auth
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    //expect(true).toBeTrue()

    //To access HTML element from HTML template, the ComponentFixture provides debugElement and nativeElement.
    let hostElement = fixture.nativeElement
    //console.log(typeof(hostElement), '\n\n\n', hostElement)
    const emailInput: HTMLInputElement = hostElement.querySelector('.login-fields #email');
    const passwordInput: HTMLInputElement = hostElement.querySelector('.login-fields #password');

    expect(emailInput).toBeTruthy()
    expect(passwordInput).toBeTruthy()
    // emailInput.value = ''
    // passwordInput.value = ''
    //fixture.componentInstance.submit()
    done()
    return
  });
});
