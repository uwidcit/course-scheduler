import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { DatabaseReference, getDatabase, onValue, ref, remove, set } from "firebase/database";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBServiceService {

  app = initializeApp(environment.firebase);
  analytics = getAnalytics(this.app);
// Get a reference to the database service
  public dbRef = getDatabase(this.app);
  
  constructor(private http: HttpClient) { 

  }

  // getData(courses: any){
  //   const tablesRef = ref(this.dbRef,"courses");
  //   let result;
  //   onValue(tablesRef, (snapshot) => {
  //     const data = snapshot.val();
      
  //     courses = data
  //   });
    
  //}

  async getDegreeCourse( degree : string ,name : string){
      const tablesRef = ref(this.dbRef, `coursesPerProgramme/${degree}/${name}` );
      let result;

      onValue(tablesRef, (snapshot) => {
        result = snapshot.val();
        
      });
      return result
  }


  deleteEvent( eventId: string){
    const tableRef = ref( this.dbRef, `events/${eventId}`)

    remove(tableRef)
  }

  deleteProgramme( programmeId: string){
    const tableRef = ref( this.dbRef, `coursesPerProgramme/${programmeId}`)

    remove(tableRef)
  }


  getUserNotifications(tableRef: DatabaseReference){
    let result ;
    onValue(tableRef, (snapshot) => {
      result = snapshot.val();
      
    });
    return result
  }

  createNotification(userID: string, eventName: string, message : string, ){
    // User { {email, message, date, read}, {}}
    let path = 'users/' + userID + '/notifications'
    const tableRef = ref(this.dbRef, path )
    //Get array of notifications
    let result:any = this.getUserNotifications(tableRef)

    if( !result )
      result = []
    result.push({eventName: eventName, message: message, date: new Date().toLocaleDateString(), read: false })

    set( tableRef, result)
  }

  readAllNotifications(userID: string ){
    // User { {email, message, date, read}, {}}
    let path = 'users/' + userID + '/notifications'
    const tableRef = ref(this.dbRef, path )
    //Get array of notifications
    let result:any = this.getUserNotifications(tableRef)

    if( result ){
      result.forEach( (notification: { read: boolean; }) => notification.read = true)
      set( tableRef, result)
    }
    
  }
  
  deleteUserNotifications( userId: string){
    const tableRef = ref( this.dbRef, `users/${userId}/notifications`)

    remove(tableRef)
  }
}
