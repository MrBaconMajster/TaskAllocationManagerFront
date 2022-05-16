import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomeComponent } from './home/home.component';
import { ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';
// import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''
  })
};

@Injectable()
export class AppServices implements OnInit {
  public isLoggedIn = true;

  public serverUrl =   'http://localhost:8080'

  public loadData = new Subject();
  public showbars = true;
  public showMessage = new Subject();
  public showStatus = new Subject();

  @ViewChild(HomeComponent) homeComponent: HomeComponent;
  @ViewChild(BoardComponent) boardComponent: BoardComponent;
  public registerPopup = false;
  public loginPopup = false;

  public selectedTask : any;

  constructor(private http: HttpClient) {

  }


  ngOnInit() { }

  closeTaskView()
  {
    try{
      this.boardComponent.taskView = false;
    }
    catch{}
    
    try{
    this.homeComponent.taskView = false;
    this.homeComponent.refresh();
    }
    catch{}
  }

  sampleGet(): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/sampleGet/')
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  samplePost(payload): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/samplePost/', payload);
  }

  samplePut(payload, id: number): Observable<any> {
    return this.http.put<any>(this.serverUrl + '/samplePut/'+ `${id}`, payload);
  }

  sampleDelete(id: number): Observable<any> {
    return this.http.delete<any>(this.serverUrl + '/sampleDelete/'+ `${id}`);
  }

  getServerUrl(){
    return  this.serverUrl;
  }


  //APIs start here

//REGISTRATION REQUESTS

getAllRegistrationRequests(): Observable<any> {
  return this.http.get<any>(this.serverUrl + '/getAllRegistrationRequests/')
    .pipe(
      catchError(() => {
        return null;
      })
    );
}

getAllPendingRegistrationRequests(): Observable<any> {
  return this.http.get<any>(this.serverUrl + '/getAllPendingRegistrationRequests/')
    .pipe(
      catchError(() => {
        return null;
      })
    );
}

addRegistrationRequest(payload){
  return this.http.post<any>(this.serverUrl + '/addRegistrationRequest', payload)
    .pipe(
      catchError(() => {
        return null;
      })
    );
}

updateRegistrationRequest(payload): Observable<any> {
  return this.http.put<any>(this.serverUrl + '/updateRegistrationRequest', payload);
}


deleteRegistrationRequest(id: number): Observable<any> {
  return this.http.delete<any>(this.serverUrl + '/deleteRegistrationRequest/'+ `${id}`);
}

  //login function

  login(payload): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/login', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  //User funtions

  addUser(payload){
    return this.http.post<any>(this.serverUrl + '/addUser', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  updateUser(payload): Observable<any> {
    return this.http.put<any>(this.serverUrl + '/updateUser', payload);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(this.serverUrl + '/deleteUser/'+ `${id}`);
  }


  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getAllUsers/')
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getUserById(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getUserById?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  banUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/banUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  unbanUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/unbanUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }


  // login/logout logger

  logUserLogin(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/logUserLogin?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  logUserLogOut(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/logUserLogOut?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  // TASK
  
  addTask(payload){
    return this.http.post<any>(this.serverUrl + '/addTask', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(this.serverUrl + '/deleteTask/' + `${id}`);
  }

  updateTask(payload){
    return this.http.put<any>(this.serverUrl + '/updateTask', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  unAssignFromTask(taskID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/unAssignFromTask?taskID=' + `${taskID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getUserByEmail(email): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getUserByEmail?email=' + `${email}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getAllTasks(): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getAllTasks')
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getTasksForUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getTasksForUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getTasksAssignedForUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getTasksAssignedForUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  
  assignUserToTask(userID, taskID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/assignUserToTask?userID=' + `${userID}` + '&taskID='+ `${taskID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }


  // TASK NAMES LIST
  getAllTaskNamesList(): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getAllTaskNamesList')
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  addTaskNamesList(payload){
    return this.http.post<any>(this.serverUrl + '/addTaskNamesList', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  deleteTaskNamesList(id: number): Observable<any> {
    return this.http.delete<any>(this.serverUrl + '/deleteTaskNamesList/'+ `${id}`);
  }

  // TASK REQUESTS

  getAllRequests(): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getAllRequests')
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getRequestsForUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getRequestsForUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  addRequest(payload){
    return this.http.post<any>(this.serverUrl + '/addRequest', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }
  
  getPendingRequestsForUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getPendingRequestsForUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  setRequestToAccepted(requestID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/setRequestToAccepted?requestID=' + `${requestID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  setRequestToDeclined(requestID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/setRequestToDeclined?requestID=' + `${requestID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  
  getRequestsSentByUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getRequestsSentByUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  // User Task Interest
  
  getTaskInterestListForUser(userID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getTaskInterestListForUser?userID=' + `${userID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  getUsersInterestedInTask(taskNameID): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/getUsersInterestedInTask?taskNameID=' + `${taskNameID}`)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  addTaskInterestsForUser(payload){
    return this.http.post<any>(this.serverUrl + '/addTaskInterestsForUser', payload)
      .pipe(
        catchError(() => {
          return null;
        })
      );
  }

  
  deleteTaskInterestListForUser(id: number): Observable<any> {
    return this.http.delete<any>(this.serverUrl + '/deleteTaskInterestListForUser/'+ `${id}`);
  }

}
