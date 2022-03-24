import { Component, OnInit } from '@angular/core';
import { onValue, ref } from 'firebase/database';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { CourseModalComponent } from '../courses-modal/course-modal.component';

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


  constructor(private firebase:FirebaseDBServiceService,  public dialog: MatDialog) { 
   
   
    const tableRef = ref( this.firebase.dbRef,'courses');
    onValue(tableRef, (snapshot)=>{
      const data = snapshot.val();

      if( !data ) this.filteredCourse.length = 0
      
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
    this.firebase.deleteProgramme(`${this.currentCourse?.name}`)
  }

  openDialog(update: boolean){

    let data: any
    if(update)
      data = {update:update, course: this.currentCourse}
    else  
      data = {update: update}
    let dialog = this.dialog.open(CourseModalComponent, {
      data: data,
      width: '96vw',
      height: '90vh'
    })

    
  }

}
