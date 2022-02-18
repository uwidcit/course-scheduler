import { Component, OnInit } from '@angular/core';
import { onValue, ref } from 'firebase/database';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';

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
      }
      main {
        flex: 100vw 0 65%;
        padding: 10px;
      }

      .background:after{ 
        height: 80%;
        width: 50%;
        background: #EAEAEB; 
        border-radius: 50%;
      }
      mat-drawer{ padding: 10px 8px; overflow-y: auto;}

      mat-list-option:hover {
        box-shadow: 4px 8px 3px 5px rgb(155 155 155 / 65%) !important; 
        border-radius: 25px;
        width: 95%;
      }
  `]
})
export class ProgrammeComponent implements OnInit {

  degrees: { name: string, courses: {}}[] = [];
  selected: string = ''

  constructor( private firebase:FirebaseDBServiceService ) {
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

        var obj = {a: 1, b: 2};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {

          }}

        let courses = []
        for( let key in degreeInfo)
          courses.push({courseName: key, type: degreeInfo[key].type, offeredIn: degreeInfo[key].offeredIn})

        this.degrees.push({ name: degreeName, courses : courses})
      })
   }) //end of firebase realtime fn

  }

  ngOnInit(): void {
  }

}
