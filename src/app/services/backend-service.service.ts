import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {
  backendURL: string = 'https://node-email-server1.herokuapp.com'
  constructor(private http: HttpClient) { }


  sendEmail(message: string, email: string){
    let request = {
      "name" : "Scheduler App Server",  //optional
      "recipient": email,
      "subject" : "Scheduler Email Notification",
      "message" : "Test to see if token is refreshed after it expires"
  }
  
    return this.http.post( this.backendURL+ '/send_email', request)
  }
}
