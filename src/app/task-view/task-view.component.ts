import { DatePipe, formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  user;
  task;
  createdBy;
  assignedTo;
  dateDue;
  editing = false;
  requestOpened = false;
  taskStatusList = ['In Progress','Done']

  public form: FormGroup;

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent, private datePipe : DatePipe , private dateAdapter: DateAdapter<Date>) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
}


  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
    this.task = this.appService.selectedTask;
    console.log(this.task);
    this.dateDue = new Date(this.task.dateDue);
    console.log(this.task.dateDue)
    
   // this.task.dateDue = this.datePipe.transform(new Date(this.task.dateDue))

    // this.form.value.description = this.task.description;
    // this.form.value.dateDue = new Date(this.task.dateDue);
    // console.log(this.form.value.dateDue)

    this.form = new FormGroup({
      task: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dateDue:new FormControl(this.dateDue, [Validators.required]),
      status: new FormControl(this.task.status, [Validators.required]),
    });

    this.appService.getUserById(this.task.createdBy).subscribe( data => {
     this.createdBy = data;
    })

    if(this.task.assignedTo != -1)
    {
    this.appService.getUserById(this.task.assignedTo).subscribe( data => {
      this.assignedTo = data;
     })
    }
    else 
    {
      this.assignedTo = "Unassigned";
    }
  }

  log()
  {
    console.log(this.form.value.dateDue)
  }

  markAsDone()
  {
    this.task.status = "Done"
    this.appService.updateTask(this.task).subscribe( data => {
      
    })
  }

  openProfileCreatedBy()
  {
    this.router.navigate(['/profile',this.createdBy.id])
  }

  openProfileAssignedTo()
  {
    this.router.navigate(['/profile',this.assignedTo.id])
  }

  unAssignFromTask()
  {
    this.appService.unAssignFromTask(this.task.id).subscribe( data => {
      this.appService.getUserById(this.task.createdBy).subscribe( data => {
        this.createdBy = data;
        this.appService.getUserById(this.task.assignedTo).subscribe( data => {

          this.assignedTo = "Unassigned"
         })
       })
    })
  }

  async edit()
  {
   
    this.editing= true;
    setTimeout(() => { this.form.value.dateDue = new Date(this.datePipe.transform(this.task.dateDue, 'dd/MM/yyy' )) }, 250);
   setTimeout(() => { console.log(this.form.value.dateDue) }, 750);
  }

  save()
  {
    var temp = 
    {
      "id" : this.task.id,
      "firstName" : this.task.firstName,
      "lastName" : this.task.lastName,
      "createdBy" : this.task.createdBy,
      "assignedTo" : this.task.assignedTo,
      "task" : this.task.task,
      "description" : this.form.value.description,
      "dateCreated" : this.task.dateCreated,
      "dateDue" : this.form.value.dateDue,
      "status" : this.form.value.status,
      "assignedToName" : this.task.assignedToName,
    }

    this.appService.updateTask(temp).subscribe( data => {
      this.task = temp;
      this.appService.selectedTask = temp;
    })


this.editing=false;
  }

  openRequest()
  {
    this.requestOpened = true;
  }

  close()
  {
    this.appService.closeTaskView();
  }

}
