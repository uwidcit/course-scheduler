import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { onValue, ref } from 'firebase/database';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { ProgrammeModalComponent } from '../programme-modal/programme-modal.component';

@Component({
  selector: 'app-programmes',
  templateUrl: './programme.component.html',
  styleUrls: ['./programme.component.scss']
})

export class ProgrammeComponent implements OnInit {

  degrees: { name: string, courses: {}}[] = [];
  selected: boolean = false;

  currDegree: { name: string, courses: {}} | undefined 
  currIndex:number = -1

  filterTerm: string = ''
  editing: boolean = false
  
  constructor( private firebase:FirebaseDBServiceService, public dialogRef: MatDialog ) {
    //get a reference to json of degrees
    const tablesRef = ref(this.firebase.dbRef ,'coursesPerProgramme');

    //recieve updates in realtime with onValue
    onValue(tablesRef, (snapshot) => {
      this.degrees.length = 0;
      const data = snapshot.val();
      
      
      if ( !data ){ console.log('No data retrieved' ); return }
      

      console.log(data)

      Object.entries(data).forEach( (entry: any)=>{
        const [degreeName, degreeInfo] = entry;

        // var obj = {a: 1, b: 2};
        // for (var key in obj) {
        //   if (obj.hasOwnProperty(key)) {

        //   }}
        

        let courses : {courseName: string, type: string, offeredIn: []}[] = []
        for( let key in degreeInfo)
        //console.log( degreeInfo[key])
          courses.push({courseName: key, type: degreeInfo[key].type, offeredIn: degreeInfo[key].offeredIn})

        this.degrees.push({ name: degreeName, courses : courses})

        //render updated current course
        if( this.currIndex != -1)
          this.currDegree= this.degrees[this.currIndex]
      })

      
   }) //end of firebase realtime fn
  }

  ngOnInit(): void {
  }

  selectDegree( index : number ){
    //this.currDegree = this.degrees.find( degree => degree.name == degreeName)
    this.currIndex = index
    this.currDegree = this.degrees[index]
    console.log("Currently Selected: ", this.currDegree)
    //console.log(this.currDegree.name)
    this.selected = true
  }

  toggleEdit(){
    this.editing = !this.editing
  }

  openDialog(update: boolean){
    //only pass current degree if it's an update
    let data;
    if( update)
      data= { update: update, degree: this.currDegree}
    else
      data = { update: update}
    let dialog = this.dialogRef.open(ProgrammeModalComponent, {
      data: data,
      width: '96vw',
      height: '90vh'
    });

    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }


  deleteCourse(){
    this.firebase.deleteProgramme(`${this.currDegree?.name}`)
  }
}
