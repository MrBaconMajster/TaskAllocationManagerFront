import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component'
import * as Highcharts from 'highcharts';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user;
  loginPopup = false;
  taskData : any;
  taskView = false;
  tasksCreated : any;
  pie1Options: any;
  pieChart1 = Highcharts;
  data1 = [];
  filteredData: any;
  showDoneCheckbox = false;


  @ViewChildren(MatPaginator) matTableGenericPaginator: QueryList<MatPaginator>; 
  @ViewChildren(MatSort) matTableSort: QueryList<MatSort>; 

    
  matTableDataSourceTasks = new MatTableDataSource; 
  matTableDataSourceRequests = new MatTableDataSource; 
  matTableDataSourceTasksCreatedByMe = new MatTableDataSource;
  matTableDataSourceRequestsSent = new MatTableDataSource;

  public matTableColumnDisplayTasks: string[] = ['status','task','dateDue','dateCreated','createdBy','actions']; 
  public matTableColumnDisplayRequests: string[] = ['task','dateDue','createdBy','actions']; 
  public matTableColumnDisplayRequestsSent: string[] = ['task','dateDue','sentTo','requestStatus','actions']; 
  public matTableColumnDisplayTasksCreatedByMe: string[] = ['status','task','dateDue','dateCreated','createdBy','actions']; 


  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent, private changeDetectorRefs: ChangeDetectorRef,private dateAdapter: DateAdapter<Date>) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
}
  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") == null){
      this.router.navigate(['/login']);
    }
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
    
    this.appService.homeComponent = this;

    console.log(this.user.id)
    this.getTasksAssignedForUser();
    this.getTasksCreatedByUser()
    this.getPendingRequestsForUser();
    this.getRequestsSentByUser();
 
    this.resetFilter();

  }

  async ngAfterViewInit()
  {
    this.matTableDataSourceTasks.paginator = this.matTableGenericPaginator.toArray()[0]; 
    this.matTableDataSourceTasks.sort = this.matTableSort.toArray()[0];

    
    this.matTableDataSourceTasksCreatedByMe.paginator = this.matTableGenericPaginator.toArray()[1];
    this.matTableDataSourceTasksCreatedByMe.sort = this.matTableSort.toArray()[1];

    this.matTableDataSourceRequests.paginator = this.matTableGenericPaginator.toArray()[2];
    this.matTableDataSourceRequests.sort = this.matTableSort.toArray()[2];

    this.matTableDataSourceRequestsSent.paginator = this.matTableGenericPaginator.toArray()[3];
    this.matTableDataSourceRequestsSent.sort = this.matTableSort.toArray()[3];


    
    this.matTableDataSourceTasks.sort = this.matTableDataSourceTasks.sort;
    this.matTableDataSourceTasksCreatedByMe.sort = this.matTableDataSourceTasksCreatedByMe.sort;
    this.matTableDataSourceRequests.sort = this.matTableDataSourceRequests.sort;
    this.matTableDataSourceRequestsSent.sort = this.matTableDataSourceRequestsSent.sort;

    setTimeout(() => { this.resetFilter(); this.filter();  }, 750);
  }

  getTasksAssignedForUser()
  {
    this.appService.getTasksAssignedForUser(this.user.id).subscribe( data => {
    this.matTableDataSourceTasks.data = data;
    this.taskData = data;
   
    })
  }


  getTasksCreatedByUser()
  {
    this.appService.getTasksForUser(this.user.id).subscribe( data => {
      this.matTableDataSourceTasksCreatedByMe.data = data;
      this.tasksCreated = data;

      })
  }

  getPendingRequestsForUser()
  {
    this.appService.getPendingRequestsForUser(this.user.id).subscribe( data => {
    this.matTableDataSourceRequests.data = data;
    console.log(data)
    })
  }

  getRequestsSentByUser()
  {
    this.appService.getRequestsSentByUser(this.user.id).subscribe( data => {
      this.matTableDataSourceRequestsSent.data = data;
      console.log(data)
    })
  }

  close(){
    this.navbar.appService.loginPopup = false;
  }

  filter()
  {
    if(this.showDoneCheckbox == true)
    {
      this.matTableDataSourceTasks.data = this.taskData;
      this.matTableDataSourceTasksCreatedByMe = this.tasksCreated;
    }
    else
    {
      this.filteredData = this.taskData.filter(o => o.status != "Done")
      this.matTableDataSourceTasks.data = this.filteredData;
      this.matTableDataSourceTasks.paginator = this.matTableGenericPaginator.toArray()[0]; 
      this.matTableDataSourceTasks.sort = this.matTableSort.toArray()[0];

    this.matTableDataSourceTasks.sort = this.matTableDataSourceTasks.sort;

    var x  = this.tasksCreated.filter(o => o.status != "Done")

    this.matTableDataSourceTasksCreatedByMe = new MatTableDataSource<any>(x);
    
    this.matTableDataSourceTasksCreatedByMe.paginator = this.matTableGenericPaginator.toArray()[1]; 
    this.matTableDataSourceTasksCreatedByMe.sort = this.matTableSort.toArray()[1];

    this.matTableDataSourceTasksCreatedByMe.sort = this.matTableDataSourceTasksCreatedByMe.sort;

    }


  }

  register(){
    this.navbar.appService.loginPopup = false;
    this.navbar.appService.registerPopup = true;
  }

  unAssignFromTask(element)
  {
    this.appService.unAssignFromTask(element.id).subscribe( data => {
      this.getTasksAssignedForUser();
      this.getPendingRequestsForUser();
    })
  }

  acceptTaskRequest(element)
  {

    this.appService.setRequestToAccepted(element.id).subscribe(data => {
    this.appService.assignUserToTask(this.user.id, element.taskId).subscribe( data => {
      this.getTasksAssignedForUser();
      this.getPendingRequestsForUser();
      })
    })
  }

  rejectTaskRequest(element)
  {
    this.appService.setRequestToDeclined(element.id).subscribe(data => {
      this.getTasksAssignedForUser();
      this.getPendingRequestsForUser();
      this.getRequestsSentByUser();
    })
  }

  openTask(element)
  {
    this.taskView = true;
    this.appService.selectedTask = element;
    console.log(element)
  }

  openTaskRequest(element)
  {
    element.createdBy = element.senderId;
    element.assignedTo = -1;
    this.taskView = true;
    this.appService.selectedTask = element;
    console.log(element)
  }

  refresh()
  {
    this.getTasksAssignedForUser();
    this.getTasksCreatedByUser()
    this.getPendingRequestsForUser();
    this.getRequestsSentByUser();
    console.log(this.taskData)
    this.resetFilter();
  }

  resetFilter()
  {
    this.getOccurrence(this.taskData);
  }

  getOccurrence(array) {
    var newArray = [];
    var newArrayTasks = [];
    var newArrayTasksDueSoon = [];
    var newArrayLateTasks = [];
    this.data1 = [];
    //Tasks , Tasks Due Soon, Late Tasks

        for (var i = 0; i < array.length; i++)
        {
          var dateDue = array[i].dateDue ;
          dateDue = new Date(dateDue);
          var dateNow = new Date()
          var timediff = dateDue.getTime() - dateNow.getTime();
          if(timediff < 0)
          {
            newArray.push(array[i].status)
            newArrayLateTasks.push(array[i].status)
          }
          else if(timediff < 604800000)
          {
            newArrayTasksDueSoon.push(array[i].status)
          }
          else{
            newArrayTasks.push(array[i].status)
          } 
        }

        var x = newArrayLateTasks.length
        var y = newArrayTasksDueSoon.length
        var z = newArrayTasks.length

        this.data1.push({Tasks : "Tasks", Value: z})
        this.data1.push({Tasks : "Tasks Due Soon", Value: y})
        this.data1.push({Tasks : "Late Tasks", Value: x})
       
    

      this.setUpPies();
    }

    
    addDays(date: Date, days: number): Date {
      date.setDate(date.getDate() + days);
      return date;
  }

  setUpPies(){
    let that = this;
    //1
      this.pie1Options = {
        'chart': {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: 'transparent',
        },
        colors: [
          
    
     '#7cb5ec', 
     '#0371fc',
     '#f13838', 
        ],
        'title': {
          text:""
        },
        'credits':{
          enabled:false
        },
        'tooltip': {
          pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        'plotOptions': {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            size:150,
        
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:1f}',
              style: {
                fontSize: '14px',
                width: '100%',
                
              }
            },
            showInLegend: true
          }
        },
        'legend': {
          style: {'fontSize': '28.5714px;', 'font-family': 'Segoe UI', 'fontWeight': '150', 'color': '#bbb'},
          itemStyle: {
            color: 'black'
          },
          itemHoverStyle: {
            color: '#FFF'
          },
          itemHiddenStyle: {
            color: '#444'
          }
        },
        'showCheckbox':{
          enabled:false
        },
  
        'series': [{
          name: 'Severity',
          colorByPoint: true,
          events: {
            click: function (event) {
  
              console.log(event.point.name);
              
            }
          },
          
          data: this.data1.map(row => [row.Tasks, row.Value])
          
        
      }]
    }
  }

}
