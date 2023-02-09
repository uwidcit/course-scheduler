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
  courseDegrees : string[] = new Array()
  assessments : {type: string, weighting: number}[]

  assessmentType : string = 'Exam'
  weighting: number = 1

  degreeList : string[] = [] //list of course from firebase


  constructor(
    public dialogRef: MatDialogRef<CoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseData,
    private _snackBar: MatSnackBar,
    private firebase: FirebaseDBServiceService

  ) { 
    this.courseCode =   data.update  ? data.course.courseName : '' //if data.update ==true initiale courseCode with "data.course.name" else empty string
    this.name = data.update  ? data.course.name : ''
    this.faculty = data.update  ? data.course.faculty : ''
    this.campus = data.update  ? data.course.campus : ''

    this.courseDegrees = data.update  ? Object.assign(this.courseDegrees, data.course.degrees) :  new Array()
    this.assessments = data.update  ? data.course.assessments : []

    
    
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

 
 
  isTotal(){ // checks that total assessment = 100%
    let sum = 0
    for ( let assessment of this.assessments)
      sum += assessment.weighting

      if ( sum != 100) return false

      return true
  }


  removeAssessmentRow(index: number){
    let assessment = this.assessments.splice(index, 1) //splice(start, deleteCount) : deletes n items
    let snackBarRef = this._snackBar.open( "Assessment removed!", "undo",{
      duration: 3000
    });

    snackBarRef.onAction().subscribe( ()=>{
      this.assessments.push(assessment[0])
      snackBarRef.dismiss();

      let newSnackBar = this._snackBar.open( "Assessment restored!", "close", {duration: 3000} )
      newSnackBar.onAction().subscribe( ()=>{
        newSnackBar.dismiss();
      })
    });
  }

  onSave(){
   
    
    if(this.name ==''){
      this.displayToast('Course Name is Required', 'close', 'error')
      return
    }
    else if(this.faculty ==''){
      this.displayToast('Faculty Name is Required', 'close', 'error')
      return
    }
    else if(this.campus ==''){
      this.displayToast('Faculty Name is Required', 'close', 'error')
      return
    }

    if( this.assessments.length==0 || !this.isTotal() ){
      this.displayToast('Course Asessments must be 100%', 'close', 'error')
      return 
    } 
    
    
 
    let newCourse: any = { name: this.name, faculty: this.faculty, campus: this.campus, assessments: this.assessments, degrees: this.courseDegrees}
    
    let created = this.firebase.updateCourse( newCourse, this.courseCode)
    if( !created )
      this.displayToast( "Course Saved", "close", "error" )
    
    this.dialogRef.close();
    
   
  console.log(newCourse)
  }

  onNoClick(){
    this.dialogRef.close(false);
  }



  displayToast(message: string, action: string, messageType:string){
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: messageType
    });

    snackBarRef.afterDismissed().subscribe(()=>{
      snackBarRef.dismiss()
    })
    //if action == "undo" push to array
  }

 

  addAssessment(){
    let sum = 0
    for ( let assessment of this.assessments)
      sum += assessment.weighting

    if ( sum + this.weighting > 100){
      this.displayToast('Course Assessments must equal 100%', 'close', 'error')
      return
    }


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
