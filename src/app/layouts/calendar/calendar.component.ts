import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import  { eventList } from '../../events';
import {MatDialog} from '@angular/material/dialog';
import { CalendarModal } from '../calendarModal/calendarModal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import {  child, onValue, push, ref, set } from "firebase/database";
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface DialogData {
  createdBy: string;
  //date : Date; 
  //dateStr :string;
  id: string;
  start: string;
  end : string;
  allDay:boolean ;
  title:string;
  backgroundColor: string;
  extendedProps: { course: string,
                    eventType : String,
                    details: String,
                    createdBy : String} ;
  courseList :string[];
  update: Boolean;
}

export interface Course{

}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [`
      .wrapper{
        max-height: 91vh;
        overflow-y: none;
        padding: 5px;
      }
      header{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        max-height: 7vh;
      }

      #title{
        flex: 1 0 auto; 
      }

      .core{
        color: rgb(0, 250, 4);
        margin-right: 7px;
      }

      .elective{
        color: rgb(250, 0 , 4);
        margin-right: 7px;
      }

      .keys{
        margin-right: 20px;
        font-weight: 700;
      }
      
      
      .calendar_modal{
        background: rgba( 248, 248, 248, 0.5 ) !important;
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ) !important;
        backdrop-filter: blur( 2px ) !important;
        -webkit-backdrop-filter: blur( 2px ) !important;
        border-radius: 10px !important;
        border: 1px solid rgba( 255, 255, 255, 0.18 ) !important;
      }
  `]
})
export class CalendarComponent implements OnInit {
  coreCourses: string[] = []  // from list of degrees
  degrees: {[key:string]: {[key:string]: any}} = {}

  currentUserId: string = ''
  courses: any; //JSON OBject of courses

  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  title!: string;
  date! : string;
  public calendarOptions: CalendarOptions; 
  private customButton = {
                    text: 'add',
                    click: function() {
                      alert('clicked the custom button!');
                    }
                  }

