import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';

@Component({
  selector: 'app-successful-registration',
  templateUrl: './successful-registration.component.html',
  styleUrls: ['./successful-registration.component.scss']
})
export class SuccessfulRegistrationComponent implements OnInit {

  constructor(private router: Router,private appService: AppServices ) { }

  ngOnInit(): void {
  }


  goToLogin()
  {
    this.router.navigate(['/login']);
  }
}
