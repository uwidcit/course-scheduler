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

import { newArray } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

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
      
      mat-spinner{
        margin-top: 35vh;
        margin-left: 45%;
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
  semesterSchedule: any 
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
  constructor(private dialog: MatDialog, private promptDialog: MatDialog, private snackBar : MatSnackBar, private firebase: FirebaseDBServiceService, private auth: AuthenticationService, private router: Router ) { 
    if (this.auth.loggedIn)
      this.currentUserId = this.auth.currentUser?.uid || '' 
    else
      this.router.navigate(['login'])
    //Get Firebase data
    const tablesRef = ref(this.firebase.dbRef);
    onValue(tablesRef, (snapshot) => {
      this.localEvents.length = 0;
      const data = snapshot.val();
      
      this.semesterSchedule = data.semesterSchedule  // get the semesterSchedule
      
      
      this.courses = data.courses;

      //console.log(data.events)
      Object.entries(data.events).forEach( (entry: any)=>{
        const [key, value] = entry;
        if( value.extendedProps.createdBy == this.currentUserId )
          value.editable = true
        // else 
        //   value.editable = false
        this.localEvents.push(value)
      })
      

      //if (!data.coursesPerProgramme) return
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
      
      
    });

    

    //define Calendar Options
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: "84vh",
      eventChange: function ( arg){ console.log('Changed ',arg.event)},
      eventClick: this.handleEventClick.bind(this),
      eventMouseEnter: this.handleEventHover.bind(this),
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
      editable: true,
      slotEventOverlap: true,
      allDaySlot: true,   //to display all day events at the top in "allday" for week & day view
      eventDisplay: "block"   //display the event as a block on daygrid & normal on other views
    };

  } //end of constructor

  ngOnInit(): void {
    
    
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
      
      
      if( result !=null && result.delete){
        let eventTitle = result.title
        this.firebase.deleteEvent(result.id)
        this.displayMessage(`${eventTitle} was deleted!`, 'success')
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
          editable: false,
          extendedProps: result.extendedProps
        }

        //Determine if the newEvent has the same course
        let updatingSameCourse = arg.extendedProps && arg.extendedProps.course == newEvent.extendedProps.course ? true : false
        
        if ( this.courseAssessmentWithinLimit( newEvent.extendedProps.course, newEvent.extendedProps.eventType, updatingSameCourse)  && this.isInSemesterSchedule(newEvent.start , newEvent.end, newEvent.extendedProps.eventType ))
          await this.editEvents( newEvent , result.update)
         
      }
      else {

        if ( result == null || result ==undefined  )
        this.displayMessage('Modal Closed', 'info')
        else
          console.log("invalid Event entry")
      }
    });
  }


  

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
    

    let displayMsg ;
    if (eventInfo.event.start && eventInfo.event.end){
        //get only date from string
      let start_date : String = eventInfo.event.start.toDateString()
      let end_date : String = eventInfo.event.end.toDateString()

      

      if ( start_date == end_date ){
        
        displayMsg = `${eventInfo.event.title} (${eventInfo.event.extendedProps.eventType})`
      }
      else
      displayMsg = `${eventInfo.event.title} (${eventInfo.event.extendedProps.eventType})`
      
    }

    else 
      displayMsg = eventInfo.event.title + ` (${eventInfo.event.extendedProps.eventType})`

    
    
    this.displayMessage(displayMsg, 'info')
    
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
      editable: false,
      extendedProps: event.extendedProps
    }

    if( !this.isInSemesterSchedule(newEvent.start , newEvent.end, newEvent.extendedProps.eventType ))
      this.refreshPage()
    else
      await this.editEvents( newEvent , true); //update = true

  }

  refreshPage(){
    
    let events = [...this.localEvents]
    this.localEvents.length = 0
    setTimeout( ()=> Object.assign(this.localEvents, events), 100)
  }

  displayMessage(message: string, messageType: string){
    let snackBarRef = this.snackBar.open(
                        message, 'Close',
                        { panelClass: messageType, duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'}
                      )

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


  async editEvents(newEvent: { title: string, start: string, end:string }, isUpdate: boolean ){
    this.displayMessage(`Checking for clahses with ${newEvent.title} ...`, 'info')

        let eventOverlaps: {title: string, type: string, createdBy:string}[] = [] //DialogData[] = []
        

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
          let freeSlots = this.suggestFreeTimeSlot(newEvent)
          console.log("Free Slots", freeSlots )

          let dialogRef = this.promptDialog.open( PromptDialogComponent, {width: '50vw', data: freeSlots.start ? { events: eventOverlaps, freeSlots: freeSlots} : {events: eventOverlaps} })
          dialogRef.afterClosed().subscribe( (eventResult : {save: boolean, start: string, end: string}) =>{
            let updated = false // if the recommended dates were added
            if(eventResult.start && eventResult.end){
              //set new start & end dates
              newEvent.start = eventResult.start
              newEvent.end = eventResult.end
              updated = true
            }
            if( !eventResult.save) {
              this.displayMessage('Cancelling Update!', 'info')
              this.refreshPage()
            } 
            else if(  !isUpdate && eventResult.save )
              this.writeEvent(newEvent)
            else if ( isUpdate  && eventResult.save)
              this.updateEvent(newEvent)
            
            //create notification if saved with overlapping dates 
            if(eventResult.save && !updated && eventOverlaps.length > 1){
              let message = ''
              eventOverlaps.forEach( event => message+= `${event.title} (${event.type})`)
              this.firebase.createNotification(this.currentUserId, newEvent.title, message).subscribe( {
                next: response => this.displayMessage( response.message || response.error, 'success'),
                error: errorMsg => this.displayMessage(errorMsg, 'error')
              });

              this.sendEmailsToOtherUsers(eventOverlaps)
              //check if overlaps for event eventOverlapping exceeds 3
            } 
          })//end of dialog subscribe
        }
        else if ( !isUpdate && userresponse )
          this.writeEvent(newEvent)
        else if ( isUpdate && userresponse )
            this.updateEvent(newEvent)

        else{
          this.displayMessage('Cancelling', 'info')
          
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
      editable: false,
      extendedProps: event.extendedProps
    }

    if( !this.isInSemesterSchedule(newEvent.start , newEvent.end, newEvent.extendedProps.eventType ))
      this.refreshPage()
    else
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

  //check number of events <= the perdefined amt
  courseAssessmentWithinLimit(course: string, assessmentType:string, updatingSameCourse: boolean){
    console.log("Running courseAssessmentWithinLimit for " + course)
    if (updatingSameCourse) return true
    let assessmentCount = 0
    
    let courseData = this.courses[`${course}`]
    console.log( courseData)
    if( !courseData ) return false


    for(let assessment of courseData.assessments){
      // console.log(assessment)
      if(assessment.type.toLowerCase() == assessmentType.toLowerCase())
        assessmentCount+=1
        
    }

    if( assessmentCount == 0 ){
      this.displayMessage( `Invalid: ${course}'s assessment type, "${assessmentType}", does not exist.`, 'error')
      return false
    }
    
    for( let event of this.localEvents){
      // console.log(event)
      if( event.extendedProps.course == course && event.extendedProps.eventType.toLowerCase()== assessmentType.toLowerCase())
        assessmentCount-=1
    }
    
    // console.log( `Assessment Count ${assessmentCount}`)
    if(  assessmentCount > 0 ){
      //console.log("Returning true from courseAssessmentWithinLimit \n")
      return true
    }
      
    this.displayMessage( `Invalid: The # of ${assessmentType} for ${course} has been scheduled`, 'error')
    return false
  }

  async sendEmailsToOtherUsers(eventOverlaps:{title: string, type: string, createdBy:string}[]){
    console.log(" Running sendEmailsToOtherUsers fn...")
    for( let event of eventOverlaps){
      let message = ""
      for ( let otherEvents of eventOverlaps)
        if (otherEvents.title != event.title)
          message += `${otherEvents.title} (${otherEvents.type})\n`
      this.firebase.sendEmail(event.title, message, event.createdBy ).subscribe( {
                                                                                  next: response => this.displayMessage(response.message || response.error, 'success'),
                                                                                  error: errorMsg => this.displayMessage(errorMsg, 'error')
                                                                                });
    }
  }

  isInSemesterSchedule(start:string, end: string, assessmentType:string ){
    console.log(" Running isInSemesterSchedule fn...")
    
    //if event is being secheduled before current Date
    if( Date.parse(start) < Date.now() ){
      this.displayMessage("Events can only be sechduled from Current Date!", 'error')
      return false
    }

    let event = { start: Date.parse(`${start}`), end: Date.parse(`${end}`) }
    //Get either the teaching or exam period for comparison
    let schedulingPeriod = assessmentType.toLowerCase() == "assignment" ? { start: Date.parse(`${this.semesterSchedule.teaching.start}`), end: Date.parse(`${this.semesterSchedule.teaching.end}`) }
                                                          : { start: Date.parse(`${this.semesterSchedule.exam.start}`), end: Date.parse(`${this.semesterSchedule.exam.end}`) }

     //IF it's past the scheduling period
    if( Date.now() >= schedulingPeriod.end && assessmentType.toLowerCase() =="assignment")
      this.displayMessage("The period for scheduling Assignments has passed!\n Ask your admin to extend it! ", 'error')
    else( Date.now() >= schedulingPeriod.end && assessmentType.toLowerCase() =="exam")
      this.displayMessage("The period for scheduling Exams has passed!\n Ask your admin to extend it! ", 'error')

    //between defined scheduling period: true
    if ( event.start <= schedulingPeriod.end && event.end >= schedulingPeriod.start )
      return true
    
    if( assessmentType.toLowerCase() =="assignment" )
      this.displayMessage("Invalid Date Range for assignment/course work", 'error')
    else
      this.displayMessage("Invalid Date Range for exams", 'error')
      return false
  }

  suggestFreeTimeSlot(newEvent: any){
    //get the # of days for incoming event
    let daysInBetween = Math.floor( ( Date.parse(newEvent.end) - Date.parse(newEvent.start) ) / 86400000 )//# of milliseconds in a day

    //check if event is being scheduled in teaching period or exams
    let isTeachingPeriod = Date.parse(newEvent.end) <= Date.parse(this.semesterSchedule.teaching.end) ? true : false
    

    //create an array to plot all current events
    let daysWithinPeriod = new Array()
    let period = { start : '', end: ''}
    if ( isTeachingPeriod ){
      console.log('\n\nIS TEACHING PERIOD with ', daysInBetween, ' days')
      period.start = this.semesterSchedule.teaching.start
      period.end = this.semesterSchedule.teaching.end
      //iterate through each and find n consecutive free slots

    }//end of teachingPeriod check
    else if ( !isTeachingPeriod ){
      console.log('\n\nIS EXAM PERIOD ', daysInBetween, ' days')
      period.start = this.semesterSchedule.exam.start
      period.end = this.semesterSchedule.exam.end
      //iterate through each and find n consecutive free slots

    }
    
    const startingDate = Date.parse(period.start) < Date.now() ? new Date() : new Date(Date.parse(period.start))
    var lastDate= new Date(period.end);
    let hasEvents = false
    let consecutiveDays = 0
    let freeSlots = []
    //console.log( "\n\nSearching for free timeslots "+ daysInBetween)
    //Iterate between start/current Date (which ever is latest) & end Period 
    
    for (var d = startingDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
      if( consecutiveDays == daysInBetween){
        hasEvents = false
        consecutiveDays = 0
        let date = d

        
        //date.setDate( date.getDate() )
        const start = date.toJSON()
        let newDay =  date.setDate( date.getDate() + daysInBetween )
        
        const end = new Date(newDay).toJSON()
        console.log(`NEW END : ${end}`)
        return {start: start, end: end}
      }
      
      //reset the has events
      else if( hasEvents ){
        hasEvents = false 
        consecutiveDays = 0
      }
      
      else consecutiveDays +=1

        for( let event of this.localEvents){
          //for each event check keep count of # of events occuring on d( <=this date)
          if( !this.isSameEvent(newEvent, event) && this.dateIsInBetweenRange( event.start, event.end, d.toJSON() ) )
            hasEvents = true
          
        }//end of events loop
        
        
        
    }

    return {}
  }

  dateIsInBetweenRange(start : string, end: string, date: string ) {
    if( Date.parse(date)>= Date.parse(start) && Date.parse(date) <= Date.parse(end) )
      return true
    
    //console.log(date, " is not in between ", start, " and ", end )
    return false
  }

  isSameEvent(event1: any, event2:any){
    if(event1.title== event2.title && event1.extendedProps.course == event2.extendedProps.course && event1.extendedProps.eventType==event2.extendedProps.eventType && event1.extendedProps.createdBy == event2.extendedProps.createdBy)
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

 
  


