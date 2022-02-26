export const eventList=  [
        { "title": "Assignment 1", "start": "2022-01-30T00:00:00", "end": "2022-01-30T10:00:00", "displayEventTime": true },
        { "title": "Assignment 2", "start": "2022-02-02T00:00:00" , "end": "2022-02-02T10:00:00" , "editable": true, "overlap": true, backgroundColor : "#f4d6a9", interactive: true},
        {
            "title": "Test Json",
            
            "start": "2022-02-01T10:30:00",
            "end": "2022-02-02T13:30:00",
            //"daysOfWeek": [ "1" ],  //to recur on same day every week
            "overlap": false,   //when false nothing can be added during this time
            "allDaySlot": false,
            "displayEventTime": true,
            "editable": true,
            "extendedProps": {
            "course": "COMP1601",
            "eventType": "Assignment",
            "details": "",
            "createdBy" : "test@gmail.com"
            }
        }
    ] 

    /* Event Options
        extendedProps: Identity<Dictionary>;
        start: Identity<DateInput>;
        end: Identity<DateInput>;
        date: Identity<DateInput>;
        allDay: BooleanConstructor;
        id: StringConstructor;
        groupId: StringConstructor;
        title: StringConstructor;
        url: StringConstructor;
        interactive: BooleanConstructor;
        display: StringConstructor;
        editable: BooleanConstructor;
        startEditable: BooleanConstructor;
        durationEditable: BooleanConstructor;
        constraint: Identity<any>;
        overlap: Identity<boolean>;
        allow: Identity<AllowFunc>;
        className: typeof parseClassNames;
        classNames: typeof parseClassNames;
        color: StringConstructor;
        backgroundColor: StringConstructor;
        borderColor: StringConstructor;
        textColor: StringConstructor;
    */