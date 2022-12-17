import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { TimelineModule } from "angular-calendar-timeline";
import { TimelineZoomComponent } from "./timeline-zoom/timeline-zoom.component";

@NgModule({
  declarations: [
    AppComponent,
    TimelineZoomComponent
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

  bootstrap: [AppComponent]
})
export class AppModule {
}
