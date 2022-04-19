import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogData } from '../calendar/calendar.component';

interface EventData {
  extendedProps: { course: String,
    eventType : String,
    details: String,
    createdBy : String} ;
        start: string;
        end: string;
        allDay: Boolean;
        id: String;
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
        update: Boolean; //
        delete: Boolean; // NOT part of the event JSON
}

@Component({
  selector: 'calendar-modal',
  templateUrl: './calendarModal.component.html',
  styles: [`
        /* #modal_main{
          background: rgba( 248, 248, 248, 0.5 );
          box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
          backdrop-filter: blur( 2px );
          -webkit-backdrop-filter: blur( 2px );
          border-radius: 10px;
          border: 1px solid rgba( 255, 255, 255, 0.18 );
        }   */

        #header{
          display: flex;
          flex-direction: row;
        }
        .spacer{
          flex: 1 0 auto;
        }

        .mat-dialog-content{
          overflow: hidden;
        }

        .dateButton{
          border: none;
          background: transparent;
          width: 100%;
          font-size: 15px;
        }

        .dateButton > mat-icon{
          float: right;
        }
  `]
})
export class CalendarModal implements OnInit {

  // start: String
  // end: String 
  public eventData: EventData

  course: String;
  eventType: String;
  details: String;
  createdBy : String ;

  constructor( public dialogRef: MatDialogRef<CalendarModal>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toast: HotToastService) {
    
    // this.start = `${this.data.start}`
    // this.end =  `${this.data.end}`

    this.course = this.data.extendedProps ? this.data.extendedProps.course : '';
    this.eventType = this.data.extendedProps ? this.data.extendedProps.eventType  : 'Assignment';
    this.details = this.data.extendedProps ? this.data.extendedProps.details  : '';
    this.createdBy = this.data.extendedProps ? this.data.extendedProps.createdBy  : this.data.createdBy;

    this.eventData = {
      id : this.data.id || '',
      title: this.data.title || '',
      start: `${this.data.start}` ,
      end: `${this.data.end}`,
      allDay: this.data.allDay,
      displayEventTime:  true ,
      editable: false,
      overlap: true,
      //allow: Identity<AllowFunc>;
      //className: typeof parseClassNames;
     // classNames: typeof parseClassNames;
     // color: StringConstructor;
      backgroundColor: this.data.backgroundColor || "#00fa04" ,
      extendedProps:  {
        course: '',
        eventType: '',
        details: '',
        createdBy : ''
        },
      update: this.data.update,
      delete: false
  }

  

  
  }
  ngOnInit(): void {
    
  }


  show(value:any){
    console.log(value)
  }

  onSave(): void{
    if(this.eventData.title == '' || this.eventData.title == null){
      this.toast.error("Please Enter a Name for your assessment", {className: 'error'})
      return
    }
    
    else if( this.course == '' || !this.course ){
      this.toast.error("Please select the assessment's course", {className: 'error'})
      return
    }
    else if(  Date.parse(this.eventData.start) < Date.now() ){
      this.toast.error("Assessments must be scheduled after current Date!", {className: 'error'})
      return
    }
    else if( this.eventData.start == this.eventData.end ){
      this.toast.error("Datetime for start and end dates cannot be the same!", {className: 'error'})
      return
    }
    else if ( Date.parse(this.eventData.start) > Date.parse(this.eventData.end) ){
      this.toast.error("The start date of your assessment cannot be after the end date!", {className: 'error'})
      return
    }
    else{
      this.eventData.extendedProps.course= this.course;
      this.eventData.extendedProps.eventType= this.eventType;
      this.eventData.extendedProps.details= this.details;
      this.eventData.extendedProps.createdBy= this.createdBy;
       
        
      this.dialogRef.close(this.eventData)

    }
      
  }

  onDelete(){
    this.eventData.delete = true;
    this.dialogRef.close(this.eventData)
  }

  onNoClick(): void { //CANCEL

    this.dialogRef.close();
  }

  displayDate(date: string){
    //return new Date(date).toISOString().split(' GMT')[0]
    return new Date(date).toDateString()  + ' ' + new Date(date).toLocaleTimeString().replace(':00 ', ' ')
  }
}
