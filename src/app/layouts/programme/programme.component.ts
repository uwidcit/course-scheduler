import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { onValue, ref } from 'firebase/database';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { ProgrammeModalComponent } from '../programme-modal/programme-modal.component';

@Component({
  selector: 'app-programmes',
  templateUrl: './programme.component.html',
  styles: [`
      .container{
        flex: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
      }

      .container:nth-child{
        height: 100%;
      } 

      
      .side{
        filter: drop-shadow(0px 0px 10px #60BBEE);
        box-shadow: 10px 0px 10px rgba(155, 155,155, 0.65);
        width: 30vw;
      }
      main {
        max-height: 100%;
        
        padding: 10px;
      }

      .background:after{ 
        height: 80%;
        width: 50%;
        background: #EAEAEB; 
        border-radius: 50%;
      }
      mat-drawer{ padding: 10px 8px; overflow-y: auto;}

      mat-list-option:hover{
        box-shadow: 4px 8px 3px 5px rgb(155 155 155 / 65%) !important; 
        border-radius: 25px;
        width: 95%;
      }

      .icons:hover, mat-icon:hover{
        box-shadow: 4px 8px 3px 5px rgb(155 155 155 / 65%) !important; 
        border-radius: 25px;
        cursor: pointer;
        /* background: #2fa4e7; */
				color: #2fa4e7;
      }


      .spacer, main{
        flex: 1 0 auto;
      }

      mat-toolbar{
        background: transparent;
      }

      #searchBar{
        border: 3px solid #ccc;
        flex: 0.9 0 auto;
      }
      
      input[type=text]:focus {
        
      }

      .none{
        text-align: center;
        margin-top: 50%;
      }
      table{
        width: 100%;
        background-color: #ccc;
        border-radius: 5%;
        height: clamp(70vh, 60vh, 60vh);
        padding: 20px;
        overflow-y: auto;
      }

      table::before{
        background: #EAEAEB;
      }

      tr, td{
        max-height: 100px;
      }

      td{
        text-align: center;
        background-color: #C1D0ED;
        border-radius: 5%;
      }

      #degreeName{
        margin-left: 35px;
        display: flex;
        flex-direction: row;
        max-width: 90%;
      }

      th, #degreeName, mat-icon{
        color: #0C6A9E;
      }

      .text-start{
        text-align: start !important;
      }

  `]
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
    this.selected = true
  }

  toggleEdit(){
    this.editing = !this.editing
  }

  openDialog(update: boolean){
    //
    let dialog = this.dialogRef.open(ProgrammeModalComponent, {
      data: { update: update, degree: this.currDegree},
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
