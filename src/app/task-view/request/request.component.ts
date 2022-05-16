import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppServices } from '../../app.service';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { TaskViewComponent } from '../task-view.component';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  user;
  task;
  createdBy;
  assignedTo;
  taskNameList;
  taskInput;
  taskNameListNamesOnly = []
  userList;
  usersInterestedInTaskList = []
  filteredData;
  filterValue;
  taskFilterValue;

  matTableDataSource = new MatTableDataSource; 
  
  @ViewChildren(MatPaginator) matTableGenericPaginator: QueryList<MatPaginator>; 
  @ViewChildren(MatSort) matTableSort: QueryList<MatSort>; 

  public form: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required]),
  });
  
  public matTableColumnDisplay: string[] = ['username','email','profile','actions']; 

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent, public taskViewComponent : TaskViewComponent, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
    this.task = this.appService.selectedTask;
    
    this.appService.getAllUsers().subscribe( data => {
      //data = data.filter(o => o.admin==false && o.id != this.user.id)
      this.userList = data.filter(o => o.id != this.user.id);
      this.matTableDataSource.data = data.filter(o => o.id != this.user.id);

     })


    this.getAllTaskNamesList();
  }

  ngAfterViewInit() { 
  this.matTableDataSource.paginator = this.matTableGenericPaginator.toArray()[0]; 
  this.matTableDataSource.sort = this.matTableSort.toArray()[0];
      
  this.matTableDataSource.sort = this.matTableDataSource.sort;
  }

  applyFilter(filterValue: string) { 

    this.matTableDataSource.filter = filterValue.trim().toLowerCase(); 

    if (this.matTableDataSource.paginator) { 

      this.matTableDataSource.paginator.firstPage(); 

    } 

  } 

  openProfile(element)
  {
    this.router.navigate(['/profile',element.id])
  }

  getAllTaskNamesList()
  {
    this.appService.getAllTaskNamesList().subscribe( data => {
      this.taskNameList = data;
      this.taskNameListNamesOnly.push("")
      data.forEach(element => {
        this.taskNameListNamesOnly.push(element.taskName)
      });
      })
  }

  openTask(element)
  {
  
  }

  taskInputChanged($event)
  {
    console.log($event.value)
    var taskNameId;
    if($event.value == "")
    {
      this.filteredData = this.userList;
      this.matTableDataSource.data = this.filteredData;

      this.matTableDataSource.paginator = this.matTableGenericPaginator.toArray()[0]; 
      this.matTableDataSource.sort = this.matTableSort.toArray()[0];
          
    this.matTableDataSource.sort = this.matTableDataSource.sort;
    }
    else
    {
    taskNameId = this.taskNameList.filter(o => o.taskName == $event.value)
    taskNameId = taskNameId[0].id;
    console.log(taskNameId)

    this.appService.getUsersInterestedInTask(taskNameId).subscribe( data => {
      console.log(data)
      var list = [];
      data.forEach(element => {
        list.push(element.userId);
      });
      this.filteredData = this.userList.filter(o => list.includes(o.id))
      this.matTableDataSource.data = this.filteredData;

      this.matTableDataSource.paginator = this.matTableGenericPaginator.toArray()[0]; 
      this.matTableDataSource.sort = this.matTableSort.toArray()[0];
          
    this.matTableDataSource.sort = this.matTableDataSource.sort;
  })
}
}

sendRequest(element)
{
  var temp = 
  {
    "receiverId" : element.id,
    "senderId" : this.user.id,
    "senderFirstName" : this.user.firstName,
    "senderLastName" : this.user.lastName,
    "task" : this.task.task,
    "taskId" : this.task.id,
    "description" : this.task.description,
    "dateCreated" : Date.now(),
    "dateDue" : this.task.dateDue,
    "requestState" : "Pending",
  }

  this.appService.addRequest(temp).subscribe( data => {
    this.toastr.success("Request Sent" )
  })
}



  close()
  {
    this.taskViewComponent.requestOpened = false;
  }

}
