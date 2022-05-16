import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {interval, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { NavbarComponent } from '../global/navbar/navbar.component';
import {ThemePalette} from '@angular/material/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor( private router: Router, private appService: AppServices, public datepipe: DatePipe, private navbar: NavbarComponent ) { }

  matTableDataSource = new MatTableDataSource; 
  matTableDataSource2 = new MatTableDataSource; 
  matTableDataSource3 = new MatTableDataSource; 

  user;

  taskListOpened = false;
  addingTaskName = false;

  @ViewChildren(MatPaginator) matTableGenericPaginator: QueryList<MatPaginator>; 
 
  @ViewChildren(MatSort) matTableSort: QueryList<MatSort>; 

  public matTableColumnDisplay: string[] = ['user','email','dateCreated','profile','banned']; 
  public matTableColumnDisplay2: string[] = ['taskName', 'actions']; 
  public matTableColumnDisplay3: string[] = ['user','email','dateCreated','actions']; 


  public form: FormGroup = new FormGroup({
    taskName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") == null){
      this.router.navigate(['/login']);
    }
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));

    if(this.user.admin == true)
    {
      console.log(this.user)
    }
    else
    {
      this.router.navigate(['/home']);
    }
    
    this.getAllUsers();
    this.getAllTaskNames();
    this.getAllRegistrationRequests();

    this.matTableDataSource.sort = this.matTableDataSource.sort;
    
  }

  ngAfterViewInit(): void { 

    this.matTableDataSource.paginator = this.matTableGenericPaginator.toArray()[0]; 
    this.matTableDataSource.sort = this.matTableSort.toArray()[0];

    this.matTableDataSource2.paginator = this.matTableGenericPaginator.toArray()[2];
    this.matTableDataSource2.sort = this.matTableSort.toArray()[2];

    this.matTableDataSource3.paginator = this.matTableGenericPaginator.toArray()[1];
    this.matTableDataSource3.sort = this.matTableSort.toArray()[1];

    this.matTableDataSource.sort.sort(({ id: 'firstName', start: 'desc'}) as MatSortable);
    this.matTableDataSource2.sort.sort(({ id: 'taskName', start: 'asc'}) as MatSortable);
    this.matTableDataSource3.sort.sort(({ id: 'dateCreated', start: 'desc'}) as MatSortable);

    
    this.matTableDataSource.sort = this.matTableDataSource.sort;
    this.matTableDataSource2.sort = this.matTableDataSource2.sort;
    this.matTableDataSource3.sort = this.matTableDataSource3.sort;
  }

  public handlePage(e: any) {
    //this.pageIndex = e.pageIndex;
  }

  openProfile(element) {
     this.router.navigate(['/profile',element.id])
  }

  applyFilter(filterValue: string) { 

    this.matTableDataSource.filter = filterValue.trim().toLowerCase(); 

    if (this.matTableDataSource.paginator) { 

      this.matTableDataSource.paginator.firstPage(); 

    } 

  } 

  getAllUsers()
  {
    this.appService.getAllUsers().subscribe( data => {
      this.matTableDataSource.data = data;
      console.log(data);
      
      })
  }

  getAllTaskNames()
  {
    this.appService.getAllTaskNamesList().subscribe( data => {
      this.matTableDataSource2.data = data;
      console.log(data);
      })
  }

  getAllRegistrationRequests()
  {
    this.appService.getAllPendingRegistrationRequests().subscribe( data => {
      this.matTableDataSource3.data = data;
      console.log(data);
      })
  }
  
  banUser(userID)
  {
    this.appService.banUser(userID).subscribe( data => {
      this.getAllUsers();
      })
      
  }

  unbanUser(userID)
  {
    this.appService.unbanUser(userID).subscribe( data => {
      this.getAllUsers();
      })
  }

  acceptRegistrationRequest(registrationRequest)
  {
    registrationRequest.requestStatus = "Accepted"
    this.appService.updateRegistrationRequest(registrationRequest).subscribe( data => {
      this.getAllRegistrationRequests();
      })
    this.appService.addUser(registrationRequest).subscribe( data => {
      this.getAllRegistrationRequests();
      this.navbar.getPendingRegistrationRequests();
      })
  }

  rejectRegistrationRequest(registrationRequest)
  {
    registrationRequest.requestStatus = "Rejected"
    console.log(registrationRequest.requestStatus)
    this.appService.updateRegistrationRequest(registrationRequest).subscribe( data => {
      this.getAllRegistrationRequests();
      })
  }

  tabChanged(event)
  {
    if(event.index == 2)
    {
      this.taskListOpened = true;
    }
    else 
    {
      this.taskListOpened = false;
      this.addingTaskName = false;
    }
  }

  addTaskButtonClicked()
  {
    this.addingTaskName = true;
  }

  editTaskName(element)
  {

  }

  deleteTaskName(element)
  {
    this.appService.deleteTaskNamesList(element.id).subscribe( data => {
      this.getAllTaskNames();
      })
  }

  submit()
  {
    var temp = 
    {
      "taskName" : this.form.value.taskName,
    }
    
    console.log(temp)
    this.appService.addTaskNamesList(temp).subscribe( data => {
        console.log(data)
        this.addingTaskName=false;
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.form.reset();
        this.getAllTaskNames();
      })

  
  
  }

  cancel()
  {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.form.reset();
    this.addingTaskName=false;
  }
}
