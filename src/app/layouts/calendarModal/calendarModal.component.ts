import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../calendar/calendar.component';

interface EventData {
  extendedProps: {};
        start: String;
        end: String;
        allDay: Boolean;
        //id: String;
        //groupId: String;
        title: String;
        overlap: Boolean;
        //url: String;
        backgroundColor: String;
        // interactive: Boolean;
        // display: String;
        editable: Boolean;
        displayEventTime: Boolean;
        
        // startEditable: Boolean;
        // durationEditable: Boolean;
        //constraint: Identity<any>;
        
        //allow: Identity<AllowFunc>;
        //className: typeof parseClassNames;
       // classNames: typeof parseClassNames;
       // color: StringConstructor;
        
        //borderColor: StringConstructor;
        //textColor: StringConstructor;
}

@Component({
  selector: 'calendar-modal',
  templateUrl: './calendarModal.component.html',
  styleUrls: []
})
export class CalendarModal implements OnInit {

  start: String
  end: String 
  eventData: EventData

  
  constructor( public dialogRef: MatDialogRef<CalendarModal>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    
    this.start = `${this.data.dateStr}`
    this.end =  `${this.data.dateStr}`

    this.eventData = {
      title: '',
      start: `${this.data.dateStr}` ,
      end: `${this.data.dateStr}`,
      allDay: this.data.allDay,
      //id: '',
      displayEventTime: true,
      editable: true,
      overlap: true,
      //allow: Identity<AllowFunc>;
      //className: typeof parseClassNames;
     // classNames: typeof parseClassNames;
     // color: StringConstructor;
      backgroundColor: "#00fa04" ,
      extendedProps: {
        
      }
  }

  

  
  }
  ngOnInit(): void {
    
  }


  show(value:any){
    console.log(value)
  }

  onSave(): void{
    if(this.eventData.title == '' || this.eventData.title == null)
      alert("Please Enter a Name for your event")
    
    else
      this.dialogRef.close(this.eventData)
  }

  onNoClick(): void { //CANCEL
    this.dialogRef.close( this.data);
  }
}
