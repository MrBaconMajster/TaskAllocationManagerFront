import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component'

@Component({
  selector: 'app-page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss']
})
export class PageTemplateComponent implements OnInit {

  user;

  constructor(private router: Router , private appService: AppServices, private navbar: NavbarComponent) { }

  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") == null){
      this.router.navigate(['/login']);
    }
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));
  }

}
