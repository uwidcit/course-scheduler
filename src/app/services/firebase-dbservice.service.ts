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

  async getCourseDegrees( courseName: string){
    const tableRef = ref(this.dbRef, `courses/${courseName}/degrees`)

    let result: string[] = [];
    onValue(tableRef, (snapshot) => {
      result = snapshot.val();
      
    });

    if( !result ) result = [];
    
    return result
  }

  async updateCourseDegree(degreeName: string, course: string, isNewCourse: boolean){
    let degreeArr = await this.getCourseDegrees(course)

    if( degreeArr.length == 0 && isNewCourse==false ) return false; //if empty array found on Delete operation

    if( isNewCourse )
      degreeArr.push( degreeName)

    else{
        //find degree location & update array 
      let degreeIndex = degreeArr.indexOf(degreeName)
      if( degreeIndex == -1) return false
      degreeArr.splice(degreeIndex, 1)
    }
    
    //update array of degrees in Course json
    let tableRef = ref(this.dbRef, `courses/${course}/degrees`)
    set( tableRef, degreeArr)
    return true
  }


  deleteEvent( eventId: string){
    const tableRef = ref( this.dbRef, `events/${eventId}`)

    remove(tableRef)
  }

  deleteProgramme( programmeId: string){
    const tableRef = ref( this.dbRef, `coursesPerProgramme/${programmeId}`)

    remove(tableRef)
  }

  deleteUser( userId: string, currentUserId: string){
    //const tableRef = ref( this.dbRef, `users/${userId}`)

    //remove(tableRef)
    let request = {
      currentUser: currentUserId,
      userToDelete: userId
      
    }
    let url = environment.backendURL + "/delete/user" //
    return this.http.post<{message:string, error:string}>( url, request)
   
  }


  getUserNotifications(tableRef: DatabaseReference){
    let result ;
    onValue(tableRef, (snapshot) => {
      result = snapshot.val();
      
    });
    return result
  }

  createNotification(userID: string, eventName: string, message : string){
    // User { {email, message, date, read}, {}}
    let path = 'users/' + userID + '/notifications'
    const tableRef = ref(this.dbRef, path )
    //Get array of notifications
    let result:any = this.getUserNotifications(tableRef)

    if( !result )
      result = []
    result.push({eventName: eventName, message: message, date: new Date().toLocaleDateString(), read: false })

    set( tableRef, result)
    
    
    return this.http.post<{message:string, error: string}>( environment.backendURL + "/send_email",
                            {
                              name: "Assessment Scheduler App",
                              recipient: userID, 
                              subject: "Clash Notification for '" + eventName +"'",
                              message: message
                            });
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

  sendEmail(eventName: string,message: string, recipient: string){
    let request = {
      name: "Assessment Scheduler App", 
      recipient: recipient,
      subject: "Clash Notification for '" + eventName +"'",
      message: message
    }
    let url = environment.backendURL + "/send_email" //
    return this.http.post<{message:string, error:string}>( url, request)
  }

  writeUserData( userID: string, email: string){
    const tableRef = ref(this.dbRef, `users/${userID}`)

    let userData = { email: email}
    return set(tableRef, userData)
  }
}
