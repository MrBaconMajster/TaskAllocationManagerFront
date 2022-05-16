import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowseComponent } from './browse/browse.component';
import { PageTemplateComponent } from './page-template/page-template.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component'
import { BoardComponent } from './board/board.component'
import { SuccessfulRegistrationComponent } from './successful-registration/successful-registration.component'
import { UsersComponent } from './users/users.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'template', component: PageTemplateComponent, data: { title: 'Template' } },
  { path: 'about', component: AboutComponent, data: { title: 'About' } },
  { path: 'browse', component: BrowseComponent, data: { title: 'Browse' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'profile/:userId', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'admin', component: AdminComponent, data: { title: 'Admin' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'board', component: BoardComponent, data: { title: 'Task Board' } },
  { path: 'successfulRegistration', component: SuccessfulRegistrationComponent, data: { title: 'Success' } },
  { path: 'users', component: UsersComponent, data: { title: 'User Board' } },


  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
