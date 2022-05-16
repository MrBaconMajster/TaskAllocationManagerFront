import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { delay, timeout } from 'rxjs/operators';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  user;
  editing = false;
  taskNameList;
  userTaskInterestList;
  displayedUser;
  taskData;
  data1 = [];
  pie1Options: any;
  pieChart1 = Highcharts;
  
  public form: FormGroup = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required]),
    about: new FormControl('', [Validators.required]),
    
  });

  public form2: FormGroup = new FormGroup({

  });

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") == null){
      this.router.navigate(['/login']);
    }
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));

    
    this.route.params.subscribe(params => {
      if(params['userId'])
      {
      this.displayedUser = params['userId'];
      this.appService.getUserById(this.displayedUser).subscribe( data => {
        this.displayedUser = data;
        this.form.value.phoneNumber = this.displayedUser.phoneNumber;
        this.form.value.about = this.displayedUser.about;
    
        this.getDisplayedUser();
        this.getUserInterestList();
        this.getTaskNameList();
        this.getTasksAssignedForUser();
      })
    }
    else 
    {
      this.displayedUser = this.user;
      this.form.value.phoneNumber = this.displayedUser.phoneNumber;
      this.form.value.about = this.displayedUser.about;
  
      this.getDisplayedUser();
      this.getUserInterestList();
      this.getTaskNameList();
      this.getTasksAssignedForUser();
    }
    });

  }

  async ngAfterViewInit()
  {
    setTimeout(() => { this.resetFilter(); }, 750);
  }

  async edit(){

    this.editing = true;
    for(let taskName in this.form2.controls)
    {
      this.form2.removeControl(taskName);
    }
    this.getTaskNameList();


  setTimeout(()=>{

    this.userTaskInterestList.forEach(element => {
      var x = element.taskName;
      this.form2.controls[x].setValue(true);
    });
    console.log(this.userTaskInterestList)

  },200); 

  }

  getTasksAssignedForUser()
  {
    this.appService.getTasksAssignedForUser(this.displayedUser.id).subscribe( data => {
    this.taskData = data;
   
    })
  }

  getDisplayedUser()
  {
    this.appService.getUserById(this.displayedUser.id).subscribe( data => {
      console.log(data);
      this.displayedUser = data;
    })
  }

  getUserInterestList()
  {
    this.appService.getTaskInterestListForUser(this.displayedUser.id).subscribe( data => {
      console.log(data);
      this.userTaskInterestList = data;
    })
  }

  taskNamesOnly = [];

  getTaskNameList()
  {
    this.taskNamesOnly = [];
    this.appService.getAllTaskNamesList().subscribe( data => {
      console.log(data);
      this.taskNameList = data;
      data.forEach(element => { this.taskNamesOnly.push(element.taskName)
      });

      data.forEach(element => {  this.form2.addControl(element.taskName, new FormControl(false,)) }); 
    })
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


  save(){
    //Save form
    console.log(this.form.value);
    var newUser = this.displayedUser;
    newUser.phoneNumber = this.form.value.phoneNumber;
    newUser.about = this.form.value.about;
    console.log(newUser.phoneNumber)

    var tasksToSaveForUser = []

    

    for(let taskName in this.form2.controls)
    {
      if (this.form2.controls[taskName].value == true)
      {
        var taskNameID

        this.taskNameList.forEach(element => { if(element.taskName == taskName) { taskNameID = element.id }});

        var temp = 
        {
          "taskName" : taskName,
          "taskNameId" : taskNameID,
          "userId" : this.displayedUser.id,
          "userName" : this.displayedUser.email,
        }
        tasksToSaveForUser.push(temp);
      }
    }


    this.appService.updateUser(newUser).subscribe( data => {
    this.editing = false;
    this.appService.deleteTaskInterestListForUser(this.displayedUser.id).subscribe( data => {
    this.appService.addTaskInterestsForUser(tasksToSaveForUser).subscribe( data => {
      this.getUserInterestList();
      this.getTaskNameList();
    this.appService.getUserByEmail(this.user.email).subscribe( data => {
      localStorage.setItem("user-LeroTask", JSON.stringify(data))
      this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
      this.getDisplayedUser();
    })
  })
    })
  })

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
