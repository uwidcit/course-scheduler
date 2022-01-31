import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import  { eventList } from '../../events';
import {MatDialog} from '@angular/material/dialog';
import { CalendarModal } from '../calendarModal/calendarModal.component';

export interface DialogData {
  //date : Date; 
  dateStr :String;
  allDay:boolean ;
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
      full-calendar{
        max-height: 88vh;
      }

      
  `]
})
export class CalendarComponent implements OnInit {
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

  localEvents = eventList            
  constructor(private dialog: MatDialog ) { 

    //define Calendar Options
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: "auto",
      dateClick: this.handleDateClick.bind(this), // bind to handle any click on calendar important!
      events: this.localEvents,
      customButtons: {
        myCustomButton: this.customButton
      },
      headerToolbar: {
        left: 'dayGridMonth timeGridWeek timeGridDay',
        center: 'title',
        right: 'today prev,next'
      },
      // dayPopoverFormat: {
      //   month: 'numeric',
      //   day: 'numeric',
      //   year: 'numeric',
      // },
      slotEventOverlap: true,
      allDaySlot: true
    };

  } //end of constructor

  ngOnInit(): void {

    
  }

  openDialog( arg : { dateStr :String, allDay:boolean }): void {
    const dialogRef = this.dialog.open(CalendarModal, {
      width: '50vw',
      data: arg,
    });

    dialogRef.afterClosed().subscribe( ( result) => {
      console.log('The dialog was closed');
      console.log(`Dialog Result: ${JSON.stringify(result)}`)
      //this.title = result.title;
      if ( result !=null ){
        let newEvent = {
          title: result.title, 
          start: result.start,
          end: result.end,
          allDay: result.allDay,
          displayEventTime: true,
          editable: true,
          extendedProps: {
            // department: "BioChemistry",
            // eventType: "Assignment"
            }
        }
         
         this.localEvents.push(result)
         //this.calendarOptions.eventSources?.push(result);//this.localEvents
      }
      else {

        if ( result == null || result ==undefined  )
          console.log('cancelled!')
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
    
    let dateSplit:any = arg.dateStr.match(/\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)
    let newDate:String = dateSplit[0]

    console.log(dateSplit[0])
    let data = {
      dateStr:  newDate.includes('T') ?  newDate : newDate + 'T00:00:00' ,
      allDay: arg.allDay
    }
    this.openDialog( data ) 
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

 
  


