import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServices } from '../../app.service';
import { WebsocketService } from 'src/app/websocket.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user;
  admin = false;
  matBadge = null;

  constructor( private router: Router, public appService: AppServices , private websocketService: WebsocketService) { }



  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-LeroTask'));

    if(this.user){
      if(this.user.admin == true){
        this.admin = true;
        this.getPendingRegistrationRequests();

      }
    }
    console.log(this.user)

  }

  getPendingRegistrationRequests()
  {
    this.appService.getAllPendingRegistrationRequests().subscribe( data => {
      if(data.length == 0)
      {
        this.matBadge = null;
      }
      else
      {
        this.matBadge = data.length;
      }
      })
  }

  ngAfterViewInit(){
  }

  log(){
  }
   home(){
    
   }
   logout(){
        localStorage.removeItem('user-LeroTask');
        this.router.navigate(['/home'])
        window.location.reload();
  }

  loginOrRegister(){
    this.appService.loginPopup = true;
  }
}
