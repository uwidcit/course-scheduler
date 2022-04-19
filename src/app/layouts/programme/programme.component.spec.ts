import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

import { ProgrammeComponent } from './programme.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutes } from 'src/app/app.routing';
import { RouterModule } from '@angular/router';

describe('ProgrammeComponent', () => {
  let component: ProgrammeComponent;
  let fixture: ComponentFixture<ProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, DemoMaterialModule, Ng2SearchPipeModule, ReactiveFormsModule, MatIconModule, RouterModule.forRoot(AppRoutes)],
      declarations: [ ProgrammeComponent,SpinnerComponent ],
      providers: [
        //{provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}  }
         FirebaseDBServiceService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and check that a list of programmes is defined', () => {
    fixture.whenStable( )
    expect(component).toBeTruthy();

    let hostElement = fixture.nativeElement
    //console.log(typeof(hostElement), '\n\n\n', hostElement)
    const programmeList: HTMLInputElement = hostElement.querySelector('.side ');
    console.log(programmeList, '\n\n\n', )
    expect(programmeList).toBeDefined()
    const programmeItems: any = programmeList.querySelectorAll('.mat-selection-list .mat-list-item');
    //expect(true).toBeTrue()
    
    console.log('\n\n\n\n Programme Items', programmeItems)
    expect(programmeItems).toBeDefined()

    
    //expect(true).toBeTrue()
  });
});
