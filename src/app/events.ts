export const eventList=  [
        { "title": "event 1", "date": "2022-01-30", "displayEventTime": true },
        { "title": "event 2", "date": "2022-02-02" , "editable": true, "overlap": true, backgroundColor : "red", interactive: true},
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
            "department": "BioChemistry",
            "eventType": "Assignment"
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