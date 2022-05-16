import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';
import { NavbarComponent } from '../global/navbar/navbar.component'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router,private appService: AppServices ) { }

  ngOnInit(): void {
    if(localStorage.getItem("user-LeroTask") != null){
      this.router.navigate(['/home']);
    }
  }


  submit(){
    console.log(this.form.value)
    this.appService.login(this.form.value).subscribe( data => {

      localStorage.setItem('user-LeroTask', JSON.stringify(data));

      this.user = JSON.parse(localStorage.getItem('user-LeroTask'));

      this.router.navigate(['/home']);
    })
  }

}
