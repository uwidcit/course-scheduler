import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getDatabase, onValue, ref, remove } from "firebase/database";
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
  
}
