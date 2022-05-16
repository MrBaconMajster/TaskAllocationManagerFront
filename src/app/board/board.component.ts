import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  user;
  taskView = false;
  addingTask = false;
  showDoneCheckbox = false;
  showAssignedCheckbox = false;
  otherSelected = false;

  taskNameList;
  taskNameListNamesOnly = []
  taskList;
  filteredData;

  taskInput;
  taskInputWarning = false;


  @ViewChildren(MatPaginator) matTableGenericPaginator: QueryList<MatPaginator>; 
  @ViewChildren(MatSort) matTableSort: QueryList<MatSort>; 
  
  public form: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    dateDue: new FormControl('', [Validators.required]),
  });

  

  matTableDataSourceTasks = new MatTableDataSource; 

  public matTableColumnDisplayTasks: string[] = ['status','task','dateDue','dateCreated','createdBy','assignedTo','actions']; 

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent,private dateAdapter: DateAdapter<Date>) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
}
  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") == null){
      this.router.navigate(['/login']);
    }
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
    this.appService.boardComponent = this;
    this.getAllTaskNamesList();
    this.getAllTasks();
 

    
  }

  async ngAfterViewInit() { 

    setTimeout(() => { this.filter(); }, 200);

  }

  openTask(element)
  {
    this.taskView = true;
    this.appService.selectedTask = element;
  }

  applyFilter(filterValue: string) { 

    this.matTableDataSourceTasks.filter = filterValue.trim().toLowerCase(); 

    if (this.matTableDataSourceTasks.paginator) { 

      this.matTableDataSourceTasks.paginator.firstPage(); 

    } 

  } 

  getAllTasks()
  {
    this.appService.getAllTasks().subscribe( data => {
      this.matTableDataSourceTasks.data = data;
      this.taskList = data;

        this.matTableDataSourceTasks.paginator = this.matTableGenericPaginator.toArray()[0]; 
        this.matTableDataSourceTasks.sort = this.matTableSort.toArray()[0];
            
      this.matTableDataSourceTasks.sort = this.matTableDataSourceTasks.sort;
  
      this.filter();
      })

     

     
  }

  deleteTask(element)
  {
    this.appService.deleteTask(element.id).subscribe( data => {
      this.getAllTasks();
      this.filter();
  })
}

  getAllTaskNamesList()
  {
    this.appService.getAllTaskNamesList().subscribe( data => {
      this.taskNameList = data;
      data.forEach(element => {
        this.taskNameListNamesOnly.push(element.taskName)
      });
      })
  }

  addTaskButtonClicked()
  {
    this.addingTask=true;
  }

  unAssignFromTask(element)
  {

  }

  volunteer(element)
  {
    this.appService.assignUserToTask(this.user.id, element.id).subscribe( data => {
      this.getAllTasks();
      this.filter();
      })
  }

  apply(element)
  {

  }
  //UPDATE LeroTaskAllocation.user SET admin = 1 WHERE id = 2

  submit()
  {
    var temp = 
    {
      "firstName" : this.user.firstName,
      "lastName" : this.user.lastName,
      "createdBy" : this.user.id,
      "assignedTo" : -1,
      "task" : this.form.value.task,
      "description" : this.form.value.description,
      "dateCreated" : Date.now(),
      "dateDue" : this.form.value.dateDue,
      "status" : "Unassigned",
    }
    
    this.appService.addTask(temp).subscribe( data => {
        console.log(data)
        this.addingTask=false;

        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.form.reset();
        this.getAllTasks();
        this.filter();
      })

  
  
  }

  refresh()
  {
    this.getAllTasks();
  
  }

  filter()
  {
    if(this.showAssignedCheckbox == true && this.showDoneCheckbox == true)
    {
      this.matTableDataSourceTasks.data = this.taskList;
    }
    else if(this.showAssignedCheckbox == true && this.showDoneCheckbox == false)
    {
      this.matTableDataSourceTasks.data = this.taskList.filter(o => o.status != "Done");
    }
    else if(this.showDoneCheckbox == true && this.showAssignedCheckbox == false)
    {
      this.matTableDataSourceTasks.data = this.taskList.filter(o => o.assignedTo == -1);
    }
    else
    {
      this.filteredData = this.taskList.filter(o => o.assignedTo == -1 && o.status != "Done")
      this.matTableDataSourceTasks.data = this.filteredData;

    }
    this.matTableDataSourceTasks.paginator = this.matTableGenericPaginator.toArray()[0]; 
    this.matTableDataSourceTasks.sort = this.matTableSort.toArray()[0];
        
  this.matTableDataSourceTasks.sort = this.matTableDataSourceTasks.sort;
  }

  taskInputChanged()
  {
    this.taskInputWarning = true;

    this.taskNameListNamesOnly.forEach(element => { if(element == this.taskInput) { this.taskInputWarning = false }})

  }

  cancel()
  {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.form.reset();
    this.addingTask=false;
  }
}
