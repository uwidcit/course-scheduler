import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoursesComponent } from '../courses/courses.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { onValue, ref } from 'firebase/database';



interface CourseData{
  update: boolean,
  course:any
}

@Component({
  selector: 'app-course-modal',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss']
})
export class CourseModalComponent implements OnInit {

  courseCode: string
  name : string
  faculty: string
  campus : string
  courseDegrees : string[]
  assessments : {type: string, weighting: number}[]

  assessmentType : string = 'exam'
  weighting: number = 1

  degreeList : string[] = [] //list of course from firebase

  separatorKeysCodes: number[] = [ENTER, COMMA];
  degreeCtrl = new FormControl();
  filteredDegrees: Observable<string[]>;
  @ViewChild('degreeInput') fruitInput: ElementRef<HTMLInputElement> | any;

  removedDegrees : string[] = []
  addedDegrees  : string[] = []

  constructor(
    public dialogRef: MatDialogRef<CoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseData,
    private _snackBar: MatSnackBar,
    private firebase: FirebaseDBServiceService

  ) { 
    this.courseCode =   data.update  ? data.course.name : ''  //if data.update ==true initiale courseCode with "data.course.name" else empty string
    this.name = data.update  ? data.course.name : ''
    this.faculty = data.update  ? data.course.faculty : ''
    this.campus = data.update  ? data.course.campus : ''

    this.courseDegrees = data.update  ? data.course.degrees : []
    this.assessments = data.update  ? data.course.assessments : []

    
    //Autocomplete
    this.filteredDegrees = this.degreeCtrl.valueChanges.pipe(
      startWith(null),
      map((degree: string | null) => (degree ? this._filter(degree) : this.degreeList.slice())),
    );

    //Get firebase data
    const tablesRef = ref(this.firebase.dbRef, '/coursesPerProgramme');
    onValue(tablesRef, (snapshot) => {
      for (let i=0;i< this.courseDegrees.length; i++){
        this.courseDegrees.pop()
      }
      const data = snapshot.val();

      if (!data)return

      this.degreeList.length = 0
      Object.entries(data).forEach((entry: any)=>{
        const [key,value]= entry;
        this.degreeList.push(key)
      })
    });
  }

  ngOnInit(): void {

  }

  isDuplicateDegree(name: string){

  //console.log("Duplicate funct: " + name);

   if( this.courseDegrees.length == 0) 
      return false
    for(let degree of this.courseDegrees)
      if(degree == name)
        return true
    
    return false
  }
 
 
  isTotal(){ // checks that total assessment = 100%
    let sum = 0
    for ( let assessment of this.assessments)
      sum += assessment.weighting

      if ( sum != 100) return false

      return true
  }

  removeDegree(index: number){
    return this.courseDegrees.splice(index, 1) //splice(start, deleteCount) : deletes n items
  }

  removeAssessmentRow(index: number){
    return this.assessments.splice(index, 1) //splice(start, deleteCount) : deletes n items
  }

  onSave(){
   
    
    if(this.name =='' || this.degreeList.length== 0 || this.assessments.length==0) return 
    //retrun msg

 
    let newCourse: any = { name: this.name, faculty: this.faculty, campus: this.campus, assessments: this.assessments, degrees: this.courseDegrees}
    
    //write to database 
    
/*
    let notFoundMsg = ""
    for( let course1 of this.addedCourses){
      let successful = await this.firebase.updateCourseDegree(this.name, course1, true)
      if ( !successful ) notFoundMsg += course1 + "\n "
    }
      

    for( let course2 of this.removedCourses){
      let successful = await this.firebase.updateCourseDegree(this.name, course2, false)
      if ( !successful ) notFoundMsg += course2 + "\n "
    }
    
    console.log("Saving ", newProgramme)
    if (notFoundMsg != ""){
      this.displayMsg(notFoundMsg + "were not found to be updated!")
      
    }
    else
      this.writeProgramme(newProgramme, this.name)
    this.dialogRef.close();
    
    */

  }

  onNoClick(){
    this.dialogRef.close();
  }



  displayToast(message: string, action: string){
    this._snackBar.open(message, action);

    //if action == "undo" push to array
  }

  // AUTOCOMPLETE STUFF
  selected(event: MatAutocompleteSelectedEvent): void {
    if( this.isDuplicateDegree(event.option.viewValue) ){
      //add display message
      return
    }
    
    this.courseDegrees.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.degreeCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.courseDegrees.filter(degree => degree.toLowerCase().includes(filterValue));
  }

  addDegree(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our degree

    let newDegree = ''
    if (value  && this.isDuplicateDegree(value)) {
      
      newDegree = value
    }

    // Clear the input value
    event.chipInput!.clear();
    this.degreeCtrl.setValue(null);

    if(newDegree == '') return
    
    //if the co
    if( this.isDuplicateDegree(newDegree) )
      this.addedDegrees.push(newDegree)
    this.courseDegrees.push(newDegree);
    let snackBarRef = this._snackBar.open( "Degree added!", "undo",{
      duration: 3000
    });

    snackBarRef.onAction().subscribe( ()=>{
      this.courseDegrees.pop()
      if( this.addedDegrees.includes(newDegree) ){
        this.addedDegrees.pop()
      }
      snackBarRef.dismiss();

      let newSnackBar = this._snackBar.open( "Degree removed!", "close", {duration: 3000} )
      newSnackBar.onAction().subscribe( ()=>{
        newSnackBar.dismiss();
      })
    });
  }

  addAssessment(){
    this.assessments.push({type: this.assessmentType, weighting: this.weighting})
    let snackBarRef = this._snackBar.open( "Assessment added!", "undo",{
      duration: 3000
    });

    snackBarRef.onAction().subscribe( ()=>{
      this.assessments.pop()
      snackBarRef.dismiss();

      let newSnackBar = this._snackBar.open( "Assessment deleted!", "close", {duration: 3000} )
      newSnackBar.onAction().subscribe( ()=>{
        newSnackBar.dismiss();
      })
    });
  }


}
