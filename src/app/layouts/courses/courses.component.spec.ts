import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';

import { CoursesComponent } from './courses.component';
import { environment } from 'src/environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutes } from 'src/app/app.routing';
import { RouterModule } from '@angular/router';


describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, DemoMaterialModule,
        BrowserAnimationsModule, ReactiveFormsModule, MatIconModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()), Ng2SearchPipeModule, RouterModule.forRoot(AppRoutes)
      ],
      declarations: [ CoursesComponent,SpinnerComponent ],
      providers: [
         FirebaseDBServiceService
      ]
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create  check that a list of courses is defined', ( done) => {
    expect(component).toBeTruthy();
    //To access HTML element from HTML template, the ComponentFixture provides debugElement and nativeElement.

    fixture.whenStable( )
    
    let hostElement = fixture.nativeElement
    //console.log(typeof(hostElement), '\n\n\n', hostElement)
    const courseList: HTMLInputElement = hostElement.querySelector('.side ');
    console.log(courseList, '\n\n\n', )
    expect(courseList).toBeDefined()
    const courseItems: any = courseList.querySelectorAll('.mat-selection-list .mat-list-item');
    //expect(true).toBeTrue()
    
    console.log('\n\n\n\nCourse Items', courseItems)
    expect(courseItems).toBeDefined()
    return done()
  });
});
