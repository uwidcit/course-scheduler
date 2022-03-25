import { Component, OnInit } from '@angular/core';
import { onValue, ref } from 'firebase/database';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { CourseModalComponent } from '../courses-modal/course-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

//import { forEach,sum} from 'lodash';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  filteredCourse : any = new Array()
  
  currIndex:number = -1  // position of selected course in array
  selected: boolean = false;
  currentCourse : any
  filterTerm: string = ''


  constructor(private firebase:FirebaseDBServiceService,  public dialog: MatDialog, private snackbar: MatSnackBar) { 
   
   
    const tableRef = ref( this.firebase.dbRef,'courses');
    onValue(tableRef, (snapshot)=>{
      const data = snapshot.val();

      if( !data ) return
      
      this.filteredCourse.length = 0
      
      //iterate JSON object as an array
      Object.entries(data).forEach( (entry: any)=>{
          const [coursesName , coursesInfo] = entry

      
          //console.log( degreeInfo[key])
          let course: any = {courseName: coursesName, faculty: coursesInfo.faculty, campus: coursesInfo.campus, degrees: coursesInfo.degrees, assessments: coursesInfo.assessments, name: coursesInfo.name}
          console.log("New Course: ",  course)
          //this.courseList.push(course)
      
          this.filteredCourse.push(course)
          //console.log(this.courseList)  
      });
      
      if(this.currIndex!= -1){
        this.currentCourse = this.filteredCourse[this.currIndex];
      }
      
      //Object.assign(this.filteredCourse, this.courseList)
      console.log( 'Course LiSt ',  this.filteredCourse)
    })
  }

  ngOnInit(): void {
    
  }

  selectCourse( index : number ){
    //this.currDegree = this.degrees.find( degree => degree.name == degreeName)
    this.currIndex = index
    this.currentCourse = this.filteredCourse[index]
    console.log("Currently Selected: ", this.currentCourse)
    //console.log(this.currentCourse.courseName)
    this.selected = true
  }

  deleteCourse(){
    this.firebase.deleteCourse(`${this.currentCourse.courseName}`)
  }

  openDialog(update: boolean){

    let data: any = {update: update}
    if(update)
      data.course = JSON.parse(JSON.stringify(this.currentCourse))
    
      let dialogRef = this.dialog.open(CourseModalComponent, {
        data: data,
        width: '96vw',
        height: '90vh'
      })
  
      dialogRef.afterClosed().subscribe((response)=>{
        console.log("\n\nREUTRNED FROM COURSE MODAL: ", response)
        if( response )
          this.displayMessage( 'Course Updated!', 'info')
      })
  }

  displayMessage(message: string, messageType:string){
    let snackBarRef = this.snackbar.open( message, 'close', {duration: 1000, panelClass: messageType})

    snackBarRef.onAction().subscribe(()=>{
      snackBarRef.dismiss()
    })
  }

}
