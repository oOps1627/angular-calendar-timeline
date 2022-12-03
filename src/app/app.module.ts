import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { TimelineModule } from "angular-calendar-timeline";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TimelineModule.forChild(),
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