  //localEvents = eventList    
  localEvents : any = [] ;        
  constructor(private dialog: MatDialog, private promptDialog: MatDialog, private snackBar : MatSnackBar, private firebase: FirebaseDBServiceService, private auth: AuthenticationService ) { 
    
    //Get Firebase data
    const tablesRef = ref(this.firebase.dbRef);
    onValue(tablesRef, (snapshot) => {
      this.localEvents.length = 0;
      const data = snapshot.val();
      this.courses = data.courses;
      
      if ( !data.events || !data.courses  )return 

      console.log(data.events)
      Object.entries(data.events).forEach( (entry: any)=>{
        const [key, value] = entry;
        if( value.extendedProps.createdBy == this.currentUserId )
          value.editable = true
        else 
          value.editable = false
        this.localEvents.push(value)
      })
      

      if (!data.coursesPerProgramme) return
      this.degrees = data.coursesPerProgramme

      //get json of degrees & iterate as list
      Object.entries(data.coursesPerProgramme).forEach( (degree: any)=>{
        const [degreeName, degreeCourses] = degree
        
        if( !degreeCourses ) return
        // get json of courses per degree 
        Object.entries(degreeCourses).forEach( (course: any) =>{
          const [name, data] = course 
          if( data.type =='core' && this.coreCourses.includes(name)==false )
            this.coreCourses.push(name)
        })
      })
      
      //this.localEvents = data.events
    });

    

    //define Calendar Options
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: "84vh",
      eventChange: function ( arg){ console.log('Changed ',arg.event)},
      eventClick: this.handleEventClick.bind(this),
      //eventMouseEnter: this.handleEventHover.bind(this),
      eventResize: this.handleEventResize.bind(this),
      eventDrop: this.handleEventDrop.bind(this), //function (arg) { console.log('Darg & Dropped Event' ,arg)},
      dateClick: this.handleDateClick.bind(this), // bind to handle any click on calendar important!
      events: this.localEvents,
      customButtons: {
        myCustomButton: this.customButton
      },
      headerToolbar: {
        left: 'today,timeGridDay,dayGridMonth,timeGridWeek,listMonth', //timeGridDay  listWeek
        center: 'title',
        right: 'prev,next'
      },
      // dayPopoverFormat: {
      //   month: 'numeric',
      //   day: 'numeric',
      //   year: 'numeric',
      // },
      editable: true,
      slotEventOverlap: true,
      allDaySlot: true,   //to display all day events at the top in "allday" for week & day view
      eventDisplay: "block"   //display the event as a block on daygrid & normal on other views
    };

  } //end of constructor

  ngOnInit(): void {
    if (this.auth.loggedIn){
      this.currentUserId = this.auth.currentUser?.uid || ''
       
    }
    
  }

  openDialog( arg : any): void {   // Type: { start :String, end :String, allDay:boolean, title:String, backgroundColor: String, extendedProps: {} }
    
    

    const dialogRef = this.dialog.open(CalendarModal, {
      width: '80vw',
      data: arg,
      panelClass: 'calendar_modal'
    });

    dialogRef.afterClosed().subscribe( async( result) => {
      console.log('The dialog was closed');
      console.log(`Dialog Result: ${JSON.stringify(result)}`)
      //this.title = result.title;
      if( result !=null && result.delete){
        let eventTitle = result.title
        this.firebase.deleteEvent(result.id)
        this.displayMessage(`${eventTitle} was deleted!`)
      }
      else if ( result !=null && !result.delete ){
        let newEvent :any = {
          id : (result.id ? result.id : ''),
          title: result.title, 
          start: result.start,
          end: result.end,
          allDay: result.allDay,
          backgroundColor: this.isCoreCourse(result.extendedProps.course) ? '#fa0004' : '#00fa04', //result.backgroundColor,
          overlap: result.overlap,
          displayEventTime: true,
          editable: true,
          extendedProps: result.extendedProps
        }

        await this.editEvents( newEvent , result.update)
         //this.calendarOptions.eventSources?.push(result);//this.localEvents
      }
      else {

        if ( result == null || result ==undefined  )
        this.displayMessage('Modal Closed')
        else
          console.log("invalid Event entry")
      }
    });
  }
  // references the #calendar in the template
  // references the #calendar in the template

  // someMethod() {
  //   let calendarApi = this.calendarComponent.getApi();
  //   console.log(calendarApi)
  //   calendarApi.next();
  // }

  handleDateClick(arg: {date : Date, dateStr :String, allDay:boolean }) {
    //alert('date click! ' + arg.dateStr)
    // console.log(arg); // {date : Date, dateStr :String, allDay:boolean }
    // console.log( typeof(arg.date))  //object
    
    //Search for a date in the format '2022-02-01T00:00:00'
    // let dateSplit:any = arg.dateStr.match(/\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)
    // let newDate:String = dateSplit[0]

    let correctDateFormat = this.getDateStringFormat(arg.dateStr)
    //console.log(dateSplit[0])
    let courseNames :String[] = []

    //add courses to array
    Object.entries(this.courses).forEach( (course: any)=>{
      const [key, value] = course;
      courseNames.push(key)
    })
    let data = {
      start:  correctDateFormat ,
      end:  correctDateFormat ,
      allDay: arg.allDay,
      courseList : courseNames,
      createdBy : this.currentUserId,
      update: false  //if it's a new event
    }
    this.openDialog( data ) 
  }

  handleEventClick( eventInfo: any ){
    //alert(" You clicked an event")
    console.log(eventInfo)

    
    let event = eventInfo.event

    if( !event.startEditable ) return;

    let courseNames :String[] = []

    //add courses to array
    Object.entries(this.courses).forEach( (course: any)=>{
      const [key, value] = course;
      courseNames.push(key)
    })
    
    console.log(' Opening Dialog with ', event)
    this.openDialog( {
      title: event.title,
      start: this.getDateStringFormat(event.startStr) ,  //startStr is in the format "2022-02-19" && start is the date object
      end: this.getDateStringFormat(event.endStr),   //endStr is in the format "2022-02-19" && end is the date object
      allDay: event.allDay,
      id: event.id,
      //displayEventTime: event.displayEventTime,
      // editable: true,
      // overlap: true,
      //allow: Identity<AllowFunc>;
      //className: typeof parseClassNames;
     // classNames: typeof parseClassNames;
     // color: StringConstructor;
      backgroundColor: event.backgroundColor ,
      extendedProps: event.extendedProps,
      courseList : courseNames,
      update : true
    });
  }

  handleEventHover( eventInfo: any){
    console.log( eventInfo )
    // let dateSplit:any = eventInfo.event.start.match(/\w+\s*\w+\s*\d{2}/)
    // let start = dateSplit[0];  // to get the First part of the date: 'Wed Feb 02
    
    // dateSplit = eventInfo.event.start.match(/\w+\s*\w+\s*\d{2}\s*\d{4}/)
    // let end = dateSplit[0];
    
    // let start_date : String = eventInfo.event.start.toUTCString().replace(',', '')
    // let end_date : String = eventInfo.event.end.toUTCString().replace(',', '')

    let displayMsg ;
    if (eventInfo.event.start && eventInfo.event.end){
        //get only date from string
      let start_date : String = eventInfo.event.start.toDateString()
      let end_date : String = eventInfo.event.end.toDateString()

      // let dateSplit:any = start_date.match(/\w+\s*\d{2}\s*\w+/)
      // start_date = dateSplit[0];  // to get the First part of the date: 'Wed Feb 02
      
      // dateSplit = end_date.match(/\w+\s*\d{2}\s*\w+\s*\d{4}/)
      // end_date = dateSplit[0];

      if ( start_date == end_date ){
        let time: String = eventInfo.event.start.toTimeString()
        let startTime = time.split(' ')[0]

        time= eventInfo.event.end.toTimeString()
        let endTime = time.split(' ')[0]
        displayMsg = `${eventInfo.event.title} by Jerry \n Duration: ${start_date} ${startTime}- ${endTime}`
      }
      else
      displayMsg = `${eventInfo.event.title} by Jerry \n
      Duration: ${start_date} - ${end_date}`
      
    }

    else 
      displayMsg = eventInfo.event.title

    console.log(eventInfo.event.start, '\n', eventInfo.event.end  )
    
    this.displayMessage(displayMsg)
    // let snackBarRef = this.snackBar.open(displayMsg, 'Close',{ duration: 3000})

    // //listen for close event
    // snackBarRef.onAction().subscribe(() => {
    //   snackBarRef.dismiss(); 
    // });
  }

  

  getDateStringFormat( dateStr : String ){
    //search for data format
    let dateSplit:any = dateStr.match(/\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)
    let newDate:String = dateSplit[0]

    
    return newDate.includes('T') ?  newDate : newDate + 'T00:00:00' 
     
  }
  
  writeEvent(newEvent : any) {
    // Get a key for a new Post.
    const newPostKey = push(child(ref(this.firebase.dbRef), 'events')).key;
    newEvent.id = newPostKey
    set(ref(this.firebase.dbRef, 'events/' + newPostKey ), newEvent);
  }

  updateEvent( newEvent: any){
    // Write the new post's data simultaneously in the posts list and the user's post list.
  

    set(ref(this.firebase.dbRef, 'events/' + newEvent.id), newEvent);
  }


  checkForOverlap(eventA : DialogData, eventB : DialogData){
    let startA = Date.parse(`${eventA.start}`)
    let startB = Date.parse(`${eventB.start}`)

    let endA = Date.parse(`${eventA.end}`)
    let endB = Date.parse(`${eventB.end}`)
    //console.log( 'Event A Dates: ' ,startA, endA)
    //console.log( 'Event B Dates: ' ,startA, endA)

    if( startA <= endB && endA >= startB )
      return true
      //console.log( eventA.title, ' overlaps ', eventB.title)
    
      return false
  }

  checkDegree( course1:string, course2: string){

    let arr1 : string[] = this.courses[course1].degrees
    let arr2: string[] = this.courses[course2].degrees

    console.log( course1, ' degrees: ', arr1)
    console.log( course2, ' degrees: ', arr2)
    
    let match : string[] = []

    for( let entry of arr1 ){
      console.log( entry)
      if( arr2.includes(entry) )
          match.push(entry)
    }
    return match;
  }

  compareCoursePeriod( course1: any, course2: any ){
    for( let periodA of course1 )
      for ( let periodB of course2 ){
        if( periodA.year == periodB.year && periodA.semester == periodB.semester)
          return true
      }

    return false
  }

  async handleEventResize(eventInfo: any ){
    //console.log(eventInfo)

    
    let event = eventInfo.event

    //console.log("Resized Event",event)
    let newEvent :any = {
      id : (event.id ? event.id : ''),
      title: event.title, 
      start: this.getDateStringFormat(event.startStr) ,  //startStr is in the format "2022-02-19" && start is the date object
      end: this.getDateStringFormat(event.endStr),   //endStr is in the format "2022-02-19" && end is the date object
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      overlap: event.overlap,
      displayEventTime: true,
      editable: true,
      extendedProps: event.extendedProps
    }

    await this.editEvents( newEvent , true); //update = true

  }

  displayMessage(message: string){
    let snackBarRef = this.snackBar.open(message, 'Close',{ duration: 3000})

    //listen for close event
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss(); 
    });
  }

  async getOverlappingEvents(newEvent: any, eventObj: any, oldArr: {title: string, type: string}[]){
    let degreeMatches: string[] ;
    let overlaps: any = [];
    //Check for event overlap && courses are within same degree
    if ( newEvent.id != eventObj.id && this.checkForOverlap(newEvent, eventObj)  ){
      console.log('New event in getOverlap: ', newEvent.extendedProps.course)
      degreeMatches  = this.checkDegree(newEvent.extendedProps.course, eventObj.extendedProps.course)//get 2 courses in degree
      
      if( degreeMatches.length == 0 ) return;
      let match = false;
      for( let degree of degreeMatches){
        let course1:any = this.getDegreeCourse(degree, newEvent.extendedProps.course)//await this.firebase.getDegreeCourse(degree, newEvent.extendedProps.course)
        let course2:any = this.getDegreeCourse(degree, eventObj.extendedProps.course)//await this.firebase.getDegreeCourse(degree, eventObj.extendedProps.course)
        
        console.log('Fetched course1: ', course1)
        console.log('Fetched course2: ', course2)
        if( !match && course1.type == "core" && course2.type == "core" && this.compareCoursePeriod(course1.offeredIn, course2.offeredIn) ){
          overlaps.push({ 
            title: eventObj.title,
            type: course2.type,
            createdBy: eventObj.extendedProps.createdBy 
          })
          match = true
        }
      }
      
    }
    
    //console.log(oldArr == null)
    
    //check if event array (oldArr) !=null & join
    if( oldArr != null )  //check to see if there exist at least one item
      return overlaps.concat(...oldArr)
    else 
      return overlaps
  }


  async editEvents(newEvent: { title: string; }, isUpdate: boolean ){
    this.displayMessage(`Checking for clahses with ${newEvent.title} ...`)

        let eventOverlaps: {title: string, type: string}[] = [] //DialogData[] = []
        

        // this.localEvents.forEach( async(eventObj: any )=>{
        //   
          
        // })

        for( let eventObj of this.localEvents )
          eventOverlaps = await this.getOverlappingEvents(newEvent , eventObj , eventOverlaps)
        

        console.log( `Event Overlaps: ${eventOverlaps.length}`, eventOverlaps)
        
         
         //this.localEvents.push(result)
        //Prompt user if overlaps found, else add event or update if isUpdate
        let userresponse : boolean = true ;
        if( eventOverlaps.length > 0 ){
          let dialogRef = this.promptDialog.open( PromptDialogComponent, {width: '50vw', data: eventOverlaps})
          dialogRef.afterClosed().subscribe( (saveEvent : boolean) =>{
            if( !saveEvent) this.displayMessage('Cancelling Update!')
            else if(  !isUpdate && saveEvent )
              this.writeEvent(newEvent)
            else if ( isUpdate  && saveEvent)
              this.updateEvent(newEvent)
            
            //create notification if overlap 
            if(saveEvent && eventOverlaps.length > 1){
              let message = ''
              eventOverlaps.forEach( event => message+= `${event.title} (${event.type})`)
              this.firebase.createNotification(this.currentUserId, newEvent.title, message)
              
              //check if overlaps for event eventOverlapping exceeds 3
            } 
          })//end of dialog subscribe
        }
        else if ( !isUpdate && userresponse )
          this.writeEvent(newEvent)
        else if ( isUpdate && userresponse )
            this.updateEvent(newEvent)

        else{
          this.displayMessage('Cancelling')
          
        }
  }

  async handleEventDrop(eventInfo: any ){
    //console.log(eventInfo)

    
    let event = eventInfo.event

    console.log("Darg & Drop Event",event)
    let newEvent :any = {
      id : (event.id ? event.id : ''),
      title: event.title, 
      start: this.getDateStringFormat(event.startStr) ,  //startStr is in the format "2022-02-19" && start is the date object
      end: this.getDateStringFormat(event.endStr),   //endStr is in the format "2022-02-19" && end is the date object
      allDay: event.allDay,
      backgroundColor: event.backgroundColor,
      overlap: event.overlap,
      displayEventTime: true,
      editable: true,
      extendedProps: event.extendedProps
    }

    await this.editEvents( newEvent , true); //update = true

  }

  isCoreCourse(course: string){
    console.log( course,' is a core course: ', this.coreCourses.includes(course))
    return this.coreCourses.includes(course)
  }

  getDegreeCourse(degree:string, course:string){
    let c = this.degrees[`${degree}` ][`${course}`]
    console.log('Recieved: ', degree, ' & ', course)
    console.log('Requested: ', c)
    return this.degrees[`${degree}` ][`${course}`]
  }

  //check number of events <= 
  validEventCount(course: string, courseType:string){
    let exams = 0
    let assignments = 0

    let courseData = this.courses[`${course}`]

    if( !courseData ) return false


    for(let assessment of courseData){
      if(assessment.type == 'exam')
        exams++
        else if(assessment.type == 'assignments')
        assignments++
    }
      
    for( let event of this.localEvents){
      if( event.extendedProps.course == course && event.extendedProps.eventType=='exam')
        exams--
      else if( event.extendedProps.course == course && event.extendedProps.eventType=='assignement')
        assignments--
    }
    
    
    if(  exams> 0 || assignments > 0 )
      return true
    
    return false
  }

}
  


  /*Calendar Options
    eventDisplay: string;
    defaultRangeSeparator: string;
    titleRangeSeparator: string;
    defaultTimedEventDuration: string;
    defaultAllDayEventDuration: {
        day: number;
    };
    forceEventDuration: boolean;
    nextDayThreshold: string;
    dayHeaders: boolean;
    initialView: string;
    aspectRatio: number;
    headerToolbar: {
        start: string;
        center: string;
        end: string;
    };
    weekends: boolean;
    weekNumbers: boolean;
    weekNumberCalculation: WeekNumberCalculation;
    editable: boolean;
    nowIndicator: boolean;
    scrollTime: string;
    scrollTimeReset: boolean;
    slotMinTime: string;
    slotMaxTime: string;
    showNonCurrentDates: boolean;
    lazyFetching: boolean;
    startParam: string;
    endParam: string;
    timeZoneParam: string;
    timeZone: string;
    locales: any[];
    locale: string;
    themeSystem: string;
    dragRevertDuration: number;
    dragScroll: boolean;
    allDayMaintainDuration: boolean;
    unselectAuto: boolean;
    dropAccept: string;
    eventOrder: string;
    dayPopoverFormat: {
        month: string;
        day: string;
        year: string;
    };
    handleWindowResize: boolean;
    windowResizeDelay: number;
    longPressDelay: number;
    eventDragMinDistance: number;
    expandRows: boolean;
    navLinks: boolean;
    selectable: boolean;
    eventMinHeight: number;
    eventMinWidth: number;
    eventShortHeight: number;
  */ 

 
  


