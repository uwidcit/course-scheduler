import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { MatIconModule } from '@angular/material/icon';

import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { LoginComponent } from '../login/login.component';

const AppRoutes : Routes = [
  {
      path: '',
      component: FullComponent,
      children: [
          
          {
              path: 'views',
              loadChildren: () => import('../../starter/starter.module').then(m => m.StarterModule)
              
          }
          
      ]
  },{
      path: 'login',
      component: LoginComponent
     },
     {
      path: '**',
      redirectTo: '/login',
      pathMatch: 'full'
  },
];

describe('Integration Testing - Full Component', () => {
  let component: FullComponent;
  let fixture: ComponentFixture<FullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule
      ],
      declarations: [  ],
      providers: [
         {provide:AppModule, useValue: { AppRoutes: AppRoutes } }
      ]
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create an integrated compoenent', async( done) => {
      
      //To access HTML element from HTML template, the ComponentFixture provides debugElement and nativeElement.
  
      fixture.whenStable( )
      expect(fixture.debugElement.componentInstance).toBeTruthy();
      return done()
    });
 
});
