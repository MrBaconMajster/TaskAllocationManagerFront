import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  taskNameList;
  taskInput;
  taskNameListNamesOnly = []
  userList;
  usersInterestedInTaskList = []
  user;
  filteredData;

  matTableDataSource = new MatTableDataSource; 
  
  @ViewChildren(MatPaginator) matTableGenericPaginator: QueryList<MatPaginator>; 
  @ViewChildren(MatSort) matTableSort: QueryList<MatSort>; 
  
  public form: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required]),
  });
  
  public matTableColumnDisplay: string[] = ['username','email','profile']; 

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent) { }

   ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));

    
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

  openProfile(element)
  {
    this.router.navigate(['/profile',element.id])
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

}

