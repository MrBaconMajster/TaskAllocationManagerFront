import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    requestStatus: new FormControl('Pending'),
  });

  constructor(private router: Router,private appService: AppServices ) { }

  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") != null){
      this.router.navigate(['/home']);
    }
  }


  submit(){
    console.log(this.form.value)
    if(this.form.value.password ==  this.form.value.confirmPassword)
    {
    this.appService.addRegistrationRequest(this.form.value).subscribe( data => {
      console.log(data)

      this.router.navigate(['/successfulRegistration']);
    })
  }
  }

}
