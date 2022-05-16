import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppServices } from './app.service';
import { GlobalModule } from './global/global.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './auth.gaurd';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatTreeModule} from '@angular/material/tree';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatMenuModule} from '@angular/material/menu';
import { WebsocketService } from './websocket.service';
import { MatIconModule } from '@angular/material/icon';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NpnSliderModule } from "npn-slider";
import { MatInputModule } from '@angular/material/input';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatFormFieldModule } from "@angular/material/form-field";

import { NavbarComponent } from './global/navbar/navbar.component';
import { BrowseComponent } from './browse/browse.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { PageTemplateComponent } from './page-template/page-template.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { SuccessfulRegistrationComponent } from './successful-registration/successful-registration.component';
import { BoardComponent } from './board/board.component';
import { RequestComponent} from './task-view/request/request.component';
import { UsersComponent } from './users/users.component'




@NgModule({
declarations: [
    NavbarComponent,
    AppComponent,
    BrowseComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    PageTemplateComponent,
    ProfileComponent,
    AdminComponent,
    RegisterComponent,
    TaskViewComponent,
    SuccessfulRegistrationComponent,
    BoardComponent,
    RequestComponent,
    UsersComponent

],
imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    GlobalModule,
    FormsModule,
    HighchartsChartModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),

],
exports: [
  MatFormFieldModule,
  MatInputModule,
],

providers: [AppServices ,DatePipe, Location,WebsocketService, AuthGuard ,HomeComponent, NavbarComponent, {provide: LocationStrategy, useClass: HashLocationStrategy }],
bootstrap: [AppComponent]
})
export class AppModule { }







